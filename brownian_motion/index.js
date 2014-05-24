// JavaScript Document

/*----------グローバル変数定義----------*/

var ctx;

var dotsList = [];
var dotsNum = 100;
var friction = 0.95;

var width;
var height;

var mouseX;
var mouseY;



/*----------初期処理----------*/

window.onload = function(){
    var canvas = document.getElementById("canvas");


    //画面調整
    canvas.width = width = 900; //window.innerWidth;
    canvas.height = height = 500; //window.innerHeight;

    mouseX = width / 2;
    mouseY = height / 2;

    ctx = canvas.getContext("2d");
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(0, 0, width, height);


    //Dot作成
    for(var i = 0; i < dotsNum; i++){
        dotsList.push(new Dot(mouseX, mouseY));
    }


    //マウス操作処理
    canvas.addEventListener("mousedown", mouseDown, false);


    //アニメーション
    setInterval(loop, 1000 / 31);
}



/*----------mouseDown関数----------*/

function mouseDown(e){
	var rect = e.target.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;


	//Dot作成
    for(var i = 0; i < dotsNum; i++){
        dotsList.push(new Dot(mouseX, mouseY));
    }
}



/*----------loop関数----------*/

function loop(){
    ctx.fillStyle = "rgba(238, 238, 238, 0.05)";
    ctx.fillRect(0, 0, width, height);


	//Dotクラスを走らせる
    for(var i = 0; i < dotsList.length; i++){
        var dots = dotsList[i];
        dots.update();
        dots.draw();
    }
}



/*----------Dotクラス----------*/

var Dot = function(x, y){
    this.x = x;
    this.y = y;

    this.vx = Math.random() - 0.5;
    this.vy = Math.random() - 0.5;

    this.color = this.randomColor();
}

Dot.prototype.update = function(){
	//進行方向の更新
    this.vx += Math.random() - 0.5;
    this.vy += Math.random() - 0.5;


	//座標の更新
    this.x += this.vx;
    this.y += this.vy;


	//摩擦の考慮
    this.vx *= friction;
    this.vy *= friction;


    //画面外に出ないように設定
    if(this.x > width) {
        this.x = 0;
    }
    else if(this.x < 0){
        this.x = width;
    }

    if(this.y > height){
        this.y = 0;
    }
    else if(this.y < 0){
        this.y = height;
    }
}

Dot.prototype.randomColor = function(){
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);

    return "rgba(" + r + "," + g + "," + b + ", 1)";
}

Dot.prototype.draw = function(){
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - 0.5, this.y - 0.5, 1, 1);
}
