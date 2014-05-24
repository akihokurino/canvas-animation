// JavaScript Document

/*----------グローバル変数定義-----------*/

var ctx;

var focalLength = 300;
var circleNum = 500;
var circleList = [];

var offsetTop;
var offsetLeft;

var mouse = {x: 0, y: 0};
//var vanishingPoint = {x: window.innerWidth / 2, y: window.innerHeight / 2};
var centerPoint = {x: 250, y: 250};

var width;
var height



/*----------初期処理-----------*/

window.onload = function(){
    var canvas = document.getElementById("canvas");


    //画面調整
    canvas.width = width = 900; //window.innerWidth;
    canvas.height = height = 500; //window.innerHeight;

    offsetTop = canvas.offsetTop;
    offsetLeft = canvas.offsetLeft;


    ctx = canvas.getContext("2d");
	ctx.fillStyle = "#fff";
	ctx.fillRect(0, 0, width, height);


    //Circleオブジェクト作成
    for(var i = 0; i < circleNum; i++){
        circleList.push(new Circle());
    }


    //マウス操作処理
    canvas.addEventListener("mousemove", mouseMove, false);
    canvas.addEventListener("mousedown", mouseDown, false);


    //アニメーション
    setInterval(loop, 1000 / 60);
}



/*----------mouseMove関数----------*/

function mouseMove(e){
    mouse.x = e.clientX - offsetLeft;
    mouse.y = e.clientY - offsetTop;
}



/*----------mouseDown関数----------*/

function mouseDown(e){
    circleList.push(new Circle(e.clientX - offsetLeft, e.clientY - offsetTop));
}



/*----------zSort関数----------*/

function zSort(a, b){
    var posZ1 = a["posZ"];
    var posZ2 = b["posZ"];

    if(posZ1 < posZ2){
        return 1;
    }
    else if(posZ1 > posZ2){
        return -1;
    }
    else{
        return 0;
    }
}



/*----------loop関数----------*/

function loop(){
    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    ctx.fillRect(0, 0, width, height);


	//Circleオブジェクトを走らせる
    for(var i = 0; i < circleList.length; i++){
        var circle = circleList[i];

        circle.update(
            (mouse.x - centerPoint.x) * 0.0005,
            (mouse.y - centerPoint.y) * 0.0005
		);

        circleList.sort(zSort);


		//描画処理
        circle.draw();
    }
}



/*----------Circleクラス----------*/

var Circle = function(x, y){
    if(x){
    	this.posX = x;
    }
    else{
		// xデフォルト値
        this.posX = Math.random() * 300 - 100;
    }
    if(y){
    	this.posY = y;
    }
    else{
		//yデフォルト値
        this.posY = Math.random() * 300 - 100;
    }

    this.posZ = Math.random() * 300 - 100;

    this.angleX = 0;
    this.angleY = 0;

    this.color = this.randomColor();

    this.scale = 0;
}

Circle.prototype.randomColor = function(){
    var h = Math.random() * 360;

    return "hsla(" + h + ", 65%, 65%, 1)";


    /*
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgb(" + r + "," + g + "," + b + ")";
    */
}

Circle.prototype.update = function(angleX, angleY){
    this.angleX = angleY;
    this.angleY = angleX;

    this.rotateX();
    this.rotateY();

    this.scale = focalLength / (focalLength + this.posZ);
}

Circle.prototype.rotateX = function(){
    var cosX = Math.cos(this.angleX);
    var sinX = Math.sin(this.angleX);

    var y = this.posY * cosX - this.posZ * sinX;
    var z = this.posZ * cosX + this.posY * sinX;

    this.posY = y;
    this.posZ = z;
}

Circle.prototype.rotateY = function(){
    var cosY = Math.cos(this.angleY);
    var sinY = Math.sin(this.angleY);

    var x = this.posX * cosY - this.posZ * sinY;
    var z = this.posZ * cosY + this.posX * sinY;

    this.posX = x;
    this.posZ = z;
}

Circle.prototype.draw = function(){
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(
        centerPoint.x + this.posX * this.scale,
        centerPoint.y + this.posY * this.scale,
        1, 0, Math.PI * 2, false);
    ctx.fill();
}
