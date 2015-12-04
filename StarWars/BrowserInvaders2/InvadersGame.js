// This code is made mainly by one punch mania, based on work done by Seb Lee-Delisle (http://seb.ly)

// state variables 
var STATE_WAITING = 0, 
	STATE_PLAYING = 1, 
	STATE_WIN = 2, 
	STATE_GAMEOVER = 3, 
	state = STATE_WAITING, 
	PLAYER_SHIP=0,
	ENEMY_TIEFIGHTER=1,
	ENEMY_TIEFIGHTER_DIAGR=2,
	ENEMY_TIEFIGHTER_DIAGL=3,
	ENEMY_VADERSHIP=4,
	ENEMY_DRID=5,
	ENEMY_SLAVE=6,
	ENEMY_IMPERIALSTAR=7,
	ALLIED_FALCON=8,
	counter = 0, 
	gameStartTime = 0, 
	gameFinishTime = 0; 
	hasPowerUp = 0;


// game variables

var playerShip, 
	invaders,
	/*VaderShip,
	Drid,
	ImperialStar,
	Slave,
	tieFighter_DiagL,
	tieFighter_DiagR,
	tieFighter_N,*/
	enemyBullets,
	bullets,
	score=0,
	powerSpeed,
	powerFriendlyCall,
	//powerFire,
	powerBomb,
	
	particles, 
	stars, 
	
	screenWidth, 
	screenHeight, 
	playerType = 0,//Math.floor(Math.random()*5); // this is the browser that is playing
	screenBoundaryUp=0,
	screenBoundaryDown,
	screenBoundaryLeft=0,//TODO
	screenBoundaryRight;
var canvas, 
	ctx; 
	
// load all the images for the ships
var images = []; 
for (var i = 0; i<9; i++) { 
	var img = new Image(); 
	img.src = "images/png-"+i+".png"; 
	images.push(img);	
}
var junk = []; 
for (var i = 0; i<5; i++) { 
	var img = new Image(); 
	img.src = "images/junk-"+i+".png"; 
	junk.push(img);	
}

var explodeSound = new Audio('audio/explode.wav');
var fireSound = new Audio('audio/laser.wav');
var soundtrack = new Audio('audio/Soundtrack.mp3');
//var fireSound_tie = new Audio('laser.wav');
//fireSound_tie.volume = 0.1;
fireSound.volume = 0.5;
	
function setup(){
	soundtrack.play();
	initVars(); 
	initCanvas(); 
	initObjects(); 
	initListeners(); 

	//startGame(); 
}


function initVars() { 
	screenWidth = window.innerWidth ||
                      document.documentElement.clientWidth ||
                      document.body.clientWidth ||
                      document.body.offsetWidth;
	screenHeight = window.innerHeight ||
                      document.documentElement.clientHeight ||
                      document.body.clientHeight ||
                      document.body.offsetHeight;	
	screenBoundaryDown=screenHeight;
	screenBoundaryRight=screenWidth;
}

function initObjects() { 

	playerShip = new PlayerShip(images[playerType]); 
	bullets = []; 
	invaders = []; 
	/*VaderShip= [];
	Drid= [];
	ImperialStar= [];
	Slave= [];
	tieFighter_DiagL= [];
	tieFighter_DiagR= [];
	tieFighter_N= [];*/
	enemyBullets= [];
	particles = []; 
	initStars();
}




// MAIN GAME LOOP

function draw() { 

	ctx.clearRect(0,0,canvas.width, canvas.height); 
	
	renderStars(); 
	
	if(state == STATE_PLAYING) { 
		checkKeys(); 
		addEnnemies();
		updateInvaders(); 
		updateBullets();
		updateParticles(); 

		checkCollisions(); 
		
		playerShip.render(ctx); 
		renderInvaders(); 
		renderBullets(); 
		
		renderPowerUp();
		renderParticles();
		renderTimer(); 
		
		
		
		/*if(invaders.length==0) {
			state = STATE_WIN; 
			gameTime = Date.now()-gameStartTime; 
		}*/
		
	} else if(state == STATE_WIN) { 
		
		updateInvaders(); 
		//updateBullets();
		updateParticles(); 

		checkCollisions(); 

		playerShip.render(ctx); 
	
		//renderBullets(); 
		renderParticles();		
		
		renderMessage("YOU WIN, YOUR TIME IS "+milsToTimer(gameTime)+"YOUR SCORE IS: "+score); 
		
	}	else if(state == STATE_GAMEOVER) { 
		
		updateInvaders(); 
		//updateBullets();
		updateParticles(); 

		checkCollisions(); 

		//playerShip.render(ctx); 
		renderInvaders(); 
		//renderBullets(); 
		renderParticles();		
		
		renderMessage("YOU LOOSE, YOUR TIME IS "+milsToTimer(gameTime)+"YOUR SCORE IS: "+score); 
		
	} else if(state == STATE_WAITING) { 
		
		updateInvaders(); 
		updateBullets();
		updateParticles(); 

		checkCollisions(); 

		playerShip.render(ctx); 
		renderBullets(); 
		renderParticles();		
		var img = new Image(); 
  img.src = "images/startscreen.jpg"; 
  ctx.drawImage(img,  screenWidth/2-img.width/2,screenHeight/2-img.height );
		renderMessage("HIT FIRE (SPACE) TO PLAY"); 
		
		
	}
	
	counter++; 
}	

function checkKeys() { 
	if(KeyTracker.isKeyDown(Key.LEFT)) {
		playerShip.goLeft(); 
	}
	
	if(KeyTracker.isKeyDown(Key.RIGHT)) {
		playerShip.goRight(); 
	}
	if(KeyTracker.isKeyDown(Key.UP)) {
		playerShip.goUp(); 
	}
	
	if(KeyTracker.isKeyDown(Key.DOWN)) {
		playerShip.goDown(); 
	}
}
var spawn1=true,spawn2=true,spawn3=true,spawn4=true,spawn5=true;
function addEnnemies(){
	gameTime = Date.now()-gameStartTime; 
	var hspacing = 70; 
	var vspacing = 70;
	//TODO randomize spawn point
	if(invaders.length==0){
		randomSpawn(1+score/20);
	}
	if(gameTime%1000<=10&&!spawn5/*&&invaders.length<score/2*/&&spawn6){
				randomSpawn(1+score/20);
				spawn6=false;
	}else if(gameTime%3000>100) {
		spawn6=true
	}
	if(gameTime%3000<=10/*&&invaders.length<score/2*/&&spawn1){
				randomSpawn(1+score/20);
				spawn1=false;
	}else if(gameTime%3000>100) {
		spawn1=true
	}
	if(gameTime%5000<=10/*&&invaders.length<score/2*/&&spawn2){
		randomSpawn(1+score/20);
		spawn2=false
	}else if(gameTime%5000>100) {
		spawn2=true
	}//TODO
	if(gameTime>=10000&&spawn3/*&&invaders.length<score/2*/){
		//spawn miniboss
		invaders.push(new Invader(screenWidth/2,20, images[ENEMY_IMPERIALSTAR], 0,ENEMY_IMPERIALSTAR));
		spawn3=false;
	}
	if(gameTime>=20000&&spawn5/*&&invaders.length<score/2*/){
		//spawn miniboss
		invaders.push(new Invader(screenWidth/2,20, images[ENEMY_VADERSHIP], 0,ENEMY_VADERSHIP));
		spawn5=false;
	}
	if(/*gameTime>10000&&*/gameTime%6000<=10/*&&invaders.length<score/2*/&&spawn2){
		invaders.push(new Invader(hspacing,screenHeight/2+20, images[ENEMY_DRID], 0,ENEMY_DRID)); 
		spawn4=false
	}else if(gameTime%6000>100) {
		spawn4=true
	}
	
}
function randomSpawn(level){
var hspacing = 70; 
	var vspacing = 70;
var rand=Math.random()*3;
if(rand<=1){
		invaders.push(new Invader(screenWidth/2+hspacing,0, images[ENEMY_TIEFIGHTER_DIAGR], 0,ENEMY_TIEFIGHTER_DIAGR)); 
		invaders.push(new Invader(screenWidth/2-hspacing,0, images[ENEMY_TIEFIGHTER_DIAGL], 0,ENEMY_TIEFIGHTER_DIAGL)); 

}else if (rand <= 2){
		invaders.push(new Invader(0-hspacing*2,0, images[ENEMY_TIEFIGHTER_DIAGR], 0,ENEMY_TIEFIGHTER_DIAGR)); 
		invaders.push(new Invader(0-hspacing,0, images[ENEMY_TIEFIGHTER_DIAGR], 1,ENEMY_TIEFIGHTER_DIAGR)); 
		invaders.push(new Invader(screenWidth+hspacing*2,0, images[ENEMY_TIEFIGHTER_DIAGL], 2,ENEMY_TIEFIGHTER_DIAGL)); 
		invaders.push(new Invader(screenWidth+hspacing,0, images[ENEMY_TIEFIGHTER_DIAGL], 3,ENEMY_TIEFIGHTER_DIAGL)); 				
}else if (rand <=3){
		invaders.push(new Invader(screenWidth/2-hspacing*2,20, images[ENEMY_TIEFIGHTER], 0,ENEMY_TIEFIGHTER)); 
		invaders.push(new Invader(screenWidth/2-hspacing,20, images[ENEMY_TIEFIGHTER], 1,ENEMY_TIEFIGHTER)); 
		invaders.push(new Invader(screenWidth/2+hspacing*2,20, images[ENEMY_TIEFIGHTER], 2,ENEMY_TIEFIGHTER)); 
		invaders.push(new Invader(screenWidth/2+hspacing,20, images[ENEMY_TIEFIGHTER], 3,ENEMY_TIEFIGHTER)); 
}

}
function checkCollisions() { 
if(state!=STATE_GAMEOVER)
	for (var j = 0; j<invaders.length; j++) { 
			var invader = invaders[j]; 
			if(rectRectPenetrationTest(invader,playerShip)){
				makeJunkExplosion(invader.pos); 
				makeJunkExplosion(playerShip.pos); //TODO: junk.image
				explodeSound.currentTime = 0;
				explodeSound.play();
				invaders.splice(j,1); 
				j--; 
				state = STATE_GAMEOVER; 
				gameTime = Date.now()-gameStartTime; 
				//TODO: lose life
				break;
			}
	}//TODO enemyBullets
	for(var i = 0; i<enemyBullets.length; i++) { 
		
		var bullet = enemyBullets[i]; 
		if( pointRectPenetrationTest(bullet.pos, playerShip)) {
				
				makeJunkExplosion(playerShip.pos); 
				explodeSound.currentTime = 0;
				explodeSound.play();
				invaders.splice(j,1); 
				j--; 
				enemyBullets.splice(i,1); 
				state = STATE_GAMEOVER; 
				gameTime = Date.now()-gameStartTime; 
				//TODO: lose life
				break;
			}
	}
	
	for(var i = 0; i<bullets.length; i++) { 
		
		var bullet = bullets[i]; 
		
		for (var j = 0; j<invaders.length; j++) { 
			var invader = invaders[j]; 
			if(rectRectPenetrationTest(invader,playerShip)){
				makeJunkExplosion(invader.pos); 
				explodeSound.currentTime = 0;
				explodeSound.play();
				invaders.splice(j,1); 
				j--; 
				score++;
				break;
			}
			if( pointRectPenetrationTest(bullet.pos, invader)) {
				if(invader.life>1){
					explodeSound.currentTime = 0;
					explodeSound.play();
					invader.life--;
					bullets.splice(i,1); 
					i--; 
				}else{
				if(invader.enemyType==ENEMY_DRID) {
					PowerFire();
				}
				makeJunkExplosion(invader.pos); 
				explodeSound.currentTime = 0;
				explodeSound.play();
				invaders.splice(j,1); 
				j--; 
				bullets.splice(i,1); 
				i--; 
				score++;
				break; 
				}
			}
		}
	}
	
}


function rectRectPenetrationTest(rect, rect) { 

	if (rect1.x < rect2.x + rect2.width &&
		rect1.x + rect1.width > rect2.x &&
		rect1.y < rect2.y + rect2.height &&
		rect1.height + rect1.y > rect2.y) {
  		return true; 
	} else { 
		return false; 
	}
}
function pointRectPenetrationTest(point, rect) { 
	if( ((point.x<rect.pos.x + rect.width) && (point.x>rect.pos.x)) &&
			((point.y<rect.pos.y + rect.height) && (point.y>rect.pos.y)) ) { 
		return true; 
	} else { 
		return false; 
	}
}

function rectRectPenetrationTest(rect1, rect2) { 
	if( ((rect1.pos.x<rect2.pos.x + rect2.width) && (rect1.pos.x+rect1.width>rect2.pos.x)) &&
			((rect1.pos.y<rect2.pos.y + rect2.height) && (rect1.pos.y+rect1.height > rect2.pos.y))) { 
		return true; 
	} else { 
		return false; 
	}
}

function startGame() { 
	
	resetPlayer(); 
	resetInvaders(); 
	gameStartTime = Date.now(); 
	state = STATE_PLAYING; 
}

function updateBullets(){
	for(var i = 0 ; i<enemyBullets.length; i++) { 
		var b = enemyBullets[i]; 
		b.update(); 
		if(b.pos.y>screenBoundaryDown) {
			enemyBullets.splice(i,1); 
			i--; 
		}
	}	
	for(var i = 0 ; i<bullets.length; i++) { 
		var b = bullets[i]; 
		b.update(); 
		if(b.pos.y<0) {
			bullets.splice(i,1); 
			i--; 
		}
	}	
}


function updateInvaders() { 
	//TODO
	speed = 0.1;// map(invaders.length, 50,0,0.001,0.1);
	for(var i = 0; i<invaders.length; i++) { 
		invaders[i].update(speed); 
	}
}

function renderPowerUp() {
	if(hasPowerUp>=1) {
	var img = new Image(); 
	img.src = "images/Special1.png"; 
	ctx.drawImage(img,  20,screenHeight-img.height -30);
	for(var j=0;j<hasPowerUp;j++){
	for(var i = 0; i<4;i++) { 
		ctx.fillStyle = hsl(100,50,map(i,0,3,0,100)); 
		ctx.fillRect(img.width+30+10*j, screenHeight-30 -i*8, 4, 8); 
		}
	}
	}else{
	
	var img = new Image(); 
	img.src = "images/Special1off.png"; 
	ctx.drawImage(img,  20,30+img.height );
	}
}

function renderBullets() { 
	for(var i = 0; i<bullets.length; i++) { 
		bullets[i].render(ctx); 
	}
	for(var i = 0; i<enemyBullets.length; i++) { 
		enemyBullets[i].render(ctx); 
	}
}

function renderInvaders() { 
	for(var i = 0; i<invaders.length; i++) { 
		invaders[i].render(ctx); 
	}
}

function renderMessage(msg) { 
	ctx.textAlign = 'center';
	ctx.font = '48pt Helvetica, Arial';
	ctx.fillStyle = hsl(0, 0, (100-(counter*2)%100));
	ctx.fillText(msg, screenWidth/2, screenHeight/2); 
	
}

function renderTimer() { 
	
	var timeElapsed = Date.now()-gameStartTime; 
	ctx.textAlign = 'center';
	ctx.font = '24pt Courier';
	ctx.fillStyle = 'white'
	
	
	ctx.fillText(milsToTimer(timeElapsed), screenWidth/2, 50); 
	
}

function milsToTimer(mils) { 
	var secs = Math.floor(mils/1000);
	

	var cents = Math.floor(mils/10)%100;
	if(cents<10) cents="0"+cents;
	return (secs+":"+cents); 
}
	

function resetPlayer() { 
	
	playerShip.pos.x = (screenWidth-playerShip.width)/2;
}
function resetInvaders() { 

	invaders = []; 
	
	
	var hspacing = 70; 
	var vspacing = 70;
	var numrows = 4; 
	var numcols = 10; 
	var count = 0; 
	/*for(var x = 0; x<numcols; x++) { 
		for(var y = 0; y<numrows; y++) { 
			invaders.push(new Invader(((screenWidth-(hspacing*numcols))/2)+x*hspacing,vspacing+y*vspacing, images[ENEMY_TIEFIGHTER_DIAGR], count,ENEMY_TIEFIGHTER_DIAGR)); 
			count++;
		}
	}*/
	invaders.push(new Invader(0-hspacing*2,0, images[ENEMY_TIEFIGHTER_DIAGR], 0,ENEMY_TIEFIGHTER_DIAGR)); 
		invaders.push(new Invader(0-hspacing,0, images[ENEMY_TIEFIGHTER_DIAGR], 1,ENEMY_TIEFIGHTER_DIAGR)); 
		invaders.push(new Invader(screenWidth+hspacing*2,0, images[ENEMY_TIEFIGHTER_DIAGL], 2,ENEMY_TIEFIGHTER_DIAGL)); 
		invaders.push(new Invader(screenWidth+hspacing,0, images[ENEMY_TIEFIGHTER_DIAGL], 3,ENEMY_TIEFIGHTER_DIAGL)); 

}


function initCanvas() { 

	canvas = document.createElement('canvas'); 
	ctx = canvas.getContext('2d'); 

	document.body.appendChild(canvas); 
	canvas.width = screenWidth; 
	canvas.height = screenHeight;
	
	
}

function initListeners() { 
	
	KeyTracker.addKeyDownListener(" ", firePressed); 
	document.body.addEventListener("keydown", keyPressed); 

}

function firePressed() { 
if(state == STATE_PLAYING) { 
	if(hasPowerUp==1){
		bullets.push(new Bullet(playerShip.pos.x+5, playerShip.pos.y+playerShip.height/2,0,-25));
		bullets.push(new Bullet(playerShip.pos.x+playerShip.width-5, playerShip.pos.y+playerShip.height/2,0,-25));
	}else if(hasPowerUp==2){
		bullets.push(new Bullet(playerShip.pos.x+5, playerShip.pos.y+playerShip.height/2,0,-25));
		bullets.push(new Bullet(playerShip.pos.x+playerShip.width/2, playerShip.pos.y,0,-25));
		bullets.push(new Bullet(playerShip.pos.x+playerShip.width-5, playerShip.pos.y+playerShip.height/2,0,-25)); 
	}else if(hasPowerUp>=3){
		bullets.push(new Bullet(playerShip.pos.x+5, playerShip.pos.y+playerShip.height/2,0,-25));
		bullets.push(new Bullet(playerShip.pos.x+playerShip.width/2, playerShip.pos.y,0,-25));
		bullets.push(new Bullet(playerShip.pos.x+playerShip.width-5, playerShip.pos.y+playerShip.height/2,0,-25)); 
		bullets.push(new Bullet(playerShip.pos.x+playerShip.width-5, playerShip.pos.y,5,-25));
		bullets.push(new Bullet(playerShip.pos.x+5, playerShip.pos.y,-5,-25));
	}else{
		bullets.push(new Bullet(playerShip.pos.x+playerShip.width/2, playerShip.pos.y,0,-25)); 
	}	
		fireSound.currentTime = 0;
		fireSound.play();
		//playerShip.fire();
	} else if(state == STATE_WAITING) { 
		startGame(); 
	} 
}

function keyPressed(e) { 
/*if(e.keyCode == 88) { // 'x' to use call a friend 
			state = STATE_WAITING; 
		}
		if(e.keyCode == 67) { // 'c' to use Bomb 
			state = STATE_WAITING; 
		}*/
/*


	if (state == STATE_WAITING) { 
		if((e.keyCode>48) && (e.keyCode<=48+images.length)) {
			playerType = e.keyCode-49; 
			resetInvaders(); 
			playerShip.image = images[playerType];
			resetPlayer();
		}// change player
	} else */if(state == STATE_GAMEOVER|| state==STATE_WIN) { 
		if(e.keyCode == 83) { // 'S' to start again 
			state = STATE_WAITING; 
		}
		
		
	}
		
}
//------------------- POWER_UP ------------------------------
function PowerSpeed() {
	PlayerShip.moveSpeed=20; 
}
function PowerFire() {
	hasPowerUp++; 
}
function PowerFriendlyCall() {
	hasPowerUp++; 
}
//------------------- PLAYER SHIP ---------------------------

function PlayerShip(image) { 
	this.pos = new Vector2(screenWidth/2, screenHeight-170); 
	this.width = image.width; 
	this.height = image.height; 
	this.moveSpeed = 10; 
	this.image = image;
	
	var stretchVel = 0, 
		yScale = 1;
	
	this.render = function(c) { 
	
		stretchVel *= 0.7; 
		stretchVel+= (1 - yScale)*0.5; 
		yScale += stretchVel; 
		c.save(); 
		c.translate(this.pos.x + this.width/2, this.pos.y+this.height/2); 
		c.scale(1/yScale, yScale); 
		c.drawImage(this.image, -this.width/2, -this.height/2); 
		c.restore();
	}	
	
	this.fire = function () { 
		stretchVel += 0.3; 
		
		
		
	}
	
	this.goLeft = function() { 
		if(this.pos.x>screenBoundaryLeft){
			this.pos.x-=this.moveSpeed; 
		}
	}
	
	this.goRight = function() { 
		if(this.pos.x<screenBoundaryRight-this.width){
			this.pos.x+=this.moveSpeed;
		}
	}
	this.goUp = function() { 
		if(this.pos.y>screenBoundaryUp){
			this.pos.y-=this.moveSpeed; 
		}
	}
	
	this.goDown = function() { 
		if(this.pos.y<screenBoundaryDown-this.height){
			this.pos.y+=this.moveSpeed;
		}
	}
}

// -------------------- INVADER -------------------------
/*
// -------------------- TIEFIGHTERS(NORMAL_ENNEMY)READY -------------------------
function tieFighter_N(x,y, image, offset)  {

	this.pos = new Vector2(x,y); 
	this.startPos = this.pos.clone(); 
	this.image = image; 
	this.width = image.width; 
	this.height = image.height; 
	this.counter = Math.PI/2 + (offset*0.5); 
	
	this.update = function(speed) { 
		this.pos.x=this.startPos.x + Math.sin(this.counter)*300; 
		this.pos.y=this.startPos.y + Math.cos(this.counter)*42;
		this.counter+=speed;
		
	}
	
	this.render = function (c) { 
		c.drawImage(this.image,  this.pos.x, this.pos.y);	
	}
	
}
// -------------------- TIEFIGHTERS(Right_ENNEMY)READY -------------------------
function tieFighter_DiagR(x,y, image, offset)  {

	this.pos = new Vector2(x,y); 
	this.startPos = this.pos.clone(); 
	this.image = image; 
	this.width = image.width; 
	this.height = image.height; 
	this.counter = Math.PI/2 + (offset*0.5); 
	
	this.update = function(speed) { 
		this.pos.x=this.startPos.x + Math.sin(this.counter)*300; 
		this.pos.y=this.startPos.y + Math.cos(this.counter)*42;
		this.counter+=speed;
		
	}
	
	this.render = function (c) { 
		c.drawImage(this.image,  this.pos.x, this.pos.y);	
	}
	
}
// -------------------- TIEFIGHTERS(Left_ENNEMY)READY -------------------------
function tieFighter_DiagL(x,y, image, offset)  {

	this.pos = new Vector2(x,y); 
	this.startPos = this.pos.clone(); 
	this.image = image; 
	this.width = image.width; 
	this.height = image.height; 
	this.counter = Math.PI/2 + (offset*0.5); 
	
	this.update = function(speed) { 
		this.pos.x=this.startPos.x + Math.sin(this.counter)*300; 
		this.pos.y=this.startPos.y + Math.cos(this.counter)*42;
		this.counter+=speed;
		
	}
	
	this.render = function (c) { 
		c.drawImage(this.image,  this.pos.x, this.pos.y);	
	}
	
}

// -------------------- SLAVE(NORMAL_ENNEMY) READY-------------------------
function Slave(x,y, image, offset)  {

	this.pos = new Vector2(x,y); 
	this.startPos = this.pos.clone(); 
	this.image = image; 
	this.width = image.width; 
	this.height = image.height;
	this.counter = Math.PI/2 + (offset*0.5); 
	
	this.update = function(speed) { 
		this.pos.x=this.startPos.x + Math.sin(this.counter)*200; 
		this.counter+=speed;
		
	}
	
	this.render = function (c) { 
		c.drawImage(this.image,  this.pos.x, this.pos.y);	
	}
	
}*/

// -------------------- IMPERIALSTAR(MINIBOSS) -------------------------
/*function ImperialStar(x,y, image, offset)  {

	this.pos = new Vector2(x,y); 
	this.startPos = this.pos.clone(); 
	this.image = image; 
	this.width = image.width; 
	this.height = image.height;
	this.counter = Math.PI/2 + (offset*0.5); 
	
	this.update = function(speed) { 
		this.pos.x=this.startPos.x + Math.sin(this.counter)*40; 
		this.counter+=speed;
		
	}
	
	this.render = function (c) { 
		c.drawImage(this.image,  this.pos.x, this.pos.y);	
	}
	
}*/
/*
// -------------------- DRID_STAR (UPGRADE) -------------------------
function Drid(x,y, image, offset)  {

	this.pos = new Vector2(x,y); 
	this.startPos = this.pos.clone(); 
	this.image = image; 
	this.width = 64; 
	this.height = 64; 
	this.counter = Math.PI/2 + (offset*0.5); 
	
	this.update = function(speed) { 
		this.pos.x=this.startPos.x + Math.sin(this.counter)*300; 
		this.counter+=speed;
		
	}
	
	this.render = function (c) { 
		c.drawImage(this.image,  this.pos.x, this.pos.y);	
	}
	
}
// -------------------- VADER(BOSS) -------------------------
function VaderShip(x,y, image, offset)  {

	this.pos = new Vector2(x,y); 
	this.startPos = this.pos.clone(); 
	this.image = image; 
	this.width = 64; 
	this.height = 64; 
	this.counter = Math.PI/2 + (offset*0.5); 
	
	this.update = function(speed) { 
		this.pos.x=this.startPos.x + Math.sin(this.counter)*300; 
		this.counter+=speed;
		
	}
	
	this.render = function (c) { 
		c.drawImage(this.image,  this.pos.x, this.pos.y);	
	}
	
}
*/
function Invader(x,y, image, offset,enemyType)  {

	this.pos = new Vector2(x,y); 
	this.startPos = this.pos.clone(); 
	this.image = image; 
	this.width = image.width; 
	this.height = image.height; 
	this.counter = Math.PI/2 + (offset*0.5); 
	this.life = 1;
	if(enemyType==ENEMY_IMPERIALSTAR){
		this.life=10;
	}else if(enemyType==ENEMY_VADERSHIP){
		this.life=30;
	}
	this.enemyType=enemyType;
	
	this.update = function(speed) { 
	/*ENEMY_TIEFIGHTER=1,
	ENEMY_TIEFIGHTER_DIAGR=2,
	ENEMY_TIEFIGHTER_DIAGL=3,
	ENEMY_VADERSHIP=4,
	ENEMY_DRID=5,
	ENEMY_SLAVE=6,
	ENEMY_IMPERIALSTAR=7,
	*/
		if(enemyType==ENEMY_TIEFIGHTER){
			
				this.pos.x=this.startPos.x + Math.sin(this.counter/2)*300; 
				this.pos.y=this.startPos.y + Math.cos(this.counter)*42+this.counter*15;
				this.counter+=speed;
				if(counter%60>=50&&counter%4>2){
					this.shoot(this.pos.x+this.width/3,this.pos.y+this.height/2,0,5);
					this.shoot(this.pos.x+this.width*2.0/3,this.pos.y+this.height/2,0,5);
				}
				
		} else if(enemyType==ENEMY_TIEFIGHTER_DIAGR){
				this.pos.x=this.startPos.x + this.counter*50; 
				this.pos.y=this.startPos.y + this.counter*25;
				this.counter+=speed;
				if(counter%60>=50&&counter%4>2){
					this.shoot(this.pos.x+this.width/2,this.pos.y+this.height/2,10,5);
				}
				if(this.pos.x>screenBoundaryRight||this.pos.y>screenBoundaryDown){
					this.counter=0;
				}
		} else if(enemyType==ENEMY_TIEFIGHTER_DIAGL){
				this.pos.x=this.startPos.x - this.counter*50; 
				this.pos.y=this.startPos.y + this.counter*25;
				this.counter+=speed;
				if(counter%60>=50&&counter%4>2){//TODO: follow player
					this.shoot(this.pos.x+this.width/2,this.pos.y+this.height/2,-10,5);	
				}
				if(this.pos.x<screenBoundaryLeft||this.pos.y>screenBoundaryDown){
					this.counter=0;
				}
		} else if(enemyType==ENEMY_VADERSHIP){
		this.pos.x=this.startPos.x + Math.sin(this.counter/2)*300; 
				if(counter%30>=20&&counter%4>2){
					this.shoot(this.pos.x+this.width/3,this.pos.y+this.height/2,0,10);
					this.shoot(this.pos.x+this.width*2.0/3,this.pos.y+this.height/2,0,10);
					this.shoot(this.pos.x+this.width/2,this.pos.y+this.height/2,10,5);
					this.shoot(this.pos.x+this.width/2,this.pos.y+this.height/2,-10,5);
				}
		} else if(enemyType==ENEMY_DRID){
				this.pos.x=this.startPos.x+this.counter*20; 
				this.pos.y=this.startPos.y - this.counter*this.counter*1;
				this.counter+=speed;
		} else if(enemyType==ENEMY_SLAVE){
		
			this.pos.x=this.startPos.x + Math.sin(this.counter/2)*200; 
				this.pos.y=this.startPos.y + Math.cos(this.counter)*42+this.counter*15;
				this.counter+=speed;
		} else if(enemyType==ENEMY_IMPERIALSTAR){
			
			this.pos.x=this.startPos.x + Math.sin(this.counter/2)*200; 
				this.pos.y=this.startPos.y + Math.cos(this.counter)*42+this.counter*15;
				this.counter+=speed;
			if(counter%60>=50&&counter%4>2){
					this.shoot(this.pos.x+this.width/3,this.pos.y+this.height/2,0,5);
					this.shoot(this.pos.x+this.width*2.0/3,this.pos.y+this.height/2,0,5);
					this.shoot(this.pos.x+this.width/2,this.pos.y+this.height/2,10,5);
					this.shoot(this.pos.x+this.width/2,this.pos.y+this.height/2,-10,5);
				}
		}
	}
	this.shoot=function(x,y,vecx,vecy){
		enemyBullets.push(new enemyBullet(x,y,vecx,vecy)); 
		//this.pos.x,this.pos.y
		//fireSound_tie.currentTime = 0;
		//fireSound_tie.play();
	}
	this.render = function (c) { 
		c.drawImage(this.image,  this.pos.x, this.pos.y);	
	}
	
}

// ---------------------- BULLET -------------------------

function Bullet(x,y,vecx,vecy) { 
	this.pos = new Vector2(x,y); 
	this.vel = new Vector2(vecx,vecy); //,0,-25
	this.width = 7; 
	
	this.update = function() { 
		this.pos.plusEq(this.vel); 
		
	}
	this.render = function(c) { 
			
		
		for(var i = 0; i<4;i++) { 
			c.fillStyle = hsl(230,50,map(i,0,3,0,100)); 
			c.fillRect(this.pos.x, this.pos.y -i*8, 4, 8); 
		
		}
		 
		
	}
	
}

function enemyBullet(x,y,vecx,vecy) { 
	this.pos = new Vector2(x,y); 
	this.vel = new Vector2(vecx,vecy); 
	this.width = 7; 
	
	this.update = function() { 
		this.pos.plusEq(this.vel); 
		
	}
	this.render = function(c) { 
			
		
		for(var i = 0; i<4;i++) { 
			c.fillStyle = hsl(0,50,map(i,0,3,0,100)); 
			//c.rotate(20*Math.PI/180);
			c.fillRect(this.pos.x, this.pos.y -i, 8 , 4); 
		}
		 
		
	}
	
}


//----------------------  PARTICLES -----------------------
function makeParticleExplosion(pos, image){
	
	for(var i = 0; i<60; i++) { 
		
		var p = new Particle(pos.x, pos.y, image); 
		particles.push(p); 
	}
	
	
};
function makeJunkExplosion(pos){
	
	for(var i = 0; i<60; i++) { 
		
		var p = new Particle(pos.x, pos.y, junk[i%junk.length]); 
		particles.push(p); 
	}
	
	
};
	

function updateParticles(){
	for(var i = 0 ; i<particles.length; i++) { 
		var p = particles[i]; 
		p.update(); 
		if((p.pos.y<0) || (p.size<0.01)) {
			particles.splice(i,1); 
			i--; 
		}

		
	}
	
}

function renderParticles() { 
//	ctx.globalCompositeOperation = 'lighter'; 
	for(var i = 0; i<particles.length; i++) { 
		particles[i].render(ctx); 
	}
	ctx.globalCompositeOperation = 'source-over'; 
}
	 

function Particle(x, y, image) { 
	this.pos = new Vector2(x,y);
	this.vel = new Vector2(random(20,26),0);
	this.vel.rotate(random(360));
	this.size = 0.5; 
	this.image = image; 

	this.update = function() { 
		this.pos.plusEq(this.vel); 
		this.vel.multiplyEq(0.9); 
		this.size*=0.91; 
	//	this.vel.y+=1;
	}
	this.render = function(c) { 
		c.save(); 
		c.translate(this.pos.x, this.pos.y); 
		c.scale(this.size, this.size); 
		
		c.drawImage(this.image, 0,0);
		c.restore();	
		
	}
	
}


//------------------- STAR FIELD ---------------------

function initStars() {
	stars = [];  
	for(var i = 0; i<200; i++) { 
		stars.push(new Star()); 
	}
	
	
}

function renderStars() { 
	for(var i = 0; i<stars.length; i++) { 
		stars[i].render(); 		
	}
}


function Star() { 
	this.pos = new Vector2(random(screenWidth), random(screenHeight)); 
	var z = random(300,2000); 
	this.scale = 250/(250+z); 
	
	this.render = function() { 
		
		this.pos.y+=this.scale*10; 
		while(this.pos.y>screenHeight) {
			this.pos.y-=screenHeight; 
			this.pos.x = random(screenWidth);
		}
		ctx.fillStyle = hsl(230,30,60); 
		ctx.fillRect(this.pos.x, this.pos.y, this.scale*10, this.scale*10); 
		
		
	}

}

