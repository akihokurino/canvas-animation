// JavaScript Document

/*----------グローバル変数定義----------*/

var boidList = []

var boidNum = 100;

var ctx;

var width;
var height;

var count = 0;



/*----------初期処理----------*/

window.onload = function(){
    var canvas = document.getElementById("canvas");


	//画面調整
    canvas.width = width = 900; //window.innerWidth;
    canvas.height = height = 500; //window.innerHeight;

    ctx = canvas.getContext('2d');
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, width, height);


	//Voidオブジェクト生成
    for(var i = 0; i < boidNum; i++){
        var boid = new Boid();

		//描画処理
        boid.draw(boid.x, boid.y);

        boidList.push(boid);
    }


	//アニメーション
    setInterval(loop, 10);
}



/*----------loop関数----------*/

function loop() {
    //カウントの初期化
    if(count > 19){
        count = 0;
    }


	//Boidオブジェクトを走らせる
    for(var i = 0; i < boidList.length; i++){
        var boid = boidList[i];

        boid.update();
    }
}



/*----------Boidクラス----------*/

var Boid = function(){
    this.x = width / 2;
    this.y = height / 2;

    this.vx = Math.random() - 0.5;
    this.vy = Math.random() - 0.5;

    this.deg = 0;

    this.delta = Math.random();
}

Boid.prototype.update = function(){
	//値の更新処理
    this.x += this.vx;
    this.y += this.vy;


	//ひねり値の更新
    this.deg += this.delta;


	//画面外に出た時の処理
    if(this.x < 0 || this.x > width){
		//方向を反転させる
        this.vx *= -1;


		//delta値の変更
        this.delta = Math.random();


		//count値の更新
		count++;
    }

    if(this.y < 0 || this.y > height){
		//方向を反転させる
        this.vy *= -1;


		//delta値の変更
        this.delta = Math.random();


		//count値の更新
		count++;
    }


	//移動処理、ひねり処理
    ctx.translate(this.x + 10, this.y + 10);
    ctx.rotate(this.deg * Math.PI / 180);


	//描画処理
    this.draw(0, 0);


	//移動処理・ひねり処理（値を戻す処理）
    ctx.rotate(this.deg * -1 * Math.PI / 180);
    ctx.translate(-1 * (this.x + 10), -1 * (this.y + 10));
}

Boid.prototype.draw = function(x, y){
	//count変数によって色を分岐する
	switch(count){
		case 0:
		case 1:
		case 2:
		case 3:
		case 4:
		case 5:
		case 6:
		case 7:
		case 8:
		case 9:
			ctx.fillStyle = "#000000";
			break;

		case 10:
		case 11:
		case 12:
		case 13:
		case 14:
		case 15:
		case 16:
		case 17:
		case 18:
		case 19:
			ctx.fillStyle = "#ffffff";
			break;
	}


	//描画処理
    ctx.fillRect(x, y, 20, 1);
}
