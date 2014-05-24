// JavaScript Document

/*----------グローバル変数定義----------*/

var ctx;
var width;
var height;

var particlesNum = 1000;
var gravity = 0.3;
var radius = 1.8;
var particlesList = [];

var first;
var old;



/*----------初期処理----------*/

window.onload = function(){
    var canvas = document.getElementById("canvas");

    //画面調整
    canvas.width = width = 900; //window.innerWidth;
    canvas.height = height = 500 * (2 / 3); //(window.innerHeight) * (2 / 3);

    ctx = canvas.getContext("2d");

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, width, height);


    //Particle作成
    for(var i = 0; i < particlesNum; i++){
        particlesList.push(new Particle());
    }


    //アニメーション
    setInterval(loop, 1000 / 60);
}



/*----------loop関数----------*/

function loop(){
    for(var i = 0; i < particlesList.length; i++){
        var particle = particlesList[i];


		//particleオブジェクトを走らせる
        particle.update();
    }

}



/*----------Particleクラス----------*/

var Particle = function(){
    this.x = width / 2;
    this.y = height;

    this.vx = Math.random() * 8 - 4;
    this.vy = Math.random() * -10 - 10;

    this.radius = radius;
    this.color = this.randomColor();
    this.width = Math.floor(Math.random() * 5);
}

Particle.prototype.randomColor = function(){
	//hslaで色を指定
    var hue = Math.floor(Math.random() * 360) + 1;

    return "hsla(" + hue + ", 100%, 65%, 1)";
}

Particle.prototype.update = function(){
	//y方向へのベクトルに重力値を加算する
    this.vy += gravity;

    ctx.beginPath();
    ctx.lineWidth = this.width;
    ctx.strokeStyle = this.color;

    ctx.moveTo(this.x, this.y);


	//オブジェクトの座標更新
    this.x += this.vx;
    this.y += this.vy;

    ctx.lineTo(this.x, this.y);
    ctx.stroke();


	//画面外に出た時の処理（オブジェクトを再利用する）
    if(this.x < 0 || this.x > width || this.y > height){
        this.x = width / 2;
        this.y = height;

        this.vx = Math.random() * 4 - 2;
        this.vy = Math.random() * -10 - 10;
        this.color = this.randomColor();

    }
}
