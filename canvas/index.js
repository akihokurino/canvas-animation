// JavaScript Document

/*----------グローバル変数定義----------*/

var DEFAULT_BRUSH_SIZE = 60;
var INK_AMOUNT = 10;
var SPLASH_RANGE = 75;
var SPLASH_INK_SIZE = 10;

var ctx;

var brush;

var mouse = { x: 0, y: 0 };
var isMouseDown = false;

var width;
var height;



/*----------初期処理----------*/

window.onload = function() {
    var canvas = document.getElementById('canvas');


    //画面調整
    canvas.width = width = 900; //window.innerWidth;
    canvas.height = height = 500; //window.innerHeight;

    ctx = canvas.getContext("2d");


    //Brushクラスのインスタンス生成
    brush = new Brush(width * 0.5, height * 0.5, DEFAULT_BRUSH_SIZE,
                      				INK_AMOUNT, SPLASH_RANGE, SPLASH_INK_SIZE);


    //マウス操作処理
    canvas.addEventListener("touchstart", mouseDown, false);
    canvas.addEventListener("touchmove", mouseMove, false);
    canvas.addEventListener("touchend", mouseUp, false);

    canvas.addEventListener("mousedown", mouseDown, false);
    canvas.addEventListener("mousemove", mouseMove, false);
    canvas.addEventListener("mouseup", mouseUp, false);


    //アニメーション
    setInterval(function(){
        brush.render(ctx, mouse.x, mouse.y);
    }, 1000 / 60);
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

    brush.startStroke();
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
}



/*----------mouseUp関数----------*/

function mouseUp(){
    brush.endStroke();
}



/*----------clamp関数----------*/

function clamp(n, max, min){
	//３つの引数をソートし、真ん中の値を返す
	if(n > max){
		return max;
	}
	else if(n < min){
		return min;
	}
	else{
		return n;
	}
}



/*----------random関数----------*/

function random(max, min) {
    if (typeof max !== 'number'){
        return Math.random();
    }
    else if (typeof min !== 'number'){
        min = 0;
    }
    return Math.random() * (max - min) + min;
}



/*----------Brushクラス----------*/

function Brush(x, y, size, inkAmount, splashRange, splashInkSize){
    this.x = x;
    this.y = y;
    this.size = size;
    this.inkAmount = inkAmount;
    this.splashRange = splashRange;
    this.splashInkSize = splashInkSize;

    this.color = {
        h: 0, s: 80, l: 50, a: 1,
        toString: function() {
            return 'hsla(' + this.h + ', ' + this.s + '%, ' + this.l + '%, ' + this.a + ')';
        }
    };

    this.resetTip();

    this._drops = [];
}

Brush.prototype = {
    isStroke: false,
    strokeId: null,
    latest: null,
    strokeRenderCount: 0,
    dropCount: 0,
    _hairs: null,
    latestStrokeLength: 0,


    //書き始め処理
    startStroke: function(){
        this.resetTip();
        this.strokeId = new Date().getTime();
        this.dropCount = random(6, 3) | 0;
        this.isStroke = true;
    },


    //書き終わり処理
    endStroke: function(){
        this.isStroke = false;
        this.strokeRenderCount = 0;
        this.dropCount = 0;
        this.strokeId = null;
    },


	//Hairクラスのインスタンス作成
    resetTip: function(){
        var hairs = this._hairs = [];
        var inkAmount = this.inkAmount;
        var hairNum = this.size * 2;

        var range = this.size / 2;
        var rx;
        var ry;
        var c0;
        var x0;
        var y0;
        var c = random(Math.PI * 2);
        var cv;
        var sv;
        var x;
        var y;


        for (var i = 0;  i < hairNum; i++) {
            rx = random(range);
            ry = rx / 2;
            c0 = random(Math.PI * 2);
            x0 = rx * Math.sin(c0);
            y0 = ry * Math.cos(c0);
            cv = Math.cos(c);
            sv = Math.sin(c);
            x = this.x + x0 * cv - y0 * sv;
            y = this.y + x0 * sv + y0 * cv;
            hairs[i] = new Hair(x, y, 10, inkAmount);
        }


		//色の変更処理
        this.color.h += 140;
    },


	//描画処理
    render: function(ctx, mouseX, mouseY) {
        this.strokeRenderCount++;


		//strokeCountが120の倍数ごとにdropCountを追加
        if (this.strokeRenderCount % 120 === 0 && this.dropCount < 10) {
            this.dropCount++;
        }


		//このオブジェクトが最新の座標でなかったら、現在のマウスの位置が最新になる。
        if(!this.latest){
            this.latest = { x: mouseX, y: mouseY };
        }
        else{
            this.latest.x = this.x;
            this.latest.y = this.y;
        }


        this.x = mouseX;
        this.y = mouseY;


        //書き始めから書き終わりまでの瞬間の距離
        var dx = this.x - this.latest.x;
        var dy = this.y - this.latest.y;

        var dist = this.latestStrokeLength = Math.sqrt(dx * dx + dy * dy);

        var hairs = this._hairs;


        for(var i = 0;  i < hairs.length; i++){
            hairs[i].update(dx, dy, dist);
        }


        if(this.isStroke){
            var color = this.color.toString();

            for(var i = 0; i < hairs.length; i++){
                //描画処理
                hairs[i].draw(ctx, color);
            }


			//瞬間の距離が20を超えた場合
            if(dist > 20){
                //飛沫発生処理
                this.drawSplash(ctx, this.splashRange, this.splashInkSize);
            }
			//瞬間の距離が10より少なく、dropCountがある場合
            else if(dist && dist < 10 && random() < 0.085 && this.dropCount){
                //絵の具が垂れる処理
                this._drops.push(new Drop(this.x, this.y, random(this.size * 0.25, this.size * 0.1), color, this.strokeId));

                this.dropCount--;
            }
        }

        var drops = this._drops;

        for(var i = 0; i < drops.length; i++){
            var drop = drops[i];
            drop.update(this);
            drop.draw(ctx);


			//dropのlifeプロパティが0になったらそこで配列から削除
            if (drop.life < 0){
                drops.splice(i, 1);
            }
        }
    },


	//絵の具拭き取り処理
    removeDrop: function(){
        this._drops = [];
    },


    //飛沫生成処理
    drawSplash: function(ctx, range, maxSize){
        var num = random(12, 0);
        var c;
        var r;
        var x;
        var y;

        ctx.save();

        for(var i = 0; i < num; i++){
            r = random(range, 1);
            c = random(Math.PI * 2);
            x = this.x + r * Math.sin(c);
            y = this.y + r * Math.cos(c);


            //飛沫の描画処理
            ctx.fillStyle = this.color.toString();
            ctx.beginPath();
            ctx.arc(x, y, random(maxSize, 0) / 2, 0, Math.PI * 2, true);
            ctx.fill();
        }

        ctx.restore();
    }
}



/*----------Hairクラス----------*/

function Hair(x, y, lineWidth, inkAmount) {
    this.x = x || 0;
    this.y = y || 0;

    this.lineWidth = lineWidth;
    this.inkAmount = inkAmount;

    this.currentLineWidth = this.lineWidth;
    this.latest = { x: this.x, y: this.y };
}

Hair.prototype = {
	//更新処理
    update: function(strokeX, strokeY, strokeLength){
        this.latest.x = this.x;
        this.latest.y = this.y;

        this.x += strokeX;
        this.y += strokeY;

		//clamp関数でcurrentLineWidthの値を変え、瞬間の距離が大きければその分かすれやすくする
        var per = clamp(this.inkAmount / strokeLength, 1, 0);
        this.currentLineWidth = this.lineWidth * per;
    },


	//描画処理
    draw: function(ctx, color){
        ctx.save();


        //メイン描画処理
        ctx.lineCap = 'round';
        ctx.strokeStyle = color;
        ctx.lineWidth = this.currentLineWidth;
        ctx.beginPath();
        ctx.moveTo(this.latest.x, this.latest.y);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();

        ctx.restore();
    }
}



/*----------Dropクラス----------*/

function Drop(x, y, amount, color, strokeId){
    this.x = x || 0;
    this.y = y || 0;
    this.amount = random(amount, amount * 0.5);
    this.life = this.amount * 1.5;
    this.color = color;
    this.strokeId = strokeId;

    this.latest = { x: this.x, y: this.y };
}

Drop.prototype = {
    xrate: 0,

    update: function(brush){
        var dx = brush.x - this.x;
        var dy = brush.y - this.y;

        this.latest.x = this.x;
        this.latest.y = this.y;


		//左右に少しぶれながら下に流れていくように設定
        this.y += random(this.life * 0.5);
        this.x += this.life * this.xrate;
        this.life -= random(0.05, 0.01);

        if(random() < 0.03){
            this.xrate += random(0.03, - 0.03);
        }
        else if(random() < 0.05){
            this.xrate *= 0.01;
        }
    },


    //絵の具が垂れる描画
    draw: function(ctx) {
        ctx.save();

        ctx.lineCap = ctx.lineJoin = 'round';
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.amount + this.life * 0.3;
        ctx.beginPath();
        ctx.moveTo(this.latest.x, this.latest.y);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
        ctx.closePath();

        ctx.restore();
    }
}
