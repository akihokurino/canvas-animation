// JavaScript Document

/*----------グローバル変数定義----------*/

var RADIUS = 350;

var RADIUS_SCALE = 0.5;
var RADIUS_SCALE_MIN = 0.5;
var RADIUS_SCALE_MAX = 1.25;

var QUANTITY = 300;

var ctx;
var particles = [];

var mouseX;
var mouseY;
var mouseIsDown = false;

var width;
var height;



/*----------初期処理----------*/

window.onload = function(){
	var canvas = document.getElementById('canvas');

    //画面調整
    canvas.width = width = 900; //window.innerWidth;
    canvas.height = height = 500; //window.innerHeight;

    mouseX = width / 2;
    mouseY = height / 2;

	ctx = canvas.getContext('2d');
	ctx.fillStyle = "#fff";
	ctx.fillRect(0, 0, width, height);


	//マウス移動処理
	canvas.addEventListener('mousemove', mouseMove, false);
	canvas.addEventListener('mousedown', mouseDown, false);
	canvas.addEventListener('mouseup', mouseUp, false);
	canvas.addEventListener('touchstart', touchStart, false);
	canvas.addEventListener('touchmove', touchMove, false);
    canvas.addEventListener('touchend', touchEnd, false);


	//Particle作成
    for(var i = 0; i < QUANTITY; i++){
        //particleオブジェクトの初期設定
        var particle = {
            size: 1,
            position: { x: mouseX, y: mouseY },
            offset: { x: 0, y: 0 },
            shift: { x: mouseX, y: mouseY },
            speed: 0.01 + Math.random() * 0.04,
            targetSize: 1,
            color: "rgb(" +
            	Math.floor(Math.random() * 255) + "," +
            	Math.floor(Math.random() * 255)  + "," +
            	Math.floor(Math.random() * 255) + ")",
            orbit: RADIUS * 0.5 + (RADIUS * 0.5 * Math.random())
        };

        particles.push(particle);
    }

    /*
    for(var i = 0; i < QUANTITY; i++){
        particles.push(new Particle(mouseX, mouseY));
    }
    */

	//アニメーション
	setInterval( loop, 1000 / 60 );
}



/*----------mouseMove関数----------*/

function mouseMove(event){
    event.preventDefault();

	var rect = event.target.getBoundingClientRect();

    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
}



/*----------mouseDown関数----------*/

function mouseDown(event){
    event.preventDefault();
	mouseIsDown = true;
}



/*----------mouseUp関数----------*/

function mouseUp(event){
    event.preventDefault();
	mouseIsDown = false;
}



/*----------touchStart関数----------*/

function touchStart(event){
    event.preventDefault();
  	mouseIsDown = true;
}



/*----------touchMove関数----------*/

function touchMove(event){
	event.preventDefault();

    mouseX = event.layerX;
    mouseY = event.layerY;
}


/*----------touchEnd関数----------*/

function touchEnd(event){
    event.preventDefault();
    mouseIsDown = false;
}



/*----------loop関数----------*/

function loop(){
	if(mouseIsDown){
        RADIUS_SCALE += (RADIUS_SCALE_MAX - RADIUS_SCALE) * 0.02;
    }
    else{
        RADIUS_SCALE -= (RADIUS_SCALE - RADIUS_SCALE_MIN) * 0.02;
    }

    RADIUS_SCALE = Math.min(RADIUS_SCALE, RADIUS_SCALE_MAX);

    //ctx.fillStyle = 'rgba(0,0,0,0.05)';
    //ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);


    //particle更新処理
    for(var i = 0; i < particles.length; i++){
        var particle = particles[i];

        var lp = {x: particle.position.x, y: particle.position.y};


    	//回転処理
    	particle.offset.x += particle.speed;
    	particle.offset.y += particle.speed;


    	//クリック座標追跡処理
    	particle.shift.x += (mouseX - particle.shift.x) * (particle.speed);
    	particle.shift.y += (mouseY - particle.shift.y) * (particle.speed);


    	//位置調整
    	particle.position.x = particle.shift.x + Math.cos(i + particle.offset.x) * (particle.orbit * RADIUS_SCALE);
    	particle.position.y = particle.shift.y + Math.sin(i + particle.offset.y) * (particle.orbit * RADIUS_SCALE);


    	//画面に出ないように処理
    	particle.position.x = Math.max(Math.min(particle.position.x, width), 0);
    	particle.position.y = Math.max(Math.min(particle.position.y, height), 0);

    	particle.size += (particle.targetSize - particle.size) * 0.05;

    	if( Math.round(particle.size) == Math.round(particle.targetSize)){
      		particle.targetSize = 1 + Math.random() * 7;
    	}


    	//Particleの描画処理
    	ctx.beginPath();
    	ctx.fillStyle = particle.color;
    	ctx.strokeStyle = particle.color;
    	ctx.lineWidth = particle.size;
    	ctx.moveTo(lp.x, lp.y);
    	ctx.lineTo(particle.position.x, particle.position.y);
    	ctx.stroke();
    	ctx.arc(particle.position.x, particle.position.y, particle.size / 2, 0, Math.PI * 2, true);
    	ctx.fill();
  	}

    /*
    for(var i = 0; i < particles.length; i++){
        var particle = particles[i];
        particle.update();
        particle.draw();
    }
    */
}



/*----------Particleクラス----------*/

var Particle = function(x, y){
    this.x = x;
    this.y = y;
    this.size = 1;
    this.position = {x: x, y: y};
    this.offset = {x: 0, y: 0};
    this.shift = {x: x, y: y};
    this.speed = 0.01 + Math.random() * 0.04;
    this.targetSize = 1;
    this.fillColor = "rgb(" +
        Math.floor(Math.random() * 255) + "," +
            Math.floor(Math.random() * 255) + "," +
                Math.floor(Math.random() * 255) + ")";
    this.orbit = RADIUS * .5 + (RADIUS * .5 * Math.random());
    this.lp = null;
}

Particle.prototype.update = function(){
    this.lp = {x: this.position.x, y: this.position.y};

    //回転処理
    this.offset.x += this.speed;
    this.offset.y += this.speed;

    //クリック座標追跡処理
    this.shift.x += (this.x - this.shift.x) * (this.speed);
    this.shift.y += (this.y - this.shift.y) * (this.speed);

    //位置調整
    this.position.x = this.shift.x + Math.cos(i + this.offset.x) * (this.orbit * RADIUS_SCALE);
    this.position.y = this.shift.y + Math.sin(i + this.offset.y) * (this.orbit * RADIUS_SCALE);

    //画面に出ないように処理
    this.position.x = Math.max(Math.min(this.position.x, width), 0);
    this.position.y = Math.max(Math.min(this.position.y, height), 0);

    this.size += (this.targetSize - this.size) * 0.05;

    if(Math.round(this.size) == Math.round(this.targetSize)){
        this.targetSize = 1 + Math.random() * 7;
    }
}

Particle.prototype.draw = function(){
    ctx.beginPath();
    ctx.fillStyle = this.fillColor;
    ctx.strokeStyle = this.fillColor;
    ctx.lineWidth = this.size;
    ctx.moveTo(this.lp.x, this.lp.y);
    ctx.lineTo(this.position.x, this.position.y);
    ctx.stroke();
    ctx.arc(this.position.x, this.position.y, this.size / 2, 0, Math.PI * 2, true);
    ctx.fill();
}

