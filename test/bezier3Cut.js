/*
 * @Date: 2021-12-21 14:49:00
 * @LastEditors: Darth_Eternalfaith
 * @LastEditTime: 2022-01-11 09:48:36
 * @FilePath: \def-web\js\visual\test\bezier3Cut.js
 */
var canvas=document.getElementById("canvas");
var ctx=canvas.getContext("2d");

var d=new CanvasBezierTGT();
d.data=new Bezier_Polygon();
d.data.pushNode({
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
d.data.pushNode({
    node:{
        x:110,
        y:150
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

// ctx.translate(2000,2000)

d.strokeStyle="#000";
d.lineWidth=1;
// d.want_to_closePath=true;
d.render(ctx);

var bd=BezierCurve.createBy_BezierNode(d.data.nodes[0],d.data.nodes[1]);
CtrlCanvas2d.bezier2(ctx,bd.derivatives);
CtrlCanvas2d.line(ctx,bd.derivatives.derivatives.points);

var d1=d.copy();
d1.strokeStyle="#f00";
d1.transformMatrix=new Matrix2x2T().translate(200,200);

d1.data.cut(0,0.5);
d1.render(ctx);

var d=bd.align_proxy;
var pp=new CanvasPolygonTGT(bd.get_tightBoundsBox());
// pp.render(ctx);

var cnm="gnn"
export{
    cnm
}