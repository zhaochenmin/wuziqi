$(function () {
    var canvas = $("#canvas").get(0);
    var ctx = canvas.getContext("2d");
    var ROW = 15;
    var width = canvas.width;
    var off = width / ROW;
    var gap=off/2;
    var flag = true;
    var blocks = {};
    var mask = $(".mask");
    var msg = $(".mask .msg");
    var ai = false;
    var blank = {};
    // var watch=$('#watch').get(0);
    // var pen=watch.getContext('2d');
    //遍历所有现在为空的坐标
    for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 15; j++) {
            blank[t2k(i, j)] = {x:i,y:j};
        }
    }
    //？？？？？？？？？？？？？？？
    function p2k(position) {
        return position.x + "_" + position.y;
    }
   	// ？？？？？？？？？？？？？？？？？？？？？？
    function t2k(x, y) {
        return x + "_" + y;
    }
    //棋盘
    function draw() {
        //横线
        ctx.beginPath();
        //0.5     将线条对其到整数
        for (var i = 0; i < 15; i++) {
            ctx.moveTo(gap+0.5,gap+0.5+i*off);
            ctx.lineTo((15-0.5)*off+0.5,gap+0.5+i*off);
        }
        ctx.stroke();
        ctx.closePath();
        //竖线
        ctx.beginPath();
        for (var i = 0; i < 15; i++) {
            ctx.moveTo(gap+0.5+i*off,gap+0.5);
            ctx.lineTo(gap+0.5+i*off,(15-0.5)*off+0.5);
        }
        ctx.stroke();
        ctx.closePath();
        //星点    天元
        drawCircle(3.5, 3.5);
        drawCircle(11.5, 3.5);
        drawCircle(7.5, 7.5);
        drawCircle(3.5, 11.5);
        drawCircle(11.5, 11.5);
    }
    //星点     天元
    function drawCircle(x,y) {
        ctx.beginPath();
        ctx.arc(x*off+0.5,y*off+0.5,3,0,Math.PI*2);
        ctx.fill();
        ctx.closePath();
    }
    //棋子
    function drawChess(position,color) {
        ctx.save();
        ctx.translate((position.x+0.5)*off+0.5,(position.y+0.5)*off+0.5);
        ctx.beginPath();
        if (color == "black") {
        	var img=new Image();
        	img.src='img/hei.png'
            // ctx.fillStyle ="black";
        } else if (color =="white") {
            ctx.fillStyle ="white";
        }
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
        blocks[p2k(position)] = color;
        delete blank[t2k(position.x,position.y)];
    }
    //判断输赢
    function check(position,color) {
        var num1 = 1;
        var num2 = 1;
        var num3 = 1;
        var num4 = 1;
        var table = {};
        for (var i in blocks) {
            if (blocks[i]==color) {
                table[i]=true;
            }
        }
        var tx=position.x;
        var ty=position.y;
        while (table[t2k(tx+1,ty)]) {
            num1++;
            tx++;
        }
        tx=position.x;
        ty=position.y;
        while (table[t2k(tx-1,ty)]) {
            num1++;
            tx--;
        }	

        tx=position.x;
        ty=position.y;
        while (table[t2k(tx,ty+1)]) {
            num2++;
            ty++;
        }
        tx=position.x;
        ty=position.y;
        while (table[t2k(tx,ty-1)]) {
            num2++;
            ty--;
        }

        tx=position.x;
        ty=position.y;
        while (table[t2k(tx+1,ty+1)]) {
            num3++;
            tx++;
            ty++;
        }
        tx=position.x;
        ty=position.y;
        while (table[t2k(tx-1,ty-1)]) {
            num3++;
            tx--;
            ty--;
        }

        tx=position.x;
        ty=position.y;
        while (table[t2k(tx+1,ty-1)]) {
            num4++;
            tx++;
            ty--;
        }
        tx=position.x;
        ty=position.y;
        while (table[t2k(tx-1,ty+1)]) {
            num4++;
            tx--;
            ty++;
        }
        var maxNum=Math.max(num1,num2,num3,num4);
        return maxNum;
    }
    //棋谱数字
    function drawText(pos,text,color) {
        ctx.save();
        ctx.font="20px san-serif";
        if (color==="black") {
            ctx.fillStyle="white";
        } else if (color==="white") {
            ctx.fillStyle="black";
        }
        ctx.textAlign="center";
        ctx.textBaseline="middle";
        ctx.fillText(text,(pos.x+0.5)*off,(pos.y+0.5)*off);
        ctx.restore();
    }
    //???????????????????????
    function k2o(pos) {
        return {x:parseInt(pos.split("_")[0]),y:parseInt(pos.split("_")[1])};
    }
    //棋谱
    function review() {
        var i = 1;
        for (var pos in blocks) {
            drawText(k2o(pos),i,blocks[pos]);
            i++;
        }
    }
    //人机
    function AI() {
        var max1= -Infinity;
        var max2= -Infinity;
        var pos1= {};
        var pos2= {};
        for (var i in blank){
            if (check(k2o(i),"black")>max1) {
                max1=check(k2o(i),"black");
                pos1=blank[i];
            }
            if (check(k2o(i),"white")>max2) {
                max2=check(k2o(i),"white");
                pos2=blank[i];
            }
        }
        if (max1>max2) {
            return pos1;
        } else {
            return pos2;
        }
    }
    function handdleClick(e) {
        var position={x:Math.round((e.offsetX-off/2)/off),y:Math.round((e.offsetY-off/2)/off)};
        if (blocks[p2k(position)]) {
            return;
        }
        if (ai) {
            drawChess(position,"black");
            if (check(position,"black")>=5) {
                $(canvas).off("click");
                msg.text("黑棋赢");
                mask.show();
                review();
                return;
            }
            drawChess(AI(),"white");
            if (check(AI(),"white")>=6) {
                $(canvas).off("click");
                msg.text("白棋赢");
                mask.show();
                review();
                return;
            }
            return;
        }
        if (flag) {
            drawChess(position,"black");
            if (check(position,"black") >= 5) {
                $(canvas).off("click");
                msg.text("黑棋赢");
                mask.show();
                review();
                return;
            }
        } else {
            drawChess(position, "white");
            if (check(position, "white") >= 5) {
                $(canvas).off("click");
                msg.text("白棋赢");
                mask.show();
                review();
                return;
            }
        }
        flag= !flag;
    }
    function restart() {
        blocks={};
        ctx.clearRect(0,0,width,width);
        draw();
        $(canvas).off("click").on("click",handdleClick);
    }
    //落子
    $(canvas).on("click", handdleClick);
    //遮罩层点击消失
    $(".mask").on("click", function () {
        $(this).hide();
    })
    draw();
    $("#restart").on("click", restart);
    $(".ai").on("click", function () {
        $(this).toggleClass("active");
        ai = !ai;
    })

 //    function time(){
	// 	pen.clearRect(0,0,100,100);
	// 	pen.save();
	// 	pen.translate(50,50);
	// 	for (var i = 0; i < 60; i++) {
	// 		pen.beginPath();
	// 		if(i%5==0){
	// 			pen.moveTo(0,-35);
	// 		}else{
	// 			pen.moveTo(0,-40);
	// 		}
	// 		pen.lineTo(0,-50);
	// 		pen.stroke();
	// 		pen.closePath();
	// 		pen.rotate(Math.PI/30)
	// 	}
	// 	pen.restore();

	// 	var date = new Date();
	// 	var s=date.getSeconds();
	// 	var m=date.getMinutes();
	// 	var h=date.getHours()>12?Math.abs(h-12):date.getHours();
	// 	// 秒针
	// 	pen.save();
	// 	pen.strokeStyle="red";
	// 	pen.beginPath();
	// 	pen.translate(50,50);
	// 	pen.rotate(2*Math.PI*s/60);
	// 	pen.moveTo(0,0);
	// 	pen.lineTo(0,-30);
	// 	pen.stroke();
	// 	pen.closePath();
	// 	pen.restore();

	// 	// 分针
	// 	pen.save();
	// 	pen.strokeStyle="blue";
	// 	pen.beginPath();
	// 	pen.translate(50,50);
	//  	pen.rotate(2*Math.PI*(m*60+s)/3600);
	// 	pen.moveTo(0,0);
	// 	pen.lineTo(0,-23);
	// 	pen.stroke();
	// 	pen.closePath();
	// 	pen.restore();

	// 	// 时针
	// 	pen.save();
	// 	pen.strokeStyle="green";
	// 	pen.beginPath();
	// 	pen.translate(50,50);
	//  	pen.rotate(2*Math.PI*(h*60*60+m*60+s)/12/3600);
	// 	pen.moveTo(0,0);
	// 	pen.lineTo(0,-16);
	// 	pen.stroke();
	// 	pen.closePath();
	// 	pen.restore();
	// }
	// time();
	// setInterval(time,1000)
})