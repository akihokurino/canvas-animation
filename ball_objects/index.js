// JavaScript Document

/*----------グローバル変数定義----------*/

var canvas;
var ctx;

var width;
var height;

var ballNum = 20;
var ballList = [];

var ballMaxWidth = 120;
var ballMinWidth = 50;

var options = {
	bounce: -0.9,
	gravity: 4,
	spring: 0.6,
	friction: 0.95
}

var timer;

var mouse = {
	x: 0,
	y: 0
}



/*----------初期処理----------*/

window.onload = function(){
	canvas = document.getElementById("canvas");

	ctx = canvas.getContext("2d");


	//画面調整
	canvas.width = width = 900; //window.innerWidth;
	canvas.height = height = 500; //window.innerHeight;


	//ボールオブジェクトの生成
	for(var i = 0; i < ballNum; i++){
		var ball = new Ball();
		ballList.push(ball);
	}


	//マウス操作処理
	canvas.addEventListener("touchstart", mouseDown, false);
    canvas.addEventListener("touchmove", mouseMove, false);
    canvas.addEventListener("touchend", mouseUp, false);

	canvas.addEventListener("mousedown", mouseDown, false);
	canvas.addEventListener("mousemove", mouseMove, false);
	canvas.addEventListener("mouseup", mouseUp, false);
	canvas.addEventListener("dblclick", dblClick, false);


	//アニメーション
	timer = setInterval(loop, 1000 / 30);
}



/*----------mouseDown関数----------*/

function mouseDown(e){
	e.preventDefault();

	if(e.type == "mousedown"){
		var rect = e.target.getBoundingClientRect();

		mouse.x = e.clientX - rect.left;
		mouse.y = e.clientY - rect.top;
	}
	else if(e.type == "touchstart"){
		mouse.x = e.layerX;
		mouse.y = e.layerY;
	}


	//ボールオブジェクトとクリック位置との相対位置を判定
	for(var i = 0; i < ballList.length; i++){
		var ball = ballList[i];

		var dx = mouse.x - ball.x;
		var dy = mouse.y - ball.y;

		var dist = Math.sqrt(dx * dx + dy * dy);


		//クリックした位置がオブジェクトの範囲内であればキャッチ処理
		if(dist < ball.radius){
			ball.isCatched = true;
			break;
		}
	}
}



/*----------mouseMove関数----------*/

function mouseMove(e){
	e.preventDefault();

	if(e.type == "mousemove"){
		var rect = e.target.getBoundingClientRect();

		mouse.x = e.clientX - rect.left;
		mouse.y = e.clientY - rect.top;
	}
	else if(e.type == "touchmove"){
		mouse.x = e.layerX;
		mouse.y = e.layerY;
	}


	//オブジェクトがキャッチ状態ならクリック位置と連動させる
	for(var i = 0; i < ballList.length; i++){
		var ball = ballList[i];

		if(ball.isCatched){
			ball.x = mouse.x;
			ball.y = mouse.y;
			break;
		}
	}
}



/*----------mouseUp関数----------*/

function mouseUp(e){
	e.preventDefault();


	//オブジェクトをキャッチしていたなら、オブジェクトを離し、オブジェクトは自由落下
	for(var i = 0; i < ballList.length; i++){
		var ball = ballList[i];

		if(ball.isCatched){
			ball.vx = ball.x - ball.oldX;
			ball.vy = ball.y - ball.oldY;

			ball.isCatched = false;
			break;
		}
	}
}



/*----------dblClick関数----------*/

function dblClick(e){
	e.preventDefault();

	var rect = e.target.getBoundingClientRect();

	mouse.x = e.clientX - rect.left;
	mouse.y = e.clientY - rect.top;


	//ダブルクリック位置がオブジェクトの範囲内だと削除処理、それ以外は生成処理
	for(var i = 0; i < ballList.length; i++){
		var ball = ballList[i];

		var dx = mouse.x - ball.x;
		var dy = mouse.y - ball.y;

		var dist = Math.sqrt(dx * dx + dy * dy);

		if(dist < ball.radius){
			//削除処理
			deleteBall(i);
			return;
		}
	}


	//生成処理
	makeBall(mouse.x, mouse.y);
	return;
}



/*----------makeBall関数----------*/

function makeBall(mouseX, mouseY){
	var ball = new Ball(mouseX, mouseY);

	ballList.push(ball);
}



/*----------deleteBall関数----------*/

function deleteBall(index){
	ballList.splice(index, 1);
}



/*----------loop関数----------*/

function loop(){
	ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
	ctx.fillRect(0, 0, width, height);


	//各オブジェクト同士の衝突判定処理（配列で隣同士のオブジェクトを比較）
	for(var i = 0; i < ballList.length - 1; i++){
		var ball_A = ballList[i];

		for(var j = i + 1; j < ballList.length; j++){
			var ball_B = ballList[j];

			var dx = ball_B.x - ball_A.x;
			var dy = ball_B.y - ball_A.y;

			var dist = Math.sqrt(dx * dx + dy * dy);
			var minDist = ball_A.radius + ball_B.radius;


			if(dist < minDist){
				//オブジェクト同士が衝突していれば反発処理
				var angle = Math.atan2(dy, dx);

				var tx = ball_A.x + Math.cos(angle) * minDist;
				var ty = ball_A.y + Math.sin(angle) * minDist;

				var ax = (tx - ball_B.x) * options.spring;
				var ay = (ty - ball_B.y) * options.spring;


				ball_A.vx -= ax;
				ball_A.vy -= ay;

				ball_B.vx += ax;
				ball_B.vy += ay;
			}
		}
	}


	//Ballオブジェクトを走らせる
	for(var i = 0; i < ballList.length; i++){
		var ball = ballList[i];

		ball.update();
		ball.draw();
	}
}



/*----------Ballクラス----------*/

var Ball = function(mouseX, mouseY){
	this.diameter = Math.floor(Math.random() * (ballMaxWidth - ballMinWidth + 1)) + ballMinWidth;

	this.width = this.diameter;
	this.height = this.diameter;


	//引数が渡されていなければデフォルト値を使用
	if(!mouseX && !mouseY){
		this.x = Math.floor(Math.random() * (width - this.width * 0.5) + this.width * 0.5);
		this.y = Math.floor(Math.random() * (height - this.height * 0.5) + this.height * 0.5);
	}

	if(mouseX && mouseY){
		this.x = mouseX;
		this.y = mouseY;
	}

	this.oldX = 0;
	this.oldY = 0;

	this.vx = Math.random() * 6 - 3;
	this.vy = Math.random() * 6 - 3;

	this.radius = this.diameter * 0.5;
	this.isCatched = false;
	this.color = this.getRandomColor();
}

Ball.prototype = {
	update: function(){
		this.oldX = this.x;
		this.oldY = this.y;


		//摩擦処理
		this.vx *= options.friction;
		this.vy *= options.friction;


		//重力処理
		this.vy += options.gravity;


		//キャッチされていなければ自由落下
		if(!this.isCatched){
			this.x += this.vx;
			this.y += this.vy;
		}


		//画面外に出ないように設定（端にぶつかったら跳ね返り処理）
		if((this.x + this.radius) > width){
			this.x = width - this.radius;
			this.vx *= options.bounce;
		}

		if((this.x - this.radius) < 0){
			this.x = this.radius;
			this.vx *= options.bounce;
		}

		if((this.y + this.radius) > height){
			this.y = height - this.radius;
			this.vy *= options.bounce;
		}
	},

	getRandomColor: function(){
		var h = Math.floor(Math.random() * 360);
		return "hsla(" + h + ", 85%, 60%, 1)";
	},

	draw: function(){
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		ctx.fill();
	}
}