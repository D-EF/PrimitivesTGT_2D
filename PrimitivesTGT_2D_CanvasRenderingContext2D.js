/*
 * @Date: 2022-01-11 09:09:00
 * @LastEditors: Darth_Eternalfaith
 * @LastEditTime: 2022-01-13 19:56:30
 * @FilePath: \def-web\js\visual\PrimitivesTGT_2D_CanvasRenderingContext2D.js
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
    bezier_i_bezier_v,
    center_v2,
}from "./Math2d.js";

/**
 * temp
 */
 class CtrlCanvas2d{
    /**
     * 
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
    * 
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
    * 
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
    * 
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


/**
 * 创建精灵图像填充类型
 * @param {Sprites} _sprites 精灵图像实例
 */
function createSpritesFillStyle(_sprites,sx,sy){
    var vMin=this.getMin();
    var vMax=this.getMax();
    return _sprites.createPattern(sx,sy,vMin.x,vMin.y,vMax.x-vMin.x,vMax.y-vMin.y);
}

class PrimitiveTGT_Renderer{
    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    constructor(ctx){
        /**@type {CanvasRenderingContext2D} 渲染上下文 */
        this.ctx=ctx;
        this.fillStyle="#fff0";
        this.strokeStyle="#000";
    }
    static copy(tgt){

    }
    copy(){
        PrimitiveTGT_Renderer.copy(this);
    }
    
    /** 
     * 渲染图形 
     * @param {CanvasRenderingContext2D} ctx 目标画布的上下文
    */
    render(ctx){
        ctx.save();
        ctx.beginPath();
        ctx.transform(this.transformMatrix.a,this.transformMatrix.b,this.transformMatrix.c,this.transformMatrix.d,this.transformMatrix.e||0,this.transformMatrix.f||0);
        ctx.fillStyle=this.fillStyle;
        ctx.strokeStyle=this.strokeStyle;
        ctx.lineWidth=this.lineWidth;
    
        this.createCanvasPath(ctx);

        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.restore();
    }
    /**
     * 根据 tgt 的属性 创建用于绘制的路径
     * @param {CanvasRenderingContext2D} ctx 目标画布的上下文
     */
    createCanvasPath(ctx){
        // 在派生类中实现
    }
}