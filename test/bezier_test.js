var canvas=document.getElementById("canvas");
var ctx=canvas.getContext("2d");

var d=new CanvasBezierTGT();
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
for(var i = 0; i<1; i+=0.1){
    // CtrlCanvas2d.line(ctx,bd.tangent(i));
    CtrlCanvas2d.line(ctx,bd.abs_normal(i));
}