// JavaScript Document

/*----------グローバル変数定義----------*/

var ctx;

var width;
var height;

var lineList = [];
var lineNum = 500;



/*----------初期処理----------*/

window.onload = function(){
    var canvas = document.getElementById("canvas");


    //画面調整
    canvas.width = width = 900; //window.innerWidth;
    canvas.height = height = 500; //window.innerHeight;

    ctx = canvas.getContext("2d");
	ctx.fillStyle = "#fff";
	ctx.fillRect(0, 0, width, height);


    //Lineオブジェクト作成
    for(var i = 0; i < lineNum; i++){
        lineList.push(new Line());
    }


    //アニメーション
    setInterval(loop, 1000 / 30);
}



/*----------loop関数----------*/

function loop(){
    ctx.fillStyle = "rgba(255, 255, 255, 0.01)";
    ctx.fillRect(0, 0, width, height);


	//Lineオブジェクトを走らせる
    for(var i = 0; i < lineList.length; i++){
        var line = lineList[i];

        line.update();
        line.draw();
    }
}



/*----------Lineクラス----------*/

var Line = function(){
    this.oldX = width / 2;
    this.oldY = height / 2;

    this.newX = 0;
    this.newY = 0;

    this.color = "rgb(" + Math.floor(Math.random() * 255) + ", 0, 0)";
}

Line.prototype.update = function(){
	//座標の更新処理
    this.newX = this.oldX + (Math.random() * 20) - 10;
    this.newY = this.oldY + (Math.random() * 20) - 10;


	//画面外に出たら中心位置に戻す（オブジェクトの再利用）
    if(this.newX < 0 || this.newX > width || this.newY < 0 || this.newY > height){
        //lineList.push(new Line());

		this.x = width / 2;
		this.y = height / 2;

        return;
    }
}

Line.prototype.draw = function(){
    ctx.beginPath();
    ctx.lineWidth = Math.random() * 1;
    ctx.strokeStyle = this.color;
    ctx.moveTo(this.oldX, this.oldY);
    ctx.lineTo(this.newX, this.newY);
    ctx.stroke();

    this.oldX = this.newX;
    this.oldY = this.newY;
}
