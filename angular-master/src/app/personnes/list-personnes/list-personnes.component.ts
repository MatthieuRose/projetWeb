import {Component, OnInit} from '@angular/core';
import {Personne} from '../../models/personne.model';
import {Router} from '@angular/router';
import {PersonnesService} from '../personnes.service';
import {gameN} from '../../game/gameN';
import {AuthService} from '../../shared/auth.service';

@Component({
  selector: 'app-list-personnes',
  templateUrl: './list-personnes.component.html',
  styleUrls: ['./list-personnes.component.css']
})
export class ListPersonnesComponent implements OnInit {
  loading = false;
  lesPersonnes: Personne[];
  selectedPersonne: Personne;
  displayedColumns: string[] = ['position', 'nom', 'prenom', 'score', 'admin'];

  constructor(private router: Router, private service: PersonnesService) {

  }

  ngOnInit() {
    if (gameN.isAlive) {
      gameN.game.destroy(true);
    }
    this.loading = true;
    this.service.getPersonnes().subscribe(personnes => {
      this.lesPersonnes = personnes;
      console.log(personnes);
      this.loading = false;
    });
  }

  selectedRow(personne: Personne) {
    if (this.isSelected(personne)) {
      this.selectedPersonne = null;
    } else {
      this.selectedPersonne = personne;
      console.log('Personne sélectionnée : ', personne.user.name);
      this.router.navigate(['./profil', this.selectedPersonne.id]);
    }
  }

  isSelected(personne: Personne) {
    return this.selectedPersonne != null && this.selectedPersonne.id === personne.id;
  }


}
