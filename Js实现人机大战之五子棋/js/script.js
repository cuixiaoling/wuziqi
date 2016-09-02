
var chess = document.getElementById('chess');
var context = chess.getContext('2d')//获取上下文，必须的嘛？
var chessBoard = [];//定义二维数组，
var me = true;//设置表识符,目的切换黑白棋子
var over =false;//棋有没有结束

//**赢法数组,三维数组，棋盘，最后一个代表第几种赢法
var wins=[];
//赢法的统计数组
var myWin =[];
var computerWin=[];

for(var i=0;i<15;i++){
	chessBoard[i]=[];
	for(var j=0;j<15;j++){
		chessBoard[i][j]=0;
	}
}
//三维数组初始化
for(var i=0;i<15;i++){
	wins[i]=[];
	for(var j=0;j<15;j++){
		wins[i][j] = [];
	}
}
var count =0;
for(var i=0;i<15;i++){
	for(var j=0;j<11;j++){//所有横线
		for(var k=0;k<5;k++){
			wins[i][j+k][count] = true;
		}
		count++;
	}
}
for(var i=0;i<15;i++){
	for(var j=0;j<11;j++){//所有竖线
		for(var k=0;k<5;k++){
			wins[j+k][i][count] = true;

		}
		count++;
	}
}
for(var i=0;i<11;i++){
	for(var j=0;j<11;j++){//所有斜线
		for(var k=0;k<5;k++){
			wins[i+k][j+k][count] = true;
		}
		count++;
	}
}
for(var i=0;i<11;i++){
	for(var j=14;j>3;j--){//所有反斜线
		for(var k=0;k<5;k++){
			wins[i+k][j-k][count] = true;
		}
		count++;
	}
}
// console.log(count);
for(var i=0;i<count;i++){
	myWin[i]=0;
	computerWin[i]=0;
}
context.strokeStyle = "#BFBFBF";
//画图片
var logo = new Image();
logo.src='images/logo.jpg';
//image 的onload方法，等图片加载完执行
logo.onload =function(){
context.drawImage(logo,0,0,450,450);
drawChessBorder();
// oneStep(0,0,true);
// oneStep(0,1,false);

}
var drawChessBorder =function(){
	for(var i=0;i<15;i++){
	context.moveTo(15+i*30,15);
	context.lineTo(15+i*30,435);
	context.stroke();//必须调用stroke()才能看见
	context.moveTo(15,15+i*30);
	context.lineTo(435,15+i*30);
	context.stroke();//必须调用stroke()才能看见
}
}
var oneStep =function(i,j,me){//传3个参数，第三个参数传true/false
	context.beginPath();
	context.arc(15+i*30,15+j*30,13,0,2*Math.PI);
	context.closePath();
	var gradient = context.createRadialGradient(15+i*30+2,15+j*30-2,13,15+i*30+2,15+j*30-2,0);//渐变
	if(me){
		gradient.addColorStop(0,"#0A0A0A");
		gradient.addColorStop(1,"#636766");
	}else{
		gradient.addColorStop(0,"#D1D1D1");
		gradient.addColorStop(1,"#F9F9F9");
	}
	
	context.fillStyle=gradient;
	context.fill();//填充
}
chess.onclick = function(e){
	if(over){
		return;
	}
	if(!me){
		return;
	}
	var x= e.offsetX;
	var y= e.offsetY;
	var i= Math.floor(x/30);
	var j= Math.floor(y/30);
	if(chessBoard[i][j]==0){
		oneStep(i,j,me);
		// if(me){
		chessBoard[i][j]=1;
		// }else{
		// 	chessBoard[i][j]=2;
		// }
		// me = !me;
		for(var k=0;k<count;k++){
			if(wins[i][j][k]){
				myWin[k]++;
				computerWin[k]=6;
				if(myWin[k]==5){
					window.alert("你赢了");
					over=true;
				}
			}
		}
		if(!over){
			me = !me;
			computerAI();
		}
	}
}
var computerAI=function(){
	var myScore=[];
	var computerScore=[];
	var max=0;
	var u=0,v=0;
	for(var i=0;i<15;i++){
		myScore[i]=[];
		computerScore[i]=[];
		for(var j=0;j<15;j++){
			myScore[i][j] =0;
			computerScore[i][j]=0;
		}
	}
	for(var i=0;i<15;i++){
		for(var j=0;j<15;j++){
			if(chessBoard[i][j]==0){
				for(var k=0;k<count;k++){
					if(wins[i][j][k]){
						if(myWin[k]==1){
							myScore[i][j]+=200;
						}else if(myWin[k]==2){
							myScore[i][j]+=400;
						}else if(myWin[k]==3){
							myScore[i][j]+=2000;
						}else if(myWin[k]==4){
							myScore[i][j]+=10000;
						}
						if(computerWin[k]==1){
							computerScore[i][j]+=220;
						}else if(computerWin[k]==2){
							computerScore[i][j]+=420;
						}else if(computerWin[k]==3){
							computerScore[i][j]+=2100;
						}else if(computerWin[k]==4){
							computerScore[i][j]+=20000;
						}
					}
				}
				if(myScore[i][j]>max){
					max = myScore[i][j];
					u=i;
					v=j;
				}else if(myScore[i][j]==max){
					if(computerScore[i][j]>computerScore[u][v]){
						u=i;
						v=j;
					}
					
				}
				if(computerScore[i][j]>max){
					max = computerScore[i][j];
					u=i;
					v=j;
				}else if(computerScore[i][j]==max){
					if(myScore[i][j]>myScore[u][v]){
						u=i;
						v=j;
					}
					
				}
			}

			
		}
	}
	oneStep(u,v,false);
	chessBoard[u][v] =2;
	for(var k=0;k<count;k++){
		if(wins[u][v][k]){
			computerWin[k]++;
			myWin[k]=6;
			if(computerWin[k]==5){
				window.alert("计算机赢了");
				over=true;
			}
		}
	}
	if(!over){
			me = !me;
	}
}
// context.moveTo(0,0);
// context.lineTo(450,450);
// context.stroke();//必须调用stroke()才能看见