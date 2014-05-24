// JavaScript Document

/*----------グローバル変数定義----------*/

var ctx;

var lineNum = 430;
var lineList = [];

var width;
var height;

var count = 0;
var index;

var h = 180;

var oldX;
var oldY;



/*----------初期処理----------*/

window.onload = function(){
    var canvas = document.getElementById("canvas");


    //画面調整
    canvas.width = width = 900; //window.innerWidth;
    canvas.height = height = 500; //window.innerHeight;

    ctx = canvas.getContext("2d");
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, width, height);


    //Lineオブジェクトの生成
    for(var i = 1; i < lineNum; i++){
        lineList.push(new Line());
    }


	/*
    oldX = Math.random() * width;
    oldY = Math.random() * height;
    */


    //アニメーション
    setInterval(loop, 50);
}



/*----------loop関数----------*/

function loop(){
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(0, 0, width, height);

    count++;


	//Lineオブジェクトを走らせる
    for(var i = 1; i < lineList.length; i++){
        index = i;

        var line = lineList[i];

        line.update();
    }


    /*
    for(var i = 1; i < lineNum; i++){
        var myX = i * Math.sin(count / 360 * 2 * Math.PI * i) + width / 2;
        var myY = i * Math.cos(count / 360 * 2 * Math.PI * i) + height / 2;

        ctx.beginPath();
        ctx.strokeStyle = "hsla(" + h + ", 100%, 60%, 1)";
        ctx.lineWidth = Math.floor(Math.random() * 5);
        ctx.moveTo(oldX, oldY);
        ctx.lineTo(myX, myY);
        ctx.stroke();

        oldX = myX;
        oldY = myY;
    }
    */


    //色の更新処理
    h++;

    if(h > 360){
        h = 0;
    }
}



/*----------Lineクラス----------*/

var Line = function(){
    this.x = Math.random() * width;
    this.y = Math.random() * height;

    this.oldX = null;
    this.oldY = null;
}

Line.prototype.update = function(){
    this.oldX = this.x;
    this.oldY = this.y;


	//値の更新処理
    this.x = index * Math.sin(count / 360 * 2 * Math.PI * index) + width / 2;
    this.y = index * Math.cos(count / 360 * 2 * Math.PI * index) + height / 2;


	//描画処理
    ctx.beginPath();
    ctx.strokeStyle = "hsla(" + h + ", 100%, 60%, 1)";
	ctx.lineWidth = Math.floor(Math.random() * 1);
    ctx.moveTo(this.oldX, this.oldY);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();
}



