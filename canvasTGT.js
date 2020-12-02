
function CanvasTGT(){
    this.data;
    this.parent;
    this.children;
    this.fillStyle="#fff";
    this.strokeStyle="#000";
    this.lineWidth=1;
    this.gridx=0;       //图形的全局坐标x
    this.gridy=0;       //图形的全局坐标y
    this.rotate=0;      //图形的全局旋转(rad)
}
CanvasTGT.prototype={
    constructor:CanvasTGT,
    copy:function(){
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
    },
    /** 判断某一点是否在目标内部
     * @param {Number} x    坐标
     * @param {Number} y    坐标
    */
    isInside:function(x,y){
        return 0;
    },
    /** 渲染图形 
     * @param {CanvasRenderingContext2D} ctx 目标画布的上下文
    */
    render:function(ctx){
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.gridx,this.gridy);
        ctx.rotate(this.rotate);
        ctx.fillStyle=this.fillStyle;
        ctx.strokeStyle=this.strokeStyle;
        ctx.lineWidth=this.lineWidth;
    
        this.createCanvasPath(ctx);

        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.restore();
    },
    regEvent:function(element,type,listener){
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
    },
    /**
     * 根据 tgt 的属性 创建用于绘制的路径
     * @param {CanvasRenderingContext2D} ctx 目标画布的上下文
     */
    createCanvasPath:function(ctx){},
    /** 转换成多边形 */
    toPolygon:function(){
        var rtn = new CanvasPolygonTGT(this.getPolygonProxy(...arguments));

        rtn.fillStyle   =this.fillStyle;
        rtn.strokeStyle =this.strokeStyle;
        rtn.lineWidth   =this.lineWidth;
        rtn.gridx       =this.gridx;
        rtn.gridy       =this.gridy;
        rtn.rotate      =this.rotate;
        return rtn;
    },
    /**用 data 获取多边形代理对象 */
    getPolygonProxy:function(_accuracy){}
}
/**根据鼠标xy触发内部tgt事件 */
CanvasTGT.trigger=function(e){
    var i,j,tgts=this.eventTGTs[e.type]
    for(i=tgts.length-1;i>=0;--i){
        if(tgts[i].isInside(e.offsetX,e.offsetY)){
            for(j=tgts[i][e.type+"Event"].length-1;j>=0;--j){
                if(tgts[i][e.type+"Event"][j].call(tgts[i],e,this)=="stop")return;
            }
        }
    }
}



/** 矩形
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} width 
 * @param {Number} height 
 */
function CanvasRectTGT(x,y,width,height){
    CanvasTGT.call(this);
    this.data={x:x,y:y,width:width,height:height};
}
inheritClass(CanvasTGT,CanvasRectTGT);
CanvasRectTGT.prototype.constructor=CanvasRectTGT;
CanvasRectTGT.prototype.isInside=function(_x,_y){;
    var m=ctrlM2.rotate(-1*this.rotate);
    var v=new Vector2(_x-this.gridx,_y-this.gridy);
    v=ctrlV2.linearMapping(v,m);

    if(v.x>this.data.x&&v.x<this.data.x+this.data.width&&v.y>this.data.y&&v.y<this.data.y+this.data.height)return true;
    return false;
}
CanvasRectTGT.prototype.createCanvasPath=function(ctx){
    ctx.rect(this.data.x,this.data.y,this.data.width,this.data.height);
}
CanvasRectTGT.prototype.getPolygonProxy=function(){
    return ctrlPolygon.rect(this.data.x,this.data.y,this.data.width,this.data.height);
}



/** 弧形 */
function CanvasArcTGT(cx,cy,r,startAngle,endAngle,anticlockwise){
    CanvasTGT.call(this);
    this.data={cx:cx,cy:cy,r:r,startAngle:startAngle,endAngle:endAngle,anticlockwise:anticlockwise};
}
inheritClass(CanvasTGT,CanvasArcTGT);
CanvasArcTGT.prototype.constructor=CanvasArcTGT
CanvasArcTGT.prototype.isInside=function(_x,_y){
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
CanvasArcTGT.prototype.createCanvasPath=function(){
    ctx.arc(this.data.cx,this.data.cy,this.data.r,this.data.startAngle,this.data.endAngle,this.data.anticlockwise);
}
CanvasArcTGT.prototype.getPolygonProxy=function(_accuracy){
    var rtn=ctrlPolygon.arc(this.data.r,this.data.startAngle,this.data.endAngle,_accuracy,this.data.anticlockwise);
    rtn.linearMapping(new Vector2(this.data.cx,this.data.cy));
    return rtn
}


/** 多边形
 * @param {Polygon} _polygon 多边形
*/
function CanvasPolygonTGT(_polygon){
    CanvasTGT.call(this);
    this.data=_polygon;
    this.data.reMinMax();
}
inheritClass(CanvasTGT,CanvasPolygonTGT);
CanvasPolygonTGT.prototype.constructor=CanvasPolygonTGT;
CanvasPolygonTGT.prototype.isInside=function(_x,_y){
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
CanvasPolygonTGT.prototype.createCanvasPath=function(){
    var i=this.data.nodes.length-1,
        nodes=this.data.nodes;
    ctx.moveTo(nodes[i].x,nodes[i].y);
    for(--i;i>=0;--i){
        ctx.lineTo(nodes[i].x,nodes[i].y);
    }
}
CanvasPolygonTGT.prototype.useRotate=function(){
    this.data.linearMapping(ctrlM2.rotate(this.rotate));
    this.rotate=0;
}
CanvasPolygonTGT.prototype.useTranslate=function(){
    this.data.linearMapping(new Vector2(this.gridx,this.gridy));
    this.gridx=0;
    this.gridy=0;
}