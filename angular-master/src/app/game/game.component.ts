import {Component, OnInit} from '@angular/core';
import * as Phaser from 'phaser';
import {gameN} from './gameN';
import {PersonnesService} from '../personnes/personnes.service';
import {Personne} from '../models/personne.model';
import {AuthService} from '../shared/auth.service';


class Game extends Phaser.Scene {
  helloWorld: Phaser.GameObjects.Text;

  init() {
    this.cameras.main.setBackgroundColor('#24252A');
  }

  create() {
    this.helloWorld = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      'Hello World', {
        font: '40px Arial',
        fill: '#ffffff'
      }
    );
    this.helloWorld.setOrigin(0.5);

  }

  update() {
    this.helloWorld.angle += 1;
  }

  setAngle(angle: number) {
    this.helloWorld.angle = angle;
  }
}



@Component({
  selector: 'app-root',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  gameN1: gameN;
  currentUser: Personne;
  timeStart: Date;

  constructor(private authService: AuthService, private service: PersonnesService) {
  }

  ngOnInit(): void {
    this.gameN1 = new gameN();
    this.timeStart = new Date();
    if (this.authService.currentUserValue.id !== null) {
      const user = this.authService.currentUserValue.id;
      gameN.game.events.addListener('score', (score) => {
        this.service.updateScore(user, score).subscribe({
          next(personne) {
            return personne;
          }
        });
      });

      gameN.game.events.addListener('game_finished', () => {
        const timeEnd = new Date();
        const timePlayed = timeEnd.getMinutes() - this.timeStart.getMinutes();
        this.service.updateNbGames(user, timePlayed).subscribe({
          next(personne) {
            return personne;
          }
        });
      });
    }
  }

}
