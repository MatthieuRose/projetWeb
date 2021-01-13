import * as Phaser from 'phaser';
import {Scene2} from './Scene2';
import {gameN} from './gameN';
import {Hound} from './Hound';

export class Scene5 extends Phaser.Scene {
  private enemies: Phaser.Physics.Arcade.Group;

  constructor() {
    super('map3');
  }

  preload() {
    this.load.spritesheet('houndRun', 'assets/Enemy/hound_run.png', {
      frameWidth: 80,
      frameHeight: 64,
      margin: 1,
      spacing: 1
    });

    this.load.image('terrain3', './assets/map/Map3/spritesheet.png');
    this.load.tilemapTiledJSON('map3', './assets/map/Map3/Map3.json');


  }

  create() {
    // @ts-ignore
    gameN.gameSettings.score += 10 ;
    gameN.lifeBar = this.add.graphics();
    gameN.lifeBar.fillStyle(0x990000, 1);
    gameN.lifeBar.fillRect(10, 50,  gameN.gameSettings.playerHealth * 2, 17).setScrollFactor(0, 0).setDepth(2);
    this.add.text(10, 10, 'Score :' + gameN.gameSettings.score, {color: 'red', fontSize: '22px', fontStyle: 'bold' }).setScrollFactor(0, 0).setDepth(2);
    this.EnemiesPlacement();
    gameN.player = this.physics.add.sprite(80, 800, 'player');
    gameN.player.setSize(35, 50);
    gameN.player.setOffset(15, 9);
    gameN.cursorKeys = this.input.keyboard.createCursorKeys();


    const map3 = this.add.tilemap('map3');
    const terrain3 = map3.addTilesetImage('Map2', 'terrain3');

    gameN.player.setScale(1.5).setDepth(2);
    const fond = map3.createDynamicLayer('fond', [terrain3], 0, 0).setDepth(1);
    const gameStatic = map3.createDynamicLayer('Calque 1', [terrain3], 0, 0).setDepth(1);
    const spikeLayer = map3.createDynamicLayer('spike', [terrain3], 0, 0).setDepth(1);
    fond.setScale(2);
    gameStatic.setScale(2);
    spikeLayer.setScale(2);
    this.physics.add.collider(gameN.player, gameStatic);
    gameStatic.setCollisionByProperty({collide: true});

    spikeLayer.setCollisionByProperty({collide: true});
    this.physics.add.collider(this.enemies, gameStatic);
    this.physics.add.collider(gameN.player, spikeLayer, () => {
      gameN.damagePlayer(this);
    });

    this.physics.add.collider(gameN.player, this.enemies, () => {
      gameN.damagePlayer(this);
    });
    const mapChanger = map3.createDynamicLayer('mapChanger', [terrain3], 0, 0).setDepth(1);
    mapChanger.setScale(2);
    mapChanger.setCollisionByProperty({changerMap: true});
    this.physics.add.collider(gameN.player, mapChanger, () => {
      this.scene.start('map6');

    });


    // make the camera follow the player
    this.cameras.main.startFollow(gameN.player);


  }

  update() {
    gameN.movePlayerManager();
    if (gameN.gameSettings.playerHealth === 0) {
      this.scene.start('GameOver');

    }
    this.enemies.children.each((enemy) => {
      enemy.update();
    }, this);

  }

  EnemiesPlacement() {
    this.enemies = this.physics.add.group();
    const hound = new Hound(this, 22, 55);
  }

}
