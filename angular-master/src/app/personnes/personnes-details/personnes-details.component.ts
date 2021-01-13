import {Component, OnInit} from '@angular/core';
import {Personne} from '../../models/personne.model';
import {PersonnesService} from '../personnes.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {gameN} from "../../game/gameN";
import {AuthService} from '../../shared/auth.service';

@Component({
  selector: 'app-personnes-details',
  templateUrl: './personnes-details.component.html',
  styleUrls: ['./personnes-details.component.css']
})
export class PersonnesDetailsComponent implements OnInit {
  loading: boolean = false;
  personne: Personne;
  currentUser: Personne;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private service: PersonnesService,
              private toastr: ToastrService,
              private authService: AuthService) {
    authService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
    if (gameN.isAlive) {
      gameN.game.destroy(true);
    }
    const id = +this.route.snapshot.paramMap.get('id');
    this.loading = true;
    this.service.getPersonne(id).subscribe(rep => {
        console.log(rep);
        this.personne = rep;
        this.loading = false;
      },
      error => {
        this.loading = false;
        this.toastr.error(`${error} failed: ${error.message}`, 'Error')
          .onHidden
          .subscribe(t => this.router.navigate(['./personnes/liste']));
      });
  }

  editPersonne() {
    this.router.navigate(['./edit', this.personne.id]);
  }

  setAsAdmin(userId: number) {
    this.service.setAsAdmin(userId, this.currentUser.user.id).subscribe({
      next(pers) {
        return pers;
      }
    });
    location.reload();
  }

}
