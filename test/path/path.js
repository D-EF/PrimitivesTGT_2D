/*
 * @Date: 2022-02-11 15:18:07
 * @LastEditors: Darth_Eternalfaith
 * @LastEditTime: 2022-02-14 20:16:42
 * @FilePath: \def-web\js\visual\test\path\path.js
 */
import {
    PrimitiveTGT__Rect,
    PrimitiveTGT__Arc,
    PrimitiveTGT__Sector,
    PrimitiveTGT__Polygon,
    PrimitiveTGT__Bezier,
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

var path=new PrimitiveTGT__Polygon(pathData);
path.fill_Material=new Canvas2d__Material("#0000");
var renderer=new Renderer_PrimitiveTGT__Canvas2D([path],ctx);
renderer.render_all();
CtrlCanvas2d.dot(ctx,pathData.sample(0.9999).v,4);


var d=new PrimitiveTGT__Bezier();
d.fill_Material=new Canvas2d__Material("#0000");
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

var i=1;
var a=new AnimationCtrl(function(t){
    ctx.clearRect(0,0,500,500)
    renderer.render_all();
    var temp=pathData.sample(t);
    CtrlCanvas2d.dot(ctx,temp.v,4);
    CtrlCanvas2d.dot(ctx,temp.v.add(temp.n.np(-20)),4);
    temp=d.data.sample(t);
    var temp1={
        v:d.localToWorld(temp.v),
        n:d.localToWorld(temp.v.add(temp.n.np(10))),
    };
    CtrlCanvas2d.dot(ctx,temp1.v,4);
    CtrlCanvas2d.dot(ctx,temp1.n,4);
},function(){
    i-=0.1;
    if(i>0)
    a.start(5000*i);
});
a.start(5000);
