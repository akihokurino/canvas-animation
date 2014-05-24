// JavaScript Document

/*----------グローバル関数定義----------*/

var ctx;
var mouseX;
var mouseY;

var fires = [];

var width;
var height;

var isMouseDown = false;



/*----------初期処理----------*/

window.onload = function(){
    var canvas = document.getElementById("canvas");


    //画面調整
    canvas.width = width = 900; //window.innerWidth;
    canvas.height = height = 500; //window.innerHeight;

    ctx = canvas.getContext("2d");
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, width, height);


    mouseX = width / 2;
    mouseY = height / 2;


    //マウス操作処理
    canvas.addEventListener("touchstart", mouseDown, false);
    canvas.addEventListener("touchmove", mouseMove, false);

    canvas.addEventListener("mousemove", mouseMove, false);
    canvas.addEventListener("mousedown", mouseDown, false);


    //アニメーション
    setInterval(anime, 1000 / 30);
}



/*----------mouseMove関数----------*/

function mouseMove(e){
    e.preventDefault();

    if(isMouseDown){
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
}



/*----------mouseDown関数----------*/

function mouseDown(e){
    e.preventDefault();

    isMouseDown = !isMouseDown;
}



/*----------anime関数----------*/

function anime(){
    //画面の塗りつぶし
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(0, 0, 0, 0.02)";
    ctx.fillRect(0, 0, width, height);


    //色の加算設定
    ctx.globalCompositeOperation = "lighter";


	//Fireオブジェクトの生成
    for(var i = 0; i < 10; i++){
        fires.push(new Fire(mouseX, mouseY));
    }


	//Fireオブジェクトを走らせる
    for(var i = 0; i < fires.length; i++){
		var fire = fires[i];


		//更新処理
        fire.update();


		//サイズが１より小さくなったら削除処理
        if(fire.size < 1){
            fires.splice(i, 1);
            continue;
        }


		//描画処理
		fire.draw();
    }

}



/*----------Fireクラス----------*/

var Fire = function(x, y){
    this.x = x;
    this.y = y;
    this.vx = Math.random() * 10 - 5;
    this.vy = Math.random() * 10 - 7;

    this.size = Math.random() * 35 + 20;

    this.r = Math.floor(Math.random() * 0.5 * 255);
    this.g = Math.floor(Math.random() * 0.5 * 255);
    this.b = Math.floor(Math.random() * 128 + 127);

    this.cx = x;
}

Fire.prototype.update = function(){
    this.x += this.vx;
    this.y += this.vy;
    this.vy -= 0.4;
    this.vx += (this.cx - this.x) / this.size / 2;
    this.size -= 1.3;
}

Fire.prototype.draw = function(){
    var edgeColor1 = "rgba(" + this.r + "," + this.g + "," + this.b + "," + (this.size / 40) + ")";
    var edgeColor2 = "rgba(" + this.r + "," + this.g + "," + this.b + ",0)";

    var gradblur = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
    gradblur.addColorStop(0, edgeColor1);
    gradblur.addColorStop(1, edgeColor2);

	ctx.beginPath();
    ctx.fillStyle = gradblur;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fill();
}
