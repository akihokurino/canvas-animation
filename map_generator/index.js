// JavaScript Document

/*----------グローバル変数定義----------*/

var ctx;

var FPS = 60;
var hue = 210;
var fromTop = 5;

var image;
var data;

var boidList = [];

var width;
var height;

var centerX;
var centerY;

var count = 0;

var isMouseDown = false;
var timer;



/*----------初期処理----------*/

window.onload = function(){
    var canvas = document.getElementById("canvas");


    //画面調整
    canvas.width = width = 900; //window.innerWidth;
    canvas.height = height = 500; //window.innerHeight;

    centerX = canvas.width / 2;
    centerY = canvas.height / 2;

    ctx = canvas.getContext("2d");
	/*
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, width, height);
	*/


    //マウス操作処理
    canvas.addEventListener("mousedown", mouseDown, false);


    //Boidオブジェクト生成
    boidList.push(new Boid(centerX, centerY, Math.random() * 360 * Math.PI / 180));


    //アニメーション
    //setInterval(anime, 1000 / FPS);
    anime();
}



/*----------mouseDown関数----------*/

function mouseDown(){
	isMouseDown = !isMouseDown;

	if(isMouseDown){
		clearTimeout(timer);
	}
	else{
		anime();
	}
}



/*----------anime関数----------*/

function anime(){
	//canvas上の画像イメージを取得
    image = ctx.getImageData(0, 0, width, height);
    data = image.data;


	//Boidオブジェクトを走らせる
    for(var i = 0; i < boidList.length; i++){
        var boid = boidList[i];

        boid.update();


		//deadプロパティがfalseの状態かつ1/2の確率でBoidを分岐させる
        if(!boid.dead && Math.random() > 0.5 && boidList.length < 1000){
            boidList.push(new Boid(boid.x, boid.y,
                                (Math.random() > 0.5 ? 90 : -90) * Math.PI / 180 + boid.angle));
        }
    }

    count++;

    if(count > 150){
		//初期化処理
        /*
        setInterval(function(){
            ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
            ctx.fillRect(0, 0, width, height);
        },100);
        */
        /*
        ctx.fillStyle = "rgba(0, 0, 0, 1)";
        ctx.fillRect(0, 0, width, height);
        */

        ctx.clearRect(0, 0, width, height);


		//色の更新処理
        hue += 50;


		//配列を空にする
        boidList = [];


		//カウントを初期化
        count = 0;


		//新規のBoidオブジェクトを生成
        boidList.push(new Boid(centerX, centerY, Math.random() * 360 * Math.PI / 180));
        //anime();
    }

    timer = setTimeout(anime, 1000 / FPS);
}



/*----------Boidクラス----------*/

var Boid = function(x, y, angle){
    this.x = x;
    this.y = y;

    this.angle = Math.pow(Math.random(), 30) + angle;

    this.dx = Math.cos(this.angle);
    this.dy = Math.sin(this.angle);

    this.life = Math.random() * 100 + 100;
    this.dead = false;
    this.color = "hsla(" + hue + ", 100%, 60%, 1)";
}

Boid.prototype.update = function(){
	ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.moveTo(this.x, this.y);


	//値の更新処理
    this.x += this.dx * fromTop;
    this.y += this.dy * fromTop;

    this.life -= 2;

    ctx.lineTo(this.x, this.y);
    ctx.stroke();

    var index = (Math.floor(this.x) + width * Math.floor(this.y)) * 4;

    if(this.life <= 0 || data[index + 3] > 0 ||
       (this.x < 0 || this.x > width) ||
        (this.y < 0 || this.y > height)){
        this.kill();
    }
}

Boid.prototype.kill = function(){
	//Boid削除処理
    boidList.splice(boidList.indexOf(this), 1);
    this.dead = true;
}
