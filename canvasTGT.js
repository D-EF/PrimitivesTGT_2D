/*!
 *  用于 canvas 面向对象化的 tgt 库
 *  
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
        // 在派生类里实现
    }
    /** 
     * 获取最大的(局部)坐标
     * @returns {Vector2} 返回一个向量
     */
    getMax(){
        // 在派生类里实现
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
     * @param {Number} x    坐标
     * @param {Number} y    坐标
    */
    isInside(x,y){
        // 在派生类中实现
        return 0;
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
        var rtn = new CanvasPolygonTGT(this.getPolygonProxy(...arguments));
        rtn.fillStyle   =this.fillStyle;
        rtn.strokeStyle =this.strokeStyle;
        rtn.lineWidth   =this.lineWidth;
        rtn.setTransformMatrix(this.transformMatrix);
        return rtn;
    }
    /**用 data 获取多边形代理对象 */
    getPolygonProxy(_accuracy){
        // 在派生类中实现
    }
    /** 默认转换成多边形的 精度 */
    static accuracy = 20;
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

function isTouch_base(canvasTGT1,canvasTGT2){
    var tgt1 = canvasTGT1.toPolygon(CanvasTGT.accuracy);
    var tgt2 = canvasTGT2.toPolygon(CanvasTGT.accuracy);
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

CanvasTGT.isTouch=OlFunction.create(isTouch_base);

/**
 * 碰撞检测函数 矩形对矩形
 * @param {CanvasRectTGT} tgt1 进行碰撞检测的对象
 * @param {CanvasRectTGT} tgt2 进行碰撞检测的对象
 */
function isTouch_Rect_Rect(tgt1,tgt2){
    var v1min=tgt1.localToWorld(tgt1.getMin()),
        v1max=tgt1.localToWorld(tgt1.getMax()),
        v2min=tgt2.localToWorld(tgt2.getMin()),
        v2max=tgt2.localToWorld(tgt2.getMax());

    if(v1min.x<v2min.x&&v1max.x<v2min.x){
        return false;
    }
    if(v1min.y<v2min.y&&v1max.y<v2min.y){
        return false;
    }
    if(v2min.x<v1min.x&&v2max.x<v1min.x){
        return false;
    }
    if(v2min.y<v1min.y&&v2max.y<v1min.y){
        return false;
    }
    return true;
}

/**
 * 碰撞检测函数 矩形 弧形(圆形)
 * @param {CanvasRectTGT} tgt1 进行碰撞检测的对象
 * @param {CanvasArcTGT}  tgt2 进行碰撞检测的对象
 */
function isTouch_Rect_Arc(tgt1,tgt2){
    var arcA=Math.abs(tgt2.data.startAngle-tgt2.data.endAngle);
    var v1min=tgt1.localToWorld(tgt1.getMin()),
        v1max=tgt1.localToWorld(tgt1.getMax()),
        cx=tgt2.data.cx,
        cy=tgt2.data.cy;
    if(tgt2.want_to_closePath||arcA>=Math.PI*2){

        return tgt2.isInside(v1min.x,v1min.y)||
            tgt2.isInside(v1max.x,v1min.y)||
            tgt2.isInside(v1min.x,v1max.y)||
            tgt2.isInside(v1max.x,v1max.y)||
            tgt2.isInside(v1min.x,cy)||
            tgt2.isInside(cx,v1min.y)||
            tgt2.isInside(v1max.x,cy)||
            tgt2.isInside(cx,v1max.y);
    }
    if((v1min.y<cy&&v1min.x<cx)&&(v1max.y>cy&&v1max.x>cx)){
        return true;
    }
    return isTouch_base(tgt1,tgt2);
}

/**
 * 碰撞检测函数 矩形 多边形
 * @param {CanvasRectTGT} tgt1
 * @param {CanvasPolygonTGT} tgt2
 */
function isTouch_Rect_Polygon(tgt1,tgt2){
    var i =tgt2.data.nodes.length-1,
        l=i;
    for(;i>=0;--i){
        if(tgt1.isInside(tgt2.data.nodes[i].x,tgt2.data.nodes[i].y)){
            return true;
        }
    }
    if(tgt2.want_to_closePath||Vector2.isEqual(tgt2.data.nodes[0],tgt2.data.nodes[l])){
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

/**
 * 碰撞检测函数 弧形(圆形) 多边形
 * @param {CanvasArcTGT} tgt1
 * @param {CanvasPolygonTGT} tgt2
 */
 function isTouch_Arc_Polygon(tgt1,tgt2){
    var i =tgt2.data.nodes.length-1,
        l=i,
        temp_node;
    for(;i>=0;--i){
        temp_node=tgt2.localToWorld(tgt2.data.nodes[i]);
        if(tgt1.isInside(temp_node.x,temp_node.y)){
            return true;
        }
    }
    if(tgt2.want_to_closePath||Vector2.isEqual(tgt2.data.nodes[0],tgt2.data.nodes[l])){
        tgt2.isInside()
    }
    else{
        return false;
    }
}

/**
 * 碰撞检测函数 多边形 多边形
 */
function isTouch_Polygon_Polygon(){
    return isTouch_base(tgt1,tgt2);
}

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
    constructor(x,y,width,height){
        super();
        this.data={x:x,y:y,width:width,height:height};
    }
    getMin(){
        var rtnx,rtny;
        if(this.data.width>=0){
            rtnx=this.data.x;
        }else{
            rtnx=this.data.x+this.data.width;
        }
        
        if(this.data.height>=0){
            rtny=this.data.y;
        }else{
            rtny=this.data.y+this.data.height;
        }
        return new Vector2(rtnx,rtny);
    }
    
    getMax(){
        var rtnx,rtny;
        if(this.data.width<=0){
            rtnx=this.data.x;
        }else{
            rtnx=this.data.x+this.data.width;
        }
        
        if(this.data.height<=0){
            rtny=this.data.y;
        }else{
            rtny=this.data.y+this.data.height;
        }
        return new Vector2(rtnx,rtny);
    }
    isInside(_x,_y){
        var v=this.worldToLocal(_x,_y),
        max=this.getMax(),
        min=this.getMin();
        if(v.x>min.x&&v.x<max.x&&v.y>min.y&&v.y<max.y)return true;
        return false;
    }
    createCanvasPath(ctx){
        ctx.rect(this.data.x,this.data.y,this.data.width,this.data.height);

    }
    getPolygonProxy(){
        return Polygon.rect(this.data.x,this.data.y,this.data.width,this.data.height);
    }
}


/**
 * 弧形
 */
class CanvasArcTGT extends CanvasTGT{
    /**
     * @param {Number} cx 圆心的坐标
     * @param {Number} cy 圆心的坐标
     * @param {Number} r  半径
     * @param {Number} startAngle       起点的弧度
     * @param {Number} endAngle         终点的弧度
     * @param {Boolean} anticlockwise    true 顺时针, false 逆时针
     */
    constructor(cx,cy,r,startAngle,endAngle,anticlockwise){
        super();
        /**
         * @type {{
         * cx:Number
         * cy:Number
         * r:Number
         * startAngle:Number
         * endAngle:Number
         * anticlockwise:Boolean
         * startAngle_V:Vector2
         * }}
         */
        this.data={
            cx:cx,
            cy:cy,
            r:r,
            startAngle:startAngle,
            endAngle:endAngle,
            anticlockwise:anticlockwise,
        };
        
        /**
         * 只读的属性
         * @type {{
         * startAngle_V:Vector2,
         * endAngle_V:Vector2,
         * angle_value:Number
         * }}
         */
        this.onlyRead_data={
            startAngle_V,
            endAngle_V,
            angle_value
        }
    }

    getMin(){
        return new Vector2(this.data.cx-this.datar,this.data.cy-this.datar);
    }
    getMax(){
        return new Vector2(this.data.cx+this.datar,this.data.cy+this.datar);
    }
    /**
     * 存入弧度值
     * @param {Number} val  新的弧度值
     * @returns val
     */
    setStartAngle(val){
        this.data.startAngle=val;
        this.data.startAngle_V=new Vector2(Math.cos(this.data.startAngle)*r,Math.sin(this.data.startAngle)*r);
        this.data.angle_value=Math.abs((this.data.anticlockwise?(this.data.startAngle-this.data.endAngle):(this.data.endAngle-this.data.startAngle)));
        return this.data.startAngle;
    }
    getStartAngle(){
        return this.data.startAngle;
    }


    isInside(_x,_y){
        var r=this.data.r+this.lineWidth*0.5;
        var v=this.worldToLocal(_x-this.data.cx,_y-this.data.cy);
        var x=v.x,y=v.y;
        if(r<x||-1*r>x||r<y||-1*r>y) return false;
        var arcA=this.onlyRead_data.angle_value;
        var tr=Math.sqrt(x*x+y*y);
        if(tr<=r){
            // 在半径内
            if(Math.PI*2<=arcA){
                return true;//圆形
            }
            else{
                if(this.want_to_closePath===false){
                    return false;
                }
                // 弧线的两端点
                var l1op=this.onlyRead_data.startAngle_V,
                    l1ed=this.onlyRead_data.endAngle_V;
                // 圆心和实参的坐标
                var l2op=new Vector2(0,0);
                var l2ed=new Vector2(x,y);
                var ISF=Math2D.line_i_line(l1op,l1ed,l2op,l2ed);  //相交情况
                if(arcA>Math.PI){
                    // 大于半圆
                    return !ISF;
                }
                else{
                    // 小于半圆
                    return ISF;
                }
            }
        }
        // 不在半径内直接判定为外
        return false;
    }
    createCanvasPath(ctx){
        ctx.arc(this.data.cx,this.data.cy,this.data.r,this.data.startAngle,this.data.endAngle,this.data.anticlockwise);
        if(this.want_to_closePath){
            var arcA=Math.abs((this.data.anticlockwise?(this.data.startAngle-this.data.endAngle):(this.data.endAngle-this.data.startAngle)));
            if((Math.PI*2>arcA)&&this.want_to_closePath){
                ctx.closePath();
            }
        }
    }
    getPolygonProxy(_accuracy){
        var rtn=Polygon.arc(this.data.r,this.data.startAngle,this.data.endAngle,_accuracy,this.data.anticlockwise);
        rtn.translate(new Vector2(this.data.cx,this.data.cy));
        return rtn;
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
    
    getMin(){
        return this.data.min.copy();
    }
    getMax(){
        return this.data.max.copy();
    }
    getPolygonProxy(){
        return this.data.copy();
    }
    isInside(_x,_y){
        var tv=this.worldToLocal(_x,_y);
        var x=tv.x,y=tv.y;
        if(this.data.min.x>x||this.data.max.x<x||this.data.min.y>y||this.data.max.y<y) return false;
        if(this.want_to_closePath&&!this.data.isClosed()){
            this.data.seal();
            var rtn=this.data.isInside(x,y);
            this.data.remove(this.data.length-1);
            return rtn;
        }
        return this.data.isInside(x,y);
        
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
    useRotate(){
        this.data.linearMapping(ctrlM2.rotate(this.rotate));
        this.rotate=0;
    }
    useTranslate(){
        this.data.linearMapping(new Vector2(this.gridx,this.gridy));
        this.gridx=0;
        this.gridy=0;
    }
}

