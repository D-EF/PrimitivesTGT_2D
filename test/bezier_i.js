/*
 * @Date: 2021-12-21 14:49:00
 * @LastEditors: Darth_Eternalfaith
 * @LastEditTime: 2022-01-11 09:31:59
 * @FilePath: \def-web\js\visual\test\bezier_i.js
 */

import {cnm} from "./bezier3Cut.js"
console.log(cnm);

var canvas=document.getElementById("canvas");
var ctx=canvas.getContext("2d");

var tgt_d=new CanvasBezierTGT();
tgt_d.data=new Bezier_Polygon();
tgt_d.data.pushNode({
    node:{
        x:210,
        y:30
    },
    hand_before:{
        x:210,
        y:250
    },
    hand_after:{
        x:210,
        y:250
    },
});
tgt_d.data.pushNode({
    node:{
        x:130,
        y:50
    },
    hand_before:{
        x:25,
        y:190
    },
    hand_after:{
        x:300,
        y:200
    },
});


var canvas=document.getElementById("canvas");
var ctx=canvas.getContext('2d');

// ctx.translate(2000,2000)

tgt_d.strokeStyle="#000";
tgt_d.lineWidth=1;
// tgt_d.want_to_closePath=true;

var bd=BezierCurve.createBy_BezierNode(tgt_d.data.nodes[0],tgt_d.data.nodes[1]);
CtrlCanvas2d.bezier2(ctx,bd.derivatives);
CtrlCanvas2d.line(ctx,bd.derivatives.derivatives.points);

var tgt_d1=tgt_d.copy();
tgt_d1.strokeStyle="#f00";
tgt_d1.transformMatrix=new Matrix2x2T().translate(280,-40).rotate(90*Math.DEG);
tgt_d1.data.cut(0,0.5);
var bd1=BezierCurve.createBy_BezierNode(tgt_d.data.nodes[0],tgt_d.data.nodes[1]);
bd1.linearMapping(tgt_d1.transformMatrix,true,false,{x:0,y:0})

ctx.resetTransform;
// ctx.translate(300,300);
ctx.moveTo(bd1.points[0].x,bd1.points[0].y);
ctx.bezierCurveTo(bd1.points[1].x,bd1.points[1].y,bd1.points[2].x,bd1.points[2].y,bd1.points[3].x,bd1.points[3].y);
ctx.stroke();

tgt_d1.render(ctx);
tgt_d.render(ctx);


CtrlCanvas2d.line(ctx,[{x:0,y:300},{x:150,y:150}]);

var di=Math2D.line_i_bezier_v({x:0,y:300},{x:150,y:150},bd);

for(var  i=di.length-1;i>=0;--i){
    CtrlCanvas2d.dot(ctx,di[i]);
}