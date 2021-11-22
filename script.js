/* Students: Please use this week's project for Week 13: Assignment 11: Basic Game. 
     You will need to replace the contents of this JavaScript file with your own work, 
     and create any other files, if any, required for the assignment.
     When you are done, be certain to submit the assignment in both Repl.it and Canvas to be graded. */
//step 1. define the name's characteristics in an object value saved in a variable to use later
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    // tell phaser engine how to find the blocks of code (functions) I am providing for the game
    audio: {
        disableWebAudio: true
    },
    scene: {
        preload: preload,
        create: create,
        update: update
        },
    title: 'The Tiny Penguin',
    pixelArt: false,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: {y: 300},
        debug: false
      }
    }
};
// step 2. define global variables that al functions can access to work with game objects
var player;
var fishes;
var platforms;
var music;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var titleText;
var game = new Phaser.Game(config);
// step 3. PRELOAD the phaser library runs our function for preload to load all the images and audio for the game
function preload ()
{// load a couple of image file assets to use during create
    // image() takes 2 args: string nickname for the asset, filepath to file
  this.load.image('water', 'assets/underwater.jpg');
  this.load.image('tree', 'assets/tree.png');
  this.load.image('grass', 'assets/grass.png');
  //this.load.image('ground', 'assets/platform.png');
  this.load.image('ground1', 'assets/desert_ground.jpg');
  this.load.image('snow', 'assets/snow_05.png');
  this.load.image('snow1', 'assets/snow_1.jpg');
  this.load.image('snow2', 'assets/snow_half.png');
  this.load.image('fish', 'assets/parrot3.png');
  this.load.image('shark', 'assets/shark_to_right.png');
  this.load.image('sharkl', 'assets/shark_to_left.png');
  // spritesheet() takes 3 args: string nickname for the asset, filepath to file, frame dimension
  this.load.spritesheet('penguin', 'assets/penguin.png', {frameWidth: 24, frameHeight: 32});
  //add music
   this.load.audio('theme', [
        'assets/sky_ogg.ogg',
        'assets/sky_wav.wav'
    ]);
  console.log("1. images done");
}
console.log("2. preload done");

// step 4. CREATE the phaser library next runs our function for creating/laying out the game, bkgnd, create game objects, etc.
function create ()
{// display a game object in the visible game stage
    // 3 args: x-coord, y-coord, asset nickname string
  this.add.image(400, 300, 'water').setScale(0.40);
  //this.add.image(400, 300, 'grass').setScale(2.7);
  //this.add.image(400, 300, 'tree').setScale(2.7);
  //this.add.image(0, 0, 'water').setOrigin(0, 0);
  //the fish image
  //this.add.image(400, 300, 'fish');
  console.log("3. add image done");
  //music
  music = this.sound.add('theme');
  music.play();
  //physics
  platforms = this.physics.add.staticGroup();
 //ground, double in size
  platforms.create(400, 568, 'ground1').setScale(2).refreshBody();
   //more bars
   //platforms.create(600, 500, 'snow1');
   platforms.create(25, 250, 'snow1');
   platforms.create(750, 200, 'snow1');
   platforms.create(250, 400, 'snow2');
   platforms.create(500, 300, 'snow2');
   //platforms.create(50, 500, 'snow1');
   console.log("4. platforms done");
// add another game object, this time a player-controlled object often called a sprite
    // to work with game objects in multiple stage of a scene, save a ref to obj in a global var
    // sprite() takes 3 args: x-coord, y-coord, asset nickname string
player = this.physics.add.sprite(200, 450, 'penguin');
//movement & change from .2 to .5
player.setBounce(0.1);
// ask the physics sim in the engine to prevent a game object from falling off screen
player.setCollideWorldBounds(true);
this.anims.create ({
  key: 'left',
  frames : this.anims.generateFrameNumbers('penguin', {start: 9, end: 11}), 
  frameRate: 10,
  repeat: -1
});
this.anims.create({
  key: 'turn',
  frames: [{key: 'penguin', frame: 7}],
  frameRate: 8
});
this.anims.create({
  key: 'right',
  frames: this.anims.generateFrameNumbers('penguin', {start: 3, end: 5}), 
  frameRate: 10,
  repeat: -1
});
console.log("5. ani done");
cursors= this.input.keyboard.createCursorKeys();
//sprite on ground
console.log("7. keyboard");
  fishes = this.physics.add.group({
    key: 'fish',
    repeat: 8,
    //setScale: 0.25,
    setXY: { x: 40, y: 0, stepX: 100}
  });
  console.log("8. add fishes");
  fishes.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0, 1));
  console.log("9. add bounce & next sharks");
  });
  //sharks
  sharks= this.physics.add.group();
  //add score & change font
  scoreText = this.add.text(16, 16, 'Score:  0', { fontSize: '32px', fill: '#000', fontFamily:'sans-serif'});
  scoreTitle = this.add.text(250, 0, 'Welcome to the Ocean', { fontSize: '36px', fill: '#191970',  fontFamily: 'serif' });
  //collide fishes, player and sharks
  this.physics.add.collider(player, platforms);
  this.physics.add.collider(fishes, platforms);
  this.physics.add.collider(sharks, platforms);
  //players overplaps of the fishes
  this.physics.add.overlap(player, fishes, collectFish, null, this);
  this.physics.add.collider(player, sharks, hitShark, null, this);
  }
//}
console.log("6. create done");
function update ()
{ //look at the global var that Phaser is saving the state of arrows inside
 // check left and right arrow keys
  if(gameOver) {
  return;
}
  
  //cursors = this.input.keyboard.createCursorKeys();
  //check left and right arrow keys
if (cursors.left.isDown){
  player.setVelocityX(-100);
  player.anims.play('left', true);
}
else if (cursors.right.isDown) {
  player.setVelocityX(100);
  player.anims.play('right', true);}
  else {
    player.setVelocityX(0);
    player.anims.play('turn');}
  if (cursors.up.isDown && player.body.touching.down){
      player.setVelocityY(-330);
      console.log("7. keyboard");
  }
  /*if(cursors.up.isDown){
   player.setVelocityY(-160);}
else if (cursors.down.isDown){player.setVelocityY(160);}
 else {
  // could change vertical velocity but gravity would be messed up
 }*/
}
function collectFish(player, fish) {
    fish.disableBody(true, true);
    //add scoreText & score
    score += 5;
    scoreText.setText('Score:' + score);
    if(fishes.countActive(true) === 0) {
      fishes.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
      });
      var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
      var shark = sharks.create(x, 16, 'shark', 'sharkl');
      shark.setBounce(1);
      shark.setCollideWorldBounds(true);
      shark.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
  }
  function hitShark (player, shark) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
  }
