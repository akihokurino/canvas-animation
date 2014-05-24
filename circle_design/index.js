// JavaScript Document

/*----------グローバル変数定義----------*/

var FPS = 60;
var CIRCLE_RADIUS = 100;
var circleList = [];

var ctx;
var timer;

var drawPoint = {x: 0, y: 0};
var mousePoint = {x: 0, y: 0};



/*----------初期処理----------*/

window.onload = function(){
    var canvas = document.getElementById("canvas");


    //画面調整
    canvas.width = 900; //window.innerWidth;
    canvas.height = 500; //window.innerHeight;

    ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#22260C";


    mousePoint.x = canvas.width / 2;
    mousePoint.y = canvas.height / 2;


    //DrawPoint作成
    drawPoint = new DrawPoint(mousePoint.x, mousePoint.y);


    //マウス操作処理
    canvas.addEventListener("touchmove", mouseMove, false);
    canvas.addEventListener("touchstart", mouseDown, false);

    canvas.addEventListener("mousedown", mouseDown, false);
    canvas.addEventListener("mousemove", mouseMove, false);


    //アニメーション
    timer = setInterval(loop, 1000 / FPS);
}



/*----------mouseDown関数----------*/

function mouseDown(e){
    e.preventDefault();

	//アニメーションが動作中なら停止、停止中なら作動する
    if(timer){
        clearInterval(timer);
        timer = null;
    }
    else{
        timer = setInterval(loop, 1000 / FPS);
    }
}



/*----------mouseMove関数----------*/

function mouseMove(e){
	e.preventDefault();

    if(e.type == "mousemove"){
        var rect = e.target.getBoundingClientRect();

        mousePoint.x = e.clientX - rect.left;
        mousePoint.y = e.clientY - rect.top;
    }
    else if(e.type == "touchmove"){
        mousePoint.x = e.layerX;
        mousePoint.y = e.layerY;
    }
}



/*----------loop関数----------*/

function loop(){
	//画面を更新
    ctx.clearRect(0, 0, 600, 600);


    drawPoint.update(mousePoint.x, mousePoint.y);


    //描画する座標とマウス座標が一定以上離れている場合、円を追加
    if(distance(drawPoint.x, drawPoint.y, mousePoint.x, mousePoint.y) > 0.5){
        //Circle作成
        circleList.push(new Circle(drawPoint.x, drawPoint.y, CIRCLE_RADIUS));
    }


    for(var i = 0; i < circleList.length; i++){
        var circle = circleList[i];

        circle.update(ctx);

        /*
        if(circle.completed){
            circleList.splice(i, 1);
            circleList--;
            i--;
        }
        */
    }
}



/*----------distance関数----------*/

function distance(newX, newY, oldX, oldY){
    var diffX = newX - oldX;
    var diffY = newY - oldY;

    return Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
}



/*----------Circleクラス----------*/

var Circle = function(x, y, radius){
    this.x = x;
    this.y = y;

    this.radius = radius;
    this.alpha = 1;
    this.completed = false;
}

Circle.prototype.update = function(ctx){
    if(this.completed){
        return;
    }

    this.alpha += (0 - this.alpha) * 0.02;

    if(Math.abs(0 - this.alpha) < 0.01){
        this.alpha = 0;
        this.completed = true;
    }

    ctx.save();

    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.stroke();

    ctx.restore();
}



/*----------DrawPointクラス----------*/

var DrawPoint = function(x, y){
    this.x = x;
    this.y = y;

    this.vx = 0;
    this.vy = 0;

    this.spring = 20;
    this.friction = 0.8;
}

DrawPoint.prototype.update = function(x, y){
	//現在のマウスの位置とDrawPointの座標の間の距離を求める
    var ax = x - this.x;
    var ay = y - this.y;


	//その値を速さに足していく
    this.vx += ax / this.spring;
    this.vy += ay / this.spring;


	//摩擦の考慮
    this.vx *= this.friction;
    this.vy *= this.friction;


	//座標の更新
    this.x += this.vx;
    this.y += this.vy;
}
