// JavaScript Document

/*----------グローバル変数定義----------*/

var ctx;
var width;
var height;

var boidNum = 100;
var sdist = 250;
var speed = 3;
var boidList = [];
var radius = 6;



/*----------初期処理----------*/

window.onload = function(){
    var canvas = document.getElementById("canvas");

    canvas.width = width = 900; //window.innerWidth;
    canvas.height = height = 500; //window.innerHeight;

    ctx = canvas.getContext("2d");
	ctx.fillStyle = "#fff";
	ctx.fillRect(0, 0, width, height);


    //Boid作成
    for(var i = 0; i < boidNum; i++){
        var x = Math.random() * width;
        var y = Math.random() * height;
        var dire = Math.random() * 2 * Math.PI;
        var dx = Math.cos(dire) * speed;
        var dy = Math.sin(dire) * speed;
        boidList.push(new Boid(i, x, y, dx, dy));
    }


    //マウス操作処理
    canvas.addEventListener("mousedown", mouseDown, false);
    canvas.addEventListener("dblclick", dblClick, false);


    //アニメーション
    loop();
}



/*----------mouseDown関数----------*/

function mouseDown(){
	//オブジェクトの半径値を更新
    radius += 5;
}



/*----------dblClick関数----------*/

function dblClick(){
    radius -= 5;
}



/*----------loop関数----------*/

function loop(){
    var _loop = function(){


		//オブジェクトを走らせる
        for(var i = 0; i < boidList.length; i++){
            var boid = boidList[i];
            boid.update();
            boid.draw();
        }

        setTimeout(_loop, 1000 / 60);
    };

    setTimeout(_loop, 1000 / 60);
}



/*----------Pointクラス----------*/

var Boid = function(i, x, y, dx, dy){
    this.id = i;
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.color = "hsla(" + Math.random() * 360 + ", 100%, 65%, 1)";
}

Boid.prototype.update = function(){
    //移動処理
    this.x += this.dx;
    this.y += this.dy;


    //画面外に出ないように設定
    if(this.x < 0){
        this.x = width;
    }

    if(this.x > width){
        this.x = 0;
    }

    if(this.y < 0){
        this.y = height;
    }

    if(this.y > height){
        this.y = 0;
    }


    for(var i = 0; i < boidNum; i++){
		//自身以外のオブジェクトを操作する
        if(this.id !== i){
			//自身と他のオブジェクトとの距離を求める
            var diffX1 = this.x - boidList[i].x;
            var diffY1 = this.y - boidList[i].y;

            var dist = Math.sqrt(Math.pow(diffX1, 2) + Math.pow(diffY1, 2));


			//他のオブジェクトと自身の距離を求める
            var diffX2 = boidList[i].x - this.x;
            var diffY2 = boidList[i].y - this.y;

            var dire = Math.atan2(diffY2, diffX2);


			//自身とオブジェクトとの距離が200以上300未満だった場合
            if(dist > 200 && dist < 300){
                this.dx += Math.cos(dire) * 0.2;
                this.dy += Math.sin(dire) * 0.2;
            }


			//自身とオブジェクトとの距離が100以上200未満だった場合
            if(dist < 200 && dist > 100){
                this.dx += boidList[i].dx * 0.1;
                this.dy += boidList[i].dy * 0.1;
            }


			//自身とオブジェクトとの距離が100未満だった場合
            if(dist < 100){
                this.dx += Math.cos(dire + Math.PI) * 0.4;
                this.dy += Math.sin(dire + Math.PI) * 0.4;
            }
        }
    }

    var dd = Math.sqrt(Math.pow(this.dx, 2) + Math.pow(this.dy, 2));
    this.dx = this.dx / dd * speed;
    this.dy = this.dy / dd * speed;
}

Boid.prototype.draw = function(){
	//描画処理
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, Math.random() * radius, 0, Math.PI * 2, false);
    ctx.stroke();
    ctx.fill();
}
