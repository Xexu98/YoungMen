'use strict';

var PlayScene = require('./play_scene.js');
PlayScene=require('./FinalBoss.js');
//PlayScene=require('./juego.js');

var BootScene = {
  preload: function () {
    // load here assets required for the loading screen
    this.game.load.image('preloader_bar', 'images/phaser.png');
  },

  create: function () {
    this.game.state.start('preloader');
  }
};


var PreloaderScene = {
  preload: function () {
    this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
    this.loadingBar.anchor.setTo(0, 0.5);
    this.load.setPreloadSprite(this.loadingBar);

    // TODO: load here the assets for the game
   /* this.game.load.image('logo', 'images/sky.png');
    this.game.load.spritesheet('personaje1','images/dude.png',32,48);
    this.game.load.image('plataforma1', 'images/platform.png');
    this.game.load.image('diamante', 'images/diamante.png');*/
  },

  create: function () {
    this.game.state.start('play');
   /* this.game.physics.startSystem(Phaser.Physics.ARCADE);

    game.physics.arcade.enabled(plataforma);
    game.physics.arcade.enabled(suelo);
    game.physics.arcade.enabled(bandeja);
    game.physics.arcade.enabled(personaje);

    personaje.body.gravity.y=300;
    plataforma.body.immovable=true;
    pers.body.velocity.x=250;*/
  }
};


window.onload = function () {
/*  var game = new Phaser.Game(600, 600, Phaser.AUTO, 'game');*/

 // game.state.add('boot', BootScene);
 // game.state.add('preloader', PreloaderScene);
 // game.state.add('play', PlayScene);


  //game.state.start('boot');
};
