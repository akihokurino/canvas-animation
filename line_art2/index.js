// JavaScript Document

/*----------グローバル変数定義----------*/

var ctx;
var canvas;

var lineList = [];
var lineNum = 10;
var MAX_NUM = 1000;

var count = 0;

var mouseX;
var mouseY;

var width;
var height;

var hue = 210;

var isMouseDown = false;

var timer;



/*----------初期処理----------*/

window.onload = function(){
    canvas = document.getElementById("canvas");


    //画面調整
    canvas.width = width = 900; //window.innerWidth;
    canvas.height = height = 500; //window.innerHeight;


    ctx = canvas.getContext("2d");
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, width, height);


    mouseX = canvas.width / 2;
    mouseY = canvas.height / 2;


    //マウス操作処理
    //canvas.addEventListener("touchstart", mouseDown, false);
    canvas.addEventListener("touchmove", mouseMove, false);

    canvas.addEventListener("mousemove", mouseMove, false);
	canvas.addEventListener("mousedown", mouseDown, false);


    //アニメーション
    timer = setInterval(loop, 10);
}

/*----------mouseDown関数----------*/

function mouseDown(e){
    e.preventDefault();

	isMouseDown = !isMouseDown;

	if(isMouseDown){
		clearInterval(timer);
	}
	else{
		timer = setInterval(loop, 10);
	}
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



/*----------loop関数----------*/

function loop(){
	/*
    ctx.fillStyle = "rgba(255, 255, 255, 0.01)";
    ctx.fillRect(0, 0, width, height);
	*/


	//Lineオブジェクトの生成
    for(var i = 0; i < lineNum; i++){
        if(lineList.length <= count){
            var line = new Line();
            lineList.push(line);
        }
        else{
            line = lineList[count];
		}


		//Lineオブジェクトの初期化処理
		line.initialize();


		//オブジェクトの数制御の為のcount更新処理
        count++;

        if(count == MAX_NUM){
            count = 0;
        }
    }


	//Lineオブジェクトを走らせる
    for(var i = 0; i < lineList.length; i++){
        var line = lineList[i];

        line.update();
        line.draw();
    }


    //色相の変化
    hue += 1;
}



/*----------Lineクラス----------*/

var Line = function(){
    this.x = null;
    this.y = null;

    this.oldX = null;
    this.oldY = null;

    this.vx = null;
    this.vy = null;

    this.size = null;

    this.active = true;
    this.color = null;
}

Line.prototype.initialize = function(){
	this.x = mouseX;
	this.y = mouseY;

    this.vx = 40 * (Math.random() - 0.5);
	this.vy = 40 * (Math.random() - 0.5);

	this.size = 1 + Math.random() * 1;

	this.active = true;
	this.color = "hsla(" + hue + ", 100%, 60%, 1)";
}

Line.prototype.update = function(){
    if(this.active){
        this.oldX = this.x;
        this.oldY = this.y;


		//値の更新処理
        this.x += this.vx;
        this.y += this.vy;


		//摩擦処理
        this.vx *= 0.98;
        this.vy *= 0.98;


		//画面外に出た時の処理
        if(this.x < 0 || this.x > width || this.y < 0 || this.y > height){
            this.active = false;

            //this.x = mouseX;
            //this.y = mouseX;
        }
    }
}

Line.prototype.draw = function(){
    if(this.active){
        ctx.beginPath();
        //ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.size;
        ctx.moveTo(this.oldX, this.oldY);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
        //ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2, false);
        //ctx.fill();
    }
}
