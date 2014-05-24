// JavaScript Document

/*----------グローバル変数定義----------*/

var width;
var height;

var ctx;
var canvas;

var particle;
var particles = [];
var particleNum = 30;


//ローレンツアトラクター要素
var p = 10;
var r = 28;
var b = 8/3;
var dt = 0.01;



/*----------初期処理----------*/

$(function(){
	canvas = document.getElementById("canvas");

	ctx = canvas.getContext("2d");
	ctx.fillStyle = "#000000";
	ctx.fillRect();

	ctx.globalCompositeOperation = "lighter";

    canvas.width = width = 900; //window.innerWidth;
    canvas.height = height = 500; //window.innerHeight;

	init();

});



/*----------init関数----------*/

function init(){
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.fillRect(0, 0, width, height);


	//particle生成
    for(var i = 0; i < particleNum; i++){
        var color = "hsla(" + Math.random() * 360 + ", 65%, 65%, 1)";
        particles.push(new Particle(i, i, i, color));
    }


	//particle = new Particle(1, 1, 1);


	//アニメーション
	anime();
}



/*----------anime関数----------*/

function anime(){
    for(var i = 0; i < particles.length; i++){
        var n = particles[i];


		//particleオブジェクトを走らせる
        n.update();
        n.draw();
    }


    /*
	var n = particle;

    n.update();
    n.draw();
    */

	setTimeout(anime, 20);
}



/*----------Particleクラス----------*/

var Particle = function(x, y, z, color){
	this.x = x;
	this.y = y;
	this.z = z;
	this.size = 3;
	this.next;
    this.nx = null;
    this.ny = null;
    this.color = color;
}

Particle.prototype.update = function(){
    var dx = -p * this.x + p * this.y;
	var dy = -this.x * this.z + r * this.x - this.y;
	var dz = this.x * this.y - b * this.z;

	dx *= dt;
	dy *= dt;
	dz *= dt;

	this.x += dx;
	this.y += dy;
	this.z += dz;


	//表示位置調整
	this.nx = this.x * 12 + width * 0.5;
	this.ny = this.y * 8 + height * 0.5;


    /*
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = this.color;
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.nx, this.ny);
    ctx.stroke();

    this.x = this.nx;
    this.y = this.ny;
    */
}

Particle.prototype.draw = function(){
    ctx.beginPath();


    //グラデーション作成
    /*
	var grad = ctx.createRadialGradient(this.nx, this.ny, 0, this.nx, this.ny, this.size);
	grad.addColorStop(0, "rgba(100, 100, 200, 1)");
	grad.addColorStop(1, "rgba(0, 0, 0, 0.1)");
    */

	ctx.fillStyle = this.color;
	ctx.arc(this.nx, this.ny, this.size, 0, Math.PI*2, false);
	ctx.fill();
}