// JavaScript Document

/*----------グローバル変数定義----------*/

var FPS = 30;
var CIRCLE_MAX = 500;
var MAX_SIZE = 100;
var STEP = 3;
var DELTA = 10;

var ctx;

var pointX;
var pointY;

var circlesList = [];

var pointNum = 50;
var pointList = [];

var centerX;
var centerY;

var width;
var height



/*----------初期処理----------*/

window.onload = function(){
    var canvas = document.getElementById("canvas");


    //画面調整
    canvas.width = width = 900; //window.innerWidth;
    canvas.height = height = 500; //window.innerHeight;

    ctx = canvas.getContext("2d");
	ctx.fillStyle = "#fff";
	ctx.fillRect(0, 0, width, height);

    centerX = canvas.width / 2;
    centerY = canvas.height / 2;


	//座標をプロットするためのクラスを生成
    for(var i = 0; i < pointNum; i++){
        pointList.push(new Point(centerX, centerY));
    }


    //マウス操作処理
    /*
    canvas.addEventListener("mousedown", mouseDown, false);
    canvas.addEventListener("mousemove", mouseMove, false);
    */


    //アニメーション
    setInterval(loop, 1000 / FPS);
}



/*----------mouseDown関数----------*/
/*
function mouseDown(e){
    mouseMove(e);
}
*/



/*----------mouseMove関数----------*/
/*
function mouseMove(e){
    e.preventDefault();

    pointX = e.clientX;
    pointY = e.clientY;

    addCircle(pointX, pointY);
}
*/



/*----------addCircle関数----------*/

function addCircle(x, y){
    /*
    if(circlesList.length >= CIRCLE_MAX){
        circlesList.shift();
    }
    */

    circlesList.push(new Circle(x, y));
}



/*----------randfloat関数----------*/

function randfloat(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



/*----------loop関数----------*/

function loop(){
	//画面の更新
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillRect(0, 0, width, height);


	//座標プロットクラスを走らせる
    for(var i = 0; i < pointList.length; i++){
        var point = pointList[i];

        point.update();
    }


	//サークルクラスを走らせる
    for(var i = 0; i < circlesList.length; i++){
        var circle = circlesList[i];

        circle.draw();


		//サークルをどんどん広げるため、半径値を更新する
        circle.size += STEP;

        if(circle.size > MAX_SIZE ){
            circlesList.splice(i, 1);
            continue;
        }
    }
}



/*----------Circleクラス----------*/

var Circle = function(x, y){
    this.x = x;
    this.y = y;

    this.size = 1;

    //this.h = Math.floor(Math.random() * 360) + 1;
}

Circle.prototype.draw = function(){
    ctx.beginPath();
    ctx.strokeStyle = "#191970";
    //ctx.strokeStyle = "hsla(" + this.h + ", 100%, 60%," + (1 - this.size / MAX_SIZE) + ")";
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.stroke();
}



/*----------Pointクラス----------*/

var Point = function(x, y){
    this.x = x;
    this.y = y;

    this.vx = 0;
    this.vy = 0;

    //this.life = randfloat(0, 1000);
}

Point.prototype.update = function(){
    this.vx = randfloat(-DELTA, DELTA);
    this.vy = randfloat(-DELTA, DELTA);

    this.x += this.vx;
    this.y += this.vy;

    addCircle(this.x, this.y);

    /*
    this.life++;

    if(this.life > 1000){
        this.x = centerX;
        this.y = centerY;
        this.life = 0;
    }
    */
}
