/*
 * @Date: 2022-02-11 15:18:07
 * @LastEditors: Darth_Eternalfaith
 * @LastEditTime: 2022-02-11 16:48:04
 * @FilePath: \def-web\js\visual\test\path\path.js
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
} from "../../PrimitivesTGT_2D_CanvasRenderingContext2D.js";
import {
    Vector2,
    Matrix2x2T,
    Polygon,
    Bezier_Polygon,  
    BezierCurve,
    Math2D
}  from "../../Math2d.js";
import { PrimitiveTGT } from "../../PrimitivesTGT_2D.js";
import { AnimationCtrl } from "../../visual.js";
Object.assign(window,{
    Vector2,
    Matrix2x2T,
    Polygon,
    Bezier_Polygon,  
    BezierCurve,
    Math2D
})

window.Vector2=Vector2;
window.Matrix2x2T=Matrix2x2T;
window.Polygon=Polygon;
window.Bezier_Polygon=Bezier_Polygon;
window.BezierCurve=BezierCurve;
window.Math2D=Math2D;
/**@type {CanvasRenderingContext2D} */
var ctx=document.getElementById("cnm").getContext("2d");


var pathData=new Polygon([
    {x:100,y:100},
    {x:100,y:200},
    {x:300,y:400},
    {x:300,y:200},
    {x:100,y:100}
]);

var path=new PrimitivePolygonTGT(pathData);
path.fill_Material=new Canvas2d_Material("#0000");
var renderer=new Canvas2D_TGT_Renderer([path],ctx);
renderer.render_all();
CtrlCanvas2d.dot(ctx,pathData.sampleCurve(0.9999).v,4);


var d=new PrimitiveBezierTGT();
d.fill_Material=new Canvas2d_Material("#0000");
d.data=new Bezier_Polygon();
d.data.pushNode({
    node:{
        x:100-100,
        y:100-100
    },
    hand_before:{
        x:100-100,
        y:200-100
    },
    hand_after:{
        x:200-100,
        y:100-100
    },
});
d.data.pushNode({
    node:{
        x:200-100,
        y:200-100
    },
    hand_before:{
        x:100-100,
        y:200-100
    },
    hand_after:{
        x:200-100,
        y:100-100
    },
});
d.data.pushNode({
    node:{
        x:300-100,
        y:100-100
    },
    hand_before:{
        x:300-100,
        y:200-100
    },
    hand_after:{
        x:300-100,
        y:0-100
    },
});
d.data.pushNode({
    node:{
        x:200-100,
        y:100-100
    },
    hand_before:{
        x:300-100,
        y:100-100
    },
    hand_after:{
        x:200-100,
        y:100-100
    },
});
renderer.tgtList.push(d);
d.transformMatrix=new Matrix2x2T().translate(0,200).scale(2,2);


var a=new AnimationCtrl(function(t){
    ctx.clearRect(0,0,500,500)
    renderer.render_all();
    var temp=pathData.sampleCurve(t);
    CtrlCanvas2d.dot(ctx,temp.v,4);
    CtrlCanvas2d.dot(ctx,temp.v.add(temp.n.np(-20)),4);
    temp=d.data.sampleCurve(t);
    var temp1={
        v:d.localToWorld(temp.v),
        n:d.localToWorld(temp.v.add(temp.n.np(10))),
    };
    CtrlCanvas2d.dot(ctx,temp1.v,4);
    CtrlCanvas2d.dot(ctx,temp1.n,4);
},function(){
    a.start(2000);
})
a.start(2000);