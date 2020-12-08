/*!
 *  用于 canvas 面向对象化的 tgt 库
 *  
 */

class CanvasTGT{
    constructor(){
        this.data;
        this.parent;
        this.children;
        this.fillStyle="#fff";
        this.strokeStyle="#000";
        this.lineWidth=1;
        this.transformMatrix=createMatrix2x2T();
        this.temp_worldToLocalM=createMatrix2x2T();
    }
    /**
     * 拷贝函数
     */
    copy(){
        var rtn=new this.constructor();

        if(this.data.copy){
            rtn.data=this.data.copy();
        }
        else{
            rtn.data=Object.assign({},this.data);
        }

        rtn.fillStyle   =this.fillStyle;
        rtn.strokeStyle =this.strokeStyle;
        rtn.lineWidth   =this.lineWidth;
        rtn.gridx       =this.gridx;
        rtn.gridy       =this.gridy;
        rtn.rotate      =this.rotate;
        
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
     */
    setTransformMatrix(m){
        this.transformMatrix=m.copy();
        this.temp_worldToLocalM=m.inverse();
    }
    // 这是个有多个重载的函数 , 在class定义的外面实现
    /**
     * 将局部坐标系变换到世界坐标系
     * @method localToWorld 拥有两个重载
     * @param {Number} x 重载1的参数 局部坐标x
     * @param {Number} y 重载1的参数 局部坐标y
     * @param {Vector2} v  重载2的参数 局部坐标向量
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
// 局部坐标 to 世界坐标
CanvasTGT.prototype.localToWorld=createOlFnc();
CanvasTGT.prototype.localToWorld.addOverload([Number,Number],function(x,y){
    return Vector2.afterTranslate_linearMapping(new Vector2(x,y),this.transformMatrix);
});
CanvasTGT.prototype.localToWorld.addOverload([Vector2],function(v){
    return Vector2.afterTranslate_linearMapping(v,this.transformMatrix);
});
// 世界坐标 to 局部坐标
CanvasTGT.prototype.worldToLocal=createOlFnc();
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
    // todo : 怎么判断当前的变换矩阵的逆是否过期
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
        return new Vector2(this.data.x,this.data.y);
    }
    getMax(){
        return new Vector2(this.data.x+this.data.width,this.data.y+this.data.height);
    }
    isInside(_x,_y){;
        var v=this.worldToLocal(_x,_y);
    
        if(v.x>this.data.x&&v.x<this.data.x+this.data.width&&v.y>this.data.y&&v.y<this.data.y+this.data.height)return true;
        return false;
    }
    createCanvasPath(ctx){
        ctx.rect(this.data.x,this.data.y,this.data.width,this.data.height);
    }
    getPolygonProxy(){
        return Polygon.rect(this.data.x,this.data.y,this.data.width,this.data.height);
    }
}

class CanvasArcTGT extends CanvasTGT{
    constructor(cx,cy,r,startAngle,endAngle,anticlockwise){
        super();
        this.data={cx:cx,cy:cy,r:r,startAngle:startAngle,endAngle:endAngle,anticlockwise:anticlockwise};
    }
    
    getMin(){
        return new Vector2(this.data.cx-this.datar,this.data.cy-this.datar);
    }
    getMax(){
        return new Vector2(this.data.cx+this.datar,this.data.cy+this.datar);
    }
    isInside(_x,_y){
        var r=this.data.r+this.lineWidth*0.5;
        var v=this.worldToLocal(_x-this.data.cx,_y-this.data.cy);
        var x=v.x,y=v.y;
        if(r<x||-1*r>x||r<y||-1*r>y) return false;
        var arcA=Math.abs((this.data.anticlockwise?(this.data.startAngle-this.data.endAngle):(this.data.endAngle-this.data.startAngle)));
        var tr=Math.sqrt(x*x+y*y);
        if(tr<=r){
            // 在半径内
            if(Math.PI*2<=arcA){
                return true;//圆形
            }
            else{
                // 弧线的两端点
                var l1op=new Vector2(Math.cos(this.data.startAngle)*r,Math.sin(this.data.startAngle)*r);
                var l1ed=new Vector2(Math.cos(this.data.endAngle)*r,Math.sin(this.data.endAngle)*r);
                // 圆心和实参的坐标
                var l2op=new Vector2(0,0);
                var l2ed=new Vector2(x,y);
                var ISF=Polygon.getIntersectFlag(l1op,l1ed,l2op,l2ed);  //相交情况
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
    createCanvasPath(){
        ctx.arc(this.data.cx,this.data.cy,this.data.r,this.data.startAngle,this.data.endAngle,this.data.anticlockwise);
    }
    getPolygonProxy(_accuracy){
        var rtn=Polygon.arc(this.data.r,this.data.startAngle,this.data.endAngle,_accuracy,this.data.anticlockwise);
        rtn.linearMapping(new Vector2(this.data.cx,this.data.cy));
        return rtn
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
        this.data=_polygon;
        if(this.data)this.data.reMinMax();
    }
    
    getMin(){
        return this.data.min.copy();
    }
    getMax(){
        return this.data.max.copy();
    }
    isInside(_x,_y){
        var tv=this.worldToLocal(_x,_y);
        var x=tv.x,y=tv.y;
        if(this.data.min.x>x||this.data.max.x<x||this.data.min.y>y||this.data.max.y<y) return false;
        return this.data.isInside(x,y);
    }
    createCanvasPath(){
        var i=this.data.nodes.length-1,
            nodes=this.data.nodes;
        ctx.moveTo(nodes[i].x,nodes[i].y);
        for(--i;i>=0;--i){
            ctx.lineTo(nodes[i].x,nodes[i].y);
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

