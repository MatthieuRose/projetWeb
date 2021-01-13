import * as Phaser from 'phaser';
import {gameN} from './gameN' ;
import {Scene2} from './Scene2';



export class Scene4 extends Phaser.Scene {
    constructor() {
        super('map2') ;
    }
    preload() {

        this.load.image('terrain2', './assets/map/Map1.png');
        this.load.tilemapTiledJSON('map2', './assets/map/map2.json');


    }

    create() {
      // @ts-ignore

        gameN.game = this ;
        gameN.gameSettings.playerHealth = 100 ;
        gameN.player = this.physics.add.sprite(0, 0, 'player') ;
        gameN.player.setSize(35, 50);
        gameN.player.setOffset(15, 9);
        gameN.cursorKeys = this.input.keyboard.createCursorKeys();
        gameN.player.setCollideWorldBounds(true);


        const map2 = this.add.tilemap('map2') ;
        const terrain = map2.addTilesetImage('Map2', 'terrain2');
        gameN.player.setScale(1.5).setDepth(2);
        const botLayer = map2.createDynamicLayer('background', [terrain], 0, 0).setDepth(1);
        const spikeLayer = map2.createDynamicLayer('spike', [terrain], 0, 0).setDepth(1);
        botLayer.setScale(2);
        spikeLayer.setScale(2);

        this.physics.add.collider(gameN.player, botLayer);

        botLayer.setCollisionByProperty({Collides: true});
        spikeLayer.setCollisionByProperty({Collides: true});
        this.physics.add.collider(gameN.player, spikeLayer, function() {
            gameN.gameSettings.playerHealth = 0 ;
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
