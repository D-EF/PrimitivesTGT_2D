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

var d1=d.copy();
d1.strokeStyle="#f00"
d1.transformMatrix=new Matrix2x2T().translate(100,100);
d1.data.cut(0,0.5);
d1.render(ctx);