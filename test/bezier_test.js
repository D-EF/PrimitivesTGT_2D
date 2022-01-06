/*
 * @Date: 2021-12-27 13:43:17
 * @LastEditors: Darth_Eternalfaith
 * @LastEditTime: 2022-01-06 15:33:33
 * @FilePath: \def-web\js\visual\test\bezier_test.js
 */
var canvas=document.getElementById("canvas");
var ctx=canvas.getContext("2d");

var d=new CanvasBezierTGT();
d.data=new Bezier_Polygon();
d.data.pushNode({
    node:{
        x:0,
        y:0
    },
    hand_before:{
        x:0,
        y:500
    },
    hand_after:{
        x:500,
        y:0
    },
});
d.data.pushNode({
    node:{
        x:500,
        y:500
    },
    hand_before:{
        x:0,
        y:500
    },
    hand_after:{
        x:500,
        y:0
    },
});

var canvas=document.getElementById("canvas");
var ctx=canvas.getContext('2d');
d.strokeStyle="#000";
d.lineWidth=1;
// d.want_to_closePath=true;
d.render(ctx);

var bd=BezierCurve.createBy_BezierNode(d.data.nodes[0],d.data.nodes[1]);
CtrlCanvas2d.bezier2(ctx,bd.derivatives);
CtrlCanvas2d.line(ctx,bd.derivatives.derivatives.points);

// 
// ctx.lineWidth=0.3
// for(var i = 0; i<=1; i+=0.01){
//     var pt=bd.sampleCurve(i),
//         k=bd.kappa(i)*100000,
//         pk=pt.add(bd.normal(i).normalize().np(k)),
//         pki=pt.add(bd.normal(i).normalize().np(-k));
//     CtrlCanvas2d.line(ctx,[pt,pk]);
//     CtrlCanvas2d.line(ctx,[pt,pki]);
// }

var maxl=bd.get_arc_length(0.1);
for(var i = -0.00001; -i<=maxl; i-=20){
    CtrlCanvas2d.dot(ctx,bd.sampleCurve(bd.get_t_by_arc_length(i)));
}