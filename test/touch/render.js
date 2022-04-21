/*
 * @Date: 2022-02-12 11:15:04
 * @LastEditors: Darth_Eternalfaith
 * @LastEditTime: 2022-04-21 19:49:47
 * @FilePath: \def-web\js\visual\test\touch\render.js
 */
import {
    PrimitiveTGT__Rect,
    PrimitiveTGT__Arc,
    PrimitiveTGT__Sector,
    PrimitiveTGT__Polygon,
    PrimitiveTGT__Group,
    CtrlCanvas2d,
    Canvas2d__Material,
    Renderer_PrimitiveTGT__Canvas2D,
    Sprites,
    Sprites_Animation
} from "../../PrimitivesTGT_2D_CanvasRenderingContext2D.js";
import {
    Vector2,
    Matrix2x2T,
    Polygon,
    BezierCurve,
    Math2D
}  from "../../Math2d.js";
import { PrimitiveTGT } from "../../PrimitivesTGT_2D.js";
Object.assign(window,{
    Vector2,
    Matrix2x2T,
    Polygon,
    BezierCurve,
    Math2D
})

window.Vector2=Vector2;
window.Matrix2x2T=Matrix2x2T;
window.Polygon=Polygon;
window.BezierCurve=BezierCurve;
window.Math2D=Math2D;
/**@type {CanvasRenderingContext2D} */
var ctx=document.getElementById("cnm").getContext("2d");
// ctx.globalAlpha=0.5
var sp=new Sprites(6,6,"/img/SpritesMap.png",0.2,0.2,0.2,0.2);
var spritesMap_Material=new Canvas2d__Material(sp);

var t1=new PrimitiveTGT__Rect(50,50,50,50);
t1.fill_Material=spritesMap_Material;
t1.fill_uv={x:0,y:0};
t1.stroke_Material=new Canvas2d__Material("#00f")
t1.origin.x=50;
t1.origin.y=50;
t1.transform_matrix=new Matrix2x2T().rotate(45*deg);

var t2=new PrimitiveTGT__Sector(0,0,50,0,120*deg);
t2.fill_Material=spritesMap_Material;
t2.fill_uv={x:1,y:1};
t2.fill_uvwh={x:0.5,y:1};
t2.lineWidth=2;
t2.want_to_closePath=true;
t2.stroke_Material=new Canvas2d__Material("#0f0");
t2.transform_matrix=new Matrix2x2T().set_Translate(120,200).rotate(45*deg);
t2.globalAlpha=0.5;

var t3=new PrimitiveTGT__Polygon(new Polygon([
    {x:0,y:0},
    {x:0,y:100},
    {x:100,y:0},
    {x:100,y:100},
    {x:0,y:0},
]));
t3.want_to_closePath=false;
t3.fill_Material=spritesMap_Material;
t3.fill_uv={x:2,y:2};
t3.lineWidth=2;
t3.origin.x=150;
t3.origin.y=150;
t3.stroke_Material=new Canvas2d__Material("#f00");
t3.transform_matrix=new Matrix2x2T().set_Translate(150,150).rotate(-45*deg);


var renderer=new Renderer_PrimitiveTGT__Canvas2D([t1,t2,t3],ctx);
sp.img.onload=function (){
    renderer.render_All();
}

var cnm=document.getElementById("cnm");
cnm.style.left="30px";
cnm.style.position="absolute";

cnm.onclick=function(e){
        var v=Vector2.copy({x:e.offsetX,y:e.offsetY});
    CtrlCanvas2d.dot(ctx,v);
    for(var i = renderer.tgtList.length-1;i>=0;--i){
        if(renderer.tgtList[i].is_Inside(v)){
            console.log("is clicking",renderer.tgtList[i]);
        }
    }
    // console.log(v);
    // console.log(renderer.tgtList[2].worldToLocal(v));
}