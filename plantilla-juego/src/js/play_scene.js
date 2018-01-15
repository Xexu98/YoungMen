'use strict';

var PlayScene = {
  
  create: function () {
    var logo = this.game.add.sprite(
      this.game.world.centerX, this.game.world.centerY, 'logo');
    logo.anchor.setTo(0.5, 0.5);

   /* var plataforma = this.game.add.sprite(0,100,'plataforma1');
    plataforma.width=800;

    var suelo=this.game.add.sprite(0,this.game.world.height-5,'plataforma1');
    suelo.width=800;
    suelo.height=5;

    var bandeja= this.game.add.sprite(50,this.game.world.height-100,'plataforma1');
    bandeja.width=150;

    var personaje = this.game.add.sprite(32,0,'personaje1');*/
  }
};

module.exports = PlayScene;
