import * as Phaser from 'phaser';
import {gameN} from './gameN' ;

export class Scene12 extends Phaser.Scene {

  constructor() {
    super('endGame');
  }

  preload() {
    this.load.image('win', 'assets/img/win.png');
  }

  create() {
    gameN.gameSettings.score += 50;
    // !!!
    gameN.game.events.emit('score', gameN.gameSettings.score);
    gameN.game.events.emit('game_finished');
    // !!!
    this.add.image(400, 300, 'win').setScale(1.15, 1.15);
    this.add.text(200, 350, 'votre score est de :' + gameN.gameSettings.score, {color: 'black', fontSize: '32px', fontStyle: 'bold'});
    const button = this.add.text(200, 450, 'Recommencer une partie?', {color: 'black', fontSize: '32px', fontStyle: 'bold'});

    button.setInteractive();

    button.on('pointerdown', function(event) {
      gameN.gameSettings.score = 0;
      gameN.gameSettings.nbMort = 0;
      this.scene.start('bootGame');
    }, this);
  }

}
