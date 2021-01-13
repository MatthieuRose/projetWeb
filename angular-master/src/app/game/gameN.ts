import * as Phaser from 'phaser';
import {Scene1} from './Scene1';
import {Scene2} from './Scene2';
import {Scene3} from './Scene3';
import {Scene4} from './Scene4';
import {Scene5} from './Scene5';
import {Scene6} from './Scene6';
import {Scene7} from './Scene7';
import {Scene8} from './Scene8';
import {Scene9} from './Scene9';
import {Scene11} from './Scene11';
import {Scene10} from './Scene10';
import {Scene12} from './Scene12';

// tslint:disable-next-line:class-name
export class gameN {
  constructor() {
    gameN.config = {
      type: Phaser.CANVAS,
      width: 800,
      height: 600,
      scene: [Scene1, Scene2, Scene3, Scene4, Scene5, Scene6, Scene7, Scene8, Scene9, Scene10, Scene11, Scene12],
      pixelArt: false,
      physics: {
        default: 'arcade',
        arcade: {
          debug: false,
          gravity: {
            y: 800
          },
        }
      }
    };

    gameN.gameSettings = {
      playerSpeed: 240,
      isJumping: false,
      isDoubleJumping: false,
      playerHealth: 100,
      score: 0,
      nbMort: 0,
    };
    gameN.isAlive = true;
    gameN.invincible = false ;
    gameN.game = new Phaser.Game(gameN.config);
  }
  // tslint:disable-next-line:max-line-length
  static config: { pixelArt: boolean; physics: { default: string; arcade: { debug: boolean; gravity: { y: number } } }; width: number; type: number; height: number; scene: (Scene1 | Scene2 | any)[] };
  static gameSettings: {
    score: number; playerHealth: number; isJumping: boolean; playerSpeed: number; isDoubleJumping: boolean; nbMort: number
  };
  static game: Phaser.Game;
  static isAlive: boolean;
  static cameras: any;
  static player: Phaser.Physics.Arcade.Sprite;
  static cursorKeys: any;
  static lifeBar: Phaser.GameObjects.Graphics;


  // @ts-ignore
  static invincible: boolean;
  static movePlayerManager() {
    gameN.player.body.velocity.x = 0 ;
    if (Phaser.Input.Keyboard.JustDown(gameN.cursorKeys.up) && !gameN.gameSettings.isJumping) {
      gameN.player.setVelocityY(-330) ;
      gameN.gameSettings.isJumping = true ;

    } else {
      // tslint:disable-next-line:max-line-length
      if (gameN.gameSettings.isJumping && !gameN.gameSettings.isDoubleJumping && Phaser.Input.Keyboard.JustDown(gameN.cursorKeys.up) ) {
        gameN.gameSettings.isDoubleJumping = true ;
        gameN.player.body.velocity.y = - 450 ;
      }
    }


    if (gameN.player.body.blocked.down) {
      gameN.gameSettings.isJumping = false ;

      gameN.gameSettings.isDoubleJumping = false ;
    } else if (gameN.cursorKeys.down.isDown && gameN.player.body.blocked.down) {
      /// this.player.play("player_crouch");

    }
    if (gameN.cursorKeys.left.isDown) {
      if (!(gameN.player.anims.getCurrentKey() === 'player_run')) {
        gameN.player.play('player_run');
        gameN.player.setOffset(18, 9);
      }
      gameN.player.setOffset(18, 9);

      gameN.player.scaleX = 1 ;
      gameN.player.setVelocityX(-gameN.gameSettings.playerSpeed) ;


    } else if (gameN.cursorKeys.right.isDown) {
      if (!(gameN.player.anims.getCurrentKey() === 'player_run')) {
        gameN.player.play('player_run');
      }
      gameN.player.setOffset(50, 9);

      gameN.player.scaleX = -1 ;
      gameN.player.setVelocityX(gameN.gameSettings.playerSpeed) ;


    } else {
      gameN.player.play('player_idle');
    }


  }
  static damagePlayer(scene)  {
    if (!gameN.invincible) {
      gameN.gameSettings.playerHealth -= 100;
    }

    gameN.player.alpha = 0.5 ;
    gameN.invincible = true ;
    setTimeout(() => {
      gameN.invincible = !gameN.invincible ;
      gameN.player.alpha = 1  ;
    }, 2000);
    gameN.lifeBar.destroy() ;
    gameN.lifeBar = scene.add.graphics();
    gameN.lifeBar.fillStyle(0x990000, 1);
    gameN.lifeBar.fillRect(10, 50,  gameN.gameSettings.playerHealth * 2, 17).setScrollFactor(0, 0).setDepth(2);
  }
}











