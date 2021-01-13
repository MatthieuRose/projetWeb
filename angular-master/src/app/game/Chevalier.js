class Chevalier extends Phaser.GameObjects.Sprite{
  constructor(scene, x, y){
    x *= 16;
    y *= 16;
   
    super(scene, x, y);

    this.scene = scene;
    this.speed = 300;
    this.flipX= true ;
    scene.add.existing(this);
    scene.enemies.add(this);

     // set setSize
    this.body.setVelocityX(-100) ;
    this.setOrigin(0.5, 0.5);
    this.body.setSize(50,66);
    this.body.offset.y = 0;
    this.body.offset.x = 18;
    this.setDepth(2)
    this.setScale(1.5);
    scene.anims.create({
      key:"chevalier_run",
      frames:scene.anims.generateFrameNumbers("chevalierRun"),
      frameRate:15,
      repeat:-1
  });
   
  this.play("chevalier_run");

  }



  create(){
  }

    update(){

      
      if(this.flipX){
        this.body.setVelocityX(this.speed) ;
      }else{
        this.body.setVelocityX(-this.speed) ;
      }
  
      
      if(this.body.onWall()){
            if(this.flipX){
              this.flipX = false;
              this.x -= 5;
            }else{
              this.flipX = true;
              this.x += 5;
            }
  
      }
  
    }

 




}
