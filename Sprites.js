/*!
 * 精灵图像相关
 */

import {Stepper} from "../basics/math_ex.js";
import {Matrix2x2T} from "./Math2d.js";

var m2t=new Matrix2x2T()

/**
 * 精灵图像
 */
class Sprites{
    /**
     * 精灵图像
     * @param {Number} spritesX X轴有几格精灵图像
     * @param {Number} spritesY Y轴有几格精灵图像
     * @param {String} imgUrl 图像的url
     * @param {Number} deviationX_before 图像 X 轴 负方向侧 偏移 (取值0到1的浮点数) 默认0
     * @param {Number} deviationX_after  图像 X 轴 正方向侧 偏移 (取值0到1的浮点数) 默认0
     * @param {Number} deviationY_before 图像 Y 轴 负方向侧 偏移 (取值0到1的浮点数) 默认0
     * @param {Number} deviationY_after  图像 Y 轴 正方向侧 偏移 (取值0到1的浮点数) 默认0
     */
    constructor(spritesX, spritesY, imgUrl,deviationX_before,deviationX_after,deviationY_before,deviationY_after ){
        /** @type {Number} X轴有几格精灵图像 */
        this.spritesX = Number(spritesX);
        /** @type {Number} Y轴有几格精灵图像 */
        this.spritesY = Number(spritesY);
        /** @type {Image} 贴图url */
        this.imgUrl=imgUrl;
        /** @type {Image} 贴图 */
        this.img = new Image();
        this.img.src = imgUrl;
        /** @type {Number} 图像 X 轴 负方向侧 偏移 (取值0到1的浮点数) 默认0 */
        this.deviationX_before  = deviationX_before || 0;
        /** @type {Number} 图像 X 轴 正方向侧 偏移 (取值0到1的浮点数) 默认0 */
        this.deviationX_after   = deviationX_after  || 0;
        /** @type {Number} 图像 Y 轴 负方向侧 偏移 (取值0到1的浮点数) 默认0 */
        this.deviationY_before  = deviationY_before || 0;
        /** @type {Number} 图像 Y 轴 正方向侧 偏移 (取值0到1的浮点数) 默认0 */
        this.deviationY_after   = deviationY_after  || 0;
    }
    /**
     * @param {Sprites} tgt 
     * @returns {Sprites} 返回拷贝
     */
    static copy(tgt){
        return new Sprites(tgt.spritesX,tgt.spritesY,tgt.imgUrl,tgt.deviationX_before,tgt.deviationX_after,tgt.deviationY_before,tgt.deviationY_after);
    }
    copy(){
        return Sprites.copy(this);
    }
    /**
     * 渲染精灵图像
     * @param {*} tgt 上下文, 可以是 Element 或者 CanvasRenderingContext2D
     * @param {*} sx  当前的X坐标(单位: 格)
     * @param {*} sy  当前的Y坐标(单位: 格)
     * @param {*} dx  图像绘制位置X  仅供canvas使用
     * @param {*} dy  图像绘制位置Y  仅供canvas使用
     * @param {*} dw  图像绘制宽度   仅供canvas使用
     * @param {*} dh  图像绘制高度   仅供canvas使用
     */
    renderSprites(tgt, sx, sy, dx, dy, dw, dh) {
        if (tgt instanceof Element) {
            this.renderCssbgSprites.apply(this, arguments);
        }
        else if (tgt instanceof CanvasRenderingContext2D) {
            this.renderCanvasSprites.apply(this, arguments);
        }
    }
    /**
     * 图像显示的尺寸 (铺满)
     * @param {Element} flagElement
     * @return {{height : Number , width : Number}}
     */
    SpritesClipSize(flagElement) {
        //return (flagElement.offsetHeight > flagElement.offsetWidth ? flagElement.offsetWidth : flagElement.offsetHeight);
        return { height: flagElement.offsetHeight, width: flagElement.offsetWidth };
    }
    /** 把精灵图像应用到 css 的 background 属性上
     * @param {Number} sx    当前的X坐标(单位: 格)
     * @param {Number} sy    当前的Y坐标(单位: 格)
     */
    renderCssbgSprites(_element, sx, sy) {
        var _spritesize = this.SpritesClipSize(_element),
            sizeX = this.spritesX * _spritesize.width  /(1-this.deviationX_before-this.deviationX_after),
            sizeY = this.spritesY * _spritesize.height /(1-this.deviationY_before-this.deviationY_after),
            dX = this.deviationX_before*sizeX,
            dY = this.deviationY_before*sizeY,
            sx = -1 * sx * _spritesize.width -dX + "px",
            sy = -1 * sy * _spritesize.height-dY + "px",
            positionTGT = sx + " " + sy,
            sizestyleTGT= sizeX + "px " + sizeY+"px";
        var styles = window.getComputedStyle(_element);
        if (styles.backgroundSize != sizestyleTGT) {
            _element.style.backgroundSize = sizestyleTGT;
        }
        if (styles.backgroundPosition != positionTGT) {
            _element.style.backgroundPosition = positionTGT;
        }
    }
    /**
     * 创建用于绘制 canvas 的 canvasPattern
     * @param {CanvasRenderingContext2D} ctx 当前画布的上下文
     * @param {Number} sx    当前的X坐标(单位: 格)
     * @param {Number} sy    当前的Y坐标(单位: 格)
     * @param {Number} dx    图像绘制位置X
     * @param {Number} dy    图像绘制位置Y
     * @param {Number} dw    图像绘制宽度
     * @param {Number} dh    图像绘制高度
     * @return {CanvasPattern}
     */
    createPattern(ctx, sx, sy, dx, dy, dw, dh){
        var tempPattern =ctx.createPattern(this.img,"repeat"),
        scaleX = (dw * this.spritesX)/(this.img.width   *(1-this.deviationX_before-this.deviationX_after)),
        scaleY = (dh * this.spritesY)/(this.img.height  *(1-this.deviationY_before-this.deviationY_after)),
        translateX=dx-dw*sx-this.deviationX_before*scaleX*this.img.width,
        translateY=dy-dh*sy-this.deviationY_before*scaleY*this.img.height;
        tempPattern.setTransform(m2t.scale(scaleX, scaleY).translate(translateX,translateY));
        return tempPattern;
    }
    /** 把精灵图像应用到 canvas 上
     * @param {CanvasRenderingContext2D} ctx 当前画布的上下文
     * @param {Number} sx    当前的X坐标(单位: 格)
     * @param {Number} sy    当前的Y坐标(单位: 格)
     * @param {Number} dx    图像绘制位置X
     * @param {Number} dy    图像绘制位置Y
     * @param {Number} dw    图像绘制宽度
     * @param {Number} dh    图像绘制高度
     */
    renderCanvasSprites(ctx, sx, sy, dx, dy, dw, dh) {
        if(!this.img.complete){
            this.img.addEventListener("load",()=>{
                this.renderCanvasSprites(ctx, sx, sy, dx, dy, dw, dh);
            });
        }else{
            ctx.fillStyle = this.createPattern(ctx, sx, sy, dx, dy, dw, dh);
            ctx.fillRect(dx, dy, dw, dh);
        }
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
        var minX=_unXL,maxX=this.Sprites.spritesX-1-_unXR,minY=_unYT,maxY=this.Sprites.spritesY-1-_unYB;
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

class Sprites_loop{
    /**
     * @param {Sprites} sprites Sprites 实例
     * @param {Number} _min_x 最小的x, 单位是 Sprites 的格
     * @param {Number} _max_x 最大的x, 单位是 Sprites 的格
     * @param {Number} _min_y 最小的y, 单位是 Sprites 的格
     * @param {Number} _max_y 最大的y, 单位是 Sprites 的格
     */
    constructor(sprites,_min_x,_max_x,_min_y,_max_y){
        var max_x=_max_x===undefined?sprites.spritesX:max_x,
            min_x=_min_x||0,
            min_y=_min_y||0,
            max_y=_max_y===undefined?sprites.spritesX:max_y;
        this.sprites=sprites;
        this._sectionX=new Stepper(max_x,min_x);
        this._sectionY=new Stepper(max_y,min_y);
    }
}


export{
    Sprites,
    Sprites_Animation,
    Sprites_loop
}