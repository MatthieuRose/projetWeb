import * as Phaser from 'phaser';
import {gameN} from './gameN';

export class Scene1 extends Phaser.Scene {
  static up: Phaser.Input.Keyboard.Key;

  constructor() {
    super('bootGame');
  }

  preload() {


    this.load.spritesheet('playerRun', 'assets/PlayerA/run.png', {
      frameWidth: 80,
      frameHeight: 64,
      margin: 1,
      spacing: 1
    });
    this.load.spritesheet('playerIdle', 'assets/PlayerA/idle.png', {
      frameWidth: 80,
      frameHeight: 64,
      margin: 1,
      spacing: 1
    });
  }

  create() {

    gameN.game.anims.create({
      key: 'player_run',
      // @ts-ignore
      frames: this.anims.generateFrameNumbers('playerRun'),
      frameRate: 15,
      repeat: -1
    });
    gameN.game.anims.create({
      key: 'player_idle',
      // @ts-ignore
      frames: this.anims.generateFrameNumbers('playerIdle'),
      frameRate: 15,
      repeat: -1
    });
    this.scene.start('map6');
  }

}
