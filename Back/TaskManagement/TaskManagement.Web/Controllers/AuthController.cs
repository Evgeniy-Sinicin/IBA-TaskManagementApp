using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using TaskManagement.DataAccess.Interfaces;
using TaskManagement.Web.Models;
using Account = TaskManagement.Web.Models.Account;
using AccountDB = TaskManagement.DataAccess.Models.Account;

namespace TaskManagement.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IOptions<AuthOptions> _authOptions;
        private readonly IService<AccountDB> _service;
        private readonly IMapper _mapper;

        public AuthController(IOptions<AuthOptions> authOptions, IService<AccountDB> service, IMapper mapper)
        {
            _authOptions = authOptions;
            _service = service;
            _mapper = mapper;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        [Route("users")]
        public IActionResult GetUsers()
        {
            return Ok(_mapper.Map<List<Account>>(_service.GetAll()));
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        [Route("users/{id}")]
        public IActionResult GetUser(string id)
        {
            var user = _mapper.Map<Account>(_service.Get(id));

            if (user == null)
            {
                return BadRequest($"User is not found by id {id}");
            }

            return Ok(user);
        }

        [HttpPost]
        [Authorize]
        [Route("users")]
        public IActionResult UpdateUser([FromBody] Account user)
        {
            _service.Update(_mapper.Map<AccountDB>(user));

            return Ok();
        }

        [HttpDelete]
        [Authorize]
        [Route("users")]
        public IActionResult DeleteUser(string id)
        {
            _service.Delete(id);

            return Ok();
        }

        [HttpPost]
        [Route("login")]
        public IActionResult Login([FromBody] Login request)
        {
            var user = _mapper.Map<List<Account>>(_service.GetAll()).SingleOrDefault(a => a.Email.Equals(request.Email));

            if (user != null)
            {
                if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                {
                    return BadRequest("Password is wrong");
                }

                var token = GenerateJWT(user);

                return Ok(new
                {
                    access_token = token
                });
            }

            return BadRequest("Email is unregistered");
        }

        [HttpPut]
        [Route("register")]
        public IActionResult Register([FromBody] Registration request)
        {
            var account = new Account
            {
                Phone = request.Phone,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Roles = new Role[] { Role.User }
            };

            _service.Add(_mapper.Map<AccountDB>(account));

            return Ok();
        }

        private string GenerateJWT(Account user)
        {
            var authParams = _authOptions.Value;

            var securityKey = authParams.GetSymmetricSecurityKey();
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>()
            {
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString())
            };

            foreach (var role in user.Roles)
            {
                claims.Add(new Claim("role", role.ToString()));
            }

            var token = new JwtSecurityToken(authParams.Issuer,
                                             authParams.Audience,
                                             claims,
                                             expires: DateTime.Now.AddSeconds(authParams.TokenLifetime),
                                             signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
