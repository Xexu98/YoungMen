var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update ,render: render});

function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('bullet', 'assets/bullet.png');
    game.load.image('torreta','assets/torreta.png');
    game.load.image('boss','assets/Boss.png');
    game.load.image('bossbullet','assets/comecocos.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
}
var platforms;
var player;
var firebutton;
var playeralive=true;
var tiempoinv;
var invulnerable=false;
var vidajugador=100;
var dispderch=true;
var tiempodis=0;
var tiempo=0;
var bullets;
var firebutton;
var movjefe=1.65;
var furioso=false;
var descanso=4.15;
var undesc=true;

var finalboss;
var bossbullets;
var vidaboss=50;
var bossinv=false;
var tiempbossinv;
var posbalx;
var posbaly;
var tienebala=true;
var atacabala=false;
var vuelve;
var bossalive=true;
var deadbullet=false;
var numsaltos;
var descansa=false;
var calculasaltos=true;
var saltox;
var saltoy;
var tiempodescanso;
var mueveboss=false;
var saltalado=300;
var knockback=false;

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
     var ledge = platforms.create(-200, game.world.height - 128, 'ground');

         ledge.scale.setTo(1, 2);
         ledge.body.immovable = true;

     //BOSS
     finalboss= game.add.sprite(600, game.world.height - 150, 'boss');
     finalboss.anchor.setTo(0.5,0.1);
     game.physics.arcade.enable(finalboss);
     finalboss.body.gravity.y = 900;
     finalboss.body.collideWorldBounds = true;


     //PLAYER
     player = game.add.sprite(32, game.world.height -200, 'dude');
     //  We need to enable physics on the player
     game.physics.arcade.enable(player);
     //  Player physics properties. Give the little guy a slight bounce.
     player.anchor.setTo(0.5,0.1);
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
     bullets.createMultiple(6, 'bullet', 0, false);
     bullets.setAll('anchor.x', 0.5);
     bullets.setAll('anchor.y', 0.5);
     bullets.setAll('outOfBoundsKill', true);
     bullets.setAll('checkWorldBounds', true);

     bossbullets=game.add.group();
     bossbullets.enableBody = true;
     bossbullets.physicsBodyType = Phaser.Physics.ARCADE;
     bossbullets.createMultiple(30, 'bossbullet');
     bossbullets.setAll('anchor.x', 0.5);
     bossbullets.setAll('anchor.y', 0.5);
     bossbullets.setAll('outOfBoundsKill', true);
     bossbullets.setAll('checkWorldBounds', true);

     firebutton= this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

     game.time.events.loop(Phaser.Timer.SECOND*2.5, bossfireing, this);
     game.time.events.loop(Phaser.Timer.SECOND*2, numerosaltos, this);
}


function update() {
     //  Collide the player and the stars with the platforms
     var hitPlatform = game.physics.arcade.collide(player, platforms);
     var hitPlatformboss=game.physics.arcade.collide(finalboss, platforms);

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
    if (vidaboss<=25)
    {
        finalboss.tint=0xE21900;
        furioso=true;
        descanso=3.15;
    }

    intocable();
    bossintocable();
    if(!bossalive && !deadbullet && bossbullets.getFirstExists())
    {
    bossbullets.getFirstExists().kill();
    deadbullet=true;
    }
    if(!tienebala && bossalive)
    {
    logicabullet();
    }
    if(hitPlatformboss){
        if(logicaboss()==0 && undesc)
        {
        tiempodescanso = game.time.now + Phaser.Timer.SECOND*descanso;
        undesc=false;
        }
        logicaboss();
    }
    else if(mueveboss && !hitPlatformboss)
    {
       /// game.physics.arcade.moveToXY(finalboss,saltox,finalboss.body.y,250);
       finalboss.body.velocity.x=saltalado;
    }
    if(finalboss.body.x>=saltox-3 && finalboss.body.x<=saltox+3 && !knockback)
    {
        finalboss.body.velocity.x=0;
        mueveboss=false;
        knockback = true;
    }
    //COLISIONES
    game.physics.arcade.overlap(finalboss, player, enemyhitplayer, null, this);
    game.physics.arcade.overlap(bullets, finalboss, killboss, null, this);
    game.physics.arcade.overlap(bossbullets, finalboss, balaboss, null, this);
    game.physics.arcade.overlap(bossbullets, player, bullethitplayer, null, this);
}

function render ()
{
    game.debug.text("Vida del jugador:"+ vidajugador,1,75);
    game.debug.text("Vida del boss:"+ vidaboss,1,150);
    game.debug.text(posbalx,1,200);
    game.debug.text(posbaly,1,250);
    game.debug.text(numsaltos,1,300);
    game.debug.text(saltox,1,350);
    game.debug.text(tiempodescanso,1,400);
    game.debug.text(descansa,1,450);
    game.debug.text(game.time.now,1,500);

}

function bossfire(enemigo)
{
    var bossbullet = bossbullets.getFirstExists(false);
    if (bossbullet && tienebala && bossalive)
    {
        bossbullet.reset(enemigo.body.x-2, enemigo.body.y+5);
        tienebala=false;
        atacabala=true;
        posbalx=player.body.x;
        posbaly=player.body.y;
    }
}
/*function bossangry(enemigo)
{
    var bossbullet = bossbullets.getFirstExists(false);
    if(bossbullet && bossalive && furioso)
    {
        bossbullet.reset(enemigo.body.x-2, enemigo.body.y+5);
        furioso=false;
        posbalx=player.body.x;
        posbaly=player.body.y;
    }
}*/
function bossfireing()
{
    bossfire(finalboss);
}
function fire () {
    if (game.time.now > tiempodis)
    {
    var bullet = bullets.getFirstExists(false);
      if (bullet)
         {
             bullet.reset(player.body.x+10, player.body.y+30);
             if(dispderch){
             bullet.body.velocity.x=250;
             }
             else
             {
                bullet.body.velocity.x=-250; 
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
function enemyhitplayer()
{
    if(!invulnerable){
    vidajugador=vidajugador-5;
    tiempoinv = game.time.now + Phaser.Timer.SECOND*2;
    player.alpha=0.5;
    invulnerable=true;
    }
    if(vidajugador <= 0)
    {
        player.kill();
        playeralive=false;
    }
}
function bullethitplayer(player,enemybullet)
{
    if(!invulnerable){
    vidajugador=vidajugador-10;
    tiempoinv = game.time.now + Phaser.Timer.SECOND*2;
    player.alpha=0.5;
    invulnerable=true;
    }
    if(vidajugador <= 0)
    {
        player.kill();
        playeralive=false;
    }
}
function killboss(enemigo,bullet)
{
    if(!bossinv)
    {
    bullet.kill();
    vidaboss=vidaboss-5;
    finalboss.alpha=0.5;
    if(bullet.body.velocity.x>0)
    {
        finalboss.body.velocity.x=finalboss.body.velocity.x+50;
    }
    else{
        finalboss.body.velocity.x=finalboss.body.velocity.x-50;
    }
    tiempbossinv=game.time.now + Phaser.Timer.SECOND*1.2;
    bossinv=true;
    }
    if(vidaboss == 0)
    {
        enemigo.kill();
        bossalive=false;
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
function bossintocable()
{
    if(game.time.now >= tiempbossinv)
    {
        finalboss.body.velocity.x=0;
        finalboss.alpha=1;
        bossinv=false;
    }
}
function numeroAleatorio(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}
function numerosaltos()
{
    if(calculasaltos){
    numsaltos=numeroAleatorio(1,4);
    calculasaltos=false;
    }
}
function logicabullet()
{
    bossbullets.getFirstExists().angle +=10;
    game.physics.arcade.moveToXY(bossbullets.getFirstExists(),posbalx,posbaly,250);
    if(bossbullets.getFirstExists().x <= posbalx+3 && bossbullets.getFirstExists().x >=posbalx-3 )
    {
        atacabala=false;
        vuelve=true;
    }
    if(vuelve)
    {
        game.physics.arcade.moveToObject(bossbullets.getFirstExists(),finalboss,250);
    }
}
function balaboss(jefe,bala)
{
    if(vuelve){
        bala.kill();
        vuelve=false;
        tienebala=true;
    }
}
function logicaboss()
{
    if (!descansa)
    {
        if(numsaltos > 0)
        {
            saltox=player.body.x;
            saltoy= player.body.y;
            finalboss.body.velocity.y=-750;
            mueveboss=true;
            numsaltos=numsaltos-1;
            knockback=false;
        }
       /* if(finalboss.body.x-saltox >0){
            saltalado=(saltox-finalboss.body.x)/movjefe;
        }*/
        saltalado=(saltox-finalboss.body.x)/movjefe;;
        if (numsaltos == 0)
        {
            descansa=true;
            calculasaltos=true;
        }
    }
    if (game.time.now >= tiempodescanso)
    {
        descansa=false;
        undesc=true;
    }
    return numsaltos;
}
