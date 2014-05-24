// JavaScript Document

/*----------グローバル変数定義----------*/

var ctx;

var particlesList = [];
var MAX_NUM = 1000;

var mouseX;
var mouseY;

var width;
var height;

var MAX_POWER = 100;

var hue = 180;

var first;
var old;



/*----------初期処理----------*/

window.onload = function(){
    var canvas = document.getElementById("canvas");


    //画面調整
    canvas.width = width = 900; //window.innerWidth;
    canvas.height = height = 500; //window.innerHeight;

    ctx = canvas.getContext("2d");
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, width, height);

    mouseX = canvas.width / 2;
    mouseY = canvas.height / 2;


    //マウス操作処理
    //canvas.addEventListener("touchstart", mouseDown, false);
    canvas.addEventListener("touchmove", mouseMove, false);

    canvas.addEventListener("mousemove", mouseMove, false);
    canvas.addEventListener("mousedown", mouseDown, false);


    /*
    for(var i = 0; i < MAX_NUM; i++){
        var particle = new Particle();
        particlesList.push(particle);
    }
    */


    //Linked List（CPU負荷軽減のため）
    for(var i = 0; i < MAX_NUM; i++){
        var particle = new Particle();
        particlesList.push(particle);

        if(first == null){
            first = old = particle;
        }
        else{
            old.next = particle;
            old = particle;
        }
    }


    //アニメーション
    setInterval(anime, 1000 / 60);
}



/*----------mouseMove関数----------*/

function mouseMove(e){
	e.preventDefault();

    if(e.type == "mousemove"){
        var rect = e.target.getBoundingClientRect();

        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    }
    else if(e.type == "touchmove"){
        mouseX = e.layerX;
        mouseY = e.layerY;
    }
}



/*----------mouseDown関数----------*/

function mouseDown(e){
    e.preventDefault();

    for(var i = 0; i < particlesList.length; i++){
        var particle = particlesList[i];

        var randAngle = Math.random() * (Math.PI << 1);
        var randPower = Math.random() * MAX_POWER - (MAX_POWER >> 1);

        particle.dx = randPower * Math.cos(randAngle);
        particle.dy = randPower * Math.sin(randAngle);
    }
}



/*----------anime関数----------*/

function anime(){
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(0, 0, 0, 0.01)";
    ctx.fillRect(0, 0, width, height);


    /*
    for(var i = 0; i < particlesList.length; i++){
        var particle = particlesList[i];

        particle.update();
        particle.draw();
    }
    */


    //Linked List（CPU負荷軽減のため）
	var n = first;

    do{
        n.update();
        n.draw();
    }while(n = n.next);


    //色相変化（青系色で統一）
    hue += 1;

    if(hue >= 330){
        hue = 180;
    }
}



/*----------Particleクラス----------*/

var Particle = function(){
    this.x = Math.random() * width;
    this.y = Math.random() * height;

    this.oldX = 0;
    this.oldY = 0;

    this.dx = 0;
    this.dy = 0;

	this.speed = Math.random() + 0.3;

    this.size = Math.random();
    this.color = null;
    this.next = null;
}

Particle.prototype.update = function(){
    this.oldX = this.x;
    this.oldY = this.y;

    var angle = Math.atan2(this.y - mouseY, this.x - mouseX);

    this.dx -= this.speed * Math.cos(angle);
    this.dy -= this.speed * Math.sin(angle);


	//座標の更新
    this.x += this.dx;
    this.y += this.dy;


	//摩擦処理
    this.dx *= 0.95;
    this.dy *= 0.95;

    this.color = "hsla(" + hue + ", 100%, 60%, 1)";
}

Particle.prototype.draw = function(){
    ctx.globalCompositeOperation = "lighter";

    ctx.beginPath();
    ctx.lineWidth = this.size;
    ctx.strokeStyle = this.color;

    ctx.moveTo(this.oldX, this.oldY);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();
}
