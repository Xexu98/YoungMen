var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update ,render: render});

function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('bullet', 'assets/bullet.png');
    game.load.image('enemy1','assets/enemy.png');
    game.load.image('enemy2','assets/enemy1.png');
    game.load.image('enemy3','assets/enemy2.png');
    game.load.image('enemy4','assets/enemy3.png');
    game.load.image('enemy5','assets/enemy4.png');
    game.load.image('torreta','assets/torreta.png');
    game.load.image('enemybullet','assets/enemybullet.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
}
var platforms;
var player;
var cursors;
var weapon;
var bullets;
var enemybullets;
var firebutton;
var enemy;
var enemy2;
var enemy3;
var enemy4;
var enemy5;
var torretas;
var vidaenemigo=5;
var dispaenem=0;
var undisparo=true;
var torretaalive=true;

var playeralive=true;
var tiempoinv;
var invulnerable=false;
var vidajugador=100;
var dispderch=true;
var tiempodis=0;
var tiempo=0;
var pointenemynewX;
var pointenemynewY;
var detectionpointX;
var detectionpointY;
var detectado=false;
var vuelveenemy = false;
var ve=false;
var nuevapos=false;
var derchen=false;
var reset=false;
var para=false;
var saltoder=false;
var posicion;
var posicionY;
var octox;
var octoy;
var pruebay=200;
var pruebax=0;
var cambiadir =false;

function create() {
  
     //  We're going to be using physics, so enable the Arcade Physics system
     game.physics.startSystem(Phaser.Physics.ARCADE);
     
         //  A simple background for our game
         game.add.sprite(0, 0, 'sky');
     
         //  The platforms group contains the ground and the 2 ledges we can jump on
         platforms = game.add.group();
     
         //  We will enable physics for any object that is created in this group
         platforms.enableBody = true;
     
         // Here we create the ground.
         var ground = platforms.create(0, game.world.height - 64, 'ground');
     
         //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
         ground.scale.setTo(2, 2);
     
         //  This stops it from falling away when you jump on it
         ground.body.immovable = true;
     
         //  Now let's create two ledges
         var ledge = platforms.create(400, 400, 'ground');
     
         ledge.body.immovable = true;
     
         ledge = platforms.create(-150, 250, 'ground');
     
         ledge.body.immovable = true;   

         enemy= game.add.sprite(500,125,'enemy1');
         enemy.enableBody=true;
         game.physics.arcade.enable(enemy);
         enemy.body.velocity.x=-100;

         enemy2 = game.add.sprite(500,100,'enemy2');
         enemy2.enableBody=true;
         game.physics.arcade.enable(enemy2);

         enemy3 = game.add.sprite(475,100,'enemy3');
         enemy3.enableBody=true;
         game.physics.arcade.enable(enemy3);
         enemy3.body.gravity.y=900;

         enemy4 = game.add.sprite(100,100,'enemy4');
         enemy4.anchor.setTo(0.5,0.5);
         enemy4.enableBody=true;
         game.physics.arcade.enable(enemy4);
         enemy4.body.gravity.y=900;

         enemy5 = game.add.sprite(500,175,'enemy5');
         game.physics.arcade.enable(enemy5);

         torretas=game.add.sprite(385,400,'torreta');
         torretas.enableBody=true;
         game.physics.arcade.enable(torretas);

         
         // The player and its settings
         player = game.add.sprite(32, game.world.height - 150, 'dude');
         player.anchor.setTo(0.5,0.1);
         //  We need to enable physics on the player
         game.physics.arcade.enable(player);
         //  Player physics properties. Give the little guy a slight bounce.
         player.body.bounce.y = 0.2;
         player.body.gravity.y = 900;
         player.body.collideWorldBounds = true;
     
         //  Our two animations, walking left and right.
         player.animations.add('left', [0, 1, 2, 3], 10, true);
         player.animations.add('right', [5, 6, 7, 8], 10, true);
         cursors = game.input.keyboard.createCursorKeys();

         bullets = game.add.group();
         bullets.enableBody = true;
         bullets.physicsBodyType = Phaser.Physics.ARCADE;
         bullets.createMultiple(30, 'bullet', 0, false);
         bullets.setAll('anchor.x', 0.5);
         bullets.setAll('anchor.y', 0.5);
         bullets.setAll('outOfBoundsKill', true);
         bullets.setAll('checkWorldBounds', true);
         
         enemybullets=game.add.group();
         enemybullets.enableBody = true;
         enemybullets.physicsBodyType = Phaser.Physics.ARCADE;
         enemybullets.createMultiple(30, 'enemybullet');
         enemybullets.setAll('anchor.x', 0.5);
         enemybullets.setAll('anchor.y', 1);
         enemybullets.setAll('outOfBoundsKill', true);
         enemybullets.setAll('checkWorldBounds', true);

         weapon = game.add.weapon(10,'bullet');
         weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        // weapon.bulletAngleOffset = 90;
         weapon.bulletSpeed = 300;
         weapon.trackSprite(player,15,30, true);
         firebutton= this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

         game.time.events.loop(Phaser.Timer.SECOND*2.5, enemigoconcha, this);
         game.time.events.loop(Phaser.Timer.SECOND*2, logicaenemigosaltofuerte, this);
         game.time.events.loop(Phaser.Timer.SECOND*1.5, logicaenemigosalto, this);
         game.time.events.loop(Phaser.Timer.SECOND*3, logicaocto, this);
         game.time.events.loop(Phaser.Timer.SECOND*3.5, logicatorretas, this);
         //puntos enemigo
      //   game.time.event.loop(2000,enemigoconcha,this);
        
}


function update() {
     //  Collide the player and the stars with the platforms
     var hitPlatform = game.physics.arcade.collide(player, platforms);
     var hitPlatformenemy = game.physics.arcade.collide(enemy3, platforms);
     var hitPlatformenemystrong = game.physics.arcade.collide(enemy4, platforms);

     player.body.velocity.x = 0;

     if (cursors.left.isDown)
     {
         //  Move to the left
         player.body.velocity.x = -150;
 
         player.animations.play('left');
         dispderch=false;
        // weapon.bulletSpeed=-300;
     }
      else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('right');
        dispderch=true;
       // weapon.bulletSpeed = 300;
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }

    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down && hitPlatform)
    {
        player.body.velocity.y = -570;
    }
    if(firebutton.isDown && playeralive)
    {
      //  weapon.fire();
      fire();
    }
    
    if(enemy2.body.y >= octoy-2 && enemy2.body.y<= octoy+2 )
    {
        enemy2.body.velocity.y=0;
    }
    if (enemy3.body.touching.down && hitPlatformenemy)
    {
        enemy3.body.velocity.x=0;
    }

   if (enemy4.body.touching.down && hitPlatformenemystrong)
    {
       enemy4.body.velocity.x=0;
    } 
    if(enemy5.body.x>=posicion-1 && enemy5.body.x<=posicion+1 )
    {
        enemy5.body.velocity.x=0;
        game.physics.arcade.overlap(bullets, enemy5, mataenemigo, null, this);
        if(undisparo)
        {
        disparocirculo();
        undisparo=false;
        }
    }
    intocable();


    tiempo=tiempo+0.1;
    
    game.physics.arcade.overlap(bullets, enemy3, mataenemigo, null, this);
    game.physics.arcade.overlap(bullets, enemy, mataenemigo, null, this);
    game.physics.arcade.overlap(bullets, torretas, matatorreta, null, this);
    game.physics.arcade.overlap(enemybullets, player, bullethitplayer, null, this);
    game.physics.arcade.overlap(bullets, enemy4, mataenemigogrande, null, this);
    game.physics.arcade.overlap(bullets, enemy2, mataenemigogrande, null, this);
    game.physics.arcade.overlap(enemy, player, enemyhitplayer, null, this);
    game.physics.arcade.overlap(enemy2, player, enemyhitplayer, null, this);
    game.physics.arcade.overlap(enemy3, player, enemyhitplayer, null, this);
    game.physics.arcade.overlap(enemy4, player, enemyhitplayer, null, this);
    game.physics.arcade.overlap(enemy5, player, enemyhitplayer, null, this);

    logicaenemigovolador();

    game.world.wrap(enemy,16);
    game.world.wrap(enemy2,16);
    game.world.wrap(enemy3,16);
    game.world.wrap(enemy4,16);
    game.world.wrap(enemy5,16);
    

}
function render ()
{
  // weapon.debug();
   game.debug.text("Vida del jugador:"+ vidajugador,1,75);
   game.debug.text("Vida enemigo fuerte:"+vidaenemigo,1,100);
  // game.debug.text(invulnerable,1,200);
//  game.debug.text(tiempoinv,1,250);
 // game.debug.text(game.time.now,1,300);
  // game.debug.text(vidaenemigo,1,350);
  /* game.debug.text(detectionpointX,100,350);
   game.debug.text(posicion,100,400);*/
}

//LOGICA ENEMIGOS

function logicaenemigovolador()
{
    if((enemy.body.x-player.body.x <= 75 && enemy.body.x-player.body.x >= -75 ) && (player.body.y-enemy.body.y <= 100 && player.body.y-enemy.body.y >=0) && !detectado)
    {
        detectionpointX = player.body.x;
        detectionpointY = player.body.y;
        if(enemy.body.x-player.body.x <= 75 && enemy.body.x-player.body.x >0 ){
            pointenemynewX = enemy.body.x - 200;
        }
        else
        {
            pointenemynewX = enemy.body.x + 200;
            derchen=true;
        }
        pointenemynewY = enemy.body.y;
        detectado=true;
        ve=true;
        para=false;
    }
    if(ve)
    {
        game.physics.arcade.moveToXY(enemy,detectionpointX,detectionpointY,200);
    }
    if((enemy.body.x <= detectionpointX + 2 && enemy.body.x >= detectionpointX - 2 ) && (enemy.body.y >= detectionpointY-2 &&  enemy.body.y <= detectionpointY+2) && !para)
    {
        enemy.body.velocity.x=0;
        enemy.body.velocity.y=0;
        ve=false;
        reset=false;
        nuevapos=true;
        para=true;
    }
    if(nuevapos)
    {
        game.physics.arcade.moveToXY(enemy,pointenemynewX,pointenemynewY,200);
    }
    if((enemy.body.x <= pointenemynewX + 2 && enemy.body.x >= pointenemynewX - 2) && (enemy.body.y <= pointenemynewY+1 && enemy.body.y >= pointenemynewY-1)&& !reset)
    {
        enemy.body.velocity.x=0;
        enemy.body.velocity.y=0;
        nuevapos=false;
        if (derchen)
        {
            enemy.body.velocity.x=100;
            derchen=false;
        }
        else
        {
            enemy.body.velocity.x=-100;
        }
        enemy.body.velocity.y=0;
        detectado=false;
        reset=true;
    }
}

function logicaenemigosalto()
{
    enemy3.body.velocity.y=-350;
   if((enemy3.body.x-player.body.x <= 175 && enemy3.body.x-player.body.x >= 0 ))
   {
       enemy3.body.velocity.x=-100;
   }
   else if (enemy3.body.x-player.body.x < 0 && enemy3.body.x-player.body.x >= -175 )
   {
    enemy3.body.velocity.x=100;
   }
   else{
       enemy3.body.velocity.x=0;
   }
}
function logicaenemigosaltofuerte()
{
    enemy4.body.velocity.y=-200;
   if((enemy4.body.x-player.body.x <= 175 && enemy4.body.x-player.body.x >= 0 ))
   {
       enemy4.scale.x=-1;
       enemy4.body.velocity.x=-100;
   }
   else if (enemy4.body.x-player.body.x < 0 && enemy4.body.x-player.body.x >= -175 )
   {
    enemy4.scale.x=1;
    enemy4.body.velocity.x=100;
   }
   else{
       enemy4.body.velocity.x=0;
   }
}
 function enemigoconcha() 
 {
     posicion=enemy5.body.x-150;
     posicionY=enemy5.body.y;
     game.physics.arcade.moveToXY(enemy5,posicion,posicionY,100);
     undisparo=true;

}
function logicaocto()
{
    octox=enemy2.body.x +pruebax;
    octoy=enemy2.body.y + pruebay;
    game.physics.arcade.moveToXY(enemy2,octox,octoy,175);
    pruebay=-pruebay;
}

//COLISIONES Y DISPAROS

function fire () {
    if (game.time.now > tiempodis)
    {
    var bullet = bullets.getFirstExists(false);
      if (bullet)
         {
             bullet.reset(player.body.x+10, player.body.y+30);
             if(dispderch){
             bullet.body.velocity.x=200;
             }
             else
             {
                bullet.body.velocity.x=-200; 
             }
             tiempodis = game.time.now + 200;
             bullet.rotation=player.rotation;
         }
    }
}
function resetBullet (bullet) {
    
        //  Called if the bullet goes out of the screen
        bullet.kill();
    
}
function mataenemigo(bullet,enemigo)
{
    bullet.kill();
    enemigo.kill();
}
function matatorreta(bullet,enemigo)
{
    bullet.kill();
    enemigo.kill();
    torretaalive=false;
}
function mataenemigogrande(enemigo2,bullet)
{
    bullet.kill();
    vidaenemigo=vidaenemigo-1;
    if(vidaenemigo == 0)
    {
        enemigo2.kill();
        vidaenemigo=5;
    }
}
function enemyfire(velx,vely,enemigo3)
{
    var enemybullet = enemybullets.getFirstExists(false);
   // if (enemybullet && game.time.now>dispaenem )
   // {
        enemybullet.reset(enemigo3.body.x-2, enemigo3.body.y+5);
        enemybullet.body.velocity.x=velx;
        enemybullet.body.velocity.y=vely;
        dispaenem=game.time.now+200;
   // }
}
function logicatorretas()
{
    if(torretaalive){
    enemyfire(-200,-200,torretas);
    enemyfire(-200,-100,torretas);
    enemyfire(-200,0,torretas);
    enemyfire(-200,200,torretas);
    }
}
function disparocirculo()
{
    enemyfire(-200,-200,enemy5);
    enemyfire(200,0,enemy5);
    enemyfire(-200,0,enemy5);
    enemyfire(-200,200,enemy5);
    enemyfire(0,200,enemy5);
    enemyfire(0,-200,enemy5);
    enemyfire(200,200,enemy5);
    enemyfire(200,-200,enemy5);
}
function bullethitplayer(player,enemybullet)
{
    if(!invulnerable){
    enemybullet.kill();
    vidajugador=vidajugador-10;
    tiempoinv = game.time.now + Phaser.Timer.SECOND*4;
    player.alpha=0.5;
    invulnerable=true;
    }
    if(vidajugador <= 0)
    {
        player.kill();
        playeralive=false;
    }
}
function enemyhitplayer()
{
    if(!invulnerable){
    vidajugador=vidajugador-5;
    tiempoinv = game.time.now + Phaser.Timer.SECOND*4;
    player.alpha=0.5;
    invulnerable=true;
    }
    if(vidajugador <= 0)
    {
        player.kill();
        playeralive=false;
    }
}
function intocable()
{
    if(game.time.now >= tiempoinv)
    {
        player.alpha=1;
        invulnerable=false;
    }
}