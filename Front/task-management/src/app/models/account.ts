export class Account {
    id!: number;
    phone!: string;
    email!: string;
    roles!: Role[];
    token!: string;
}

export enum Role {
    User,
    Admin
}