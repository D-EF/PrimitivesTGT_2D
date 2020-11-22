

/*精灵图像截取ed*/
/**
 * 
 * @param {Sprites} _Sprites Sprites类的实例化
 * @param {Number} order 播放顺序 0 从左到右 从上到下; 1 从上到下 从左到右; 2从右到左 从上到下; 3 从上到下 从右到左; 4 从左到右 从下到上; 5 从下到上 从左到右; 6 从右到左 从下到上; 7 从下到上 从右到左
 * @param {Number} FPS 每秒的帧数
 */
function Sprites_Animation(_Sprites,order,FPS){
    this.Sprites=_Sprites;
    this.order=order||0;
    this.FPS=FPS||24;
    /** 动画完成时的回调 */
    this.callback;
    /** 动画跑完一次循环后的回调 */
    this.callstep;
    /** 用于中断动画的函数，函数返回0时将中断动画 */
    this.discontinueFunction;
}
Sprites_Animation.prototype={
    constructor:Sprites_Animation,
    /**
     * 计算下一个xy
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} sx 
     * @param {Number} sy 
     * @param {Number} _unXL    左侧的空省
     * @param {Number} _unYT    上方的空省
     * @param {Number} _unXR    右侧的空省
     * @param {Number} _unYB    下方的空省
     * @return {Array}  [x,y,endFlag]
     */
    calcNextXY:function(_x,_y,_sx,_sy,_unXL,_unXR,_unYT,_unYB,_x2,_y2){
        var x=_x,y=_y,endFlag=0;
        var minX=_unXL,maxX=this.Sprites.SpritesX-1-_unXR,minY=_unYT,maxY=this.Sprites.SpritesY-1-_unYB;
        switch(this.order){
            // 0 从左到右 从上到下;
            case 0:
                x+=_sx;
                if(x>maxX){
                    x=minX;
                    y+=_sy;
                }
                if(y>maxY||y>_y2||(y==_y2&&x>=_x2)){
                    endFlag=1;
                }
            break;
            // 1 从上到下 从左到右;
            case 1:
                y+=_sy;
                if(y>maxY){
                    y=minY;
                    x+=_sx;
                }
                if(x>maxX||x>_x2||(x==_x2&&y>=_y2)){
                    endFlag=1;
                }
            break;
            // 2从右到左 从上到下;
            case 2:
                x-=_sx;
                if(x<minY){
                    x=maxX;
                    y+=_sy;
                }
                if(y>maxY||y>_y2||(y==_y2&&x<=_x2)){
                    endFlag=1;
                }
            break;
            // 3 从上到下 从右到左; 
            case 3:
                y+=_sy;
                if(y>maxY){
                    y=minY;
                    x-=_sx;
                }
                if(x<minX||x<_x2||(x==_x2&&y>=_y2)){
                    endFlag=1;
                }
            break;
            // 4 从左到右 从下到上;
            case 4:
                x+=_sx;
                if(x>maxX){
                    x=minX;
                    y-=_sy;
                }
                if(y<minY||y<_y2||(y==_y2&&x>=_x2)){
                    endFlag=1;
                }
            break;
            // 5 从下到上 从左到右;
            case 5:
                y-=_sx;
                if(y<minY){
                    y=maxY;
                    x+=_sx;
                }
                if(x>maxX||x>_x2||(x==_x2&&y<=_y2)){
                    endFlag=1;
                }
            break;
            // 6 从右到左 从下到上; 
            case 6:
                x-=_sx;
                if(x<minY){
                    x=maxX;
                    y-=_sy;
                }
                if(y<minY||y<_y2||(y==_y2&&x<=_x2)){
                    endFlag=1;
                }
            break;
            // 7 从下到上 从右到左;
            case 7:
                y-=_sy;
                if(x<minY){
                    y=maxY;
                    x-=_sx;
                }
                if(x<minX||x<_x2||(x==_x2&&y<=_y2)){
                    endFlag=1;
                }
            break;
            default:
                endFlag=1;
            break;
        }

        return [x,y,endFlag];
    },
    /**
     * 运行动画
     * @param {Number} X1   起点的X坐标
     * @param {Number} Y1   起点的Y坐标
     * @param {Number} X2   终点的X坐标
     * @param {Number} Y2   终点的Y坐标
     * @param {Number} SX   当前图像在整张图像中X占据多少格子,同时也是动画的步长
     * @param {Number} SY   当前图像在整张图像中Y占据多少格子,同时也是动画的步长
     * @param {*} _unXL     左侧的空省
     * @param {*} _unYT     上方的空省
     * @param {*} _unXR     右侧的空省
     * @param {*} _unYB     下方的空省
     */
    go:function(_element,X1,Y1,X2,Y2,_SX,_SY,_unXL,_unYT,_unXR,_unYB,_count){
        var thisAnimation=this,
            F_Speeds=1000/this.FPS,
            X=X1||0,Y=Y1||0,SX=_SX||1,SY=_SY||1,
            unXL=_unXL||0,unXR=_unXR||0,unYT=_unYT||0,unYB=_unYB||0,endFlag=0,
            callback=this.callback,
            callstep=this.callstep,
            _arguments=arguments,
            count=_count||1,
            discontinueFunction=this.discontinueFunction||function(){return 1};
        clearInterval(_element.SpritesAnimationTimer);
        _element.SpritesAnimationTimer=setInterval(function(){
            thisAnimation.Sprites.renderSprites(_element,X,Y,_SX,_SY);
            if(!discontinueFunction(thisAnimation)){
                if(callback&&callback.constructor==Function){
                    callback();
                }
                clearInterval(_element.SpritesAnimationTimer);
            }
            [X,Y,endFlag]=thisAnimation.calcNextXY(X,Y,SX,SY,unXL,unXR,unYT,unYB,X2,Y2);
            if(endFlag){
                if(--count){
                    X=X1||0,Y=Y1||0;
                    if(callstep&&callstep.constructor==Function)callstep.apply(thisAnimation,_arguments);
                }
                else{
                    // 结束
                    clearInterval(_element.SpritesAnimationTimer);
                    if(callback&&callback.constructor==Function)callback.apply(thisAnimation,_arguments);
                }
            }
        },F_Speeds);
    }
}

/**
 * 2维向量
 * @param {Number}  x
 * @param {Number}  y
 */
function Vector2(x,y){
    this.x=x||0;
    this.y=y||0;
}
Vector2.prototype={
    constructor:Vector2,
    /** 归零 */
    zero:function(){
        this.x=this.y=0;
    },
    /**拷贝向量
     * @return {Vector2} 
     */
    copy    :function(){
        return new Vector2(this.x,this.y);
    },
    /**
	 * @brief 求模
     * @return {Number} 
	*/
	mag:function() {
		return Math.sqrt(this.x*this.x+this.y*this.y);
    },
	/**
	 * @brief 标准化向量
	*/
	normalize:function() {
        if(this.x==0&&this.y==0)return;
		var magSq = this.vectorMag(),oneOverMag=0;
		if (magSq>0) {
			oneOverMag = 1.0/magSq;
			this.x *= oneOverMag;
			this.y *= oneOverMag;
		}
    },
    getXY:function(){
        return [this.x,this.y];
    }
}
var ctrlV2={
    /**判断一个向量是不是零向量
     * @param   {Vector2} v
     * @return {Boolean}
     */
    judgeZero:function(){return !(this.x||this.y);},
    /**向量取反
     * @param {Vector2} v
     * @return {Vector2}
     */
    instead :function(v){return new Vector2(-1*v.x,-1*v.y);},
    /**向量和
     * @param {Vector2} v1
     * @param {Vector2} v2
     * @return {Vector2}
     */
    sum     :function(v1,v2){return new Vector2(v1.x+v2.x,v1.y+v2.y);},
    /**数字乘向量 
     * @param {Number} n
     * @param {Vector2} v
     * @return {Vector2}
    */
    np      :function(n,v){return new Vector2(v.x*n,v.y*n);},
    /**向量差
     * @param {Vector2} v1
     * @param {Vector2} v2
     * @return {Vector2}
     */
    dif     :function(v1,v2){return new Vector2(v1.x-v2.x,v1.y-v2.y);},
    /**
     * 向量内积
     * @param {Vector2} v1
     * @param {Vector2} v2
     * @return {Number}
     */
    ip      :function(v1,v2){return v1.x*v2.x+v1.y*v2.y;},
    /**向量外积
     * @param {Vector2} v1
     * @param {Vector2} v2
     * @return {Number}
     */
    op      :function(v1,v2){return v1.x*v2.y-v1.y*v2.x;},
    /**
     * 向量乘以矩阵
     * @param {Vector2} v 
     * @param {Matrix2x2} m 
     * @return {Vector2} 返回一个新的向量
     */
    linearMapping   :function(v,m){
        var x,y;
        x=v.x*m.m11+v.y*m.m21;
        y=v.x*m.m12+v.y*m.m22;
        return new Vector2(x,y);
    }
}
/**
 * 2*3矩阵
 * @param {Number} m11  矩阵的参数
 * @param {Number} m12  矩阵的参数
 * @param {Number} m21  矩阵的参数
 * @param {Number} m22  矩阵的参数
 */
function Matrix2x2(m11,m12,m21,m22){
    this.m11=m11;
    this.m12=m12;
    this.m21=m21;
    this.m22=m22;
}
Matrix2x2.prototype.constructor=Matrix2x2;

var ctrlM2={
    /**创建旋转矩阵 
     * @param {Number} angle 旋转角(rad)
    */
    rotate:function(angle){
        var rtn = new Matrix2x2(
            Math.cos(angle),Math.sin(angle),
            0,0
        );
        rtn.m21=rtn.m12*-1;
        rtn.m22=rtn.m11;
        return rtn;
    }
}

/** */
function Polygon(){
    // 存放 Vector2 的列表 
    this.nodes=[];
    this.minX;
    this.minY;
    this.maxX;
    this.maxY;
}
Polygon.prototype={
    constructor:Polygon,
    /**拷贝自身
     * @return {Polygon}
     */
    copy:function(){
        var ret=new Polygon();
        var l=this.nodes.length,i=0;
        for(;i<l;++i){
            ret.pushNode(this.nodes[i]);
        }
        ret.minX=this.minX;
        ret.minY=this.minY;
        ret.maxX=this.maxX;
        ret.maxY=this.maxY;
        return ret;
    },
    /**
     * 刷新 最大xy 最小xy
     */
    reMinMax:function(){
        for(var i=this.nodes.length-1;i>=0;--i){
                 if(this.nodes[i].x>this.maxX||this.maxX==undefined)this.maxX=this.nodes[i].x;
            else if(this.nodes[i].y<this.minX||this.minX==undefined)this.minX=this.nodes[i].x;
                 if(this.nodes[i].y>this.maxY||this.maxY==undefined)this.maxY=this.nodes[i].y;
            else if(this.nodes[i].y<this.minY||this.minY==undefined)this.minY=this.nodes[i].y;
        }
    }
    ,
    /**追加节点
     * @param {Vector2} v       要插入的节点
     */
    pushNode:function(v){
        this.nodes.push(v.copy());
             if(v.x>this.maxX||this.maxX==undefined)this.maxX=v.x;
        else if(v.x<this.minX||this.minX==undefined)this.minX=v.x;
             if(v.y>this.maxY||this.maxY==undefined)this.maxY=v.y;
        else if(v.y<this.minY||this.minY==undefined)this.minY=v.y;
    },
    /**插入节点
     * @param {Number} index    要插入的节点的下标
     * @param {Vector2} v       要插入的节点
     */
    insert:function(index,v){
        this.nodes.splice(index,0,v);
             if(v.x>this.maxX||this.maxX==undefined)this.maxX=v.x;
        else if(v.y<this.minX||this.minX==undefined)this.minX=v.x;
             if(v.y>this.maxY||this.maxY==undefined)this.maxY=v.y;
        else if(v.y<this.minY||this.minY==undefined)this.minY=v.y;
    },
    /**移除节点
     * @param {Number} index 要删除的节点的下标
     */
    remove:function(index){
        this.nodes.splice(index,1);
        this.reMinMax();
    },
    /**移除所有节点 */
    removeAll:function(){
        this.nodes=[];
        this.minX=0;
        this.minY=0;
        this.maxX=0;
        this.maxY=0;
    },
    /** 闭合路径 */
    seal:function(){
        if(!this.isClosed()){
            this.nodes.push(this.nodes[0].copy());
        }
    },
    /** 是否密封 */
    isClosed:function(){
        var l=this.nodes.length-1;
        return this.nodes[0].x==this.nodes[l].x&&this.nodes[0].y==this.nodes[l].y;
    }
}

Polygon.prototype.linearMapping=createOlFnc();
/**用一个向量变换 把所有点与参数相加*/
Polygon.prototype.linearMapping.addOverload([Vector2],function(v){
    var i=this.nodes.length;
    for(--i;i>=0;--i){
        this.nodes[i]=ctrlV2.sum(this.nodes[i],v);
    }
});
/**用一个矩阵变换 */
Polygon.prototype.linearMapping.addOverload([Matrix2x2],function(m){
    var i=this.nodes.length;
    for(--i;i>=0;--i){
        this.nodes[i]=ctrlV2.linearMapping(this.nodes[i],m);
    }
});

var ctrlPolygon={
    /** 
     * 创建矩形
     */
    rect:function(x,y,width,height){
        var ret=new Polygon();
        ret.pushNode(new Vector2(x,y));
        ret.pushNode(new Vector2(x+width,y));
        ret.pushNode(new Vector2(x+width,y+height));
        ret.pushNode(new Vector2(x,y+height));
        ret.seal();
        return ret;
    },
    /**
     * 把弧形转换成多边形, 如果弧度的 绝对值 大于 2π 将作为圆形而不是弧形
     * @param {Number} r                半径
     * @param {Number} _accuracy         精度 最小为3, 表示弧形由个顶点构成
     * @param {Number} startAngle       开始的弧度(rad)
     * @param {Number} endAngle         结束的弧度(rad)
     * @param {Boolean} anticlockwise   逆时针或顺时针
     */
    arc:function(r,_startAngle,_endAngle,_accuracy,anticlockwise){
        var rtn=new Polygon();
        var accuracy=_accuracy>=3?_accuracy:3,
            startAngle,endAngle,cyclesflag,
            stepLong,
            cycles=Math.PI*2,
            i,tempAngle;
        if(anticlockwise){
            // 逆时针
            startAngle=_endAngle;
            endAngle=_startAngle;
        }
        else{
            // 顺时针
            startAngle=_startAngle;
            endAngle=_endAngle;
        }
        if(endAngle-startAngle>=cycles||endAngle-startAngle<=-1*cycles){
            // 如果弧度 绝对值 大于 2π 将作为圆形而不是弧形
            stepLong=cycles/accuracy;
            cyclesflag=true;
        }
        else{
            stepLong=(endAngle-startAngle)/(accuracy-1);
        }
        for(i=accuracy-1;i>=0;--i){
            tempAngle=endAngle-i*stepLong;
            rtn.nodes.push(new Vector2(Math.cos(tempAngle)*r,Math.sin(tempAngle)*r));
        }
        if(cyclesflag){
            rtn.seal();
        }
        rtn.reMinMax();
        return rtn;
    }
}

/** 判断两条线段是否相交
 * @param {Vector2} l1op    线段1的起点
 * @param {Vector2} l1ed    线段1的终点
 * @param {Vector2} l2op    线段2的起点
 * @param {Vector2} l2ed    线段2的终点
 * @return {Boolean}
 */
function getIntersectFlag(l1op,l1ed,l2op,l2ed){
    var temp1=ctrlV2.dif(l1ed,l1op),
        t1o=ctrlV2.dif(l1ed,l2op),
        t1e=ctrlV2.dif(l1ed,l2ed);
    var temp2=ctrlV2.dif(l2ed,l2op),
        t2o=ctrlV2.dif(l2ed,l1op),
        t2e=ctrlV2.dif(l2ed,l1ed);
    var f11=ctrlV2.op(temp1,t1o),
        f12=ctrlV2.op(temp1,t1e);
    var f21=ctrlV2.op(temp2,t2o),
        f22=ctrlV2.op(temp2,t2e);
    if((f11>0)==(f12<0)&&(f22>0)==(f21<0)){
        return true;
    }
    return false;
}
/** 获取两个多边形的相交次数
 * @param   {Polygon}   _polygon1
 * @param   {Polygon}   _polygon2
 * @return  {Number}    相交的次数
 */
function getImpactCount(_polygon1,_polygon2){
    if(_polygon1.minX>_polygon2.maxX||_polygon2.minX>_polygon1.maxX||_polygon1.minY>_polygon2.maxY||_polygon1.minY>_polygon1.maxY)return 0;
    var vl1=_polygon1.nodes,vl2=_polygon2.nodes;
    var i=vl1.length-1,j;
    var f=0;
    for(--i;i>=0&&!f;--i){
        for(j=vl2.length-2;j>=0;--j){
            if(getIntersectFlag(vl1[i],vl1[i+1],vl2[j],vl2[j+1]))++f;
        }
    }
    return f;
}
/** 获取两个多边形是否相交
 * @param   {Polygon}   _polygon1
 * @param   {Polygon}   _polygon2
 * @return  {Number}    相交的次数
 */
function getImpactFlag(_polygon1,_polygon2){
    if(_polygon1.minX>_polygon2.maxX||_polygon2.minX>_polygon1.maxX||_polygon1.minY>_polygon2.maxY||_polygon1.minY>_polygon1.maxY)return false;
    var vl1=_polygon1.nodes,vl2=_polygon2.nodes;
    var i=vl1.length-1,j;
    for(--i;i>=0&&!f;--i){
        for(j=vl2.length-2;j>=0;--j){
            if(getIntersectFlag(vl1[i],vl1[i+1],vl2[j],vl2[j+1]))return true;
        }
    }
    return false;
}
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
    this.minX=-2048;
    this.minY=-2048;
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
    tempProxy=this.data.isClosed()?this.data:this.data.copy();
    tempProxy.seal();
    var t1op=new Vector2(this.minX,this.minY);
    var t1ed=new Vector2(x,y);
    var tempPolygon=new Polygon();
    tempPolygon.pushNode(t1op);
    tempPolygon.pushNode(t1ed);
    if(getImpactCount(tempPolygon,tempProxy)%2){
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