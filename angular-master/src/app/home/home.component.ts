import {Component, OnInit} from '@angular/core';
import {gameN} from '../game/gameN';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  image = './assets/Aperçu.png';
  imageIcon = '../../assets/PlayerA/Image/attackUnarmed_1.png';

  constructor() {
  }

  ngOnInit() {
    if (gameN.isAlive) {
      gameN.game.destroy(true);
    }
  }

}
