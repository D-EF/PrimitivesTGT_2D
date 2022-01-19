/*
 * @Date: 2022-01-15 10:51:54
 * @LastEditors: Darth_Eternalfaith
 * @LastEditTime: 2022-01-19 16:01:07
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
    Polygon,
    Bezier_Polygon,  
    BezierCurve,
    Math2D
} from "../Math2d.js";

window.Vector2=Vector2;
window.Matrix2x2T=Matrix2x2T;
window.Polygon=Polygon;
window.Bezier_Polygon=Bezier_Polygon;
window.BezierCurve=BezierCurve;
window.Math2D=Math2D
/**@type {CanvasRenderingContext2D} */
var ctx=document.getElementById("cnm").getContext("2d");

var sp=new Sprites(6,6,"SpritesMap.png",0.2,0.2,0.2,0.2);
var spritesMap_Material=new Canvas2d_Material(sp);

var t1=new PrimitiveRectTGT(50,50,50,50);
t1.fill_Material=spritesMap_Material;
t1.fill_uv={x:0,y:0};
t1.stroke_Material=new Canvas2d_Material("#00f")

var t2=new PrimitiveArcTGT(0,0,50,0,180*deg);
t2.fill_Material=spritesMap_Material;
t2.fill_uv={x:1,y:1};
t2.fill_uvwh={x:0.5,y:1};
t2.lineWidth=2;
t2.want_to_closePath=true;
t2.stroke_Material=new Canvas2d_Material("#0f0");
t2.transformMatrix=new Matrix2x2T().setTranslate(120,120).rotate(45*deg);

var t3=new PrimitivePolygonTGT(new Polygon([
    {x:0,y:0},
    {x:0,y:100},
    {x:100,y:0},
    {x:100,y:100},
    // {x:0,y:0},
]));
t3.want_to_closePath=true;
t3.fill_Material=spritesMap_Material;
t3.fill_uv={x:2,y:2};
t3.lineWidth=2;
t3.stroke_Material=new Canvas2d_Material("#f00");
t3.transformMatrix=new Matrix2x2T().setTranslate(150,150).rotate(-45*deg);


var renderer=new Canvas2D_TGT_Renderer([t1,t2,t3],ctx);
sp.img.onload=function (){
    renderer.render_all();
}


var d=new PrimitiveBezierTGT();
d.data=new Bezier_Polygon();
d.data.pushNode({
    node:{
        x:100,
        y:100
    },
    hand_before:{
        x:100,
        y:200
    },
    hand_after:{
        x:200,
        y:100
    },
});
d.data.pushNode({
    node:{
        x:200,
        y:200
    },
    hand_before:{
        x:100,
        y:200
    },
    hand_after:{
        x:200,
        y:100
    },
});

// d.transformMatrix=new Matrix2x2T().translate(400,100).rotate(90*deg);
d.want_to_closePath=-1;
renderer.tgtList.push(d);
d.fill_Material=new Canvas2d_Material("#0000");
window.ka=d.data.get_bezierCurve(0);

var cnm=document.getElementById("cnm");
cnm.style.left="30px";
cnm.style.position="absolute";

cnm.onclick=function(e){
    // console.log(e);
    var v=Vector2.copy({x:e.offsetX,y:e.offsetY});
    CtrlCanvas2d.dot(ctx,v);
    for(var i = renderer.tgtList.length-1;i>=0;--i){
        if(renderer.tgtList[i].isInside(v)){
            console.log("is clicking",renderer.tgtList[i]);
        }
    }
}
cnm.onmousemove=function (e){
    var v=Vector2.copy({x:e.offsetX,y:e.offsetY});
    
    /**@type {BezierCurve} */
    // var ka;
    console.log(ka.projection_point(v));
    ctx.clearRect(0,0,1000,1000)
    renderer.render(d);
    CtrlCanvas2d.dot(ctx,ka.projection_point(v).v,3,"#0f0");
}