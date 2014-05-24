var ctx;
var width;
var height;
var fish_list = [];
var food_list = [];
var fish_num = 200;

window.onload = function(){
	var canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");

	canvas.width = width = 1000;
	canvas.height = height = 700;

	init();
	setInterval(frame, 30);

	canvas.addEventListener("mousedown", createFood, false);
}

function init(){
	for(var i = 0; i < fish_num; i++){
		var pt = new Point(Math.floor(Math.random() * width), Math.floor(Math.random() * height));
		var fish = new Fish(pt);
		fish_list.push(fish);
	}
}

function createFood(e){
	var rect = e.target.getBoundingClientRect();
	var x = e.clientX - rect.left;
	var y = e.clientY - rect.top;
	var pt = new Point(x, y);
	var food = new Food(pt);
	food.render();
	food_list.push(food);
}

function frame(){
	ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
	ctx.fillRect(0, 0, width, height);

	for(var i = 0; i < fish_list.length; i++){
		var fish = fish_list[i];
		fish.update();
		fish.render();
	}

	for(var i = 0; i < food_list.length; i++){
		var food = food_list[i];
		food.render();
	}
}

var Point = function(x, y){
	this.x = x;
	this.y = y;
}

var Fish = function(pt){
	this.pt = pt;
	this.vel = new Point(Math.floor(Math.random() * 20) - 10, Math.floor(Math.random() * 10) - 5);
	this.acc = new Point(0, 0);
	this.radius = 3;
	this.color = "#FF1D00";
}

Fish.prototype = {
	update: function(){
		var tmp_distination = 10000;
		var tmp_dx = 0;
		var tmp_dy = 0;

		for (var i = 0; i < food_list.length; i++) {
			var food = food_list[i];
			var dx = food.pt.x - this.pt.x;
			var dy = food.pt.y - this.pt.y;
			var distination = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
			if (tmp_distination > distination) {
				tmp_distination = distination;
				tmp_dx = dx;
				tmp_dy = dy;
			}
		}
		this.acc.x = tmp_dx / 450;
		this.acc.y = tmp_dy / 450;

		this.vel.x += this.acc.x;
		this.vel.y += this.acc.y;

		this.filter();

		this.pt.x += this.vel.x;
		this.pt.y += this.vel.y;

		this.checkCollision();
	},
	render: function(){
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(this.pt.x, this.pt.y, this.radius, 0, Math.PI * 2, false);
		ctx.fill();
	},
	filter: function(){
		var current_speed = Math.sqrt(Math.pow(this.vel.x, 2) + Math.pow(this.vel.y, 2));
		var maxSpeed = 15;
		if(current_speed > maxSpeed){
			this.vel.x *= maxSpeed / current_speed;
			this.vel.y *= maxSpeed / current_speed;
		}
	},
	checkCollision: function(){
		for(var i = 0; i < food_list.length; i++){
			var food = food_list[i];
			var dx = food.pt.x - this.pt.x;
			var dy = food.pt.y - this.pt.y;
			var distination = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
			var min_distination = this.radius + food.radius;

			if(distination < min_distination){
				this.vel.x *= -1;
				this.vel.y *= -1;
				this.eat(food, i);
			}
		}
	},
	eat: function(food, index){
		food.radius -= 0.3;
		if(food.radius < 10){
			food_list.splice(index, 1);
		}
	}
}

var Food = function(pt){
	this.pt = pt;
	this.radius = Math.floor(Math.random() * 100 + 10);
	this.color = "#333333";
}

Food.prototype = {
	render: function(){
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(this.pt.x, this.pt.y, this.radius, 0, Math.PI * 2, false);
		ctx.fill();
	}
}