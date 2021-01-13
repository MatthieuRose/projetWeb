import * as Phaser from 'phaser';
import {Scene2} from './Scene2';
import {gameN} from './gameN';
import {Hound} from './Hound';

export class Scene11 extends Phaser.Scene {
  constructor() {
    super('map11');
  }

  preload() {
    this.load.spritesheet('houndRun', 'assets/Enemy/hound_run.png', {
      frameWidth: 80,
      frameHeight: 64,
      margin: 1,
      spacing: 1
    });

    this.load.image('terrain11', './assets/map/spritesheet.png');
    this.load.tilemapTiledJSON('map11', './assets/map/Map11/Map11.json');
  }

  create() {
    gameN.gameSettings.score += 10 ;
    // tslint:disable-next-line:max-line-length
    gameN.lifeBar = this.add.graphics();
    gameN.lifeBar.fillStyle(0x990000, 1);
    gameN.lifeBar.fillRect(10, 50,  gameN.gameSettings.playerHealth * 2, 17).setScrollFactor(0, 0).setDepth(2);
    this.add.text(10, 10, 'Score :' + gameN.gameSettings.score, {color: 'red', fontSize: '22px', fontStyle: 'bold' }).setScrollFactor(0, 0).setDepth(2);
    gameN.player = this.physics.add.sprite(16 * 40, 16 * 24, 'player');
    gameN.player.setSize(35, 50);
    gameN.player.setOffset(15, 9);
    gameN.cursorKeys = this.input.keyboard.createCursorKeys();


    const map11 = this.add.tilemap('map11');
    const terrain11 = map11.addTilesetImage('Map4', 'terrain11');

    gameN.player.setScale(1.5).setDepth(2);
    const fond1 = map11.createDynamicLayer('fond1', [terrain11], 0, -16 * 32).setDepth(0);
    const spikeLayer = map11.createDynamicLayer('spike', [terrain11], 0, 0).setDepth(1);
    const mapChanger = map11.createDynamicLayer('changerMap', [terrain11], 16 * 128, 0).setDepth(1);
    mapChanger.setScale(2);
    mapChanger.setCollisionByProperty({changerMap: true});

    const gameStatic = map11.createDynamicLayer('gameStatic', [terrain11], 0, 0).setDepth(1);
    const fond2 = map11.createDynamicLayer('fond2', [terrain11], 0, -16 * 32).setDepth(0);
    const fond3 = map11.createDynamicLayer('fond3', [terrain11], 0, -16 * 32).setDepth(0);
    const fond4 = map11.createDynamicLayer('fond4', [terrain11], 0, -16 * 32).setDepth(0);
    const fond5 = map11.createDynamicLayer('fond5', [terrain11], 0, 0).setDepth(0);


    fond1.setScale(2);
    gameStatic.setScale(2);
    fond2.setScale(2);
    fond3.setScale(2);
    fond4.setScale(2);
    fond5.setScale(2);
    spikeLayer.setScale(2);

    this.physics.add.collider(gameN.player, gameStatic);
    gameStatic.setCollisionByProperty({collide: true});
    this.physics.add.collider(gameN.player, mapChanger, () => {
      this.scene.start('map10');
    });
    spikeLayer.setCollisionByProperty({collide: true});
    this.physics.add.collider(gameN.player, spikeLayer, () => {
      gameN.damagePlayer(this);
    });
    /*
    this.physics.add.collider(this.enemies,gameStatic);
    this.physics.add.collider(gameN.player,this.enemies,function(){
        gameN.gameSettings.playerHealth=0 ;
    });
    */

    // make the camera follow the player
    this.cameras.main.startFollow(gameN.player);
    this.cameras.main.followOffset.set(0, 0);
  }

  update() {
    gameN.movePlayerManager();
    if (gameN.gameSettings.playerHealth === 0) {
      this.scene.start('GameOver');

    }
  }

  enemiesPlacement() {


  }

}
