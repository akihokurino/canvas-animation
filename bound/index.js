var ctx;
var balls = [];
var width, height;
var ballMaxWidth = 120;
var ballMinWidth = 50;
var options = {
	bounce: -0.9,
	gravity: 4,
	friction: 1
};

window.onload = function(){
	var canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	canvas.width = width = 900;
	canvas.height = height = 500;

	canvas.addEventListener("mousedown", create, false);

	setInterval(frame, 1000 / 30);
}

function frame(){
	ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
	ctx.fillRect(0, 0, width, height);

	for(var i = 0; i < balls.length; i++){
		var ball = balls[i];
		ball.update();
		ball.render();
	}
}

function create(e){
	var rect = e.target.getBoundingClientRect();
	var x = e.clientX - rect.left;
	var y = e.clientY - rect.top;

	var ball = new Ball(x, y);
	balls.push(ball);
}

function Ball(x, y){
	var diameter = Math.floor(Math.random() * (ballMaxWidth - ballMinWidth + 1)) + ballMinWidth;
	this.width = diameter;
	this.height = diameter;
	this.radius = diameter * 0.5;
	this.color = this.getRandomColor();
	this.vx = 50;
	this.vy = Math.random() * 6 - 3;
	this.x = x;
	this.y = y;
}

Ball.prototype = {
	update: function(){
		this.vy *= options.friction;
		this.vx *= options.friction;

		this.vy += options.gravity;

		this.y += this.vy;
		this.x += this.vx;

		if((this.y + this.radius) > height){
			this.y = height - this.radius;
			this.vy *= options.bounce;
			this.vx *= 0.7;
		}

		if((this.x + this.radius) >= width){
			this.x = width - this.radius;
			console.log(this.x);
			this.vx *= options.bounce;
		}

		if((this.x - this.radius) < 0){
			console.log("test");
			this.x = this.radius;
			this.vx *= options.bounce;
		}
	},
	getRandomColor: function(){
		var h = Math.floor(Math.random() * 360);
		return "hsla(" + h + ", 85%, 60%, 1)";
	},
	render: function(){
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		ctx.fill();
	}
}