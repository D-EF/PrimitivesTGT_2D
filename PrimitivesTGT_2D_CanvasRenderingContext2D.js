/*
 * @Date: 2022-01-11 09:09:00
 * @LastEditors: Darth_Eternalfaith
 * @LastEditTime: 2022-02-18 21:05:13
 * @FilePath: \def-web\js\visual\PrimitivesTGT_2D_CanvasRenderingContext2D.js
 * 
 * 材质和渲染器具体类
 */

import {
    OlFunction,
} from "../basics/basics.js";
import {
    Math2D,
    Rect_Data,
    Arc_Data,
    Sector_Data,
    Vector2,
    Matrix2x2,
    Matrix2x2T,
    Polygon,
    Bezier_Node,
    Bezier_Polygon,
    BezierCurve,
        }from "./Math2d.js";

import {
    Material,
    PrimitiveTGT_Renderer,
    PrimitiveTGT,
    PrimitiveRectTGT,
    PrimitiveArcTGT,
    PrimitiveSectorTGT,
    PrimitivePolygonTGT,
    PrimitiveBezierTGT,
    PrimitiveTGT_Group
}from "./PrimitivesTGT_2D.js"

import {
    Sprites,
    Sprites_Animation
}from "./Sprites.js"

/** temp
 */
 class CtrlCanvas2d{
    /** 
     * @param {CanvasRenderingContext2D} ctx 2d渲染上下文 
     * @param {Vector2} v 位置坐标
     * @param {Number} r  半径
     * @param {String} s_color #f00
     * @param {String} f_color #000
     */
   static dot(ctx,v,r=2,f_color="#f00",s_color="#000"){
       ctx.beginPath();
       ctx.arc(v.x,v.y,r,0,2*Math.PI);
       ctx.fillStyle=f_color;
       ctx.strokeStyle=s_color;
       ctx.fill();
       ctx.stroke();
   }
   
   /** 
    * @param {CanvasRenderingContext2D} ctx 
    * @param {BezierCurve} bc 
    */
   static bezier2(ctx,bc){
       ctx.beginPath();
       ctx.moveTo(bc.points[0].x,bc.points[0].y);
       ctx.quadraticCurveTo(bc.points[1].x,bc.points[1].y,bc.points[2].x,bc.points[2].y);
       ctx.stroke();
   }
   /** 
    * @param {CanvasRenderingContext2D} ctx 
    * @param {Vector2[]} vs 
    */
   static line(ctx,vs){
       ctx.beginPath();
       ctx.moveTo(vs[0].x,vs[0].y);
       ctx.lineTo(vs[1].x,vs[1].y);
       ctx.stroke();
   }
   /** 
    * @param {CanvasRenderingContext2D} ctx 
    * @param {Rect_Data} cd 
    */
   static rect(ctx,cd){
       ctx.beginPath();
       ctx.rect(cd.x,cd.y,cd.w,cd.h);
       ctx.stroke();
   }
   static rv2(ctx,v1,v2){
       var x=v1.x,
           y=v1.y,
           w=v2.x-v1.x,
           h=v2.y-v1.y;
       ctx.beginPath();
       ctx.rect(x,y,w,h);
       ctx.stroke();
   }
}

class Canvas2d_Material extends Material{
    constructor(texture){
        super();
        /**@type {Sprites} */
        this.texture=texture;
    }
    /** 获取2d材质
     * @param {Number} x 精灵图元素 x 坐标
     * @param {Number} y 精灵图元素 y 坐标
     * @param {PrimitiveTGT} tgt 图元对象
     * @param {CanvasRenderingContext2D} ctx 画布渲染上下文对象
     */
    get(tgt,ctx,type){
        if((this.texture.constructor===String)||(this.texture instanceof String)){
            return this.texture;
        }else{
            var uv=tgt[((type.toString()+'_')||'')+"uv"],
                uvwh=tgt[((type.toString()+'_')||'')+"uvwh"],
                vMin=tgt.getMin(),
                vMax=tgt.getMax();
            return this.texture.createPattern(ctx,uv.x,uv.y,vMin.x,vMin.y,(vMax.x-vMin.x)*uvwh.x,(vMax.y-vMin.y)*uvwh.y);
        }
    }
}

class Canvas2D_TGT_Renderer extends PrimitiveTGT_Renderer{
    /** Canvas2D渲染器
     * @param {PrimitiveTGT[]} renderList 等待渲染的对象列表
     * @param {CanvasRenderingContext2D} ctx 
     */
     constructor(renderList,ctx){
        super(renderList);
        /**@type {CanvasRenderingContext2D} 渲染上下文 */
        this.ctx=ctx;
    }
    /** 渲染图形 
     * @param {PrimitiveTGT} tgt
    */
    render(tgt){
        if(!tgt.visibility){
            return;
        }
        var ctx=this.ctx;
        ctx.save();
        ctx.beginPath();
        ctx.globalAlpha=tgt.globalAlpha;
        ctx.setLineDash(tgt.lineDash);
        ctx.lineDashOffset=tgt.lineDashOffset;
        ctx.transform(tgt.transformMatrix.a,tgt.transformMatrix.b,tgt.transformMatrix.c,tgt.transformMatrix.d,tgt.transformMatrix.e||0,tgt.transformMatrix.f||0);
        if(tgt.fill_Material){
            ctx.fillStyle=tgt.fill_Material.get(tgt,this.ctx,"fill");
        }
        if(tgt.stroke_Material){
            ctx.strokeStyle=tgt.stroke_Material.get(tgt,this.ctx,"stroke");
        }
        ctx.lineWidth=tgt.lineWidth;
    
        this.createCanvasPath(tgt);

        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.restore();
    }
    /** 根据 tgt 的属性 创建用于绘制的路径
     * @param {PrimitiveTGT} tgt
     */
    createCanvasPath(tgt){
        Canvas2D_TGT_Renderer.createCanvasPath[tgt.dataType](this,tgt);
    }
}


Canvas2D_TGT_Renderer.createCanvasPath={
    "group"         : function(that,tgt){
        for(var i=0;i<tgt.children.length;++i){
            that.render(tgt.children[i]);
        }
    },
    "Rect_Data"     : function(that,tgt){
        var ctx=that.ctx;
        ctx.rect(tgt.data.x,tgt.data.y,tgt.data.w,tgt.data.h);
    },
    "Arc_Data"      : function(that,tgt){
        var ctx=that.ctx;
        ctx.arc(tgt.data.c.x,tgt.data.c.y,tgt.data.r,tgt.data.startAngle,tgt.data.endAngle,false);
        if(tgt.want_to_closePath){
            var arcA=Math.abs((tgt.data.anticlockwise?(tgt.data.startAngle-tgt.data.endAngle):(tgt.data.endAngle-tgt.data.startAngle)));
            if((Math.PI*2>arcA)&&tgt.want_to_closePath){
                ctx.closePath();
            }
        }
    },
    "Sector_Data"   : function(that,tgt){
        var ctx=that.ctx;
        ctx.arc(tgt.data.c.x,tgt.data.c.y,tgt.data.r,tgt.data.startAngle,tgt.data.endAngle,false);
        if(tgt.want_to_closePath){
            var arcA=Math.abs((tgt.data.anticlockwise?(tgt.data.startAngle-tgt.data.endAngle):(tgt.data.endAngle-tgt.data.startAngle)));
            ctx.lineTo(tgt.data.c.x,tgt.data.c.y)
            if((Math.PI*2>arcA)){
                ctx.closePath();
            }
        }
    },
    "Polygon"       : function(that,tgt){
        var ctx=that.ctx;
        var i=tgt.data.nodes.length-1,
            nodes=tgt.data.nodes;
        ctx.moveTo(nodes[i].x,nodes[i].y);
        for(--i;i>=0;--i){
            ctx.lineTo(nodes[i].x,nodes[i].y);
        }
        if(tgt.want_to_closePath){
            ctx.closePath();
        }
    },
    "Bezier_Polygon": function(that,tgt){
        var ctx=that.ctx;
        var nodes=tgt.data.nodes,i=0;
        ctx.moveTo(nodes[i].node.x,nodes[i].node.y);
        for(i=1;i<tgt.data.nodes.length;++i){
            ctx.bezierCurveTo(nodes[i-1].hand_after.x,nodes[i-1].hand_after.y,nodes[i].hand_before.x,nodes[i].hand_before.y,nodes[i].node.x,nodes[i].node.y);
        }
        if(tgt.want_to_closePath&&!tgt.data.isClosed()){
            if(tgt.want_to_closePath===-1){
                ctx.closePath();
            }
            else{
                ctx.bezierCurveTo(nodes[i-1].hand_after.x,nodes[i-1].hand_after.y,nodes[0].hand_before.x,nodes[0].hand_before.y,nodes[0].node.x,nodes[0].node.y);
            }
        }
    },
}

export{
    PrimitiveRectTGT,
    PrimitiveArcTGT,
    PrimitiveSectorTGT,
    PrimitivePolygonTGT,
    PrimitiveBezierTGT,
    PrimitiveTGT_Group,
    CtrlCanvas2d,
    Canvas2d_Material,
    Canvas2D_TGT_Renderer,
    Sprites,
    Sprites_Animation
}