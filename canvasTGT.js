/*!
 *  用于 canvas 面向对象化的 tgt 库
 *  注意 canvas 大部分情况是 x 正方向向右, y 正方向向下的。
 *  canvas 是向量后乘矩阵再偏移
 */

// data

/** @type {Number} 默认转换多边形的精度 用于圆弧或曲线转换 */
var def_accuracy=20;

class CanvasTGT{
    constructor(){
        /**@type {Object} */
        this.data;
        this.fillStyle="#fff0";
        this.strokeStyle="#000";
        this.lineWidth=1;
        this.want_to_closePath=false;
        /**@type {Matrix2x2T} */
        this._transformMatrix=createMatrix2x2T();
        this._worldToLocalM;
        /**
         * tgt的 data的类型 用于将json实例化为 CanvasTGT
         * @type {String}
         */
        this.dataType="Object";
    }
    /**
     * 拷贝函数 注:json互相转化时,无法正常转换成json的类型 fillStyle strokeStyle 会丢失
     * @param {CanvasTGT} tgt
     * @return {CanvasTGT} 返回一个拷贝
     */
    static copy(tgt){
        var rtn;
        rtn=CanvasTGT.create_ByDataType[tgt.dataType](tgt.data);

        rtn.fillStyle           = tgt.fillStyle;
        rtn.strokeStyle         = tgt.strokeStyle;
        rtn.lineWidth           = tgt.lineWidth;
        rtn.transformMatrix     = Matrix2x2T.copy(tgt._transformMatrix);
        rtn._worldToLocalM      = Matrix2x2T.copy(tgt._worldToLocalM);
        rtn.want_to_closePath   = tgt.want_to_closePath;
        
        return rtn;
    }
    /**
     * 拷贝函数
     * @return {CanvasTGT} 返回一个拷贝
     */
    copy(){
        return CanvasTGT.copy(this);
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
     * 创建精灵图像填充类型
     * @param {Sprites} _sprites 精灵图像实例
     */
    createSpritesFillStyle(_sprites,sx,sy,sw,sh){
        var vMin=this.getMin();
        var vMax=this.getMax();
        return _sprites.createPattern(sx,sy,sw,sh,vMin.x,vMin.y,vMax.x-vMin.x,vMax.y-vMin.y);
    }
    /** 如果需要使用逆变换矩阵的话,不要直接修改矩阵的参数 */
    set transformMatrix(m){
        this._transformMatrix=m.copy();
        this._worldToLocalM=undefined;
        return this._transformMatrix;
    }
    get transformMatrix(){
        return this._transformMatrix;
    }
    get worldToLocalM(){
        this.re_worldToLocalM();
        return this._worldToLocalM;
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
     * 刷新逆变换矩阵
     */
    re_worldToLocalM(){
        if(this._worldToLocalM===undefined){
            this._worldToLocalM=this.transformMatrix.inverse();
        }
    }
    /** 
     * 判断某一点是否在目标内部
     * @param {Number} _x    重载1的参数 世界坐标x
     * @param {Number} _y    重载1的参数 世界坐标y
     * @param {Vector2} _v   重载2的参数 世界坐标向量
     * @returns {Boolean} 
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
    /** 转换成多边形
     * @param {Number} _accuracy 转换精度 用于圆弧或曲线转换
     * @returns {CanvasPolygonTGT}
     */
    toPolygon(_accuracy=def_accuracy){
        var rtn = new CanvasPolygonTGT(this.data.ceratePolygonProxy(...arguments));
        rtn.fillStyle   =this.fillStyle;
        rtn.strokeStyle =this.strokeStyle;
        rtn.lineWidth   =this.lineWidth;
        rtn.transformMatrix=(this.transformMatrix);
        return rtn;
    }
    
    /**
     * 生成世界坐标的多边形集合
     * @param {Boolean} f 是否作拷贝 默认 true, 为 false 时会影响 this
     * @param {Number} _accuracy 转换精度 用于圆弧或曲线转换
     * @returns {Array<CanvasPolygonTGT>} 因为只有一个tgt所以是 length 为 1 的数组
     */
    create_worldPolygons(f,_accuracy=def_accuracy){
        /** @type {CanvasPolygonTGT} */
        var rtn;
        if((!f)&&(rtn instanceof CanvasPolygonTGT)){
            rtn=this;
        }
        else{
            rtn=this.toPolygon(_accuracy);
        }

        rtn.nodesToWorld(true);
        return [rtn];
    }
    /**
     * 碰撞检测 有多个重载, 在class外面实现
     * @param {CanvasTGT} canvasTGT1 需要检测碰撞的对象
     * @param {CanvasTGT} canvasTGT2 需要检测碰撞的对象
     */
    static isTouch(canvasTGT1,canvasTGT2){}
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
    }
    /** 
     * 根据数据类型创建
     */
    static create_ByDataType={
        /**
         * @param {Arc_Data} data 
         * @returns {CanvasArcTGT}
         */
        "Arc_Data":function(data){
            return new CanvasArcTGT(data.c.x,data.c.y,data._r,data._startAngle,data._endAngle);
        },
        /**
         * @param {Rect_Data} data 
         * @returns {CanvasRectTGT}
         */
        "Rect_Data":function(data){
            return new CanvasRectTGT(data.x,data.y,data.w,data.h);
        },
        /**
         * @param {Polygon} data 
         * @returns {CanvasPolygonTGT}
         */
        "Polygon":function(data){
            return new CanvasPolygonTGT(data);
        },
        "Bezier_Data":function(data){
            return new CanvasBezierTGT(data);
        }
    }
}

/** 矩形
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} width 
 * @param {Number} height 
 */
class CanvasRectTGT extends CanvasTGT{
    constructor(x,y,w,h){
        super();
        /**@type {Rect_Data} */
        this.data=new Rect_Data(x,y,w,h);
        this.dataType="Rect_Data";
        /** 矩形一直是封闭图形 */
        this.want_to_closePath=true;
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
        /**@type {Arc_Data} */
        this.data=new Arc_Data(cx,cy,r,startAngle,endAngle);
        this.dataType="Arc_Data";
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
/**
 * 扇形
 */
class CanvasSectorTGT extends CanvasTGT{
    /**
     * @param {Number} cx 圆心的坐标
     * @param {Number} cy 圆心的坐标
     * @param {Number} r  半径
     * @param {Number} startAngle       起点的弧度
     * @param {Number} endAngle         终点的弧度
     */
     constructor(cx,cy,r,startAngle,endAngle){
        super();
        /**@type {Sector_Data} */
        this.data=new Sector_Data(cx,cy,r,startAngle,endAngle);
        this.dataType="Arc_Data";
        /** 扇形一直是封闭图形 */
        this.want_to_closePath=true;
    }
    createCanvasPath(ctx){
        ctx.arc(this.data.c.x,this.data.c.y,this.data.r,this.data.startAngle,this.data.endAngle,false);
        if(this.want_to_closePath){
            var arcA=Math.abs((this.data.anticlockwise?(this.data.startAngle-this.data.endAngle):(this.data.endAngle-this.data.startAngle)));
            ctx.lineTo(this.data.c.x,this.data.c.y)
            if((Math.PI*2>arcA)){
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
        this.data=Polygon.copy(_polygon);
        if(this.data)this.data.reMinMax();
        this.dataType="Polygon"
    }

    /**
     * 将局部坐标系的 nodes 转换到世界坐标系
     * @param {Boolean} clear_tfm_f 是否清理变换矩阵属性 默认清理(true)
     */
    nodesToWorld(clear_tfm_f=true){
        // this.data.linearMapping(this.transformMatrix,true)
        for(var i=this.data.nodes.length-1;i>=0;--i){
            this.data.nodes[i]=this.localToWorld(this.data.nodes[i]);
        }
        if(clear_tfm_f){
            this.transformMatrix=new Matrix2x2T();
        }
    }   
    
    getPolygonProxy(){
        return this.data.copy();
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

// CanvasTGT 函数重载 ----------------------------------------------------------------------------------------------------------------------------------

function _CanvasTGT_isInside(_x,_y){
    var v=this.worldToLocal(_x,_y);
    return this.data.isInside(v.x,v.y,this.want_to_closePath);
}
CanvasTGT.prototype.isInside=OlFunction.create();
CanvasTGT.prototype.isInside.addOverload([Number,Number],_CanvasTGT_isInside);
CanvasTGT.prototype.isInside.addOverload([Vector2],function(_v){
    return _CanvasTGT_isInside.call(this,_v.x,_v.y)
});

// 局部坐标 to 世界坐标
function _CanvasTGT_localToWorld(v){
    return Vector2.afterTranslate_linearMapping(v,this.transformMatrix);
}
CanvasTGT.prototype.localToWorld=OlFunction.create();
CanvasTGT.prototype.localToWorld.addOverload([Number,Number],function (x,y){
    return _CanvasTGT_localToWorld.call(this,new Vector2(x,y));
});
CanvasTGT.prototype.localToWorld.addOverload([Vector2],_CanvasTGT_localToWorld);

// 世界坐标 to 局部坐标
function _CanvasTGT_worldToLocal(v){
    var tm=this.worldToLocalM;
    return Vector2.beforeTranslate_linearMapping(v,tm);
}
CanvasTGT.prototype.worldToLocal=OlFunction.create();
CanvasTGT.prototype.worldToLocal.addOverload([Number,Number],function (x,y){
    return _CanvasTGT_worldToLocal.call(this,new Vector2(x,y));
});
CanvasTGT.prototype.worldToLocal.addOverload([Vector2],_CanvasTGT_worldToLocal
);
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
    
    if(Polygon.getImpactFlag(tgt1.data,tgt2.data)){
        return true;                                         
    }
    return canvasTGT1.isInside(canvasTGT2.localToWorld(canvasTGT2.data.nodes[0]))||canvasTGT2.isInside(canvasTGT1.localToWorld(canvasTGT1.data.nodes[0]));
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
    console.log(1)
    var t2d1=Polygon.linearMapping(tgt2.data,tgt2.transformMatrix,false);
    var t2d=Polygon.linearMapping(t2d1,tgt1.worldToLocalM,true);
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
 * 碰撞检测函数 弧形(圆形) 弧形
 * @param {CanvasArcTGT} tgt1 
 * @param {CanvasArcTGT} tgt2 
 */
function isTouch_Arc_Arc(tgt1,tgt2){
    var tgtt=tgt1.toPolygon();
    return isTouch_Arc_Polygon(tgt2,tgtt);
}

CanvasTGT.isTouch.addOverload([CanvasArcTGT,CanvasArcTGT],isTouch_Arc_Arc);

// 扇形碰撞 --------------------------------------------------------------------------------------------

/**
 * 碰撞检测函数 矩形 扇形(圆形)
 * @param {CanvasRectTGT} tgt1 进行碰撞检测的对象
 * @param {CanvasSectorTGT}  tgt2 进行碰撞检测的对象
 */
 function isTouch_Rect_Sector(tgt1,tgt2){
    var t1=tgt1.toPolygon();
    return isTouch_Sector_Polygon(tgt2,t1);
}
CanvasTGT.isTouch.addOverload([CanvasRectTGT,CanvasSectorTGT],isTouch_Rect_Sector);
CanvasTGT.isTouch.addOverload([CanvasSectorTGT,CanvasRectTGT],function(tgt1,tgt2){
    return isTouch_Rect_Sector(tgt2,tgt1);
});

/**
 * 碰撞检测函数 扇形(圆形) 多边形
 * @param {CanvasSectorTGT} tgt1 
 * @param {CanvasPolygonTGT} tgt2 
 */
 function isTouch_Sector_Polygon(tgt1,tgt2){
    var i =tgt2.data.nodes.length-1,
        l=i;
    if(l<0)return false;
    console.log(1)
    var t2d1=Polygon.linearMapping(tgt2.data,tgt2.transformMatrix,false);
    var t2d=Polygon.linearMapping(t2d1,tgt1.worldToLocalM,true);
        nodes=t2d.nodes;

    for(;i>0;--i){
        if(Math2D.sector_i_line(tgt1.data,nodes[i],nodes[i-1])){
            return true;
        }
    }
    if((l>1&&tgt2.want_to_closePath)&&(!tgt2.data.isClosed())){
        // 规定闭合路径的多边形, 多算一次
        if(Math2D.sector_i_line(tgt1.data,nodes[0],nodes[l])){
            return true;
        }
    }
    if(tgt2.want_to_closePath||tgt2.data.isClosed()){
        return t2d.isInside(tgt1.data.c.x,tgt1.data.c.y,true);
    }
    return false;
}

CanvasTGT.isTouch.addOverload([CanvasSectorTGT,CanvasPolygonTGT],isTouch_Sector_Polygon);
CanvasTGT.isTouch.addOverload([CanvasPolygonTGT,CanvasSectorTGT],function(tgt1,tgt2){
    return isTouch_Sector_Polygon(tgt2,tgt1)
});

/**
 * 碰撞检测函数 扇形(圆形) 弧形
 * @param {CanvasSectorTGT} tgt1 
 * @param {CanvasArcTGT} tgt2 
 */
 function isTouch_Sector_Arc(tgt1,tgt2){
    var tgtt=tgt1.toPolygon();
    return isTouch_Arc_Polygon(tgt2,tgtt);
}

CanvasTGT.isTouch.addOverload([CanvasSectorTGT,CanvasArcTGT],isTouch_Sector_Arc);
CanvasTGT.isTouch.addOverload([CanvasArcTGT,CanvasSectorTGT],function(tgt1,tgt2){
    return isTouch_Sector_Arc(tgt2,tgt1)
});

/**
 * 碰撞检测函数 扇形(圆形) 弧形
 * @param {CanvasSectorTGT} tgt1 
 * @param {CanvasSectorTGT} tgt2 
 */
 function isTouch_Sector_Sector(tgt1,tgt2){
    var tgtt=tgt1.toPolygon();
    return isTouch_Sector_Polygon(tgt2,tgtt);
}

CanvasTGT.isTouch.addOverload([CanvasSectorTGT,CanvasSectorTGT],isTouch_Sector_Sector);

// 组----------------------------------------------------------------------------------------------------------------------------------------------

/**
 * canvas tgt 组
 */
class CanvasTGT_Group{
    /**
     * 
     * @param {Array<CanvasTGT,CanvasTGT_Group>} tgts 
     */
    constructor(tgts){
        /**@type {Array<CanvasTGT,CanvasTGT_Group>} */
        this.children;
        if(tgts!==undefined){
            this.children=[].concat(tgts);
        }
        else{
            this.children=[]
        }
        this._transformMatrix=createMatrix2x2T();
        this._worldToLocalM=undefined;
        this.dataType="Group";
    }
    /**
     * 添加子项
     * @param {CanvasTGT} tgt CanvasTGT对象
     */
    addChildren(tgt){
        this.children.push(tgt);
    }
    /**
     * 添加子项
     * @param {Array<CanvasTGT>} tgt CanvasTGT对象
     */
    addChildrens(tgts){
        this.children=this.children.concat(tgts);
    }
    /**
     * 移除一个子项
     * @param {Number} index 下标
     */
    removeChildrenByIndex(index){
        this.children.splice(index,1);
    }
    /**
     * 移除一个子项
     * @param {CanvasTGT} tgt 必须是同一个子项
     */
    removeChildren(tgt){
        for(var i=this.children.length-1;i>=0;--i){
            if(this.children[i]===tgt)
            this.children.splice(index,1);
        }
    }

    /**
     * 拷贝函数
     * 注意别把某个组放在自己的后代里
     * @param {CanvasTGT_Group}
     * @return {CanvasTGT_Group} 返回一个拷贝
     */
    static copy(tgt){
        if(tgt.dataType==="Group"){
            var rtn=new CanvasTGT_Group();
            for(var i=tgt.children.length-1;i>=0;--i){
                rtn.children.push(CanvasTGT_Group.copy(tgt.children[i]));
            }
            rtn._transformMatrix=Matrix2x2T.copy(tgt._transformMatrix);
            rtn._worldToLocalM=Matrix2x2T.copy(tgt._worldToLocalM);
            return rtn;
        }else{
            return CanvasTGT.copy(tgt);
        }
    }

    /**
     * 拷贝函数
     * @return {CanvasTGT_Group} 返回一个拷贝
     */
    copy(){
        return CanvasTGT_Group.copy(this);
    }
    get transformMatrix(){
        return this._transformMatrix;
    }
    set transformMatrix(m){
        this._transformMatrix=m.copy();
        this._worldToLocalM=undefined;
        return this._transformMatrix;
    }
    get worldToLocalM(){
        this.re_worldToLocalM();
        return _worldToLocalM;
    }
    /**
     * 刷新逆变换矩阵
     */
    re_worldToLocalM(){
        if(this._worldToLocalM===undefined){
            this._worldToLocalM=this.transformMatrix.inverse();
        }
    }
    
    /** 
     * 获取点在某子项内部
     * @param {Number} _x    重载1的参数 世界坐标x
     * @param {Number} _y    重载1的参数 世界坐标y
     * @param {Vector2} _v   重载2的参数 世界坐标向量
     * @returns {Number} 返回下标
    */
    inside_i(_x,_y){
        // 2个重载
    }
    
    /** 
     * 获取点是否在子项内部
     * @param {Number} _x    重载1的参数 世界坐标x
     * @param {Number} _y    重载1的参数 世界坐标y
     * @param {Vector2} _v   重载2的参数 世界坐标向量
     * @returns {Boolean} 返回是否在子项内
     */
    isInside(_x,_y){
        var i;
        if(_x.constructor===Vector2) i=this.inside_i(_x)
        else i=this.inside_i(_x,_y);
        return i!==-1;
    }
    
    /** 
     * 渲染图形 
     * @param {CanvasRenderingContext2D} ctx 目标画布的上下文
    */
     render(ctx){
        ctx.save();
        ctx.transform(this.transformMatrix.a,this.transformMatrix.b,this.transformMatrix.c,this.transformMatrix.d,this.transformMatrix.e,this.transformMatrix.f);
    
        for(var i=this.children.length-1;i>=0;--i){
            this.children[i].render(ctx);
        }

        ctx.restore();
    }
    /**
     * 生成世界坐标的多边形集合
     * @param {Boolean} f 组的该方法中的是无用的属性
     * @param {Number} _accuracy 转换精度 用于圆弧或曲线转换
     * @returns {Array<CanvasPolygonTGT>}
     */
    create_worldPolygons(f,_accuracy=def_accuracy){
        /**@type {Array<CanvasPolygonTGT>}  */
        var rtn=[];
        var i = this.children.length-1;
        for(;i>=0;--i){
            rtn=rtn.concat(this.children[i].create_worldPolygons(true,_accuracy));
        }
        console.log('rtn :>> ', rtn);
        for(i=rtn.length-1;i>=0;--i){
            rtn[i].transformMatrix=this.transformMatrix;
            rtn[i].nodesToWorld();
        }
        return rtn;
    }
}

function _CanvasTGT_Group_Inside_I(_x,_y){
    var v=this.worldToLocal(_x,_y);
    for(var i=this.children.length-1;i>=0;--i){
        if(this.children[i].isInside(v)){
            console.log(i)
            return i;
        }
    }
    return -1;
}
CanvasTGT_Group.prototype.inside_i=OlFunction.create();
CanvasTGT_Group.prototype.inside_i.addOverload([Number,Number],_CanvasTGT_Group_Inside_I);
CanvasTGT_Group.prototype.inside_i.addOverload([Vector2],function(_v){
    return _CanvasTGT_Group_Inside_I.call(this,_v.x,_v.y);
});
// 此处直接使用了 CanvasTGT 的 重载函数对象
CanvasTGT_Group.prototype.localToWorld=CanvasTGT.prototype.localToWorld;
CanvasTGT_Group.prototype.worldToLocal=CanvasTGT.prototype.worldToLocal;

/**
 * 没有进行矩阵变换的世界坐标系多边形tgt数组 和 tgt组 碰撞检测
 * @param {Array<CanvasPolygonTGT>} _tgts 多边形对象数组 不要加矩阵
 * @param {CanvasTGT_Group} g 组
 * @param {CanvasTGT_Group} pg g的父组
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
        tgts[i].transformMatrix=g.transformMatrix;
        for(j=g.children.length-1;j>=0;--j){
            if(g.children[j] instanceof CanvasTGT_Group){
                if(isTouch_noTransformPolygons_Group(tgts,g.children[j],g)){
                    return true;
                }
            }else{
                if(CanvasTGT.isTouch(tgts[i],g.children[j])){
                    return true;
                }
            }
        }
    }
    return false;
}
/**
 * 碰撞检测函数 组 组
 * @param {CanvasTGT_Group} group1
 * @param {CanvasTGT_Group} group2
 */
function isTouch_Group_Group(group1,group2){
    var g1_Polygons=group1.create_worldPolygons();
    return isTouch_noTransformPolygons_Group(g1_Polygons,group2);
}
CanvasTGT.isTouch.addOverload([CanvasTGT_Group,CanvasTGT_Group],isTouch_Group_Group);

CanvasTGT.isTouch.addOverload([CanvasTGT_Group,CanvasTGT],function (group,tgt){
    return isTouch_noTransformPolygons_Group([tgt],group);
});
CanvasTGT.isTouch.addOverload([CanvasTGT,CanvasTGT_Group],function (tgt,group){
    return isTouch_noTransformPolygons_Group([tgt],group);
});


class CanvasBezierTGT extends CanvasTGT{
    /**
     * @param {Bezier_Polygon} bezier_polygon 
     */
    constructor(bezier_polygon){
           super();
           if(bezier_polygon)
           /**@type {Bezier_Polygon} */
           this.data=Bezier_Polygon.copy(bezier_polygon);
           this.dataType="Bezier_Data";
       }
       /**
        * 将局部坐标系的 nodes 转换到世界坐标系
        * @param {Boolean} clear_tfm_f 是否清理变换矩阵属性 默认清理(true)
        */
       nodesToWorld(clear_tfm_f=true){
           // this.data.linearMapping(this.transformMatrix,true)
           for(var i=this.data.nodes.length-1;i>=0;--i){
               this.data.nodes[i].node=this.localToWorld(this.data.nodes[i].node);
               this.data.nodes[i].hand1=this.localToWorld(this.data.nodes[i].hand1);
               this.data.nodes[i].hand2=this.localToWorld(this.data.nodes[i].hand2);
           }
           if(clear_tfm_f){
               this.transformMatrix=new Matrix2x2T();
           }
       }
       /**
        * @param {CanvasRenderingContext2D} ctx 
        */
       createCanvasPath(ctx){
           var nodes=this.data.nodes,i=0;
           ctx.moveTo(nodes[i].node.x,nodes[i].node.y);

           for(i=1;i<this.data.nodes.length;++i){
               ctx.bezierCurveTo(nodes[i-1].hand2.x,nodes[i-1].hand2.y,nodes[i].hand1.x,nodes[i].hand1.y,nodes[i].node.x,nodes[i].node.y);
           }
           if(this.want_to_closePath){
            //    ctx.closePath();
            ctx.bezierCurveTo(nodes[i-1].hand2.x,nodes[i-1].hand2.y,nodes[0].hand1.x,nodes[0].hand1.y,nodes[0].node.x,nodes[0].node.y);
           }
       }
}


// /**
//  * 贝塞尔曲线相交情况
//  * @param {Bezier_Node} curve1d1
//  * @param {Bezier_Node} curve1d2
//  * @param {Bezier_Node} curve2d1
//  * @param {Bezier_Node} curve2d2
//  */
// function bezier_i_bezier(curve1d1,curve1d2,curve2d1,curve2d2){
//     var p0=curve1d1.node,
//         p1=curve1d1.hand2.dif(p0),
//         p2=curve1d2.hand1.dif(p0),
//         p3=curve1d2.node,
//         q0=curve2d1.node,
//         q1=curve2d1.hand2.dif(q0),
//         q2=curve2d2.hand1.dif(q0),
//         q3=curve2d2.node;

//     var ps=p3.dif(p0),
//         qs=q3.dif(q0);
    
//     var psm=new Matrix2x2T().scale(1/ps.x,1/px.y),
//         qsm=new Matrix2x2T().scale(1/qs.x,1/qx.y);
//         //todo
// }