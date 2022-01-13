/*
 * @Date: 2022-01-12 17:51:41
 * @LastEditors: Darth_Eternalfaith
 * @LastEditTime: 2022-01-13 12:22:01
 * @FilePath: \def-web\js\visual\test\sprites.js
 */
import {Sprites,Sprites_Animation} from "../Sprites.js";
var ctx=document.getElementById("canvas").getContext("2d");
var b1=document.getElementById("b1");

var sp=new Sprites(8,8,"./SpritesMap.png",0.1,0.1,0.1,0.1);
var spa=new Sprites_Animation(sp);

spa.frameCallback=function(x,y){
    console.log(x,y)
    sp.renderSprites(b1,x,y);
}
function cnm(){
    spa.play(2,2,4,3,"x1y1",12);
    this.callbackList.push(cnm);
}

spa.play(2,2,4,3,"x1y1",12).then(cnm);

sp.renderSprites(ctx,6,6,0,0,100,100);
b1.style.backgroundImage="url(./SpritesMap.png)";

