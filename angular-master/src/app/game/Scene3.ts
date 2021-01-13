import * as Phaser from 'phaser';
import {gameN} from './gameN' ;



export class Scene3 extends Phaser.Scene {
    constructor() {
        super('GameOver') ;
    }

    preload() {
        this.load.image('backG', 'assets/img/gameOver.png');

    }

    create() {
      // !!!
      gameN.game.events.emit('score', gameN.gameSettings.score);
      gameN.game.events.emit('game_finished');
      // !!!
      gameN.gameSettings.nbMort++;
      gameN.gameSettings.score = 0 ;
      gameN.gameSettings.playerHealth = 100 ;
      this.add.image(400, 300, 'backG').setScale(0.6, 0.6);
      const button1 = this.add.text(355, 410, 'Retry', {color: 'red', fontSize: '32px', fontStyle: 'bold' });

      button1.setInteractive();

      button1.on('pointerdown', function(event) {

        this.scene.start('bootGame');
          }, this);



    }
}
