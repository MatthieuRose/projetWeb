import * as Phaser from 'phaser';
import {Scene2} from './Scene2';
import {gameN} from './gameN';
import {Hound} from './Hound';

export class Scene10 extends Phaser.Scene {
  private enemies: Phaser.Physics.Arcade.Group;
    constructor() {
        super('map10') ;
    }
    preload() {
        this.load.spritesheet('houndRun', 'assets/Enemy/hound_run.png', {
            frameWidth : 80,
            frameHeight : 64,
            margin: 1,
            spacing: 1
        });



        this.load.image('terrain10', './assets/map/spritesheet.png');
        this.load.tilemapTiledJSON('map10', './assets/map/Map5/Map5.json');


    }

    create() {
        gameN.gameSettings.score += 10 ;

        this.add.text(10, 10, 'Score :' + gameN.gameSettings.score, {color: 'red', fontSize: '22px', fontStyle: 'bold' }).setScrollFactor(0, 0).setDepth(2);
        this.enemiesPlacement();
        gameN.lifeBar = this.add.graphics();
        gameN.lifeBar.fillStyle(0x990000, 1);
        gameN.lifeBar.fillRect(10, 50,  gameN.gameSettings.playerHealth * 2, 17).setScrollFactor(0, 0).setDepth(2);
        gameN.player = this.physics.add.sprite(16 * 70, 16 * 22, 'player') ;
        gameN.player.setSize(35, 50);
        gameN.player.setOffset(15, 9);
        gameN.cursorKeys = this.input.keyboard.createCursorKeys();



        const map10 = this.add.tilemap('map10') ;
        const terrain10 = map10.addTilesetImage('Map3', 'terrain10');

        gameN.player.setScale(1.5).setDepth(2);
        const fond1 = map10.createDynamicLayer('fond', [terrain10], 0, 0).setDepth(0);
        const spikeLayer = map10.createDynamicLayer('spike', [terrain10], 0, 510).setDepth(0);
        const mapChanger = map10.createDynamicLayer('changerMap', [terrain10], 0, 0).setDepth(1);
        mapChanger.setScale(2);
        mapChanger.setCollisionByProperty({changerMap: true});

        const gameStatic = map10.createDynamicLayer('gameStatic', [terrain10], 0, 0).setDepth(1);
        const fond2 = map10.createDynamicLayer('fond2', [terrain10], 0, 0).setDepth(0);
        const fond3 = map10.createDynamicLayer('fond3', [terrain10], 0, 0).setDepth(0);

        fond1.setScale(2);
        gameStatic.setScale(2);
        fond2.setScale(2);
        fond3.setScale(2);
        spikeLayer.setScale(2);

        this.physics.add.collider(gameN.player, gameStatic);
        gameStatic.setCollisionByProperty({collide: true});
        this.physics.add.collider(gameN.player, mapChanger, () => {
            this.scene.start('map6');
        });
        spikeLayer.setCollisionByProperty({collide: true});
        this.physics.add.collider(gameN.player, spikeLayer, () => {
          gameN.damagePlayer(this);
        });

        this.physics.add.collider(this.enemies, gameStatic);
        this.physics.add.collider(gameN.player, this.enemies, () => {
          gameN.damagePlayer(this);
        });







    // make the camera follow the player
        this.cameras.main.startFollow(gameN.player);
        this.cameras.main.followOffset.set(0, -150);



    }

    update() {
        gameN.movePlayerManager();
        if (gameN.gameSettings.playerHealth === 0) {
            this.scene.start('GameOver');

        }
        this.enemies.children.each((enemy) => {
            enemy.update();
          } , this);


    }

    enemiesPlacement() {

        this.enemies = this.physics.add.group();
        const hound = new Hound(this, 22, 55);

    }




}
