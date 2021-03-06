/*
 * @LastEditors: Darth_Eternalfaith
 */
import {
    colorToRGBA,
    AnimationCtrl,
    valueAnimation,
    v2Animation,
    m2tAnimation
} from "../visual.js";
import {
    PrimitiveTGT as CanvasTGT,
    PrimitiveTGT__Rect as CanvasRectTGT,
    PrimitiveTGT__Arc as CanvasArcTGT,
    PrimitiveTGT__Sector as CanvasSectorTGT,
    PrimitiveTGT__Polygon as CanvasPolygonTGT,
    PrimitiveTGT__Group as CanvasTGT_Group,
    PrimitiveTGT__Group,
} from "../PrimitivesTGT_2D.js";
import {
    Math2D,
    Data_Rect,
    Data_Arc,
    Data_Sector,
    Vector2,
    Matrix2x2,
    Matrix2x2T,
    Polygon,
    BezierCurve,
        }from "../Math2d.js";
import { Canvas2d__Material, Renderer_PrimitiveTGT__Canvas2D } from "../PrimitivesTGT_2D_CanvasRenderingContext2D.js";



var canvas=document.getElementById("canvas");
var ctx=canvas.getContext('2d');
var renderer=new Renderer_PrimitiveTGT__Canvas2D([],ctx);

var Material_white=new Canvas2d__Material("#fff");
var Material_white0=new Canvas2d__Material("#fff0");
var Material_Block=new Canvas2d__Material("#000");

var bg=new CanvasRectTGT(0,0,1280,720);
bg.fill_material=Material_Block;
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
itemTGT0.stroke_material=Material_white0;
var itemTGT1=itemTGT0.copy(),
    itemTGT2=itemTGT0.copy();

itemTGT0.data=itemPolygon;
itemTGT1.data=itemPolygon;
itemTGT2.data=itemPolygon;
itemTGT0.fill_material=Material_white;
itemTGT1.fill_material=Material_white;
itemTGT2.fill_material=Material_white;


var tgt_group0=new CanvasTGT_Group([itemTGT0]),
    tgt_group1=new CanvasTGT_Group([itemTGT1]),
    tgt_group2=new CanvasTGT_Group([itemTGT2]);

var tgt_group=new CanvasTGT_Group([
    tgt_group0,
    tgt_group1,
    tgt_group2
]);

var text_group=new CanvasTGT_Group();
text_group.stroke_material=Material_white0;
text_group.lineWidth=5;
text_group.lineCap="square";
text_group.fill_material=Material_white0;
text_group.transform_matrix=new Matrix2x2T().scale(2,2).translate(400,200);
var fillScale=100/6;
tgt_group.transform_matrix=new Matrix2x2T().scale(fillScale,fillScale).translate(0,200);

itemTGT0._transform_matrix=new Matrix2x2T().rotate(90*Math.DEG).translate(60,0);
itemTGT1._transform_matrix=itemTGT0.transform_matrix;
itemTGT2._transform_matrix=itemTGT0.transform_matrix;

function ctxRender(){
    renderer.render(bg);
    renderer.render(tgt_group);
    renderer.render(text_group);
}

ctxRender();

var animation1=new AnimationCtrl();
var om=new Matrix2x2T();
var gm=tgt_group.transform_matrix,
    gm_end=new Matrix2x2T().scale(4,4).translate(231.8221983093764,231.8221983093764);

// ????????????UnitBezier???????????????,??????x????????????????????????t????????????.
// ???????????????css??? Bezier ???????????????????????????x????????????t???????????????t??????y(???)??????, ?????????????????????t????????????y??????
// ????????????????????????x?????????????????????????????????0???1????????????x?????????t?????????????????????
var animation_curve=new BezierCurve([
    {x:0,y:0},
    {x:1,y:1},
    {x:0,y:1.2},
    {x:1,y:1},
]);
/** ??????????????????????????????????????????logo
 */
function rect_to_LogoItem(t){
    var t=animation_curve.sample_y(animation_curve.get_t_ByX(t));
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
/** ???logo??????
 */
function logoScale(t){
    var t=animation_curve.sample_y(animation_curve.get_t_ByX(t));
    tgt_group._transform_matrix=m2tAnimation(gm,gm_end,t);
    ctxRender();
}
/** ???logo???item?????????????????????
 */
function logoItemShow(t){
    var t=animation_curve.sample_y(animation_curve.get_t_ByX(t));
    tgt_group0._transform_matrix=new Matrix2x2T().rotate(valueAnimation(0, 45,t)*Math.DEG);
    tgt_group1._transform_matrix=new Matrix2x2T().rotate(valueAnimation(0,165,t)*Math.DEG);
    tgt_group2._transform_matrix=new Matrix2x2T().rotate(valueAnimation(0,285,t)*Math.DEG);
    ctxRender();
}

function a1(animation){
    animation.frameCallback=rect_to_LogoItem;
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
    animation.stopCallback=function(){
        atd1();
    };
    animation.start(200);
}
setTimeout(() => {
    a1(animation1);
}, 200);

var textPolygonD=new Polygon([
    new Vector2(), //0
    new Vector2(), //1
    new Vector2(), //2
    new Vector2(), //3
    new Vector2(), //4
    new Vector2(), //5
]);
var textTGT_D=new CanvasPolygonTGT();
textTGT_D.data=textPolygonD;
text_group.add_Children(textTGT_D);

var textPolygonE1=new Polygon([
    new Vector2(), //0
    new Vector2(), //1
    new Vector2(), //2
    new Vector2(), //3
    new Vector2(), //4
]);
var textTGT_E1=new CanvasPolygonTGT();
textTGT_E1.data=textPolygonE1;
text_group.add_Children(textTGT_E1);
textTGT_E1.transform_matrix=new Matrix2x2T().translate(100,0)

var textPolygonE2=new Polygon([
    new Vector2(),
    new Vector2(),
]);
var textTGT_E2=new CanvasPolygonTGT();
textTGT_E2.data=textPolygonE2;
text_group.add_Children(textTGT_E2);
textTGT_E2.transform_matrix=new Matrix2x2T().translate(100,0)

var textPolygonF1=new Polygon([
    new Vector2(),
    new Vector2(),
    new Vector2(),
    new Vector2(),
]);
var textTGT_F1=new CanvasPolygonTGT();
textTGT_F1.data=textPolygonF1;
text_group.add_Children(textTGT_F1);
textTGT_F1.transform_matrix=new Matrix2x2T().translate(200,0)

var textTGT_F2=textTGT_E2.copy();
textTGT_F2.transform_matrix=new Matrix2x2T().translate(200,0)
text_group.add_Children(textTGT_F2);

var animation2=new AnimationCtrl();
function animation_D1f(t){
    var end=valueAnimation(0,50,t);
    textPolygonD.nodes[0].y=
    textPolygonD.nodes[1].y=
    textPolygonD.nodes[2].y=end;
    textPolygonD.nodes[3].y=
    textPolygonD.nodes[4].y=
    textPolygonD.nodes[5].y=-end;
    ctxRender();
}
function animation_D2f(t){
    var end=valueAnimation(0,50,t);
    textPolygonD.nodes[0].x=
    textPolygonD.nodes[1].x=end;
    textPolygonD.nodes[4].x=
    textPolygonD.nodes[5].x=end;
    ctxRender();
}
function animation_D3f(t){
    var end=v2Animation({x:50,y:50},{x:100,y:0},t);
    textPolygonD.nodes[0].x=end.x;
    textPolygonD.nodes[0].y=end.y;
    textPolygonD.nodes[5].x=end.x;
    textPolygonD.nodes[5].y=-end.y;
    ctxRender();
}

function animation_E1f(t){
    var end=v2Animation({x:0,y:0},{x:50,y:50},t);
    var end1=valueAnimation(0,100,t);
    textPolygonE1.nodes[0].x=
    textPolygonE1.nodes[1].x=end.x;

    textPolygonE1.nodes[0].y=
    textPolygonE1.nodes[1].y=end.y;

    textPolygonE1.nodes[4].x=
    textPolygonE1.nodes[3].x=end.x;
    textPolygonE1.nodes[4].y=
    textPolygonE1.nodes[3].y=-end.y;

    textPolygonE2.nodes[1].x=end1;
    ctxRender();
}
function animation_E2F1f(t){
    var end=valueAnimation(50,100,t);
    var end1=valueAnimation(0,100,t);
    var end2=valueAnimation(0,50,t);
    textPolygonE1.nodes[0].x=end;
    textPolygonE1.nodes[4].x=end;
    textTGT_F2.data.nodes[1].x=end1;

    textPolygonF1.nodes[0].y=end2;
    textPolygonF1.nodes[2].x=
    textPolygonF1.nodes[3].x=end2;
    textPolygonF1.nodes[2].y=
    textPolygonF1.nodes[3].y=-end2;

    ctxRender();
}
function animation_F2f(t){
    var end=valueAnimation(50,100,t);
    textPolygonF1.nodes[3].x=end;
    ctxRender();
}

function atd1(){
    text_group.stroke_material=Material_white;
    text_group.data[1].stroke_material=Material_white0;
    text_group.data[2].stroke_material=Material_white0;
    text_group.data[3].stroke_material=Material_white0;
    text_group.data[4].stroke_material=Material_white0;
    animation2.frameCallback=animation_D1f;
    animation2.stopCallback=atd2;
    animation2.start(100);
}
function atd2(){
    animation2.frameCallback=animation_D2f;
    animation2.stopCallback=atd3;
    animation2.start(100);
}
function atd3(){
    animation2.frameCallback=animation_D3f;
    animation2.stopCallback=ate1;
    animation2.start(100);
}
function ate1(){
    text_group.data[1].stroke_material=null;
    text_group.data[2].stroke_material=null;
    animation2.frameCallback=animation_E1f;
    animation2.stopCallback=ate2f1;
    animation2.start(100);
}
function ate2f1(){
    
    text_group.data[3].stroke_material=null;
    text_group.data[4].stroke_material=null;
    animation2.frameCallback=animation_E2F1f;
    animation2.stopCallback=atf2;
    animation2.start(100);
}
function atf2(){
    animation2.frameCallback=animation_F2f;
    animation2.stopCallback=undefined;
    animation2.start(100);
}

window.tgts={
    tgt_group:tgt_group,
    tgt_group0:tgt_group0,
    tgt_group1:tgt_group1,
    tgt_group2:tgt_group2,
}