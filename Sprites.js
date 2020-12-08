

/**
 * 精灵图像
 * @param {Number} _SpritesX X轴有几格精灵图像
 * @param {Number} _SpritesY Y轴有几格精灵图像
 */
function Sprites(_SpritesX, _SpritesY, imgUrl) {
    this.SpritesX = Number(_SpritesX);
    this.SpritesY = Number(_SpritesY);
    this.img = new Image();
    this.img.src = imgUrl;
}
Sprites.Matrix = new Matrix2x2T();
Sprites.nullCtx=document.createElement("canvas").getContext("2d");
Sprites.prototype = {
    constructor: Sprites,
    /**
     * 图像显示的尺寸 (铺满)
     * @return {Object{height : Number , width : Number}}
     */
    SpritesClipSize: function (flagElement) {
        //return (flagElement.offsetHeight > flagElement.offsetWidth ? flagElement.offsetWidth : flagElement.offsetHeight);
        return { height: flagElement.offsetHeight, width: flagElement.offsetWidth };
    },
    /**
     * 
     * @param {*} tgt 上下文, 可以是 Element 或者 CanvasRenderingContext2D
     * @param {*} sx  当前的X坐标(单位: 格)
     * @param {*} sy  当前的Y坐标(单位: 格)
     * @param {*} sw  当前图像在整张图像中X占据多少格子
     * @param {*} sh  当前图像在整张图像中Y占据多少格子
     * @param {*} dx  图像绘制位置X  仅供canvas使用
     * @param {*} dy  图像绘制位置Y  仅供canvas使用
     * @param {*} dw  图像绘制宽度   仅供canvas使用
     * @param {*} dh  图像绘制高度   仅供canvas使用
     */
    renderSprites: function (tgt, sx, sy, sw, sh, dx, dy, dw, dh) {
        if (tgt instanceof Element) {
            this.renderCssbgSprites.apply(this, arguments);
        }
        else if (tgt instanceof CanvasRenderingContext2D) {
            this.renderCanvasSprites.apply(this, arguments);
        }
    },
    /** 把精灵图像应用到 css 的 background 属性上
     * @param {Number} X    当前的X坐标(单位: 格)
     * @param {Number} Y    当前的Y坐标(单位: 格)
     * @param {Number} SX   当前图像在整张图像中X占据多少格子
     * @param {Number} SY   当前图像在整张图像中Y占据多少格子
     */
    renderCssbgSprites: function (_element, sx, sy, sw = 1, sh = 1) {
        var _spritesize = this.SpritesClipSize(_element),
            sx = -1 * sx * _spritesize.width + "px",
            sy = -1 * sy * _spritesize.height + "px",
            sw = 1 / (sw || 1),
            sh = 1 / (sh || 1),
            sizestyleTGT = this.SpritesX * _spritesize.width * sw + "px " + this.SpritesY * _spritesize.height * sh + "px",
            positionTGT = sx + " " + sy;
        var styles = window.getComputedStyle(_element);
        if (styles.backgroundSize != sizestyleTGT) {
            _element.style.backgroundSize = sizestyleTGT;
        }
        if (styles.backgroundPosition != positionTGT) {
            _element.style.backgroundPosition = positionTGT;
        }
    },
    /**
     * 创建用于绘制 canvas 的 canvasPattern
     * @param {Number} sx    当前的X坐标(单位: 格)
     * @param {Number} sy    当前的Y坐标(单位: 格)
     * @param {Number} sw    当前图像在整张图像中X占据多少格子
     * @param {Number} sh    当前图像在整张图像中Y占据多少格子
     * @param {Number} dx    图像绘制位置X
     * @param {Number} dy    图像绘制位置Y
     * @param {Number} dw    图像绘制宽度
     * @param {Number} dh    图像绘制高度
     * @return {CanvasPattern}
     */
    createPattern:function(sx, sy, sw, sh, dx, dy, dw, dh){
        var tempPattern =Sprites.nullCtx.createPattern(this.img,"repeat"),
        scaleX = (dw * this.SpritesX)/(this.img.width*sw),
        scaleY = (dh*this.SpritesY)/(this.img.height*sh),
        translateX=dx-scaleX*dw*sx,
        translateY=dy-scaleY*dh*sy;
        tempPattern.setTransform(Sprites.Matrix.scale(scaleX, scaleY).translate(translateX,translateY));
        return tempPattern;
    },

    /** 把精灵图像应用到 canvas 上
     * @param {CanvasRenderingContext2D} ctx 当前画布的上下文
     * @param {Number} sx    当前的X坐标(单位: 格)
     * @param {Number} sy    当前的Y坐标(单位: 格)
     * @param {Number} sw    当前图像在整张图像中X占据多少格子
     * @param {Number} sh    当前图像在整张图像中Y占据多少格子
     * @param {Number} dx    图像绘制位置X
     * @param {Number} dy    图像绘制位置Y
     * @param {Number} dw    图像绘制宽度
     * @param {Number} dh    图像绘制高度
     */
    renderCanvasSprites: function (ctx, sx, sy, sw, sh, dx, dy, dw, dh) {
        ctx.fillStyle = this.createPattern( sx, sy, sw, sh, dx, dy, dw, dh);
        ctx.fillRect(dx, dy, dw, dh);
    }
}

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
     * @param {HTMLElement} _element 目标元素
     * @param {Number} X1   起点的X坐标
     * @param {Number} Y1   起点的Y坐标
     * @param {Number} X2   终点的X坐标
     * @param {Number} Y2   终点的Y坐标
     * @param {Number} SX   当前图像在整张图像中X占据多少格子,同时也是动画的步长
     * @param {Number} SY   当前图像在整张图像中Y占据多少格子,同时也是动画的步长
     * @param {Number} _unXL     左侧的空省
     * @param {Number} _unYT     上方的空省
     * @param {Number} _unXR     右侧的空省
     * @param {Number} _unYB     下方的空省
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
