var PLAY = 1;
var END = 0;
var gameState = PLAY;
this.index=0;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var bg_img;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var bg;


function preload(){
  trex_running = loadAnimation("Images/trex1.png","Images/trex3.png","Images/trex4.png");
  trex_collided = loadAnimation("Images/trex_collided.png");
  
  groundImage = loadImage("Images/ground2.png");
  
  bg_img=loadImage("Images/ee.jpg");

  cloudImage = loadImage("Images/cloud.png");
  
  obstacle1 = loadImage("Images/cactii.png");
  obstacle2 = loadImage("Images/cc.png");
  obstacle3 = loadImage("Images/cc.png");
  obstacle4 = loadImage("Images/nn.png");
  obstacle5 = loadImage("Images/nn.png");
  obstacle6 = loadImage("Images/cactii.png");
  
  restartImg = loadImage("Images/rs.png")
  gameOverImg = loadImage("Images/goo.jpg")
  

 
}

function setup() {
  createCanvas(windowWidth,windowHeight);

  var message = "hiiiiii";
 console.log(message)
  
  trex = createSprite(width/2,height-200,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  //trex.shapeColor("pink");

  trex.scale = 0.5;
  
  ground = createSprite(width/2,height-100,width,2);
  ground.addImage("ground",groundImage);
  ground.x = width /2;
  
  
  gameOver = createSprite(width/2,height/2-50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.2;
  restart.scale = 0.03;
  
  invisibleGround = createSprite(width/2,height-100,400,10);
  invisibleGround.visible = false;
  
  
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("rectangle",0,0,70,70);
  trex.debug = false;
  
  score = 0;

  camera.position.y=displayWidth/3;
  camera.position.x=trex.x;
  
}

function draw() {
  
  background(bg_img);
  textSize(15)
  stroke("red");
  strokeWeight(1);
  text("Score: "+ score, 90,50);

  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    //ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    
    if(touches.length > 0 || keyDown("space") && trex.y >= height-       130) {
     
        trex.velocityY = -12;
        touches=[];
       console.log(trex.y);
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        
        gameState = END;
       
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
    
     
     
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0); 
     //resets the game when the restart icon is clicked
     if(mousePressedOver(restart)) {
      reset();
    }
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
if(mousePressedOver(restart)||touches.length>0) {
      reset();
      touches=[];
    }  


  drawSprites();
}
//resets the game when the restart icon is pressed 
function reset(){
  gameState=PLAY;
  gameOver.visible=false;
  restart.visible=false;
  //destroys the obstacles and the clouds when the restart is pressed
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  //changes the popping eyes animation to the original animation 
  trex.changeAnimation("running",trex_running);
  score=0;
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
  
   var obstacle = createSprite(width,height-120,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.06;
    obstacle.lifetime = width/obstacle.velocityX;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.6;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}
function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  

 
  }
  
  
 
