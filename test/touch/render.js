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
// ctx.globalAlpha=0.5
var sp=new Sprites(6,6,"../SpritesMap.png",0.2,0.2,0.2,0.2);
var spritesMap_Material=new Canvas2d__Material(sp);

var t1=new PrimitiveTGT__Rect(50,50,50,50);
t1.fill_Material=spritesMap_Material;
t1.fill_uv={x:0,y:0};
t1.stroke_Material=new Canvas2d__Material("#00f")

var t2=new PrimitiveTGT__Sector(0,0,50,0,120*deg);
t2.fill_Material=spritesMap_Material;
t2.fill_uv={x:1,y:1};
t2.fill_uvwh={x:0.5,y:1};
t2.lineWidth=2;
t2.want_to_closePath=true;
t2.stroke_Material=new Canvas2d__Material("#0f0");
t2.transformMatrix=new Matrix2x2T().set_translate(120,200).rotate(45*deg);
t2.globalAlpha=0.5;

var t3=new PrimitiveTGT__Polygon(new Polygon([
    {x:0,y:0},
    {x:0,y:100},
    {x:100,y:0},
    {x:100,y:100},
    {x:0,y:0},
]));
t3.want_to_closePath=false;
t3.fill_Material=spritesMap_Material;
t3.fill_uv={x:2,y:2};
t3.lineWidth=2;
t3.stroke_Material=new Canvas2d__Material("#f00");
t3.transformMatrix=new Matrix2x2T().set_translate(150,150).rotate(-45*deg);


var renderer=new Renderer_PrimitiveTGT__Canvas2D([t1,t2,t3],ctx);
sp.img.onload=function (){
    renderer.render_all();
}


var t4=new PrimitiveTGT__Bezier();
t4.data=new Bezier_Polygon();
t4.data.add_Node({
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
t4.data.add_Node({
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

t4.transformMatrix=new Matrix2x2T().translate(400,100).rotate(90*deg);
t4.want_to_closePath=1;
t4.fill_Material=spritesMap_Material;
t4.fill_uv={x:4,y:6};
t4.fill_uvwh={x:0.5,y:0.5};
renderer.tgtList.push(t4);

var d=new PrimitiveTGT__Bezier();
d.data=new Bezier_Polygon();
d.data.add_Node({
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
d.data.add_Node({
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

d.transformMatrix=new Matrix2x2T().translate(400,100).rotate(90*deg);
d.want_to_closePath=-1;
d.fill_Material=spritesMap_Material;
d.fill_uv={x:4,y:6};
d.fill_uvwh={x:0.5,y:0.5};
renderer.tgtList.push(d);
var ka=window.ka=d.data.get_bezierCurve(0);
var l=ka.get_arcLength(),spl=l/15;

var cnm=document.getElementById("cnm");
cnm.style.left="30px";
cnm.style.position="absolute";

cnm.onclick=function(e){
    // console.log(e);
    var v=Vector2.copy({x:e.offsetX,y:e.offsetY});
    CtrlCanvas2d.dot(ctx,v);
    for(var i = renderer.tgtList.length-1;i>=0;--i){
        if(renderer.tgtList[i].is_inside(v)){
            console.log("is clicking",renderer.tgtList[i]);
        }
    }
}
cnm.onmousemove=function(e){
    d.transformMatrix=new Matrix2x2T().translate(e.offsetX,e.offsetY).rotate(90*deg);
    ctx.clearRect(0,0,1000,1000)
    renderer.render_all();
    var v=t4.worldToLocal(Vector2.copy({x:e.offsetX,y:e.offsetY}));
    CtrlCanvas2d.dot(ctx,t4.localToWorld(ka.create_projectionPoint(v,"t").v),3,"#0f0");
    
    if(PrimitiveTGT.isTouch(d,t1))console.log("is touching t1");
    if(PrimitiveTGT.isTouch(d,t2))console.log("is touching t2");
    if(PrimitiveTGT.isTouch(d,t3))console.log("is touching t3");
    if(PrimitiveTGT.isTouch(d,t4))console.log("is touching t4");
}
window.tgtbezier=d;
