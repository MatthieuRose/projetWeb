import {User} from './user.model';

export class Personne {
  id: number;
  nom: string;
  prenom: string;
  score: number;
  actif: boolean;
  cv: string;
  avatar?: string;
  games: number;
  timePlayed: number;
  user: User;


  constructor(
    id: number,
    nom: string,
    prenom: string,
    score: number,
    actif: boolean,
    cv: string,
    avatar: string,
    games: number,
    timePlayed: number,
    user: User
  ) {
    this.id = id;
    this.nom = nom;
    this.prenom = prenom;
    this.score = score;
    this.actif = actif;
    this.cv = cv;
    this.avatar = avatar;
    this.games = games;
    this.timePlayed = timePlayed;
    this.user = user;
  }

  static parse(personne: any) {
    const user = User.parse(personne);
    console.log('User : ', user);
    return new Personne(personne.id, personne.nom,
      personne.prenom, personne.best_score,
      personne.actif, personne.cv,
      personne.avatar, personne.games, personne.timePlayed, user);
  }
}

