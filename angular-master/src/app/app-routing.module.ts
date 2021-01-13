import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {HomeComponent} from './home/home.component';
import {PersonnesDetailsComponent} from './personnes/personnes-details/personnes-details.component';
import {AuteurGuardService} from './shared/auteur-guard.service';
import {EditPersonneComponent} from './personnes/edit-personne/edit-personne.component';
import {AuthGuardService} from './shared/auth-guard.service';
import {GameComponent} from './game/game.component';
import {ListPersonnesComponent} from './personnes/list-personnes/list-personnes.component';
import {DonnneesServeurComponent} from './donnnees-serveur/donnnees-serveur.component';


const routes: Routes = [
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'statistiques', component: DonnneesServeurComponent },
  { path: 'game', component: GameComponent },
  { path: 'liste', component: ListPersonnesComponent },
  {path: 'profil/:id', component: PersonnesDetailsComponent, canActivateChild: [AuteurGuardService]},
  {path: 'edit/:id', component: EditPersonneComponent, canActivateChild: [AuthGuardService]},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
