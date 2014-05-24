// JavaScript Document

/*----------グローバル変数定義----------*/

var ctx;

var width;
var height;

var image;
var data;

var boids = [];

var mouseX;
var mouseY;



/*----------初期処理----------*/

window.onload = function(){
    var canvas = document.getElementById("canvas");


    //画面調整
    canvas.width = width = 900; //window.innerWidth;
    canvas.height = height = 500; //window.innerHeight;
    canvas.setAttribute("style", "background:black");

    ctx = canvas.getContext("2d");
	ctx.fillStyle = "#fff";
	ctx.fillRect(0, 0, width, height);

	mouseX = canvas.width / 2;
	mouseY = canvas.height / 2;


    //マウス処理
    canvas.addEventListener("mousedown", mouseDown, false);
    //canvas.addEventListener("mousemove",mouseMove, false);


    //Boidオブジェクト生成
    for(var i = 0; i < 50; i++){
        boids.push(
			new Boid(mouseX + randfloat(5), mouseY + randfloat(5), Math.random() * 360 * Math.PI / 180)
		);
    }


    //アニメーション
    setInterval(loop, 2000 / 60);
}



/*----------mouseDown関数----------*/

function mouseDown(e){
	var rect = e.target.getBoundingClientRect();

    mouseX = e.clientX - rect.left;
	mouseY = e.clientY - rect.top;


    //Boid作成
    for(var i = 0; i < 50; i++){
        boids.push(
			new Boid(mouseX + randfloat(5), mouseY + randfloat(5), Math.random() * 360 * Math.PI / 180)
		);
    }
}



/*----------mouseMove関数----------*/

/*
function mouseMove(e){
    mouseX = e.clientX;
    mouseY = e.clientY;

    //Boid作成
    for(var i = 0; i < 50; i++){
        boids.push(newBoid());
    }
}
*/



/*----------loop関数----------*/

function loop(){
	/*
    image = ctx.getImageData( 0, 0, width, height );
    data = image.data;
	*/


	//Boidオブジェクトを走らせる
    for(var i = 0; i < boids.length; i++){
	    var boid = boids[i];

	    boid.update();

	    if(!boid.dead && Math.random() > 0.85 && boids.length < 300){
			//Boidを枝分かれさせる（新しいBoidオブジェクトを作成）
		    boids.push(
				new Boid(boid.x, boid.y, (Math.random() > 0.5 ? 90 : - 90) * Math.PI / 180 + boid.angle)
			);
	    }
    }
}



/*----------randfloat関数----------*/

function randfloat(num){
    return Math.random() * num - num * 0.5;
}



/*----------Boidクラス----------*/

var Boid = function (x, y, angle){
    this.x = x;
    this.y = y;

    this.angle = Math.pow(Math.random() * 10, 180) + angle;

    this.dx = Math.cos(this.angle);
    this.dy = Math.sin(this.angle);

    this.life = Math.random() * 100 + 100;
    this.dead = false;
}

Boid.prototype.update = function(){
    //描画処理
	ctx.strokeStyle = 'red';
	ctx.beginPath();
	ctx.moveTo(this.x, this.y);


	//座標更新
	this.x += this.dx * 2;
	this.y += this.dy * 2;

	this.life -= 2;

	ctx.lineTo(this.x, this.y);
	ctx.stroke();

	//var index = (Math.floor(this.x) + width * Math.floor(this.y)) * 4;


    //削除処理
    if(this.life <= 0){
        this.kill();
    }
	/*
    if(data[ index + 3 ] > 0){
        this.kill();
    }
	*/

    if(this.x < 0 || this.x > width || this.y < 0 || this.y > height){
        this.kill();
    }
}

Boid.prototype.kill = function(){
    //削除処理
	boids.splice(boids.indexOf(this), 1);
    this.dead = true;
}

