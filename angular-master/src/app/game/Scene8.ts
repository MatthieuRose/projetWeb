import * as Phaser from 'phaser';
import {Scene2} from './Scene2';
import {gameN} from './gameN';
import {Hound} from './Hound';

export class Scene8 extends Phaser.Scene {
    constructor() {
        super('mapFinale') ;
    }
    preload() {


        this.load.image('terrain8', './assets/map/spritesheet.png');
        this.load.tilemapTiledJSON('map8', './assets/map/MapFinal/MapFinal.json');


    }

    create() {
      // @ts-ignore
        gameN.gameSettings.score += 10 ;
        this.add.text(10, 10, 'Score :' + gameN.gameSettings.score, {color: 'red', fontSize: '22px', fontStyle: 'bold' }).setScrollFactor(0, 0).setDepth(2);

        gameN.lifeBar = this.add.graphics();
        gameN.lifeBar.fillStyle(0x990000, 1);
        gameN.lifeBar.fillRect(10, 50,  gameN.gameSettings.playerHealth * 2, 17).setScrollFactor(0, 0).setDepth(2);
        gameN.player = this.physics.add.sprite(16 * 16, 16 * 40, 'player') ;
        gameN.player.setSize(35, 50);
        gameN.player.setOffset(15, 9);
        gameN.cursorKeys = this.input.keyboard.createCursorKeys();



        const map8 = this.add.tilemap('map8') ;
        const terrain8 = map8.addTilesetImage('Map7', 'terrain8');

        gameN.player.setScale(1.5).setDepth(2);
        const fond1 = map8.createDynamicLayer('fond1', [terrain8], 0, 0).setDepth(1);

        const gameStatic = map8.createDynamicLayer('mapStatic', [terrain8], 0, 0).setDepth(1);
        const chest = map8.createDynamicLayer('chest', [terrain8], 16 * 32, 0).setDepth(1);
        fond1.setScale(2);
        gameStatic.setScale(2);
        chest.setScale(2);

        this.physics.add.collider(gameN.player, gameStatic);
        gameStatic.setCollisionByProperty({collide: true});
        chest.setCollisionByProperty({endGame: true});
        this.physics.add.collider(gameN.player, chest, () => {
            this.scene.start('endGame');
        });







    // make the camera follow the player
        this.cameras.main.startFollow(gameN.player);



    }

    update() {
        gameN.movePlayerManager();
        if (gameN.gameSettings.playerHealth === 0) {
            this.scene.start('GameOver');

        }


    }




}
