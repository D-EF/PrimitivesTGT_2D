/*!
 *  用于 canvas 面向对象化的 tgt 库
 *  注意 canvas 大部分情况是 x 正方向向右, y 正方向向下的。
 *  canvas 是向量后乘矩阵再偏移
 */

// data


class CanvasTGT{
    constructor(){
        this.data;
        this.fillStyle="#fff";
        this.strokeStyle="#000";
        this.lineWidth=1;
        this.transformMatrix=createMatrix2x2T();
        this.temp_worldToLocalM=createMatrix2x2T();
        this.want_to_closePath=false;
    }
    /**
     * 拷贝函数
     * @return {CanvasTGT} 返回一个拷贝
     */
    copy(){
        var rtn=new this.constructor();

        if(this.data.copy){
            rtn.data=this.data.copy();
        }
        else{
            rtn.data=Object.assign({},this.data);
        }

        rtn.fillStyle           = this.fillStyle;
        rtn.strokeStyle         = this.strokeStyle;
        rtn.lineWidth           = this.lineWidth;
        rtn.transformMatrix     = Matrix2x2T.prototype.copy.call(this.transformMatrix);
        rtn.temp_worldToLocalM  = Matrix2x2T.prototype.copy.call(this.temp_worldToLocalM);
        
        return rtn;
    }
    /** 
     * 获取最小的(局部)坐标
     * @returns {Vector2} 返回一个向量
     */
    getMin(){
        return this.data.getMin();
    }
    /** 
     * 获取最大的(局部)坐标
     * @returns {Vector2} 返回一个向量
     */
    getMax(){
        return this.data.getMax();
    }
    /**
     * 创建填充类型
     * @param {Sprites} _sprites 精灵图像实例
     */
    createSpritesFillStyle(_sprites,sx,sy,sw,sh){
        var vMin=this.getMin();
        var vMax=this.getMax();
        return _sprites.createPattern(sx,sy,sw,sh,vMin.x,vMin.y,vMax.x-vMin.x,vMax.y-vMin.y);
    }
    /**
     * 设置变换矩阵
     * @param {Matrix2x2T} m 
     * @return {CanvasTGT} 返回当前对象
     */
    setTransformMatrix(m){
        this.transformMatrix=m.copy();
        this.temp_worldToLocalM=m.inverse();
        return this;
    }
    // 这是个有多个重载的函数 , 在class定义的外面实现
    /**
     * 将局部坐标系变换到世界坐标系
     * @method localToWorld 拥有两个重载
     * @param {Number} x 重载1的参数 局部坐标x
     * @param {Number} y 重载1的参数 局部坐标y
     * @param {Vector2} v  重载2的参数 局部坐标向量
     * @returns {Vector2} 返回一个世界坐标系的向量
     */
    localToWorld (x,y){
        // 这是个有多个重载的函数 , 在class定义的外面实现
    }
    /**
     * 将世界坐标系变换到局部坐标系
     * @method localToWorld 拥有两个重载
     * @param {Number} x 重载1的参数 世界坐标x
     * @param {Number} y 重载1的参数 世界坐标y
     * @param {Vector2} v  重载2的参数 世界坐标向量
     * @returns {Vector2} 返回一个局部坐标系的向量
     */
    worldToLocal (x,y){
        // 在class定义的外面, 实现重载
    }
    /** 
     * 判断某一点是否在目标内部
     * @param {Number} _x    重载1的参数 世界坐标x
     * @param {Number} _y    重载1的参数 世界坐标y
     * @param {Vector2} _v   重载2的参数 世界坐标向量
    */
    isInside(_x,_y){
        // 2个重载
    }
    /** 
     * 渲染图形 
     * @param {CanvasRenderingContext2D} ctx 目标画布的上下文
    */
    render(ctx){
        ctx.save();
        ctx.beginPath();
        ctx.transform(this.transformMatrix.a,this.transformMatrix.b,this.transformMatrix.c,this.transformMatrix.d,this.transformMatrix.e,this.transformMatrix.f);
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
     * 注册事件
     * @param {Element} element     触发事件的html元素 , 一般是挂到canvas上
     * @param {String} type         事件的类型 Event.type 
     * @param {Function} listener   事件触发的函数
     */
    regEvent(element,type,listener){
        if(!this[type+"Event"]){
            this[type+"Event"]=[listener];
        }
        else{
            this[type+"Event"].push(listener);
        }
        if(!element.eventTGTs){
            element.eventTGTs={};
        }
        if(!element.eventTGTs[type]){
            element.eventTGTs[type]=[this];
            element.addEventListener(type,CanvasTGT.trigger);
        }
        else{
            var flag;
            for(var i=element.eventTGTs[type].length-1;i>=0;--i){
                if(flag=element.eventTGTs[type][i]==this)break;
            }
            if(!flag)element.eventTGTs[type].push(this);
        }
    }
    /**
     * 根据 tgt 的属性 创建用于绘制的路径
     * @param {CanvasRenderingContext2D} ctx 目标画布的上下文
     */
    createCanvasPath(ctx){
        // 在派生类中实现
    }
    /** 转换成多边形 */
    toPolygon(){
        var rtn = new CanvasPolygonTGT(this.data.ceratePolygonProxy(...arguments));
        rtn.fillStyle   =this.fillStyle;
        rtn.strokeStyle =this.strokeStyle;
        rtn.lineWidth   =this.lineWidth;
        rtn.setTransformMatrix(this.transformMatrix);
        return rtn;
    }
    /**
     * 碰撞检测 有多个重载, 在class外面实现
     * @param {CanvasTGT} canvasTGT1 需要检测碰撞的对象
     * @param {CanvasTGT} canvasTGT2 需要检测碰撞的对象
     */
    static isTouch(){}
    /**
     * 根据鼠标xy触发内部tgt事件
     */
    static trigger(e){
        var i,j,tgts=this.eventTGTs[e.type]
        for(i=tgts.length-1;i>=0;--i){
            if(tgts[i].isInside(e.offsetX,e.offsetY)){
                for(j=tgts[i][e.type+"Event"].length-1;j>=0;--j){
                    if(tgts[i][e.type+"Event"][j].call(tgts[i],e,this)=="stop")return;
                }
            }
        }
    }   //回调地狱 ('A'#)
}


CanvasTGT.prototype.isInside=OlFunction.create();
CanvasTGT.prototype.isInside.addOverload([Number,Number],function(_x,_y){
    var v=this.worldToLocal(_x,_y);
    return this.data.isInside(v.x,v.y,this.want_to_closePath);
});
CanvasTGT.prototype.isInside.addOverload([Vector2],function(_v){
    var v=this.worldToLocal(_v);
    return this.data.isInside(v.x,v.y,this.want_to_closePath);
});

// 局部坐标 to 世界坐标
CanvasTGT.prototype.localToWorld=OlFunction.create();
CanvasTGT.prototype.localToWorld.addOverload([Number,Number],function(x,y){
    return Vector2.afterTranslate_linearMapping(new Vector2(x,y),this.transformMatrix);
});
CanvasTGT.prototype.localToWorld.addOverload([Vector2],function(v){
    return Vector2.afterTranslate_linearMapping(v,this.transformMatrix);
});
// 世界坐标 to 局部坐标
CanvasTGT.prototype.worldToLocal=OlFunction.create();
CanvasTGT.prototype.worldToLocal.addOverload([Number,Number],function(x,y){
    var tm;
    if(this.temp_worldToLocalM){
        tm=this.temp_worldToLocalM;
    }
    else{
        tm=this.transformMatrix.inverse();
        this.temp_worldToLocalM=tm;
    }
    return Vector2.beforeTranslate_linearMapping(new Vector2(x,y),tm);
});
CanvasTGT.prototype.worldToLocal.addOverload([Vector2],function(v){
    var tm;
    if(this.temp_worldToLocalM&&(this.temp_worldToLocalM)){
        tm=this.temp_worldToLocalM;
    }
    else{
        tm=this.transformMatrix.inverse();
        this.temp_worldToLocalM=tm;
    }
    return Vector2.beforeTranslate_linearMapping(v,tm);
});

/** 矩形
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} width 
 * @param {Number} height 
 */
class CanvasRectTGT extends CanvasTGT{
    constructor(x,y,w,h){
        super();
        this.data=new Ract_Data(x,y,w,h);
    }
    createCanvasPath(ctx){
        ctx.rect(this.data.x,this.data.y,this.data.w,this.data.h);

    }
}


/**
 * 弧形
 * 需要注意旋转方向因为坐标系不同而有所变动
 */
class CanvasArcTGT extends CanvasTGT{
    /**
     * @param {Number} cx 圆心的坐标
     * @param {Number} cy 圆心的坐标
     * @param {Number} r  半径
     * @param {Number} startAngle       起点的弧度
     * @param {Number} endAngle         终点的弧度
     */
    constructor(cx,cy,r,startAngle,endAngle){
        super();
        this.data=new Arc_Data(cx,cy,r,startAngle,endAngle);
    }
    createCanvasPath(ctx){
        ctx.arc(this.data.c.x,this.data.c.y,this.data.r,this.data.startAngle,this.data.endAngle,false);
        if(this.want_to_closePath){
            var arcA=Math.abs((this.data.anticlockwise?(this.data.startAngle-this.data.endAngle):(this.data.endAngle-this.data.startAngle)));
            if((Math.PI*2>arcA)&&this.want_to_closePath){
                ctx.closePath();
            }
        }
    }
}

/** 多边形
*/
class CanvasPolygonTGT extends CanvasTGT{
    /**
     * @param {Polygon} _polygon 多边形
     */
    constructor(_polygon){
        super();
        /**
         * @type {Polygon}
         */
        this.data=Polygon.prototype.copy.call(_polygon);
        if(this.data)this.data.reMinMax();
    }
    
    getPolygonProxy(){
        return this.data.copy();
    }
    isInside(_x,_y){
        var tv=this.worldToLocal(_x,_y);
        var x=tv.x,y=tv.y;
        if(this.data.min.x>x||this.data.max.x<x||this.data.min.y>y||this.data.max.y<y) return false;
        return this.data.isInside(x,y,this.want_to_closePath);
        
    }
    createCanvasPath(){
        var i=this.data.nodes.length-1,
            nodes=this.data.nodes;
        ctx.moveTo(nodes[i].x,nodes[i].y);
        for(--i;i>=0;--i){
            ctx.lineTo(nodes[i].x,nodes[i].y);
        }
        if(this.want_to_closePath){
            ctx.closePath();
        }
    }
}


//碰撞检测函数 ----------------------------------------------------------------------------------------------------------------------------------

/** @type {Number} 默认精度 用于弧形转换成多边形 */
CanvasTGT.accuracy=20;
CanvasTGT.isTouch=OlFunction.create(isTouch_base);

/**
 * 可以通用的碰撞检测函数 将对象转换成多边形 开销较大
 * @param {CanvasTGT} canvasTGT1
 * @param {CanvasTGT} canvasTGT2
 */
function isTouch_base(canvasTGT1,canvasTGT2){
    var tgt1 = canvasTGT1.toPolygon(CanvasTGT.accuracy,canvasTGT1.want_to_closePath);
    var tgt2 = canvasTGT2.toPolygon(CanvasTGT.accuracy,canvasTGT2.want_to_closePath);
    var i;
    for(i=tgt1.data.nodes.length-1;i>=0;--i){
        tgt1.data.nodes[i]=tgt1.localToWorld(tgt1.data.nodes[i]);
    }
    for(i=tgt2.data.nodes.length-1;i>=0;--i){
        tgt2.data.nodes[i]=tgt2.localToWorld(tgt2.data.nodes[i]);
    }
    tgt1.data.reMinMax();
    tgt2.data.reMinMax();
    
    return Polygon.getImpactFlag(tgt1.data,tgt2.data);
}

/**
 * 碰撞检测函数 矩形 弧形(圆形)
 * @param {CanvasRectTGT} tgt1 进行碰撞检测的对象
 * @param {CanvasArcTGT}  tgt2 进行碰撞检测的对象
 */
function isTouch_Rect_Arc(tgt1,tgt2){
    var t1=tgt1.toPolygon();
    return isTouch_Arc_Polygon(tgt2,t1);
}
CanvasTGT.isTouch.addOverload([CanvasRectTGT,CanvasArcTGT],isTouch_Rect_Arc);
CanvasTGT.isTouch.addOverload([CanvasArcTGT,CanvasRectTGT],function(tgt1,tgt2){
    return isTouch_Rect_Arc(tgt2,tgt1)
});

/**
 * 碰撞检测函数 矩形 多边形
 * @param {CanvasRectTGT} tgt1
 * @param {CanvasPolygonTGT} tgt2
 */
function isTouch_Rect_Polygon(tgt1,tgt2){
    
    var t2d=Polygon.linearMapping(tgt2.data,tgt2.transformMatrix,false);
        nodes=t2d.nodes;

    var i =nodes.length-1;
    for(;i>=0;--i){
        if(tgt1.isInside(nodes[i].x,nodes[i].y)){
            return true;
        }
    }
    if(tgt2.want_to_closePath||t2d.isClosed()){
        var min=tgt1.localToWorld(tgt1.getMin());
            max=tgt1.localToWorld(tgt1.getMax());
        return tgt2.isInside(min.x,min.y)||
            tgt2.isInside(max.x,max.y)||
            tgt2.isInside(max.x,min.y)||
            tgt2.isInside(min.x,max.y);
    }
    else{
        return false;
    }
}
CanvasTGT.isTouch.addOverload([CanvasRectTGT,CanvasPolygonTGT],isTouch_Rect_Polygon);
CanvasTGT.isTouch.addOverload([CanvasPolygonTGT,CanvasRectTGT],function(tgt1,tgt2){
    return isTouch_Rect_Polygon(tgt2,tgt1);
});

/**
 * 碰撞检测函数 弧形(圆形) 多边形
 * @param {CanvasArcTGT} tgt1
 * @param {CanvasPolygonTGT} tgt2
 */
 function isTouch_Arc_Polygon(tgt1,tgt2){
    var i =tgt2.data.nodes.length-1,
        l=i;
    if(l<0)return false;

    var t2d1=Polygon.linearMapping(tgt2.data,tgt2.transformMatrix,false);
    var t2d=Polygon.linearMapping(t2d1,tgt1.temp_worldToLocalM,true);
        nodes=t2d.nodes;

    for(;i>0;--i){
        if(Math2D.arc_i_line(tgt1.data,nodes[i],nodes[i-1])){
            return true;
        }
    }
    var opv,edv;
    if(tgt1.want_to_closePath){
        // 割圆 的线段也要判断
        opv=Vector2.add(tgt1.data.opv,tgt1.data.c);
        edv=tgt1.data.edv.add(tgt1.data.c);
        for(i=l;i>0;--i){
            if(Math2D.line_i_line(opv,edv,nodes[i],nodes[i-1])){
                return true;
            }
        }
    }
    if((l>1&&tgt2.want_to_closePath)&&(!tgt2.data.isClosed())){
        // 规定闭合路径的多边形, 多算一次
        if(Math2D.arc_i_line(tgt1.data,nodes[0],nodes[l])){
            return true;
        }
        if(tgt1.want_to_closePath){
            if(Math2D.line_i_line(tgt1.data.opv,tgt1.data.edv,nodes[0],nodes[l])){
                return true;
            }
        }
    }
    if(tgt2.want_to_closePath||tgt2.data.isClosed()){
        return t2d.isInside(tgt1.data.c.x+tgt1.data.opv.x,tgt1.data.c.y+tgt1.data.opv.y,true);
    }
    return false;
}
CanvasTGT.isTouch.addOverload([CanvasArcTGT,CanvasPolygonTGT],isTouch_Arc_Polygon);
CanvasTGT.isTouch.addOverload([CanvasPolygonTGT,CanvasArcTGT],function(tgt1,tgt2){
    return isTouch_Arc_Polygon(tgt2,tgt1);
});

/**
 * 碰撞检测函数 组 组
 */
function isTouch_Group_Group(){
    
}

/**
 * 碰撞检测函数 组 矩形
 */
function isTouch_Group_Rect(){
    
}

/**
 * 碰撞检测函数 组 弧形(多边形)
 */
function isTouch_Group_Arc(){
    
}

/**
 * 碰撞检测函数 组 多边形
 */
function isTouch_Group_Polygon(){
    
}