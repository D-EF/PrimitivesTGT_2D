/*
 * @Date: 2022-01-12 17:51:41
 * @LastEditors: Darth_Eternalfaith
 * @LastEditTime: 2022-01-12 20:07:19
 * @FilePath: \def-web\js\visual\test\sprites.js
 */
import {Sprites} from "../Sprites.js";
var ctx=document.getElementById("canvas").getContext("2d");
var b1=document.getElementById("b1");

var sp=new Sprites(8,8,"./SpritesMap.png",0.1,0.1,0.1,0.1);

sp.renderSprites(b1,0,0,1,1);
sp.renderSprites(ctx,6,6,0,0,100,100);
b1.style.backgroundImage="url(./SpritesMap.png)";