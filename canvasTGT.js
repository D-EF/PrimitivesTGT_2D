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
        this.transformMatrix=new Matrix2x2T();
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
    // 重载函数 , 在class定义的外面实现
    /**
     * 将局部坐标系变换到世界坐标系
     * @method localToWorld 拥有两个重载
     * @param {Number} x 重载1的参数 局部坐标x
     * @param {Number} y 重载1的参数 局部坐标y
     * @param {Vector2} v  重载2的参数 局部坐标向量
     */
    localToWorld (x,y){}
    // 重载函数 , 在class定义的外面实现
    /**
     * 将世界坐标系变换到局部坐标系
     * @method localToWorld 拥有两个重载
     * @param {Number} x 重载1的参数 世界坐标x
     * @param {Number} y 重载1的参数 世界坐标y
     * @param {Vector2} v  重载2的参数 世界坐标向量
     */
    worldToLocal (x,y){}
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
        rtn.gridx       =this.gridx;
        rtn.gridy       =this.gridy;
        rtn.rotate      =this.rotate;
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
    var tm=this.transformMatrix.inverse();
    Vector2.beforeTranslate_linearMapping(new Vector2(x,y),tm);
});
CanvasTGT.prototype.worldToLocal.addOverload([Vector2],function(v){
    var tm=this.transformMatrix.inverse();
    Vector2.beforeTranslate_linearMapping(v,tm);
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
    isInside(_x,_y){;
        var m=ctrlM2.rotate(-1*this.rotate);
        var v=new Vector2(_x-this.gridx,_y-this.gridy);
        v=ctrlV2.linearMapping(v,m);
    
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
        this.data={cx:cx,cy:cy,r:r,startAngle:startAngle,endAngle:endAngle,anticlockwise:anticlockwise};
    }
    isInside(_x,_y){
        var x=_x-this.gridx-this.data.cx,y=_y-this.gridy-this.data.cy,r=this.data.r+this.lineWidth*0.5;
        var v = ctrlV2.linearMapping(new Vector2(x,y),ctrlM2.rotate(-1*this.rotate));
        x=v.x,y=v.y;
        if(r<x||-1*r>x||r<y||-1*r>y) return false;
        var arcA=Math.abs((this.data.anticlockwise?(this.data.startAngle-this.data.endAngle):(this.data.endAngle-this.data.startAngle)));
        var tr=Math.sqrt(x*x+y*y);
        if(tr<=r){
            // 在半径内
            if(Math.PI*2<=arcA){
                return true;//圆形
            }
            else{
                var l1op=new Vector2(Math.cos(this.data.startAngle)*r,Math.sin(this.data.startAngle)*r);
                var l1ed=new Vector2(Math.cos(this.data.endAngle)*r,Math.sin(this.data.endAngle)*r);
                var l2op=new Vector2();
                var l2ed=new Vector2(x,y);
                var ISF=getIntersectFlag(l1op,l1ed,l2op,l2ed);
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
 * @param {Polygon} _polygon 多边形
*/
class CanvasPolygonTGT extends CanvasTGT{
    constructor(_polygon){
        super();
        this.data=_polygon;
        this.data.reMinMax();
    }
    isInside(_x,_y){
        var x=_x-this.gridx,y=_y-this.gridy,tempProxy;
        if(this.rotate){
            var tv=ctorV2.linearMapping(new Vector2(x,y),ctrlM2.rotate(-1*this.rotate));
            x=tv.x;
            y=tv.y
        }
        if(this.data.minX>x||this.data.maxX<x||this.data.minY>y||this.data.maxY<y) return false;
        if(this.data.isInside(x,y)){
            return true;
        }
        return false;
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
