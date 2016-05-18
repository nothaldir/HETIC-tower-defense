var verif = document.querySelector('#name');

function verification(){
  var element = verif.value;
  if(element=="" || element.length<3)
  {
    return false;
  }
  else
  {
    return true;
  }
}


var audio = document.querySelector('.audio');

var again_button = document.querySelector('.again-button');
again_button.addEventListener('click', function(){
  restart();
})

var leaderboard_screen = document.querySelector('.leaderboard-screen');
var leaderboard_button = document.querySelector('.leaderboard-button');
leaderboard_button.addEventListener('click', function(){
  leaderboard_screen.classList.add('pop-up-animation');
})

var leaderboard_back = document.querySelector('.back-button');
leaderboard_back.addEventListener('click', function(){
  leaderboard_screen.classList.remove('pop-up-animation');
  restart();
})

var canvas = document.getElementById('canvas1');
var context = canvas.getContext("2d");
canvas.oncontextmenu = function(){return false;}

var slotw, sloth;
var towers = new Array();
var mobs = new Array();
var flakes = new Array();
var size = 10;
var towerCosts = new Array(40, 200, 1000, 10);

var ctower = false;
var ingameXsel = 0;
var ingameYsel = 0;
var towerType = 1;

var waveSize = 0;
var mobDelay = 0;
var waveDelay = 400;
var level = 1;
var playerHealth = 10;
var gold = 100;

init();
requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
            window.setTimeout(callback, 1000/60);
        };
    })();
requestAnimFrame(draw);


function init(){
  slotw = Math.floor((canvas.width - size) / size);
  sloth = Math.floor((canvas.width - size) / size);
  controlsUpdate();
  
  /*document.getElementById('cTower1Bt').value = "Placer une tourelle ("+numberFormat(towerCosts[0])+")";
  document.getElementById('cTower2Bt').value = "Placer une tourelle AOE ("+numberFormat(towerCosts[1])+")";
  document.getElementById('cTower3Bt').value = "Placer une tourelle ralentissante ("+numberFormat(towerCosts[2])+")";
  document.getElementById('cTower4Bt').value = "Placer un mur ("+numberFormat(towerCosts[3])+")";*/

  genPath();
  //path = new Array(new Point(0,0), new Point(0,1), new Point(0,2));
}

function snowParticle(dir, x, y){
  this.xspeed = Math.cos(dir);
  this.yspeed = Math.sin(dir);
  this.x = x;
  this.y = y;
  this.life = 1;
  
  
  this.update = function(){
    this.x += 0.035*this.xspeed * this.life;
    this.y += 0.035*this.yspeed * this.life;
    this.life -= 0.012;
    if(this.life <= 0){
      return false;
    }else{
      for(var i = 0; i < mobs.length; i++){
	var xdist = (mobs[i].getXCenter() - (this.x*slotw + this.x))/slotw;
	var ydist = (mobs[i].getYCenter() - (this.y*slotw + this.y))/sloth;
	var dist = Math.sqrt(xdist*xdist + ydist*ydist);
	if(dist < 0.2){
	  mobs[i].slowDuration=60;
	}
      }
    }
    
    return true;
  }
  
  this.genTexture = function(){
      
  }
  
  this.draw = function(){
    context.save();
    context.globalAlpha = this.life;
    context.translate(this.x * slotw + this.x + sloth/2,this.y*sloth + this.y + sloth/2);
    context.rotate(Math.PI*2*this.life);
    context.beginPath();
    context.moveTo(0,-1);
    context.lineTo(0, 5);
    context.moveTo(0,-1);
    context.lineTo(4, 2);
    context.moveTo(0,-1);
    context.lineTo(3.5, -5);
    context.moveTo(0,-1);
    context.lineTo(-3.5, -5);
    context.moveTo(0,-1);
    context.lineTo(-4, 2);
    context.lineWidth = 3;
    context.strokeStyle = "#4CC5C3";
    context.stroke();
    context.lineWidth = 1;
    context.strokeStyle = "#FFF";
    context.stroke();
    context.globalAlpha =1;
    
    context.restore();
  }
  
}

function wallTower(x,y){
  this.sel = false;
  
  this.x = x;
  this.y = y;
  this.getXCenter = function(){
    return this.x*slotw + this.x + slotw/2 + 0.5;
  }
  this.getYCenter = function(){
    return this.y*sloth + this.y + sloth/2 + 0.5;
  }
  this.attack = function(){}
  
  this.getUpgradeCost = function(){
    return 0;
  }
  this.getSellValue = function(){
    return 0;
  }
  
  this.draw = function(){
    context.save();
    context.translate(Math.floor(this.getXCenter()), Math.floor(this.getYCenter()));
    if(this.sel){
      context.strokeStyle = "#FF0";
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(-slotw/2, -sloth/2);
      context.lineTo(-slotw/2, sloth/2);
      context.lineTo(slotw/2, sloth/2);
      context.lineTo(slotw/2, -sloth/2);
      context.lineTo(-slotw/2, -sloth/2);
      context.stroke();
    }
    
    var mur = new Image;
    mur.src = "src/images/mur.png";
    
    context.beginPath();
    context.drawImage(mur, -35, -35);
    context.fill();
    
    
    /*context.fillStyle = "#D04532";
    context.strokeStyle = "#A62727";
    
    context.lineWidth = 2;
    context.fillRect(-0.4*slotw, -0.4*sloth, 0.8*slotw, 0.8*sloth);
    context.strokeRect(-0.4*slotw, -0.4*sloth, 0.8*slotw, 0.8*sloth);
    
    context.strokeStyle = "#A6807A";
    context.beginPath();
    for(var i = 1; i < 5; i++){
      context.moveTo(-0.4*slotw, -0.4*sloth + i*(0.8*sloth)/5);
      context.lineTo(0.4*slotw, -0.4*sloth + i*(0.8*sloth)/5);
    }
    for(var i = 0; i < 5; i++){
      for(var j = 1 - i%2; j < 3; j++){
	  context.moveTo(-0.4*slotw + (j + (i%2)*0.5) * (0.8*slotw)/3, -0.4*sloth + i*(0.8*sloth)/5);
	  context.lineTo(-0.4*slotw + (j + (i%2)*0.5) * (0.8*slotw)/3, -0.4*sloth + (i+1)*(0.8*sloth)/5);
      }
    }*/
    context.stroke();
    
    context.restore();
  }
}

function slowTower(x,y){
  this.lvl = 1;
  this.range = 2.3;
  this.sel = false;
  this.anim = 0;
  this.recharge = 13;
  this.charge = this.recharge;
  
  this.x = x;
  this.y = y;
  this.getXCenter = function(){
    return this.x*slotw + this.x + slotw/2 + 0.5;
  }
  this.getYCenter = function(){
    return this.y*sloth + this.y + sloth/2 + 0.5;
  }
  
  this.getUpgradeCost = function(){
    return towerCosts[2] + Math.pow(8, this.lvl) * 100;
  }
  this.getSellValue = function(){
    return towerCosts[2]/2 + (Math.pow(8, this.lvl-1)-1) * 100;
  }
  
  this.draw = function(){
    context.save();
    context.translate(Math.floor(this.getXCenter()), Math.floor(this.getYCenter()));
    
    this.anim = (this.anim +1.8) % 360;
    context.save();
    context.rotate(Math.PI * this.anim / 180);
    
    context.beginPath();
    context.moveTo(-0.1*slotw/2, -0.1*sloth/2);
    context.lineTo(-0.1*slotw/2, -0.5*sloth/2);
    context.lineTo(-0.2*slotw/2, -0.6*sloth/2);
    context.lineTo(-0.2*slotw/2, -0.7*sloth/2);
    context.lineTo(0, -0.8*sloth/2);
    context.lineTo(0.2*slotw/2, -0.7*sloth/2);
    context.lineTo(0.2*slotw/2, -0.6*sloth/2);
    context.lineTo(0.1*slotw/2, -0.5*sloth/2);
    context.lineTo(0.1*slotw/2, -0.1*sloth/2);
    for(var i = 0; i < 5; i++){
      context.rotate(Math.PI/3);
      context.lineTo(-0.1*slotw/2, -0.1*sloth/2);
      context.lineTo(-0.1*slotw/2, -0.5*sloth/2);
      context.lineTo(-0.2*slotw/2, -0.6*sloth/2);
      context.lineTo(-0.2*slotw/2, -0.7*sloth/2);
      context.lineTo(0, -0.8*sloth/2);
      context.lineTo(0.2*slotw/2, -0.7*sloth/2);
      context.lineTo(0.2*slotw/2, -0.6*sloth/2);
      context.lineTo(0.1*slotw/2, -0.5*sloth/2);
      context.lineTo(0.1*slotw/2, -0.1*sloth/2);
    }
    context.closePath();
    
    var tourelle3 = new Image;
    tourelle3.src = "src/images/tourelle3.png";
    
    context.beginPath();
    context.drawImage(tourelle3, -35, -35);
    
    /*context.fillStyle = "#86F5FF";
    context.lineWidth = 2;
    context.strokeStyle = "#4CC4C2";*/
    context.fill();
    /*context.stroke();*/
    context.restore();
    
    if(this.sel){
      context.strokeStyle = "#FF0";
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(-slotw/2, -sloth/2);
      context.lineTo(-slotw/2, sloth/2);
      context.lineTo(slotw/2, sloth/2);
      context.lineTo(slotw/2, -sloth/2);
      context.lineTo(-slotw/2, -sloth/2);
      context.stroke();
    }
    context.strokeStyle = '#FFF';
    context.strokeText(this.lvl, 1-slotw/2, -1 + sloth/2);
    context.fillStyle = '#000';
    context.fillText(this.lvl, 1-slotw/2, -1 + sloth/2);
    
    context.restore();
  }
  this.attack = function(){
    this.charge--;
    if(this.charge <= 0){
      this.charge = this.recharge;
      for(var i = 0; i < this.lvl; i++){
	var rot = i*Math.PI*2/this.lvl + Math.PI * this.anim/180 + Math.PI/6;
	flakes[flakes.length] = new snowParticle(rot, this.x + Math.cos(rot)*0.3, this.y+Math.sin(rot)*0.3);
      }
    }
  }
}

function aoeTower(x,y){
  this.lvl = 1;
  this.cost = 10;
  this.range = 2.3;
  this.sel = false;
  this.charge = 20;
  this.anim = 0;
  this.recharge = 50;
  
  this.x = x;
  this.y = y;
  
  this.dmg = function(){
    return Math.pow(1.93, this.lvl) * 80;
  }
  
  this.getXCenter = function(){
    return this.x*slotw + this.x + slotw/2 + 0.5;
  }
  this.getYCenter = function(){
    return this.y*sloth + this.y + sloth/2 + 0.5;
  }
  
  this.getUpgradeCost = function(){
    return towerCosts[1] + Math.floor(Math.pow(2.7, this.lvl) * 80);
  }
  this.getSellValue = function(){
    return towerCosts[1]/2 + Math.floor((Math.pow(2.7, this.lvl-1)-1) * 80);
  }
  
  this.draw = function(){
    context.save();
    context.translate(Math.floor(this.getXCenter()), Math.floor(this.getYCenter()));
    
    var tourelle2 = new Image;
    tourelle2.src = "src/images/tourelle2.png";
    
    /*context.fillStyle = "#B0F";*/
    context.beginPath();
    /*context.arc(0,0, Math.floor(Math.min(slotw, sloth) * 0.45), 0, Math.PI*2, false);*/
    context.beginPath();
    context.drawImage(tourelle2, -25, -17);
    context.fill();
    /*context.lineWidth = 2;
    context.strokeStyle = "#8800B9";
    context.stroke();
    context.fillStyle = "#000";*/
    
    if(this.charge >= 0){
      context.globalAlpha = 0.4;
      context.fillStyle = "#FFF";
      context.beginPath();
      context.arc(0,0, Math.floor(Math.min(slotw, sloth) * 0.45 * (this.charge/this.recharge)), 0, Math.PI*2, false);
      context.fill();
      context.globalAlpha = 1;
    }else{
      context.globalAlpha = 0.2*(1-(Math.abs(this.charge)/20));
      context.fillStyle = "#000";
      context.beginPath();
      context.arc(0,0, Math.floor(Math.min(slotw, sloth) * this.range), 0, Math.PI*2, false);
      context.fill();
      context.globalAlpha = 1;
    }
    
    context.fillStyle = "#FFF";
    context.save();
    if(this.charge == 0) {
      this.anim = (this.anim +1) % 360;
    }
   /* context.rotate(Math.PI * this.anim / 180);*/
context.beginPath();
/*    context.moveTo(0,0);
    context.arc(0,0, Math.floor(Math.min(slotw, sloth) * 0.33), 0, Math.PI * 2 / 6, false);
    context.lineTo(0,0);
    context.arc(0,0, Math.floor(Math.min(slotw, sloth) * 0.33), Math.PI*4 / 6, Math.PI*6 / 6, false);
    context.lineTo(0,0);
    context.arc(0,0, Math.floor(Math.min(slotw, sloth) * 0.33), Math.PI*8 / 6, Math.PI*10 / 6, false);
    context.lineTo(0,0);*/
    context.fill();
    context.stroke();
    context.restore();
    
    if(this.sel){
      context.strokeStyle = "#FF0";
      context.beginPath();
      context.moveTo(-slotw/2, -sloth/2);
      context.lineTo(-slotw/2, sloth/2);
      context.lineTo(slotw/2, sloth/2);
      context.lineTo(slotw/2, -sloth/2);
      context.lineTo(-slotw/2, -sloth/2);
      context.stroke();
    }
    
    context.strokeStyle = '#FFF';
    context.strokeText(this.lvl, 1-slotw/2, -1 + sloth/2);
    context.fillStyle = '#000';
    context.fillText(this.lvl, 1-slotw/2, -1 + sloth/2);
    
    context.restore();
    
    if(this.charge != 0) this.charge --;
    if(this.charge < -20){
      this.charge = this.recharge;
    }
  }
  this.attack = function(){
    if(this.charge == 0){
      var foundOne = false;
      for(var i = 0; i < mobs.length; i++){
	var xdist = mobs[i].x - this.x;
	var ydist = mobs[i].y - this.y;
	var dist = Math.sqrt(xdist*xdist + ydist*ydist);
	if(dist <= this.range){
	  mobs[i].hp -= this.dmg();
	  foundOne = true;
	}
      }
      if(foundOne){
	this.charge--;
      }
    }
  }
    
}

function laserTower(x,y){
  this.lvl = 1;
  this.range = 2.3;
  this.sel = false;
  this.cost = 4;
  
  this.x = x;
  this.y = y;
  this.dmg = function(){
    return Math.pow(1.7, this.lvl) * 3 ;
  }
  
  
  this.getXCenter = function(){
    return this.x*slotw + this.x + slotw/2 + 0.5;
  }
  this.getYCenter = function(){
    return this.y*sloth + this.y + sloth/2 + 0.5;
  }
  this.getUpgradeCost = function(){
    return towerCosts[0] + Math.floor(Math.pow(1.9, this.lvl) * 60);
  }
  this.getSellValue = function(){
    return towerCosts[0]/2 + Math.floor((Math.pow(1.9, this.lvl-1)-1) * 60);
  }
  
  this.draw = function(){
    context.save();
    context.translate(Math.floor(this.getXCenter()), Math.floor(this.getYCenter()));
    
    var tourelle1 = new Image;
    tourelle1.src = "src/images/tourelle1.png";
    
/*    context.fillStyle = "#FF0000";
    context.lineWidth = 2;
    context.strokeStyle = "#880000";*/
    context.beginPath();
    context.drawImage(tourelle1, -13, -20);
    /*context.moveTo(-0.40*slotw, 0.42*sloth);
    context.lineTo(-0.15*slotw, 0.2*sloth);
    context.lineTo(0, -0.2*sloth);
    context.lineTo(0.15*slotw, 0.2*sloth);
    context.lineTo(0.4*slotw, 0.42*sloth);
    context.lineTo(-0.4*slotw, 0.42*sloth);*/
    context.fill();
  /*  context.stroke();*/
    
    if(this.atk){
      context.fillStyle = "#FF0";
      context.strokeStyle = "#D3D300";
    }
    context.beginPath();
   /* context.arc(0, -0.2*sloth, Math.floor(Math.min(slotw, sloth) * 0.2), 0, 2*Math.PI, false);*/
    context.fill();
    context.stroke();
    
    if(this.sel){
      context.strokeStyle = "#FF0";
      context.beginPath();
      context.moveTo(-slotw/2, -sloth/2);
      context.lineTo(-slotw/2, sloth/2);
      context.lineTo(slotw/2, sloth/2);
      context.lineTo(slotw/2, -sloth/2);
      context.lineTo(-slotw/2, -sloth/2);
      context.stroke();
    }
    
    context.strokeStyle = '#FFF';
    context.strokeText(this.lvl, 1-slotw/2, -1 + sloth/2);
    context.fillStyle = '#000';
    context.fillText(this.lvl, 1-slotw/2, -1 + sloth/2);
    context.restore();
  }
  
  this.attack = function(){
    this.atk = false;
    for(var i = 0; i < mobs.length; i++){
      var xdist = mobs[i].x - this.x;
      var ydist = mobs[i].y - this.y;
      var dist = Math.sqrt(xdist*xdist + ydist*ydist);
      if(dist <= this.range){
	mobs[i].hp -= this.dmg();
	this.atk = true;
	
	context.beginPath();
	context.lineWidth = 2;
	context.moveTo(this.x*slotw + this.x + slotw/2, this.y*sloth + this.y + sloth/2 - 0.2*sloth);
	context.lineTo(mobs[i].getXCenter(), mobs[i].getYCenter());
	context.strokeStyle = "red";
	context.stroke();
	break;
      }
    }
  }
}


function mob(level){
  this.lvl = level;
  this.index = 0;
  this.a = path[0];
  this.slowDuration = 0;
  this.x = this.a.x;
  this.y = this.a.y;
  this.xoffset = Math.floor((2*Math.random() -1) * 0.6*(slotw/2));
  this.yoffset = Math.floor((2*Math.random() -1) * 0.6*(sloth/2));
  this.xbase = this.x;
  this.ybase = this.y;
  this.hp = Math.pow(1.20, this.lvl - 1) * 5.5+ 50 + 15*this.lvl;
  this.maxhp = this.hp;
  
  this.getXCenter = function(){
    return this.x*slotw + this.x + slotw/2 + this.xoffset + 0.5;
  }
  this.getYCenter = function(){
    return this.y*sloth + this.y + sloth/2 + this.yoffset +0.5;
  }
  
  this.draw = function(){
    
    var soldat = new Image();
    soldat.src = 'src/images/soldat.png';
    
    context.save();
    context.translate(Math.floor(this.getXCenter()), Math.floor(this.getYCenter()));
    
    context.fillStyle = "#00B615";
    context.beginPath();
    context.drawImage(soldat,-5, -5)
    context.fill();
   /* if(this.hp < this.maxhp){
      context.fillStyle = "#000";
      context.beginPath();
      context.moveTo(0,0);
      context.arc(0,0, Math.floor(Math.min(slotw, sloth) * 0.2), Math.PI*2 * (this.hp/this.maxhp), Math.PI*2, false);
      context.fill();
    }*/
    
    context.restore();
  }
  this.update = function(){
    if(this.hp <= 0){
      gold+= Math.floor(Math.pow(1.175, this.lvl)) + 5;
      controlsUpdate();
      return false;
    }
    
    var speed = (this.slowDuration-- > 0 ? 0.02 : 0.05);
    if(this.slowDuration <0) this.slowDuration = 0;
    var pre = Math.floor(this.index);
    this.index += speed;
    if(this.index >= 1){
      if(directions[this.xbase][this.ybase].from != 1){
	var xi = this.xbase;
	var yi = this.ybase;
	this.xbase = directions[xi][yi].from.loc.x;
	this.ybase = directions[xi][yi].from.loc.y;
      }
      this.index = 0;
    }
    if(this.xbase >= size || this.ybase >= size){
      playerHealth--;
      controlsUpdate();
      return false;
    }
    var a = directions[this.xbase][this.ybase].loc;
    var b = directions[this.xbase][this.ybase].from.loc;
    if(b == null || a == null) return true;
    
    this.x = a.x * (1 - this.index) + b.x * this.index;
    this.y = a.y * (1 - this.index) + b.y * this.index;
    
    return true;
  }
}

function draw(){
  requestAnimFrame(draw);
  if(playerHealth <= 0) return;
  context.clearRect(0,0,canvas.width,canvas.height);
  
  context.globalAlpha = 1;
  context.fillStyle = "#A4FFAA";
  for(var i = 1; i < path.length-3; i++){
    var a = path[i];
    context.fillRect(a.x*slotw + a.x, a.y*sloth + a.y,slotw, sloth);
  }
  
  if(ctower){
    context.fillStyle = "#29FF37";
    context.fillRect(ingameXsel*slotw + ingameXsel, ingameYsel*sloth + ingameYsel, slotw, sloth);
  }
  context.fillStyle = "#FFE2AE";
  context.fillRect(path[0].x*slotw + path[0].x, path[0].y*sloth + path[0].y,slotw, sloth);
  context.fillRect(path[path.length-3].x*slotw + path[path.length-3].x, path[path.length-3].y*sloth + path[path.length-3].y,slotw, sloth);
  
  context.strokeStyle = "#000";
  context.lineWidth = 1;
  context.beginPath();
  for(var i = 0; i < 21; i++){
    context.moveTo(i*slotw + i, 0);
    context.lineTo(i*slotw + i, canvas.height);
  }
  
  for(var i = 0; i < 21; i++){
    context.moveTo(0, i*slotw + i);
    context.lineTo(canvas.width, i*slotw + i);
  }
  context.stroke();
  
  
  for(var i = 0; i < towers.length; i++){
    towers[i].draw();
  }
  for(var i = 0; i < mobs.length; i++){
    mobs[i].draw();
    if(!mobs[i].update()){
      mobs.splice(i, 1); // remove this element
    }
  }
  for(var i = 0; i < towers.length; i++){
    towers[i].attack();
  }
  
  for(var i = 0; i < flakes.length; i++){
    if(!flakes[i].update()){
      flakes.splice(i,1);
    }else flakes[i].draw();
  }
  
  if(waveSize == 0){
    if(waveDelay-- <= 0){
      level++;
      controlsUpdate();
      waveDelay = 200;
      waveSize = Math.floor(level/2) + 2;
    }
  }
  if(waveSize > 0 && mobDelay-- <= 0){
    mobDelay = 6;
    waveSize--;
    mobs[mobs.length] = new mob(level);
  }
}


function mouseDown(e){
  if(playerHealth <= 0) return;
  var mouseX, mouseY;

  if(e.offsetX) {
      mouseX = e.offsetX;
      mouseY = e.offsetY;
  }
  else if(e.layerX) {
      mouseX = e.layerX;
      mouseY = e.layerY;
  }
  
  var foundOne = false;
  for(var i = 0; i < towers.length; i++){
    if(towers[i].x == ingameXsel && towers[i].y == ingameYsel){
      towers[i].sel = true;
      controlsUpdate();
      foundOne = true;
      ctower = false;
    }else{
      towers[i].sel = false;
    }
  }
  if(!foundOne && ctower){
    if(e.button == 2) {
      ctower = false;
      return false;
    }
    switch(towerType){
      case 1: if(towerCosts[0] <= gold){
		towers[towers.length] = new laserTower(ingameXsel, ingameYsel);
		gold -= towerCosts[0];
		ctower = false;
	      }
	      break;
      case 2: if(towerCosts[1] <= gold){
		towers[towers.length] = new aoeTower(ingameXsel, ingameYsel);
		gold -= towerCosts[1];
		ctower = false;
	      }
	      break;
      case 3: if(towerCosts[2] <= gold){
		towers[towers.length] = new slowTower(ingameXsel, ingameYsel);
		gold -= towerCosts[2];
		ctower = false;
	      }
	      break;
      case 4: if(towerCosts[3] <= gold){
		towers[towers.length] = new wallTower(ingameXsel, ingameYsel);
		gold -= towerCosts[3];
		ctower = false;
	      }
	      break;
    }
    if(e.button == 1) ctower = true;
    if(!genPath()){
      towers.splice(towers.length-1, 1);
      gold += towerCosts[towerType-1];
      ctower = true;
      genPath();
    }
    controlsUpdate();
  }else if(!foundOne){
    controlsUpdate();
  }
  return false;
}

function sell(){
  for(var i = 0; i < towers.length; i++){
    if(towers[i].sel){
      gold += towers[i].getSellValue();
      towers.splice(i, 1);
      genPath();
      controlsUpdate();
      break;
    }
  }
}

function mouseMove(e){
  var mouseX, mouseY;

  if(e.offsetX) {
      mouseX = e.offsetX;
      mouseY = e.offsetY;
  }
  else if(e.layerX) {
      mouseX = e.layerX;
      mouseY = e.layerY;
  }
  
  ingameXsel = Math.floor((mouseX - Math.floor(mouseX / slotw))/slotw);
  ingameYsel = Math.floor((mouseY - Math.floor(mouseY / sloth))/sloth);
}

function upgrade(){
  for(var i = 0; i < towers.length; i++){
    if(!towers[i].sel){
      continue;
    }
    if(gold >= towers[i].getUpgradeCost()){
      gold-=towers[i].getUpgradeCost();
      towers[i].lvl++;
      controlsUpdate();
    }else{
      //console.log("insufficient gold");
    }
  }
}

function controlsUpdate(){
  document.getElementById('upgradebutton').disabled = true;
  document.getElementById('sellbutton').disabled = true;
  document.getElementById('upgradebutton').value = "AMELIORATION";
/*  document.getElementById('sellbutton').value = "Vendre";*/
  if(playerHealth > 0){
    for(var i = 0; i < towers.length; i++){
      if(towers[i].sel){
	if(towers[i].getUpgradeCost() > 0){
	  document.getElementById('upgradebutton').value = "AMELIORATION ("+numberFormat(towers[i].getUpgradeCost())+")";
	  if(gold >= towers[i].getUpgradeCost()){
	    document.getElementById('upgradebutton').disabled = false;
	  }
	}
/*	document.getElementById('sellbutton').value = "Sell ("+numberFormat(towers[i].getSellValue())+")";*/
	document.getElementById('sellbutton').disabled = false;
	break;
      }
    }
  }
  if(gold >= towerCosts[0] && playerHealth > 0){
    document.getElementById('cTower1Bt').disabled = false;
  }else{
    document.getElementById('cTower1Bt').disabled = true;
  }
  if(gold >= towerCosts[1] && playerHealth > 0){
    document.getElementById('cTower2Bt').disabled = false;
  }else{
    document.getElementById('cTower2Bt').disabled = true;
  }
  if(gold >= towerCosts[2] && playerHealth > 0){
    document.getElementById('cTower3Bt').disabled = false;
  }else{
    document.getElementById('cTower3Bt').disabled = true;
  }
  if(gold >= towerCosts[3] && playerHealth > 0){
    document.getElementById('cTower4Bt').disabled = false;
  }else{
    document.getElementById('cTower4Bt').disabled = true;
  }
  document.getElementById('hpindic').style.width = Math.floor(212*Math.max(playerHealth, 0)/ 10) + "px";
  document.getElementById('levelindic').innerHTML = level;
  document.getElementById('goldindic').innerHTML = numberFormat(gold);
  if(playerHealth <= 0){
    if(leaderboard_screen.classList.contains('pop-up-animation')==false)
    {
      audio.play();
      document.querySelector('#score').value = level;
      document.querySelector('.defeat-screen').classList.add('pop-up-animation');
      document.querySelector('.current-level').innerText = level;
    }
  }else
  {
    document.querySelector('.defeat-screen').classList.remove('pop-up-animation');
  }
}

function restart(){
  if(!confirm("Voulez vous vraiment recommencer ?")) return;
  towers = new Array();
  mobs = new Array();
  flakes = new Array();
  ctower = false;

  waveSize = 0;
  mobDelay = 0;
  waveDelay = 400;
  level = 1;
  playerHealth = 10;
  gold = 100;
  controlsUpdate();
  genPath();
}

function numberFormat(val){
	st = '' + val;
	
	var regx = /^([0-9]+)([0-9]{3})/;
	while (regx.test(st)) {
		st = st.replace(regx, '$1,$2');
	}
	return st;
}


function Point(x,y){
	this.x = x;
	this.y = y;
	this.equals = function(p){
		if(p == null) return false;
		else return p.x == this.x && p.y == this.y;
	}
}

function VisPoint(x,y){
	this.from = null;
	this.loc = new Point(x,y);
}

var directions;

/**
 * Point startpoint = point from which to start
 * Point endpoint = point which to reach
 * boolean[][] obstacles = double boolean array, for each obstacle on pos (x,y) obstacles[x][y] = true
 */
function calculatePath(startPoint,endPoint,obstacles){
	"use strict";
	if(startPoint.equals(endPoint)){
		return [];//empty path
	}
	if(obstacles[endPoint.x][endPoint.y]){ // the starting point is occupied
	  return -1;
	}
	obstacles[endPoint.x][endPoint.y] = true;
	//directions will be filled with the actual path
	directions = new Array(obstacles.length);
	for(var i=0;i<directions.length;i++){
		directions[i] = new Array(obstacles[i].length);
		for(var j=0;j<directions[i].length;j++){
			directions[i][j] = new VisPoint(i,j);
			if(obstacles[i][j])
				directions[i][j].from = 1; //something which isn't null
		}
	}
	var path = [];
	var nextQueue = [new VisPoint(endPoint.x, endPoint.y)];
	var curPoint;
	var x, y;
	while (nextQueue.length > 0){
		curPoint = nextQueue.shift();
		x = curPoint.loc.x;
		y = curPoint.loc.y;
		if(x-1 >= 0 && directions[x-1][y].from == null){
			directions[x-1][y].from = curPoint;
			nextQueue.push(directions[x-1][y]);
		}
		if (y-1 >= 0 && directions[x][y-1].from == null){
			directions[x][y-1].from = curPoint;
			nextQueue.push(directions[x][y-1]);
		}
		if (x+1 < directions.length && directions[x+1][y].from == null){
			directions[x+1][y].from = curPoint;
			nextQueue.push(directions[x+1][y]);
		}
		if (y+1 < directions[x].length && directions[x][y+1].from == null){
			directions[x][y+1].from = curPoint;	
			nextQueue.push(directions[x][y+1]);
		}
	}
	directions[endPoint.x][endPoint.y].from = new VisPoint(size, Math.floor(size/2)); // so the mobs keep walking outside the playing field
	if(directions[startPoint.x][startPoint.y].from == null || directions[startPoint.x][startPoint.y].from == 1){
	  return -1;
	}
	var endVisPoint = directions[startPoint.x][startPoint.y];
	while(!endPoint.equals(endVisPoint.loc)){
		path.push(endVisPoint.loc);
		endVisPoint = endVisPoint.from;
	}
	path.push(endPoint);
	return path;
}

var path;
function genPath(){
  var obst = new Array(size);
  for(var i = 0; i < size; i++){
    obst[i] = new Array(size);
  }
  for(var i = 0; i < towers.length; i++){
    obst[towers[i].x][towers[i].y] = true;
  }
  path = calculatePath(new Point(0, Math.floor(size/2)), new Point(size-1, Math.floor(size/2)), obst);
  path[path.length] = new Point(size, Math.floor(size/2));
  path[path.length] = new Point(size+1, Math.floor(size/2));
  return (path != -1);
}

/*document.onkeydown = function (e){
  var c = e.which;
  if(c == 85){ // u
    upgrade();
  }else if(c == 49){ // 1
    if(gold >= towerCosts[1]){
      ctower=true;towerType=2;
    }
  }else if(c == 50){
    if(gold >= towerCosts[0]){
      ctower=true;towerType=1;
    }
  }else if(c == 51){
    if(gold >= towerCosts[2]){
      ctower=true;towerType=3;
    }
  }else if(c == 52){
    if(gold >= towerCosts[3]){
      ctower=true;towerType=4;
    }
  }
}*/