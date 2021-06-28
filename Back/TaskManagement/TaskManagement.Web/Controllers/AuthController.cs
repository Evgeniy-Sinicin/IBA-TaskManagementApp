using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using TaskManagement.Web.Models;

namespace TaskManagement.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IOptions<AuthOptions> authOptions;

        public AuthController(IOptions<AuthOptions> authOptions)
        {
            this.authOptions = authOptions;
        }

        // TODO: Accounts will be got from MongoDB
        private List<Account> Accounts { get; set; } = new List<Account>
        {
            new Account()
            {
                Id = Guid.Parse("78976017-e3bc-441b-9149-e60e0d8426b3"),
                Phone = "+375291111111",
                Email = "user@email.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("user"),
                Roles = new Role[] { Role.User }
            },
            new Account()
            {
                Id = Guid.Parse("b896ab24-edb4-4dc7-a4ef-fe6184003f02"),
                Phone = "+375292222222",
                Email = "user2@email.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("user2"),
                Roles = new Role[] { Role.User }
            },
            new Account()
            {
                Id = Guid.Parse("d5c98c2d-d8fa-4949-89ec-48cbda5aab6b"),
                Phone = "+375297757581",
                Email = "admin@email.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin"),
                Roles = new Role[] { Role.Admin }
            }
        };

        [Route("login")]
        [HttpPost]
        public IActionResult Login([FromBody] Login request)
        {
            var user = AuthenticateUser(request.Email);

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

        [Route("register")]
        [HttpPost]
        public IActionResult Register([FromBody] Registration request)
        {
            if (Accounts.SingleOrDefault(a => a.Email.Equals(request.Email)) != null)
            {
                return BadRequest("Account with this email already exists");
            }

            Accounts.Add(new Account
            {
                Id = Guid.NewGuid(),
                Phone = request.Phone,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Roles = new Role[] { Role.User }
            });

            return Ok();
        }

        private Account AuthenticateUser(string email)
        {
            return Accounts.SingleOrDefault(u => u.Email.Equals(email));
        }

        private string GenerateJWT(Account user)
        {
            var authParams = authOptions.Value;

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
