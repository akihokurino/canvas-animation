// JavaScript Document

/*----------グローバル変数定義----------*/

var canvas1;
var ctx1;

var canvas2;
var ctx2;


var snowList = [];
var totalSnow = 1000;
var stage = {};
var mouse = {x: 0, y: 0};

var imageData;
var imageDataList = [];

var img;

var timer;
var dropButton;



/*----------初期処理----------*/

window.onload = function(){
	canvas1 = document.getElementById("layer1");
	ctx1 = canvas1.getContext("2d");

	canvas2 = document.getElementById("layer2");
	ctx2 = canvas2.getContext("2d");


	//画面調整
	stage.width = 900; //window.innerWidth;
	stage.height = 500; //window.innerHeight;

	canvas1.width = stage.width;
	canvas1.height = stage.height;

	canvas2.width = stage.width;
	canvas2.height = stage.height;


	//イメージオブジェクトの生成
	img = new Image();
	img.src = "http://jsrun.it/assets/B/R/T/g/BRTgn.png";

	img.onload = function(){
		//Snowインスタンスの生成
		for(var i = 0; i < totalSnow; i++){
			var snow = new Snow();

			snowList.push(snow);
		}


		//layer_2のcanvasにイベントリスナを設定
		canvas2.addEventListener("mousedown", mouseDown, false);
		canvas2.addEventListener("mouseup", mouseUp, false);


		//layer_2のキャンバスの画像を取得
		imageData = ctx2.getImageData(0, 0, stage.width, stage.height);
		imageDataList = imageData.data;


		//アニメーション
		timer = setInterval(anime, 1000 / 30);
	}


	//振り落とし処理の設定
	dropButton = document.getElementById("reset");
	dropButton.addEventListener("click", dropSnow, false);
}



/*----------mouseDown関数----------*/

function mouseDown(e){
	e.preventDefault();

	var rect = e.target.getBoundingClientRect();

    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;


	ctx2.beginPath();
	ctx2.moveTo(mouse.x, mouse.y);
	canvas2.addEventListener("mousemove", mouseMove, false);
}



/*----------mouseMove関数----------*/

function mouseMove(e){
	e.preventDefault();

	var rect = e.target.getBoundingClientRect();

    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;


	ctx2.lineTo(mouse.x, mouse.y);
	ctx2.lineWidth = 50;
	ctx2.miterLimit = 20;
	ctx2.strokeStyle = "rgba(200, 200, 200, 0.005)";
	ctx2.lineCap = "round";
	ctx2.lineJoin = "round";
	ctx2.stroke();


	//マウスで描画した後のleyer_2のキャンバスの画像を取得
	imageData = ctx2.getImageData(0, 0, stage.width, stage.height);
	imageDataList = imageData.data;
}



/*----------mouseUp関数----------*/

function mouseUp(e){
	e.preventDefault();

	canvas2.removeEventListener("mousemove", mouseMove, false);
}



/*----------anime関数----------*/

function anime(){
	ctx1.setTransform(1, 0, 0, 1, 0, 0);
	ctx1.globalCompositeOperation = "source-over";
	ctx1.clearRect(0, 0, stage.width, stage.height);
	ctx1.globalCompositeOperation = "lighter";


	for(var i = 0; i < snowList.length; i++){
		var snow = snowList[i];


		//Snowインスタンスを走らせる
		snow.update();
	}
}



/*----------dropSnow関数----------*/

function dropSnow(e){
	clearInterval(timer);

	e.preventDefault();


	//全てのSnowインスタンスのhitプロパティをfalseにする
	for(var i = 0; i < snowList.length; i++){
		var snow = snowList[i];
		snow.hit = false;
	}


	//leyer_2のキャンバスもクリアする
	for(var i = 0; i < imageDataList.length; i++){
		imageDataList[i] = 0;
	}


	//layer_2のキャンバスにクリアしたimageDataオブジェクトを描画する
	ctx2.putImageData(imageData, 0, 0);
	timer = setInterval(anime, 1000 / 30);
}



/*----------Snowクラス----------*/

var Snow = function(){
	this.x = Math.floor(Math.random() * stage.width);
	this.y = Math.floor(Math.random() * stage.height);

	this.direction = Math.random() - 0.5;
	this.scale = Math.random();
	this.speed = Math.floor(Math.random() * 10) + 1;

	this.hit = false;

	ctx1.drawImage(img, 0, 0);
	ctx1.setTransform(this.scale, 0, 0, this.scale, this.x, this.y);
}

Snow.prototype.update = function(){
	if(this.hit){
		this.x += this.direction * 0.01;
		this.y += this.speed * 0.01;
	}
	else{
		this.x += this.direction;
		this.y += this.speed;
	}


	//画面外に出た時の処理
	if(this.x > stage.width){
		this.x = 0;
	}

	if(this.x < 0){
		this.x = stage.width;
	}


	//下まで落ちた場合は上から再利用
	if(this.y > stage.height){
		this.x = Math.floor(Math.random() * stage.width);
		this.y = -20;
	}


	//画面内にある時の処理
	if(this.y > 0){
		//現在の座標を取得
		var _x = Math.floor(this.x);
		var _y = Math.floor(this.y);


		//実際の移動処理（位置の更新）
		ctx1.setTransform(this.scale, 0, 0, this.scale, _x, _y);
		ctx1.drawImage(img, 0, 0);


		//描画処理
		/*
		ctx1.beginPath();
		ctx1.fillStyle = "red";
		ctx1.arc(this.x, this.y, 3, 0, Math.PI * 2, false);
		ctx1.fill();
		*/


		//layer_2のキャンバスにマウスで描画した範囲と重なっていればhitプロパティをtrueにする
		var targetAlpha = (stage.width * _y + _x) * 4;

		if(imageDataList[targetAlpha] === 0){
			this.hit = false;
		}
		else{
			this.hit = true;
		}
	}
	else{
		this.hit = false;
	}
}
