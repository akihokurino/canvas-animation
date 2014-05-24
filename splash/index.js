// JavaScript Document

/*----------グローバル変数定義----------*/

var ctx;

var centerX;
var centerY;

var isMouseDown = false;

var particlesList = [];
var particlesNum = 200;

var drawItems = {};

var n = 18;

var timer;



/*----------初期処理----------*/

window.onload = function(){
    var canvas = document.getElementById("canvas");


    //画面調整
    canvas.width = width = 900; //window.innerWidth;
    canvas.height = height = 500; //window.innerHeight;

    ctx = canvas.getContext("2d");

    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter';


    centerX = width / 2;
    centerY = height / 2;


    //アニメーション
    timer = setInterval(anime, 1000 / 60);
}



/*----------anime関数----------*/

function anime(){
    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.shadowBlur = 0;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();


    //Particleオブジェクト生成
    for(var i = 0; i < particlesNum; i++){
        particlesList.push(new Particle(8,  30));
    }

    var drawItems = {};


	//Particleオブジェクトを走らせる
    for(var i = 0; i < particlesList.length; i++){
        var particle = particlesList[i];


        particle.update();


        //画面外に出たら削除処理
        if(particle.x > width + 50 || particle.x < -50 || particle.y > height + 50 || particle.y < -50){
            particlesList.splice(i, 1);
            particlesList.length--;
            i--;
        }
        else{
            if(!drawItems[particle.hue]){
                drawItems[particle.hue] = [];
            }

            drawItems[particle.hue].push(particle);
        }
    }


	//描画処理
    for(var hue in drawItems){
        var item = drawItems[hue];

        ctx.fillStyle = "hsla(" + hue + ", 100%, 50%, 1)";
        ctx.beginPath();

        for(var i = 0; i < item.length; i++){
            particle = item[i];

            ctx.moveTo(particle.x + particle.radius, particle.y);
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2, true);
        }

        ctx.fill();
    }
}



/*----------Particleクラス----------*/

var Particle = function(x, y){
    this.x = width / 2;
    this.y = height / 2;

    var v = Math.random() * 5 + x;
    var r = Math.random() * Math.PI * 2;

    this.vx = v * Math.cos(r);
    this.vy = v * Math.sin(r);

    this.hue = Math.floor(Math.random() * (n + 1)) * 360 / n;

    this.radius = (Math.random() * 20 + y) * 0.1;
}

Particle.prototype.update = function(){
    this.vy += 0.5;

    this.x += this.vx;
    this.y += this.vy;

    this.radius -= 0.1;

    if(this.radius < 0){
        this.radius = 0;
    }
}
