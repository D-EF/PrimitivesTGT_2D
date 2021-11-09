/*
 * @LastEditors: Darth_Eternalfaith
 */
var canvas=document.getElementById("canvas");
var ctx=canvas.getContext('2d');

var bg=new CanvasRectTGT(0,0,1280,720);
bg.fillStyle="#000";
var itemPolygonNodes=[
    new Vector2(0,0),
    new Vector2(12.06794919,0), //1
    new Vector2(12.06794919,21.9615242),
    new Vector2(12.06794919,47.3205081),
    new Vector2(12.06794919,60), //4
    new Vector2(-0,60),
    new Vector2(-12.06794919,60), //6
    new Vector2(-12.06794919,47.3205081),
    new Vector2(-12.06794919,21.9615242),
    new Vector2(-12.06794919,0), //9
    new Vector2(0,0)
];
var itemPolygon=new Polygon();
itemPolygon.nodes=itemPolygonNodes;

var d1start =new Vector2(12.06794919,0),
    d2start =new Vector2(12.06794919,60),
    d1end   =new Vector2(6.033974595,10.9807621),
    d2end   =new Vector2(6.033974595,53.66025405);


var itemTGT0=new CanvasPolygonTGT();
itemTGT0.fillStyle="#fff"
itemTGT0.strokeStyle="#0000"
var itemTGT1=itemTGT0.copy(),
    itemTGT2=itemTGT0.copy();

    itemTGT0.data=itemPolygon;
    itemTGT1.data=itemPolygon;
    itemTGT2.data=itemPolygon;

var tgt_group0=new CanvasTGT_Group([itemTGT0]),
    tgt_group1=new CanvasTGT_Group([itemTGT1]),
    tgt_group2=new CanvasTGT_Group([itemTGT2]);

var tgt_group=new CanvasTGT_Group([
    tgt_group0,
    tgt_group1,
    tgt_group2
])
var fillScale=128/6;
tgt_group.transformMatrix=new Matrix2x2T().scale(fillScale,fillScale).translate(0,360);

itemTGT0._transformMatrix=new Matrix2x2T().rotate(90*Math.DEG).translate(60,0);
itemTGT1._transformMatrix=itemTGT0.transformMatrix;
itemTGT2._transformMatrix=itemTGT0.transformMatrix;

function ctxRender(){
    bg.render(ctx);
    tgt_group.render(ctx);
}

ctxRender();

var animation1=new AnimationCtrl();
var om=new Matrix2x2T();
var gm=tgt_group.transformMatrix,
    gm_end=new Matrix2x2T().scale(4,4).translate(300,360);

var animation_curve=new UnitBezier(0.4, 1.02, 0.46, 1.03);
/**
 * 把看上去是矩形的东西变成一块logo
 */
function rect_to_logoItem(t){
    var t=animation_curve.sampleCurveY(t);
    var d1=v2Animation(d1start,d1end,t);
    var d2=v2Animation(d2start,d2end,t);
    itemPolygonNodes[1].x=d1.x;
    itemPolygonNodes[1].y=d1.y;
    itemPolygonNodes[9].x=-d1.x;
    itemPolygonNodes[9].y=d1.y;

    itemPolygonNodes[4].x=d2.x;
    itemPolygonNodes[4].y=d2.y;
    itemPolygonNodes[6].x=-d2.x;
    itemPolygonNodes[6].y=d2.y;
    ctxRender();
}
/**
 * 把logo缩小
 */
function logoScale(t){
    var t=animation_curve.sampleCurveY(t);
    tgt_group._transformMatrix=m2tAnimation(gm,gm_end,t);
    ctxRender();
}
/**
 * 把logo从item变成完整的一块
 */
function logoItemShow(t){
    var t=animation_curve.sampleCurveY(t);
    tgt_group0._transformMatrix=new Matrix2x2T().rotate(valueAnimtion(0, 45,t)*Math.DEG);
    tgt_group1._transformMatrix=new Matrix2x2T().rotate(valueAnimtion(0,165,t)*Math.DEG);
    tgt_group2._transformMatrix=new Matrix2x2T().rotate(valueAnimtion(0,285,t)*Math.DEG);
    ctxRender();
}

function a1(animation){
    animation.frameCallback=rect_to_logoItem;
    animation.stopCallback=a2;
    animation.start(200);
}
function a2(animation){
    animation.frameCallback=logoScale;
    animation.stopCallback=a3;
    animation.start(200);
}
function a3(animation){
    animation.frameCallback=logoItemShow;
    animation.stopCallback=undefined;
    animation.start(200);
}
a1(animation1);