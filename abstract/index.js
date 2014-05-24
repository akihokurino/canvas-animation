// JavaScript Document

/*----------グローバル変数定義----------*/

var delta = 5;
var lineNum = 50;
var lineList = [];
var maxIterations = 1000;

var ctx;
var width;
var height;

var center = {x: 0, y: 0};



/*----------初期処理----------*/

window.onload = function(){
    var canvas = document.getElementById("canvas");


    //画面調整
    canvas.width = width = 900; //window.innerWidth;
    canvas.height = height = 500; //window.innerHeight;

    ctx = canvas.getContext("2d");
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(0, 0, width, height);

    center.x = width / 2;
    center.y = height / 2;


    //line作成
    for(var i = 0; i < lineNum; i++){
        lineList.push(new Line(center.x, center.y));
    }


    //アニメーション
    setInterval(loop, 10);
}



/*----------loop関数----------*/

function loop(){
    for(var i = 0; i < lineList.length; i++){
        var line = lineList[i];

        line.update();
    }
}



/*----------randfloat関数----------*/

function randfloat(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



/*----------Lineクラス----------*/

var Line = function(x, y){
    this.x = x;
    this.y = y;

    this.vx = 0;
    this.vy = 0;

    this.life = randfloat(0, maxIterations);
    this.color = "#000000";
}

Line.prototype.update = function(){
	//進行方向の更新
    this.vx = randfloat(-delta, delta);
    this.vy = randfloat(-delta, delta);


	//描画処理
    ctx.beginPath();
    ctx.lineWidth = 0.1;
    ctx.strokeStyle = this.color;

    ctx.moveTo(this.x, this.y);


	//座標の更新
    this.x += this.vx;
    this.y += this.vy;

    ctx.lineTo(this.x, this.y);
    ctx.stroke();

    this.life++;


	//lifeプロパティがmaxIterationsを超えると中心から再生成
    if(this.life > maxIterations){
        this.x = center.x;
        this.y = center.y;
        this.life = 0;
    }
}
