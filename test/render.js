/*
 * @Date: 2022-01-15 10:51:54
 * @LastEditors: Darth_Eternalfaith
 * @LastEditTime: 2022-01-15 12:06:30
 * @FilePath: \def-web\js\visual\test\render.js
 */
import {
    PrimitiveRectTGT,
    PrimitiveArcTGT,
    PrimitiveSectorTGT,
    PrimitivePolygonTGT,
    PrimitiveBezierTGT,
    PrimitiveTGT_Group,
    CtrlCanvas2d,
    Canvas2d_Material,
    Canvas2D_TGT_Renderer,
    Sprites,
    Sprites_Animation
} from "../PrimitivesTGT_2D_CanvasRenderingContext2D.js";
import {
    Vector2,
    Matrix2x2T,
    Polygon
} from "../Math2d.js";


var ctx=document.getElementById("cnm").getContext("2d");

var sp=new Sprites(6,6,"SpritesMap.png",0.2,0.2,0.2,0.2);
var spritesMap_Material=new Canvas2d_Material(sp);

var t1=new PrimitiveRectTGT(50,50,50,50);
t1.fill_Material=spritesMap_Material;
t1.fill_uv={x:0,y:2};
t1.stroke_Material=new Canvas2d_Material("#00f")
var t2=new PrimitiveArcTGT(0,0,50,0,6.3);
t2.fill_Material=spritesMap_Material;
t2.fill_uv={x:1,y:2};
t2.lineWidth=2;
t2.stroke_Material=new Canvas2d_Material("#0f0");
t2.transformMatrix=new Matrix2x2T().setTranslate(120,120).rotate(45*deg);

var t3=new PrimitivePolygonTGT(new Polygon([
    {x:0,y:0},
    {x:0,y:100},
    {x:100,y:0},
    {x:0,y:0}
]));
t3.fill_Material=spritesMap_Material;
t3.fill_uv={x:2,y:2};
t3.lineWidth=2;
t3.stroke_Material=new Canvas2d_Material("#f00");
t3.transformMatrix=new Matrix2x2T().setTranslate(150,150).rotate(-45*deg);


var renderer=new Canvas2D_TGT_Renderer([t1,t2,t3],ctx);
sp.img.onload=function (){
    renderer.render_all();
}