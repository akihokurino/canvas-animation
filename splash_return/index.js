// JavaScript Document

//グローバル関数
var center = {x: 0, y: 0};
var circleRadius = 100;
var holeRadius = 10;
var particlesNum = 1000;

var width;
var height;

var ctx;

var particles = []

var isMouseDown = false;
var tmp;

//初期処理
window.onload = function(){
    var canvas = document.getElementById("canvas");

    //画面調整
    canvas.width = width = 900; //window.innerWidth;
    canvas.height = height = 500; //window.innerWidth;

    center.x = width / 2;
    center.y = height / 2;

    ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillRect(0, 0, width, height);

    //マウス操作処理
    canvas.addEventListener("mousedown", mouseDown, false);

    //particleの作成
    for(var i = 0; i < particlesNum; i++){
        particles.push(new Particle());
    }

    //アニメーション
    setInterval(loop, 1000 / 50);
}

//mouseDown関数
function mouseDown(){
    isMouseDown = !isMouseDown;
}

//loop関数
function loop(){
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.fillRect(0, 0, width, height);

    for(var i = 0; i < particles.length; i++){
        var particle = particles[i];
        particle.update();
        particle.draw();
    }
}

//Particleクラス
var Particle = (function(){
    function Particle(){
        this.generate();
    }

    Particle.prototype.generate = function(fadeBack){
        this.angle = 2 * Math.random() * Math.PI;
        tmp = Math.random() * 20;

        if(!isMouseDown){
        	this.radius = (Math.random() * 5) + 1;
            this.x = center.x + circleRadius * Math.cos(this.angle);
        	this.y = center.y + circleRadius * Math.sin(this.angle);
        }
        else if(isMouseDown){
            this.radius = (Math.random() * 3) + 3;
            this.opacity = 1.0;
            this.x = center.x + 30 * Math.cos(this.angle);
        	this.y = center.y + 30 * Math.sin(this.angle);
        }

        this.xSpeed = tmp * Math.cos(this.angle);
        this.ySpeed = tmp * Math.sin(this.angle);

        //条件分岐
        if(!isMouseDown){
        	this.xAccel = 10;
        	this.yAccel = 10;
        }
        else if(isMouseDown){
            this.xAccel = -Math.cos(this.angle);
            this.yAccel = -Math.sin(this.angle);
        }

        this.color = "rgba(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + this.radius / 6 + ")";
    }

    Particle.prototype.update = function(){
        this.x += this.xSpeed;
        this.y += this.ySpeed;

        if(isMouseDown){
            this.xSpeed += this.xAccel;
            this.ySpeed += this.yAccel;
        }

        if(this.check()){
            this.generate();
        }
    }

    Particle.prototype.check = function(){
        if(this.x < 0 || this.x > width){
            this.generate();
        }
        else if(this.y < 0 || this.y > height){
            this.generate();
        }

        if(isMouseDown){
            var distance = ((tmp = (center.x - this.x)) * tmp) +
                					((tmp = (center.y - this.y)) * tmp * 20);
            this.opacity = 10000 / distance;
        	if (1 < this.opacity) {
            	this.opacity = 1
        	}
        	this.opacity = 1 - this.opacity;

        	if (distance < holeRadius * holeRadius) {
            	return true;
        	}
            else {
            	return false;
        	}
        }
    }

    Particle.prototype.draw = function(){
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();
    }

    return Particle;
})();
