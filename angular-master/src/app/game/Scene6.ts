import * as Phaser from 'phaser';
import {Scene2} from './Scene2';
import {gameN} from './gameN';
import {Hound} from './Hound';

export class Scene6 extends Phaser.Scene {
  private enemies: any;

  constructor() {
    super('map6');
  }

  preload() {
    this.load.spritesheet('houndRun', 'assets/Enemy/hound_run.png', {
      frameWidth: 80,
      frameHeight: 64,
      margin: 1,
      spacing: 1
    });

    this.load.spritesheet('chevalierRun', 'assets/Enemy/chevalier_run.png', {
      frameWidth: 66,
      frameHeight: 64,
      margin: 1,
      spacing: 1
    });

    this.load.image('terrain6', './assets/map/spritesheet.png');

    this.load.image('coin', './assets/map/coin.png');
    this.load.image('violet1', './assets/map/violet1.png');
    this.load.tilemapTiledJSON('map6', './assets/map/Map6/Map6.json');


  }

  create() {

    this.EnemiesPlacement();
    gameN.lifeBar = this.add.graphics();
    gameN.lifeBar.fillStyle(0x990000, 1);
    gameN.lifeBar.fillRect(10, 50,  gameN.gameSettings.playerHealth * 2, 17).setScrollFactor(0, 0).setDepth(2);
    gameN.gameSettings.score += 10 ;
    let scorebt = this.add.text(10, 10, 'Score :' + gameN.gameSettings.score,
      {color: 'red', fontSize: '22px', fontStyle: 'bold' }).setScrollFactor(0, 0).setDepth(2);
    // @ts-ignore


    gameN.player = this.physics.add.sprite(730, 460, 'player');
    gameN.player.setSize(35, 50);
    gameN.player.setOffset(15, 9);
    gameN.cursorKeys = this.input.keyboard.createCursorKeys();


    const map6 = this.add.tilemap('map6');
    const terrain6 = map6.addTilesetImage('Map6', 'terrain6');

    gameN.player.setScale(1.5).setDepth(1);
    const fond1 = map6.createDynamicLayer('fond1', [terrain6], 0, 0).setDepth(0);
    const fond2 = map6.createDynamicLayer('fond2', [terrain6], 0, 0).setDepth(0);

    const gameStatic = map6.createDynamicLayer('gameStatic', [terrain6], 0, 0).setDepth(0);
    const spikeLayer = map6.createDynamicLayer('spikeLaye', [terrain6], 0, 32 * 16).setDepth(0);
    fond2.setScale(2);
    fond1.setScale(2);
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
    const mapChanger = map6.createDynamicLayer('mapChanger', [terrain6], 0, 32 * 16).setDepth(-1);
    mapChanger.setScale(2);
    mapChanger.setCollisionByProperty({changerMap: true});
    const coins = this.add.group();
    const violets = this.add.group();
    // @ts-ignore
    const it = map6.createFromObjects('items', 3493);
    // @ts-ignore
    const it2 = map6.createFromObjects('items2', 3494);
    it[0] = this.physics.add.sprite(1305, 712, 'coin');
    it2[0] = this.physics.add.sprite(430, 540, 'violet1');
    it2[0].scale = 2 ;
    // @ts-ignore
    it2[0].body.allowGravity = false ;
    violets.add(it2[0]);
    it[1] = this.physics.add.sprite(1487, 463, 'coin');
    it[2] = this.physics.add.sprite(478, 887, 'coin');

    it.forEach((el) => {
      console.log(el.x, el.y);
      el.scale = 2;
      // @ts-ignore
      el.body.allowGravity = false;
      coins.add(el);
    }, this);
    this.physics.add.overlap(gameN.player, coins, collectCoin, null, this);
    this.physics.add.overlap(gameN.player, violets, collectViolet, null, this);
    function collectViolet(player, violet) {
      gameN.gameSettings.playerHealth += 100;
      gameN.lifeBar.destroy() ;
      gameN.lifeBar = this.add.graphics();
      gameN.lifeBar.fillStyle(0x990000, 1);
      gameN.lifeBar.fillRect(10, 50,  gameN.gameSettings.playerHealth * 2, 17).setScrollFactor(0, 0).setDepth(2);
      violet.destroy();
    }
    function collectCoin(player, coin) {
      gameN.gameSettings.score += 50;
      scorebt.destroy() ;
      scorebt = this.add.text(10, 10, 'Score :' + gameN.gameSettings.score,
        {color: 'red', fontSize: '22px', fontStyle: 'bold' }).setScrollFactor(0, 0).setDepth(2);

      console.log(gameN.gameSettings.score);
      coin.destroy();
    }


    this.physics.add.collider(gameN.player, mapChanger, () => {
      this.scene.start('map7');

    });


    // make the camera follow the player
    this.cameras.main.startFollow(gameN.player);
    this.cameras.main.zoomTo(1.0, 2000);


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

    /// const chevalier = new Chevalier(this, 10, 0);

  }


}
