/*
 * @Date: 2022-01-12 17:51:41
 * @LastEditors: Darth_Eternalfaith
 * @LastEditTime: 2022-01-17 19:54:33
 * @FilePath: \def-web\js\visual\test\sprites.js
 */
import {Sprites,Sprites_Animation} from "../Sprites.js";

/**@type {CanvasRenderingContext2D} */
var ctx=document.getElementById("canvas").getContext("2d");

var b1=document.getElementById("b1");
b1.style.backgroundImage="url(./ぷぷーん_sp.png)";

var sp=new Sprites(3,2,"./ぷぷーん_sp.png");
var spa=new Sprites_Animation(0,2,0,1);

// 帧回调中渲染
spa.frameCallback=function(x,y){
    console.log("x:"+x,"y:"+y);
    sp.renderSprites(b1,x,y);
    ctx.clearRect(0,0,500,500);
    sp.renderSprites(ctx,x,y,0,0,300,300);
}

// 结束回调函数
function rl(x,y,that){
    console.log("39 Miku!");
    that.play(0,0,2,1,"x1y1",12).then(lr);
}

function lr(x,y,that){
    console.log("39 Miku!");
    that.play(2,1,0,0,"x-1y-1",12).then(rl);
}

spa.play(2,1,0,0,"x-1y-1",12).then(lr);

