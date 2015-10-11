/*
	1.游戏在运行前，可以在GUI使用鼠标配置地图“墙壁”分布情况 //碰到各种Bug暂无实现
	2.在交互界面随时更改网格规模	//
	3.地图刷新帧率	//实现
	4.随机生成初始地图时的活细胞密度 //实现
	5.根据新配置重新刷新地图 //实现
*/
var g_speed = document.getElementById('speed').value;
var g_samsara;

function GameOfLife () {

	this.init = function (turns,width,height) {
		this.board = new Array(height);
		for (var x = 0; x < height; x++) {
			this.board[x] = new Array(width);
			for (var y = 0; y < width; y++) {
				this.board[x][y] = probability(Math.random(), document.getElementById('intensity').value); //Math.random生成0~1之间的随机数，probability代表着密集程度
			}
		}
		this.turns = turns;
	}

	//判断下一代生死
	this.nextGen = function() {
		this.boardNext = new Array(this.board.length);
		for (var i = 0; i < this.board.length; i++) {
			this.boardNext[i] = new Array(this.board[i].length);
		}
		for (var x = 0; x < this.board.length; x++) {
			for (var y = 0; y < this.board[x].length; y++) {
				var n = 0;
				for (var dx = -2; dx <= 2; dx++) {
						if (dx == 0){}
						else if (typeof this.board[x+dx] !== 'undefined'
								&& typeof this.board[x+dx][y] !== 'undefined'
								&& this.board[x+dx][y] == 1) {
							n++;
						}
				}
				for (var dy = -2; dy <= 2; dy++) {
						if (dy == 0){}
						else if (typeof this.board[y+dy] !== 'undefined'
								&& typeof this.board[x][y+dy] !== 'undefined'
								&& this.board[x][y+dy] == 1) {
							n++;
						}
				}
				var c = this.board[x][y];
				switch (n) {
					case 2:
						break;
					case 3:
						c = 1;
						break;
					default:
						c = 0;

				}
				this.boardNext[x][y] = c;
			}
		}
		this.board = this.boardNext.slice();
	}

	this.print = function(ctx,w,h) {
		if (!w)
			w = 10;
		if (!h)
			h = 10;
		for (var x = 0; x < this.board.length; x++) {
			var l = "";
			for (var y = 0; y < this.board[x].length; y++) {
				if (this.board[x][y] == 1)
					ctx.fillStyle = "green";
				else if (this.board[x][y] == 2)
					ctx.fillStyle = "red";
				else
					ctx.fillStyle = "white";
				ctx.fillRect(y*h,x*w,h,w);
			}
		}
	}

	this.start = function(ctx,w,h) {
		for (var t = 0; t < this.turns; t++) {
			this.print(ctx,w,h);
			this.nextGen()
		}
	}

}

/*
	w,h 细胞的大小
*/
function run(game,ctx,w,h) {
	game.print(ctx,w,h);
	game.nextGen();
	return 0;
}


function init() {
	//申请全局类
	random = new GameOfLife();
	random.init(null,400,400);
	random.canvas = document.getElementById('random');
	if (random.canvas.getContext) {
   		random.ctx = random.canvas.getContext('2d');
	} else {
		return 1;
	}
	
	//周期调用周期函数
	//g_samsara = setInterval(function(){run(random,random.ctx,5,5)}, g_speed);
	run(random,random.ctx,10,10);
	
	return 0;
}

function changeSpeed()
{
	g_speed = document.getElementById('speed').value;
	clearInterval(g_samsara);
	g_samsara = setInterval(function(){run(random,random.ctx,10,10)}, g_speed);
}

function pause()
{
	clearInterval(g_samsara);
}

/*
function drawWall()
{
	var canvas = random.canvas;
	canvas.addEventListener("click", function (evt) { 
		var mousePos = getMousePos(canvas, evt); 
	//	alert(mousePos.x +',' + mousePos.y); 
		random.board[mousePos.x][mousePos.y] = 2;
	//	alert(random.board[mousePos.x][mousePos.y]);
	}, false); 
	
	return 0;
}
*/

 //Get Mouse Position 
 function getMousePos(canvas, evt) { 
   var rect = canvas.getBoundingClientRect(); 
   return { 
     x:  Math.floor(evt.clientX - rect.left * (canvas.width / rect.width)),
     y:  Math.floor(evt.clientY - rect.top * (canvas.height / rect.height))
   }
 }	
 
 function probability(num, prob)
 {
	 if(num * 100 < prob) 
		 return 1
	 else 
		 return 0
 }
 
 function re_init() {
	 document.getElementById('intensity').value = 50;
	 document.getElementById('speed').value = 250;
	
	return 0;
}