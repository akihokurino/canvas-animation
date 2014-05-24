// JavaScript Document

/*----------グローバル変数定義----------*/

var particleNum = 3000;

var mouseX = 0;
var mouseY = 0;

var first;
var old;

var ctx;

var width;
var height;

var hue = 1;



/*----------初期処理----------*/

window.onload = function(){
    var canvas = document.getElementById("canvas");


	//画面調整
    canvas.width = width = 900; //window.innerWidth;
    canvas.height = height = 500; //window.innerHeight;

    ctx = canvas.getContext("2d");
	ctx.fillStyle = "#fff";
	ctx.fillRect(0, 0, width, height);


    //Particleオブジェクト生成
    for(var i = 0; i < particleNum; i++){
        var particle = new Particle(Math.random() * width, Math.random() * height);


		//CPC負荷軽減のためLinked Listを使用
        if(first == null){
            first = old = particle;
        }
        else{
            old.next = particle;
            old = particle;
        }
    }


    //マウス操作処理
    canvas.addEventListener("touchmove", mouseMove, false);
    canvas.addEventListener("mousemove", mouseMove, false);


    //アニメーション
    setInterval(loop, 1000 / 60);
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
    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    ctx.fillRect(0, 0, width, height);


    //Linked List
	var n = first;

    do{
		//Particleオブジェクトを走らせる
        n.update();


		//描画処理
        n.draw();
    }
    while(n = n.next);
}



/*----------Particleクラス----------*/

var Particle = function(x, y){
    this.x = x;
    this.y = y;

    this.vx = 0;
    this.vy = 0;

    this.hue = hue;

    this.next = null;
}

Particle.prototype.update = function(){
    var diffX = mouseX - this.x;
    var diffY = mouseY - this.y;

    var acc = 50 / (diffX * diffX + diffY * diffY);

    var accX = acc * diffX;
    var accY = acc * diffY;

    this.vx += accX;
    this.vy += accY;


	//値の更新処理
    this.x += this.vx;
    this.y += this.vy;


	//摩擦処理
    this.vx *= 0.96;
    this.vy *= 0.96;


	//色の更新
    this.hue += 1;


	//画面外に出ないように設定
    if(this.x > width){
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

Particle.prototype.draw = function(){
    ctx.fillStyle = "hsla(" + this.hue + ", 100%, 65%, 1)";
    ctx.fillRect(this.x, this.y, 1, 1);
}

