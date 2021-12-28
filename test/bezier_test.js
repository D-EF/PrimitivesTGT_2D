var canvas=document.getElementById("canvas");
var ctx=canvas.getContext("2d");

var d=new CanvasBezierTGT();
d.data=new Bezier_Polygon();
d.data.pushNode({
    node:{
        x:100,
        y:100
    },
    hand1:{
        x:100,
        y:200
    },
    hand2:{
        x:200,
        y:100
    },
});
d.data.pushNode({
    node:{
        x:200,
        y:200
    },
    hand1:{
        x:100,
        y:200
    },
    hand2:{
        x:200,
        y:100
    },
});


var canvas=document.getElementById("canvas");
var ctx=canvas.getContext('2d');
d.strokeStyle="#000";
d.lineWidth=1;
d.want_to_closePath=true;
d.render(ctx);

var d_math=Bezier3Curve.createBy_BezierNode(d.data.nodes[0],d.data.nodes[1]);
var dd=d_math.derivatives;
CtrlCanvas2d.bezier2(ctx,dd);
for(var i = 0; i<1; i+=0.1){
    CtrlCanvas2d.line(ctx,d_math.tangents(i));
}