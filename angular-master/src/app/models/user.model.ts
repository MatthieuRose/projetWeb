export class User {
  id: number;
  name: string;
  email: string;
  role: string[];
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  is_admin: boolean;

  constructor(id: number,
              name: string,
              email: string,
              role: string[],
              admin: boolean
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.is_admin = admin;
  }

  static parse(personne: any) {
    return new User(personne.id, personne.name,
      personne.email, personne.role, personne.is_admin
    );
  }
}
