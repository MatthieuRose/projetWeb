import * as Phaser from 'phaser';

export class Hound extends Phaser.Physics.Arcade.Sprite {
  private readonly speed: number;

  constructor(scene, x, y) {
    x *= 16;
    y *= 16;
    // @ts-ignore
    super(scene, x, y);
    this.scene = scene;
    this.speed = 300;
    this.flipX = true;
    scene.add.existing(this);
    scene.enemies.add(this);
    // @ts-ignore
    this.scene.physics.add.sprite(50, 25);
    // set setSize
    this.body.setSize(50, 25);
    this.body.offset.y = 30;
    this.body.offset.x = 18;
    this.setDepth(2);
    scene.anims.create({
      key: 'hound_run',
      frames: scene.anims.generateFrameNumbers('houndRun'),
      frameRate: 15,
      repeat: -1
    });

    this.play('hound_run');

  }


  create() {
  }

  update() {


    if (this.flipX) {
      this.setVelocityX(this.speed);
    } else {
      this.setVelocityX(-this.speed);
    }


    // @ts-ignore
    if (this.body.onWall()) {
      if (this.flipX) {
        this.flipX = false;
        this.x -= 5;
      } else {
        this.flipX = true;
        this.x += 5;
      }

    }

  }

}
