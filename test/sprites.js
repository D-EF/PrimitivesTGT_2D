/*
 * @Date: 2022-01-12 17:51:41
 * @LastEditors: Darth_Eternalfaith
 * @LastEditTime: 2022-01-13 15:37:19
 * @FilePath: \def-web\js\visual\test\sprites.js
 */
import {Sprites,Sprites_Animation} from "../Sprites.js";
var ctx=document.getElementById("canvas").getContext("2d");

var b1=document.getElementById("b1");
b1.style.backgroundImage="url(./SpritesMap.png)";

var sp=new Sprites(8,8,"./SpritesMap.png",0.1,0.1,0.1,0.1);
var spa=new Sprites_Animation(0,7,0,7);

// 帧回调中渲染
spa.frameCallback=function(x,y){
    console.log("x:"+x,"y:"+y);
    sp.renderSprites(b1,x,y);
}

// 结束回调函数
function cnm(x,y,that){
    console.log("cnm")
    that.play(2,2,4,3,"x2y1",12).then(cnm);
}

spa.play(2,2,4,3,"x2y1",12).then(cnm);



sp.renderSprites(ctx,6,6,0,0,100,100);

