import * as Phaser from 'phaser';
import {gameN} from './gameN' ;
import {Scene1} from './Scene1';



export class Scene2 extends Phaser.Scene {
  public static player: Phaser.Physics.Arcade.Sprite;
  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;


    constructor() {
        super('playGame') ;
    }
    preload() {
        /*
        this.load.image("terrain","./assets/map/Map1.png");
        this.load.tilemapTiledJSON("map1","./assets/map/map1.json");
        */


        this.load.image('terrain', './assets/map/Map/spritesheet.png');
        this.load.tilemapTiledJSON('map1', './assets/map/Map/Map1.json');

    }

    create() {
        this.add.text(80, 70, 'Score :' + gameN.gameSettings.score,
          {color: 'red', fontSize: '22px', fontStyle: 'bold' }).setScrollFactor(0, 0).setDepth(2);
        gameN.lifeBar = this.add.graphics();
        gameN.lifeBar.fillStyle(0x990000, 1);
        gameN.lifeBar.fillRect(80, 100,  gameN.gameSettings.playerHealth * 2, 17).setScrollFactor(0, 0).setDepth(2);
        gameN.cursorKeys = this.input.keyboard.createCursorKeys();
        gameN.player = this.physics.add.sprite(0, 25 * 16, 'player') ;
        gameN.player.setSize(35, 50);
        gameN.player.setOffset(15, 9);
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        gameN.player.setCollideWorldBounds(true);
        gameN.player.setDepth(2);
        const map1 = this.add.tilemap('map1') ;
        const terrain = map1.addTilesetImage('Map1', 'terrain');
        const fond1 = map1.createDynamicLayer('fond1', [terrain], 0, 0).setDepth(1);
        const fond2 = map1.createDynamicLayer('fond2', [terrain], 0, 0).setDepth(1);
        const fond3 = map1.createDynamicLayer('fond3', [terrain], 0, 0).setDepth(1);
        const fond4 = map1.createDynamicLayer('fond4', [terrain], 0, 0).setDepth(1);
        const gameStatic = map1.createDynamicLayer('gameStatic', [terrain], 0, 0).setDepth(1);
        const mapChanger = map1.createDynamicLayer('MapChanger', [terrain], 0, 0).setDepth(1);
        fond1.setScale(2); fond2.setScale(2); fond3.setScale(2); fond4.setScale(2); gameStatic.setScale(2); mapChanger.setScale(2);
        this.physics.add.collider(gameN.player, gameStatic);
        gameStatic.setCollisionByProperty({collide: true});
        mapChanger.setCollisionByProperty({mapChanger: true});
        this.physics.add.collider(gameN.player, mapChanger, () => {
            this.scene.start('map3');

        });

    // make the camera follow the player
        this.cameras.main.startFollow(gameN.player);
        this.cameras.main.setFollowOffset(0, 100);
        this.cameras.main.zoomTo(1.2, 2000);
        this.cameras.main.setBounds(0, 0, map1.widthInPixels + 500, map1.heightInPixels);

    }

    update() {
        gameN.movePlayerManager();
        if (gameN.gameSettings.playerHealth === 0) {
            this.scene.start('GameOver');
        }

    }
}
