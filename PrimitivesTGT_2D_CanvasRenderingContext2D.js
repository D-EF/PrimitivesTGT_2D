/*
 * @Date: 2022-01-11 09:09:00
 * @LastEditors: Darth_Eternalfaith
 * @LastEditTime: 2022-01-11 09:31:50
 * @FilePath: \def-web\js\visual\PrimitivesTGT_2D_CanvasRenderingContext2D.js
 */

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