var ushala, ushalaRunning;
var pista, pistaImg;
var bomb, bombImg;
var explosion, explosionBlowing;
var bau, bauImg;
var invisibleWall1, invisibleWall2;
var start, startImg;
var gameOver, gameOverImg;
var score = 0;
var resetGame, resetImg;
var explosionSound;
var coinSound;
var WAIT = 0;
var PLAY = 1;
var PAUSE = 2;
var END = 3;
var gameState = WAIT;

function preload(){
ushalaRunning = loadAnimation(
"ushala1.png",
"ushala2.png",
"ushala3.png",
"ushala4.png",
"ushala5.png",
"ushala6.png"
)
pistaImg = loadImage(
"ground.png"
)
bombImg = loadImage(
"bomb.png"
)
explosionBlowing = loadAnimation(
"explosion1.webp",
"explosion2.webp",
"explosion3.webp",
"explosion4.webp",
"explosion3.webp",
"explosion4.webp",
"explosion3.webp",
"explosion4.webp",

)
bauImg = loadImage(
"bau.png"
)
startImg = loadImage(
"start1.png"
)
gameOverImg = loadImage(
"gameOverImg.webp"
)
resetImg = loadImage(
"resetImg.webp"
)
explosionSound = loadSound(
"explosionsound.mp3"
)
coinSound = loadSound(
"coinsound.mp3"
)
}


var startGameClickable = true

function setup() {
  createCanvas(400,600);
  pista = createSprite(200,300);
  pista.addImage(pistaImg);
  pista.scale = 2;

  ushala = createSprite(200,500);
  ushala.addAnimation("running", ushalaRunning);
  ushala.addAnimation("explosion", explosionBlowing);
  //ushala.debug = true;

  invisibleWall1 = createSprite(20,350,25,1000);
  invisibleWall2 = createSprite(380,350,25,1000);
  invisibleWall1.visible = false;
  invisibleWall2.visible = false;

  start = createSprite(200,300,150,100);
  start.addImage(startImg);
  start.scale = 0.5;

  resetGame = createSprite(200,400,150,100);
  resetGame.visible = false;
  resetGame.addImage(resetImg);
  resetGame.scale = 0.5;


  bauGroup = new Group();
  bombGroup = new Group();

  gameOver = createSprite(200, 300, 100, 100);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  gameOver.visible = false;
}

function draw(){
  background(225);
  //console.log(pista.y);
  console.log(gameState);
  if(mousePressedOver(start) && startGameClickable){
    start.visible = false;
    gameState = PLAY;
    startGameClickable = false;
  }

  if(gameState === PLAY){

    spawnBombs();
    spawnBau();
    if(keyDown("left")){
      ushala.x = ushala.x -10;
    }
    if(keyDown("right")){
      ushala.x = ushala.x +10;
    }
    pista.velocityY = 4 +3*score/100;

    bauGroup.overlap(ushala, function(bau){
      bau.remove();
      score += 5;
      coinSound.play();
    })
    bombGroup.overlap(ushala, function(bomb){
      bomb.remove();
      explosionSound.setVolume(0.15);
      explosionSound.play();
      //ushala.changeAnimation("explosion");
      //ushala.scale = 3;
      //setTimeout(function(){
        gameState = END;
      //},2000);

    })
  }

  else if(gameState === END){
    gameOver.visible = true;
    resetGame.visible = true;

    pista.velocityY = 0;


    bauGroup.setVelocityYEach(0);
    bombGroup.setVelocityYEach(0);


    //bauGroup.setLifetimeEach(-1);
    //bombGroup.setLifetimeEach(-1);

    bauGroup.destroyEach();
    bombGroup.destroyEach();

    ushala.changeAnimation("explosion");
    ushala.scale = 2;
    if(mousePressedOver(resetGame)){
      restartGame();

    }
    
  }


  if(pista.y > 900){
    pista.y = 330;
  }
  
  ushala.bounceOff(invisibleWall1);
  ushala.bounceOff(invisibleWall2);



  drawSprites();
  fill("white");
  textSize(20);
  text("SCORE: " + score, 60,70);

}

function spawnBombs(){
  if(frameCount%100 === 0){
    bomb = createSprite(200,0,40,40);
    bomb.velocityY = 4 +3*score/100;
    bomb.x = Math.round(random(100,300));
    bomb.lifetime = 310;
    bomb.addImage(bombImg);
    bomb.scale = 0.35
    bombGroup.add(bomb);
  }
}

function spawnBau(){
  if(frameCount%150 === 0){
    bau = createSprite(200,0,40,40);
    bau.velocityY = 4 +3*score/100;
    bau.x = Math.round(random(100,300));
    bau.lifetime = 310;
    bau.addImage(bauImg);
    bau.scale = 0.5
    bauGroup.add(bau);
  }
}

function restartGame(){
  resetGame.visible = false;
  gameOver.visible = false
  ushala.changeAnimation("running");
  ushala.scale = 1;
  gameState = PLAY;
  score = 0;
}