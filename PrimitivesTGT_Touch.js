/*
 * @Author: Darth_Eternalfaith
 * @Date: 2022-03-15 00:41:42
 * @LastEditors: Darth_Eternalfaith
 * @LastEditTime: 2022-03-15 00:59:12
 * @FilePath: \def-web\js\visual\PrimitivesTGT_Touch.js
 * 碰撞检测函数
 */

import {
    OlFunction,
    Delegate
} from "../basics/basics.js";
import {
    Math2D,
    Data_Rect,
    Data_Arc,
    Data_Sector,
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
    Renderer_PrimitiveTGT,
    PrimitiveTGT,
    PrimitiveTGT__Rect,
    PrimitiveTGT__Arc,
    PrimitiveTGT__Sector,
    PrimitiveTGT__Polygon,
    PrimitiveTGT__Bezier,
    PrimitiveTGT__Group
} from './PrimitivesTGT_2D.js';
/** @type {Number} 默认精度 用于弧形转换成多边形 */
PrimitiveTGT.accuracy=20;
PrimitiveTGT.isTouch=OlFunction.create(isTouch_base);

/** 可以通用的碰撞检测函数 将对象转换成多边形 开销较大
 * @param {PrimitiveTGT} primitive1
 * @param {PrimitiveTGT} primitive2
 */
function isTouch_base(primitiveTGT1,primitiveTGT2){
    var tgt1 = primitiveTGT1.toPolygon(PrimitiveTGT.accuracy,primitive1.want_to_closePath);
    var tgt2 = primitiveTGT2.toPolygon(PrimitiveTGT.accuracy,primitive2.want_to_closePath);
    var i;
    for(i=tgt1.data.nodes.length-1;i>=0;--i){
        tgt1.data.nodes[i]=tgt1.localToWorld(tgt1.data.nodes[i]);
    }
    for(i=tgt2.data.nodes.length-1;i>=0;--i){
        tgt2.data.nodes[i]=tgt2.localToWorld(tgt2.data.nodes[i]);
    }
    tgt1.data.reMinMax();
    tgt2.data.reMinMax();
    
    if(Polygon.getImpactFlag(tgt1.data,tgt2.data)){
        return true;                                         
    }
    return primitiveTGT1.is_inside(primitiveTGT2.localToWorld(primitiveTGT2.data.nodes[0]))||primitiveTGT2.is_inside(primitiveTGT1.localToWorld(primitiveTGT1.data.nodes[0]));
}

/** 碰撞检测函数 矩形 弧形(圆形)
 * @param {PrimitiveTGT__Rect} tgt1 进行碰撞检测的对象
 * @param {PrimitiveTGT__Arc}  tgt2 进行碰撞检测的对象
 */
function isTouch_Rect_Arc(tgt1,tgt2){
    var t1=tgt1.toPolygon();
    return isTouch_Arc_Polygon(tgt2,t1);
}
PrimitiveTGT.isTouch.addOverload([PrimitiveTGT__Rect,PrimitiveTGT__Arc],isTouch_Rect_Arc);
PrimitiveTGT.isTouch.addOverload([PrimitiveTGT__Arc,PrimitiveTGT__Rect],function(tgt1,tgt2){
    return isTouch_Rect_Arc(tgt2,tgt1)
});

/** 碰撞检测函数 矩形 多边形
 * @param {PrimitiveTGT__Rect} tgt1
 * @param {PrimitiveTGT__Polygon} tgt2
 */
function isTouch_Rect_Polygon(tgt1,tgt2){
    
    var t2d=Polygon.linearMapping(tgt2.data,tgt2.transform_matrix,false);
        nodes=t2d.nodes;

    var i =nodes.length-1;
    for(;i>=0;--i){
        if(tgt1.is_inside(nodes[i].x,nodes[i].y)){
            return true;
        }
    }
    if(tgt2.want_to_closePath||t2d.isClosed()){
        var min=tgt1.localToWorld(tgt1.get_min());
            max=tgt1.localToWorld(tgt1.get_max());
        return tgt2.is_inside(min.x,min.y)||
            tgt2.is_inside(max.x,max.y)||
            tgt2.is_inside(max.x,min.y)||
            tgt2.is_inside(min.x,max.y);
    }
    else{
        return false;
    }
}
PrimitiveTGT.isTouch.addOverload([PrimitiveTGT__Rect,PrimitiveTGT__Polygon],isTouch_Rect_Polygon);
PrimitiveTGT.isTouch.addOverload([PrimitiveTGT__Polygon,PrimitiveTGT__Rect],function(tgt1,tgt2){
    return isTouch_Rect_Polygon(tgt2,tgt1);
});

/** 碰撞检测函数 弧形(圆形) 多边形
 * @param {PrimitiveTGT__Arc} tgt1
 * @param {PrimitiveTGT__Polygon} tgt2
 */
 function isTouch_Arc_Polygon(tgt1,tgt2){
    var i =tgt2.data.nodes.length-1,
        l=i;
    if(l<0)return false;
    console.log(1)
    var t2d1=Polygon.linearMapping(tgt2.data,tgt2.transform_matrix,false);
    var t2d=Polygon.linearMapping(t2d1,tgt1.worldToLocalM,true);
        nodes=t2d.nodes;

    for(;i>0;--i){
        if(Math2D.get_intersectionOfArcLine_f(tgt1.data,nodes[i],nodes[i-1])){
            return true;
        }
    }
    var opv,edv;
    if(tgt1.want_to_closePath){
        // 割圆 的线段也要判断
        opv=Vector2.sum(tgt1.data.opv,tgt1.data.c);
        edv=tgt1.data.edv.sum(tgt1.data.c);
        for(i=l;i>0;--i){
            if(Math2D.get_intersectionOfLineLine_f(opv,edv,nodes[i],nodes[i-1])){
                return true;
            }
        }
    }
    if((l>1&&tgt2.want_to_closePath)&&(!tgt2.data.isClosed())){
        // 规定闭合路径的多边形, 多算一次
        if(Math2D.get_intersectionOfArcLine_f(tgt1.data,nodes[0],nodes[l])){
            return true;
        }
        if(tgt1.want_to_closePath){
            if(Math2D.get_intersectionOfLineLine_f(tgt1.data.opv,tgt1.data.edv,nodes[0],nodes[l])){
                return true;
            }
        }
    }
    if(tgt2.want_to_closePath||tgt2.data.isClosed()){
        return t2d.is_inside(tgt1.data.c.x+tgt1.data.opv.x,tgt1.data.c.y+tgt1.data.opv.y,true);
    }
    return false;
}
PrimitiveTGT.isTouch.addOverload([PrimitiveTGT__Arc,PrimitiveTGT__Polygon],isTouch_Arc_Polygon);
PrimitiveTGT.isTouch.addOverload([PrimitiveTGT__Polygon,PrimitiveTGT__Arc],function(tgt1,tgt2){
    return isTouch_Arc_Polygon(tgt2,tgt1);
});

/** 碰撞检测函数 弧形(圆形) 弧形
 * @param {PrimitiveTGT__Arc} tgt1 
 * @param {PrimitiveTGT__Arc} tgt2 
 */
function isTouch_Arc_Arc(tgt1,tgt2){
    var tgtt=tgt1.toPolygon();
    return isTouch_Arc_Polygon(tgt2,tgtt);
}

PrimitiveTGT.isTouch.addOverload([PrimitiveTGT__Arc,PrimitiveTGT__Arc],isTouch_Arc_Arc);

// 扇形碰撞 -------------------------------------------------------------------------------------------------

/** 碰撞检测函数 矩形 扇形(圆形)
 * @param {PrimitiveTGT__Rect} tgt1 进行碰撞检测的对象
 * @param {PrimitiveTGT__Sector}  tgt2 进行碰撞检测的对象
 */
 function isTouch_Rect_Sector(tgt1,tgt2){
    var t1=tgt1.toPolygon();
    return isTouch_Sector_Polygon(tgt2,t1);
}
PrimitiveTGT.isTouch.addOverload([PrimitiveTGT__Rect,PrimitiveTGT__Sector],isTouch_Rect_Sector);
PrimitiveTGT.isTouch.addOverload([PrimitiveTGT__Sector,PrimitiveTGT__Rect],function(tgt1,tgt2){
    return isTouch_Rect_Sector(tgt2,tgt1);
});

/** 碰撞检测函数 扇形(圆形) 多边形
 * @param {PrimitiveTGT__Sector} tgt1 
 * @param {PrimitiveTGT__Polygon} tgt2 
 */
 function isTouch_Sector_Polygon(tgt1,tgt2){
    var i =tgt2.data.nodes.length-1,
        l=i;
    if(l<0)return false;
    console.log(1)
    var t2d1=Polygon.linearMapping(tgt2.data,tgt2.transform_matrix,false);
    var t2d=Polygon.linearMapping(t2d1,tgt1.worldToLocalM,true);
        nodes=t2d.nodes;

    for(;i>0;--i){
        if(Math2D.get_intersectionOfSectorLine_f(tgt1.data,nodes[i],nodes[i-1])){
            return true;
        }
    }
    if((l>1&&tgt2.want_to_closePath)&&(!tgt2.data.isClosed())){
        // 规定闭合路径的多边形, 多算一次
        if(Math2D.get_intersectionOfSectorLine_f(tgt1.data,nodes[0],nodes[l])){
            return true;
        }
    }
    if(tgt2.want_to_closePath||tgt2.data.isClosed()){
        return t2d.is_inside(tgt1.data.c.x,tgt1.data.c.y,true);
    }
    return false;
}

PrimitiveTGT.isTouch.addOverload([PrimitiveTGT__Sector,PrimitiveTGT__Polygon],isTouch_Sector_Polygon);
PrimitiveTGT.isTouch.addOverload([PrimitiveTGT__Polygon,PrimitiveTGT__Sector],function(tgt1,tgt2){
    return isTouch_Sector_Polygon(tgt2,tgt1)
});

/** 碰撞检测函数 扇形(圆形) 弧形
 * @param {PrimitiveTGT__Sector} tgt1 
 * @param {PrimitiveTGT__Arc} tgt2 
 */
 function isTouch_Sector_Arc(tgt1,tgt2){
    var tgtt=tgt1.toPolygon();
    return isTouch_Arc_Polygon(tgt2,tgtt);
}

PrimitiveTGT.isTouch.addOverload([PrimitiveTGT__Sector,PrimitiveTGT__Arc],isTouch_Sector_Arc);
PrimitiveTGT.isTouch.addOverload([PrimitiveTGT__Arc,PrimitiveTGT__Sector],function(tgt1,tgt2){
    return isTouch_Sector_Arc(tgt2,tgt1)
});

/** 碰撞检测函数 扇形(圆形) 弧形
 * @param {PrimitiveTGT__Sector} tgt1 
 * @param {PrimitiveTGT__Sector} tgt2 
 */
 function isTouch_Sector_Sector(tgt1,tgt2){
    var tgtt=tgt1.toPolygon();
    return isTouch_Sector_Polygon(tgt2,tgtt);
}

PrimitiveTGT.isTouch.addOverload([PrimitiveTGT__Sector,PrimitiveTGT__Sector],isTouch_Sector_Sector);

/** 碰撞检测函数 贝塞尔曲线 多边形
 * @param {PrimitiveTGT__Bezier} tgt1 
 * @param {PrimitiveTGT__Polygon} tgt2 
 */
function isTouch_Bezier_Polygon(tgt1,tgt2){
    var t1d_w=tgt1.world_bezier;
    var t2d1=Polygon.linearMapping(tgt2.data,tgt2.transform_matrix,false);
    if(t2d1.is_inside(t1d_w.nodes[0].node)||t1d_w.is_inside(t2d1.nodes[0])){
        return true;
    }
    var i=0,j=0;
    var tempBezierCurve=null;

    i=t1d_w.nodes.length-1;
    if(tgt1._want_to_closePath===-1){
        // 曲线对象正在使用直线闭合起点~终点 
        j=t2d1.nodes.length-1;
        if(tgt2.want_to_closePath){
            if(Math2D.get_intersectionOfLineLine_f(t2d1.nodes[j],t2d1.nodes[0],t1d_w.nodes[0].node,t1d_w.nodes[i].node))return true;
        }
        for(--j;j>=0;--j){
            if(Math2D.get_intersectionOfLineLine_f(t1d_w.nodes[0].node,t1d_w.nodes[i].node,t2d1.nodes[j],t2d1.nodes[j+1]))return true;
        }
    }
    if(tgt1._want_to_closePath!==1)--i;
    for(;i>=0;--i){
        tempBezierCurve=t1d_w.get_bezierCurve(i);

        j=t2d1.nodes.length-1;
        if(tgt2.want_to_closePath){
            if(Math2D.get_intersectionOfLineBezier_v(t2d1.nodes[j],t2d1.nodes[0],tempBezierCurve).length>0)return true;
        }
        for(--j;j>=0;--j){
            if(Math2D.get_intersectionOfLineBezier_v(t2d1.nodes[j+1],t2d1.nodes[j],tempBezierCurve).length>0)return true;
        }
    }
    return false;
}
PrimitiveTGT.isTouch.addOverload([PrimitiveTGT__Bezier,PrimitiveTGT__Polygon],isTouch_Bezier_Polygon);
PrimitiveTGT.isTouch.addOverload([PrimitiveTGT__Polygon,PrimitiveTGT__Bezier],function(tgt1,tgt2){
    return isTouch_Bezier_Polygon(tgt2,tgt1);
});

/** 碰撞检测函数 贝塞尔曲线 矩形
 * @param {PrimitiveTGT__Bezier} tgt1 
 * @param {PrimitiveTGT__Rect} tgt2 
 */
function isTouch_Bezier_Rect(tgt1,tgt2){
    var t_tgt2=tgt2.toPolygon();
    return isTouch_Bezier_Polygon(tgt1,t_tgt2);
}
PrimitiveTGT.isTouch.addOverload([PrimitiveTGT__Bezier,PrimitiveTGT__Rect],isTouch_Bezier_Rect);
PrimitiveTGT.isTouch.addOverload([PrimitiveTGT__Rect,PrimitiveTGT__Bezier],function(tgt1,tgt2){
    return isTouch_Bezier_Rect(tgt2,tgt1);
});
/** 碰撞检测函数 贝塞尔曲线 弧形
 * @param {PrimitiveTGT__Bezier} tgt1 
 * @param {PrimitiveTGT__Arc} tgt2 
 */
function isTouch_Bezier_Arc(tgt1,tgt2){
    var t1d_l2=Bezier_Polygon.linearMapping(tgt1.world_bezier,tgt2.worldToLocalM,true),
        t2d=tgt2.data;

    var i=t1d_l2.nodes.length-1;
    var temp;
    if(t1d_l2.is_inside(t2d.opv)||t1d_l2.is_inside(t2d.edv)||t2d.is_inside(t1d_l2.nodes[0].node)){
        return true;
    }
    if(tgt1._want_to_closePath===-1){
        // 曲线对象正在使用直线闭合起点~终点 
        if(tgt2.want_to_closePath){
            // 弧形自闭合,多计算一个直线段(弦)
            if(Math2D.get_intersectionOfLineLine_f(t2d.opv,t2d.edv,t1d_l2.nodes[0].node,t1d_l2.nodes[i].node)){
                return true;
            }
        }
        if(Math2D.get_intersectionOfArcLine_f(t2d,t1d_l2.nodes[0].node,t1d_l2.nodes[i].node)){
            return true;
        }
    }
    if(tgt1._want_to_closePath!==1)--i;
    for(;i>=0;--i){
        temp=t1d_l2.get_bezierCurve(i);
        if(tgt2.want_to_closePath){
            // 弧形自闭合,多计算一个直线段(弦)
            if(Math2D.get_intersectionOfLineBezier_v(t2d.opv,t2d.edv,temp).length){
                return true;
            }
        }
        if(Math2D.get_intersectionOfArcBezier_v(t2d,temp).length){
            return true;
        }
    }
    return false;
}
PrimitiveTGT.isTouch.addOverload([PrimitiveTGT__Bezier,PrimitiveTGT__Arc],isTouch_Bezier_Arc);
PrimitiveTGT.isTouch.addOverload([PrimitiveTGT__Arc,PrimitiveTGT__Bezier],function(tgt1,tgt2){
    return isTouch_Bezier_Arc(tgt2,tgt1);
});
/** 碰撞检测函数 贝塞尔曲线 扇形
 * @param {PrimitiveTGT__Bezier} tgt1 
 * @param {PrimitiveTGT__Sector} tgt2 
 */
function isTouch_Bezier_Sector(tgt1,tgt2){
    var t1d_l2=Bezier_Polygon.linearMapping(tgt1.world_bezier,tgt2.worldToLocalM,true),
        t2d=tgt2.data;

    var i=t1d_l2.nodes.length-1;
    var temp;
    if(t1d_l2.is_inside(t2d.opv)||t1d_l2.is_inside(t2d.edv)||t2d.is_inside(t1d_l2.nodes[0].node)){
        return true;
    }
    if(tgt1._want_to_closePath===-1){
        // 曲线对象正在使用直线闭合起点~终点 
        if(tgt2.want_to_closePath){
            // 弧形自闭合,多计算一个直线段(弦)
            if( Math2D.get_intersectionOfLineLine_f(t2d.c,t2d.opv,t1d_l2.nodes[0].node,t1d_l2.nodes[i].node)||
                Math2D.get_intersectionOfLineLine_f(t2d.c,t2d.edv,t1d_l2.nodes[0].node,t1d_l2.nodes[i].node)){
                return true;
            }
        }
        if(Math2D.get_intersectionOfArcLine_f(t2d,t1d_l2.nodes[0].node,t1d_l2.nodes[i].node)){
            return true;
        }
    }
    if(tgt1._want_to_closePath!==1)--i;
    for(;i>=0;--i){
        temp=t1d_l2.get_bezierCurve(i);
        // 弧形自闭合,多计算一个直线段(弦)
        if( Math2D.get_intersectionOfLineBezier_v(t2d.c,t2d.edv,temp).length||
            Math2D.get_intersectionOfLineBezier_v(t2d.c,t2d.opv,temp).length){
            return true;
        }
        if(Math2D.get_intersectionOfArcBezier_v(t2d,temp).length){
            return true;
        }
    }
    return false;
}
PrimitiveTGT.isTouch.addOverload([PrimitiveTGT__Bezier,PrimitiveTGT__Sector],isTouch_Bezier_Sector);
PrimitiveTGT.isTouch.addOverload([PrimitiveTGT__Sector,PrimitiveTGT__Bezier],function(tgt1,tgt2){
    return isTouch_Bezier_Arc(tgt2,tgt1);
});
/** 碰撞检测函数 贝塞尔曲线 贝塞尔曲线
 * @param {PrimitiveTGT__Bezier} tgt1 
 * @param {PrimitiveTGT__Bezier} tgt2 
 */
function isTouch_Bezier_Bezier(tgt1,tgt2){
    var t1d_w=tgt1.world_bezier;
    var t2d_w=tgt2.world_bezier;
    if(t2d_w.is_inside(t1d_w.nodes[0].node)||t1d_w.is_inside(t2d_w.nodes[0].node)){
        return true;
    }
    var i=0,j=0;
    var tempBezierCurve=null,tempBezierCurve2;

    i=t1d_w.nodes.length-1;
    if(tgt1._want_to_closePath===-1){
        // 曲线对象1正在使用直线闭合起点~终点 
        j=t2d_w.nodes.length-1;
        if(tgt2.want_to_closePath===-1){
            if(Math2D.get_intersectionOfLineLine_f(t2d_w.nodes[j].node,t2d_w.nodes[0].node,t1d_w.nodes[j].node,t1d_w.nodes[0].node))return true;
        }
        if(tgt2._want_to_closePath!==1)--j;
        for(;j>=0;--j){
            tempBezierCurve=t2d_w.get_bezierCurve(j);
            if(Math2D.get_intersectionOfLineBezier_v(t1d_w.nodes[i].node,t1d_w.nodes[0].node,tempBezierCurve).length>0)return true;
        }
    }
    if(tgt1._want_to_closePath!==1)--i;
    for(;i>=0;--i){
        tempBezierCurve=t1d_w.get_bezierCurve(i);
        j=t2d_w.nodes.length-1;
        if(tgt2._want_to_closePath!==1)--j;
        for(;j>=0;--j){
            tempBezierCurve2=t2d_w.get_bezierCurve(j);
            if(Math2D.get_intersectionOfBezierBezier_f(tempBezierCurve,tempBezierCurve2,0.01,true).length){
                return true;
            }
        }
    }
    return false;
}
PrimitiveTGT.isTouch.addOverload([PrimitiveTGT__Bezier,PrimitiveTGT__Bezier],isTouch_Bezier_Bezier);

/** 没有进行矩阵变换的世界坐标系多边形tgt数组 和 tgt组 碰撞检测
 * @param {PrimitiveTGT__Polygon[]} _tgts 多边形对象数组 不要加矩阵
 * @param {PrimitiveTGT__Group} g 组
 * @param {PrimitiveTGT__Group} pg g的父组
 */
function isTouch_noTransformPolygons_Group(_tgts,g,pg){
    var tgts=_tgts;
    var i,j,t_nodes;
    // 将顶点数据转换到 pg 的局部坐标系
    if(pg){
        for(i=tgts.lengthi;i>=0;--i){
            tgts[i]=tgts[i].copy();
            t_nodes=tgts[i].data.nodes;
            for(j=t_nodes.length-1;j>=0;--j){
                t_nodes[j]=pg.worldToLocal(t_nodes[j]);
            }
        }
    }
    for(i=tgts.length-1;i>=0;--i){
        tgts[i].transform_matrix=g.transform_matrix;
        for(j=g.data.length-1;j>=0;--j){
            if(g.data[j] instanceof PrimitiveTGT__Group){
                if(isTouch_noTransformPolygons_Group(tgts,g.data[j],g)){
                    return true;
                }
            }else{
                if(PrimitiveTGT.isTouch(tgts[i],g.data[j])){
                    return true;
                }
            }
        }
    }
    return false;
}
/** 碰撞检测函数 组 组
 * @param {PrimitiveTGT__Group} group1
 * @param {PrimitiveTGT__Group} group2
 */
function isTouch_Group_Group(group1,group2){
    var g1_Polygons=group1.create_worldPolygons();
    return isTouch_noTransformPolygons_Group(g1_Polygons,group2);
}
PrimitiveTGT.isTouch.addOverload([PrimitiveTGT__Group,PrimitiveTGT__Group],isTouch_Group_Group);

PrimitiveTGT.isTouch.addOverload([PrimitiveTGT__Group,PrimitiveTGT],function (group,tgt){
    return isTouch_noTransformPolygons_Group([tgt],group);
});
PrimitiveTGT.isTouch.addOverload([PrimitiveTGT,PrimitiveTGT__Group],function (tgt,group){
    return isTouch_noTransformPolygons_Group([tgt],group);
});


export{
    // not anything export
}