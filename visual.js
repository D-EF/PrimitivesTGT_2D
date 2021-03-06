/*
 * @Date: 2022-04-29 09:55:11
 * @LastEditors: Darth_Eternalfaith
 * @LastEditTime: 2022-04-29 17:22:52
 * @FilePath: \Editor\PrimitivesTGT-2D_Editor\js\import\PrimitivesTGT_2D\visual.js
 */

import {Stepper} from "../basics/math_ex.js";
import {
    Math2D,
    Data_Rect,
    Data_Arc,
    Data_Sector,
    Vector2,
    Matrix2x2,
    Matrix2x2T,
    Polygon,
    BezierCurve,
}from "./Math2d.js";


/**把色卡(#xxx)变成rgba的格式 */
function colorToRGBA(str) {
    var rgbass;
    var i = -1;
    if ((i = str.indexOf("#")) != -1) {
        var strlength = str.length;
        var colorStrLength = strlength - i - 1;
        var j = 0;
        if (colorStrLength == 3) {
            rgbass = new Array(4);
            for (++i; i <= 3; ++i, ++j) {
                if (str[i].charCodeAt() >= 48 && str[i].charCodeAt() <= 57) {
                    rgbass[j] = (str[i].charCodeAt() - 37) * 16 - 1;
                }
                else if (str[i].charCodeAt() >= 97 && str[i].charCodeAt() <= 102) {
                    rgbass[j] = (str[i].charCodeAt() - 86) * 16 - 1;
                }
                else if (str[i].charCodeAt() >= 65 && str[i].charCodeAt() <= 70) {
                    rgbass[j] = (str[i].charCodeAt() - 54) * 16 - 1;
                }
            }
            rgbass[3] = 1;
        }
        else if (colorStrLength == 4) {
            rgbass = new Array(4);
            for (++i; i <= 4; ++i, ++j) {
                if (str[i].charCodeAt() >= 48 && str[i] <= 57) {
                    rgbass[j] = (str[i].charCodeAt() - 37) * 16 - 1;
                }
                else if (str[i].charCodeAt() >= 97 && str[i] <= 102) {
                    rgbass[j] = (str[i].charCodeAt() - 37) * 16 - 1;
                }
                else if (str[i].charCodeAt() >= 65 && str[i] <= 70) {
                    rgbass[j] = (str[i].charCodeAt() - 37) * 16 - 1;
                }
            }
            rgbass[3] = rgbass[3] * 0.0625;
        }
        else if (colorStrLength = 6) {
            rgbass = new Array(4);
            for (++i; i <= 6; ++i, ++j) {
                if (str[i].charCodeAt() >= 48 && str[i] <= 57) {
                    rgbass[j] = (str[i].charCodeAt() - 37) * 16 + (str[++i].charCodeAt() - 38) - 1;
                }
                else if (str[i].charCodeAt() >= 97 && str[i] <= 102) {
                    rgbass[j] = (str[i].charCodeAt() - 87) * 16 + (str[++i].charCodeAt() - 87) - 1;
                }
                else if (str[i].charCodeAt() >= 65 && str[i] <= 70) {
                    rgbass[j] = (str[i].charCodeAt() - 57) * 16 + (str[++i].charCodeAt() - 55) - 1;
                }
            }
            rgbass[3] = 1;
        }
        return "rgba(" + rgbass.join(',') + ")";
    }
}

class AnimationCtrl{
    /** 动画控制器
     * @param {function(Number,AnimationCtrl)} frameCallback 每次进行动作的回调 frameCallback(t,this)
     * @param {function(AnimationCtrl)} stopCallback 结束时的回调 stopCallback(this)
     */
    constructor(frameCallback,stopCallback){
        /**@type {Boolean}表示是否正在进行动作 设置为false可以急停动画*/
        this._keepGo=false;
        /**@type {Number}开始的时间*/
        this._startTime=0;
        /**@type {Number} 用于表示时间长度, 值为 1/时间长度 */
        this.time_reciprocal;
        /**@type {function(Number,AnimationCtrl)} 每次进行动作的回调 frameCallback(t,this)*/
        this.frameCallback=frameCallback;
        /**@type {function(AnimationCtrl):Boolean} 结束时的回调 stopCallback(this)*/
        this.stopCallback=stopCallback;
        /**@type {function():Boolean} 控制结束函数 返回true时会停下动画*/
        this.discontinueFunction=nullfnc
    }
    /**
     * 开始动作
     * @param {Number} time 动作时长 单位毫秒
     */
    start(time){
        window.cancelAnimationFrame(this.animationID);
        this._keepGo=false;
        this.time_reciprocal=1/time;
        this._keepGo=true;
        this._startTime=performance.now();
        this.r_Frame();
    }
    /**
     * 停下动作
     */
    stop(){
        window.cancelAnimationFrame(this.animationID);
        this._keepGo=false;
        if(this.stopCallback instanceof Function) this.stopCallback(this);
    }
    /**
     * 申请动作在 requestAnimationFrame
     */
     r_Frame(){
        var that=this;
        if(this._keepGo&&!that.discontinueFunction())
        this.animationID=requestAnimationFrame(
            function(){
                var t=(performance.now()-that._startTime)*that.time_reciprocal;
                if(t>=1){
                    t=1;
                    if(that.frameCallback instanceof Function) that.frameCallback(t,this);
                    that.r_Frame();
                    that.stop();
                    return;
                }
                if(that.frameCallback instanceof Function) that.frameCallback(t,this);
                that.r_Frame();
            }
        )
    }
}

/**
 * 动画中数字使用的函数
 * @param {Number} start 起点
 * @param {Number} end   终点
 * @param {Number}  t    权值
 * @returns {Number} 返回对应的点
 */
function valueAnimation(start,end,t){
    return start+(end-start)*t;
}

/**
 * 动画中向量使用的函数
 * @param {Vector2} start 起点
 * @param {Vector2} end   终点
 * @param {Number}  t     权值
 * @returns {Vector2} 返回对应的点
 */
function v2Animation(start,end,t){
    return new Vector2(
        start.x+(end.x-start.x)*t,
        start.y+(end.y-start.y)*t);
}

/**
 * 动画中矩阵使用的函数
 * @param {Matrix2x2T} start 起点
 * @param {Matrix2x2T} end   终点
 * @param {Number}  t     权值
 * @returns {Matrix2x2T} 返回对应矩阵
 */
 function m2tAnimation(start,end,t){
    return new Matrix2x2T(
        start.a+(end.a-start.a)*t,
        start.b+(end.b-start.b)*t,
        start.c+(end.c-start.c)*t,
        start.d+(end.d-start.d)*t,
        start.e+(end.e-start.e)*t,
        start.f+(end.f-start.f)*t,
    )
}

var m2t=new Matrix2x2T()

/**
 * 精灵图像
 */
class Sprites{
    /**
     * 精灵图像
     * @param {Number} sprites_x X轴有几格精灵图像
     * @param {Number} sprites_y Y轴有几格精灵图像
     * @param {String} imgUrl 图像的url
     * @param {Number} deviationX_before 图像 X 轴 负方向侧 偏移 (取值0到1的浮点数) 默认0
     * @param {Number} deviationX_after  图像 X 轴 正方向侧 偏移 (取值0到1的浮点数) 默认0
     * @param {Number} deviationY_before 图像 Y 轴 负方向侧 偏移 (取值0到1的浮点数) 默认0
     * @param {Number} deviationY_after  图像 Y 轴 正方向侧 偏移 (取值0到1的浮点数) 默认0
     */
    constructor(sprites_x, sprites_y, imgUrl,deviationX_before,deviationX_after,deviationY_before,deviationY_after ){
        /** @type {Number} X轴有几格精灵图像 */
        this.sprites_x = Number(sprites_x);
        /** @type {Number} Y轴有几格精灵图像 */
        this.sprites_y = Number(sprites_y);
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
        return new Sprites(tgt.sprites_x,tgt.sprites_y,tgt.imgUrl,tgt.deviationX_before,tgt.deviationX_after,tgt.deviationY_before,tgt.deviationY_after);
    }
    copy(){
        return Sprites.copy(this);
    }
    /**
     * 渲染精灵图像
     * @param {Element|CanvasRenderingContext2D} tgt 渲染上下文, 可以是 Element 或者 CanvasRenderingContext2D
     * @param {Number} sx  当前的X坐标(单位: 格)
     * @param {Number} sy  当前的Y坐标(单位: 格)
     * @param {Number} dx  图像绘制位置X  仅供canvas使用
     * @param {Number} dy  图像绘制位置Y  仅供canvas使用
     * @param {Number} dw  图像绘制宽度   仅供canvas使用
     * @param {Number} dh  图像绘制高度   仅供canvas使用
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
            sizeX = this.sprites_x * _spritesize.width  /(1-this.deviationX_before-this.deviationX_after),
            sizeY = this.sprites_y * _spritesize.height /(1-this.deviationY_before-this.deviationY_after),
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
        scaleX = (dw * this.sprites_x)/(this.img.width   *(1-this.deviationX_before-this.deviationX_after)),
        scaleY = (dh * this.sprites_y)/(this.img.height  *(1-this.deviationY_before-this.deviationY_after)),
        translateX=dx-dw*sx-this.deviationX_before*scaleX*this.img.width,
        translateY=dy-dh*sy-this.deviationY_before*scaleY*this.img.height;
        tempPattern.setTransform(m2t.normalize().scale(scaleX, scaleY).translate(translateX,translateY));
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
 * 精灵图像帧动画控制器
 */
class Sprites_Animation{
    /**
     * @param {Number} min_x x轴最小值
     * @param {Number} max_x x轴最大值
     * @param {Number} min_y y轴最小值
     * @param {Number} max_y y轴最大值
     */
    constructor(min_x,max_x,min_y,max_y){
        /** @type {Stepper} X方向的步进器 */
        this.stepper_x=new Stepper(min_x,max_x);
        /** @type {Stepper} Y方向的步进器 */
        this.stepper_y=new Stepper(min_y,max_y);
        /**@type {function(Number,Number,Sprites_Animation)[]} 结束回调队列  this.callbackList\[0\](x,y,this)*/
        this.callbackList=[];
        /** @type {Funciton} 帧回调函数 如果返回true将会停止动画 this.frameCallback(x,y,this)*/
        this.frameCallback=nullfnc;
        /** @type {Boolean} 是否正在运行动画, 直接控制这个属性可以急停动画 */
        this._keepGo=false;
    }
    /**
     * 添加一个回调
     * @param {function(Number,Number,Sprites_Animation)} callback 下一个动作
     * @returns {Sprites_Animation} this
     */
    then(callback){
        this.callbackList.push(callback);
        return this;
    }
    /**
     * 移除一个回调
     * @param {function(Number,Number,Sprites_Animation)} callback 
     * @returns {Sprites_Animation} this
     */
    removeCallback(callback){
        this.callbackList.splice(this.callbackList.indexOf(callback),1);
        return this;
    }
    /**
     * 执行动画
     * @param {Number} opx 起点的x坐标(格)
     * @param {Number} opy 起点的y坐标(格)
     * @param {Number} edx 终点的x坐标(格)
     * @param {Number} edy 终点的y坐标(格)
     * @param {String} order 执行顺序 使用两个字符串控制; 例"y1x-1" 即从上到下然后从右到左
     * @param {Number} fps  动画帧率
     * @returns {Sprites_Animation} this
     */
    play(opx,opy,edx,edy,order,fps){
        var v={
            opx:opx,
            opy:opy,
            edx:this.stepper_x.set(edx),
            edy:this.stepper_y.set(edy)
        },
        orderOBJ=[],
        that=this;
        var i=1,j,fs=1000/fps;
        that._keepGo=true;

        // 分析顺序
        while((order[i]>='0'&&order[i]<='9')||order[i]==='-')++i;
        orderOBJ.push({
            k:order[0].toLowerCase(),
            v:Number(order.slice(1,i))
        });
        j=i;
        do{++i;}while((order[i]>='0'&&order[i]<='9')||order[i]==='-');
        orderOBJ.push({
            k:order[j].toLowerCase(),
            v:Number(order.slice(j+1,i))
        });
        
        // 初始化步进器
        this.stepper_x.set(opx);
        this.stepper_y.set(opy);
        this["stepper_"+orderOBJ[1].k].regression_listener=[function (){
            that._keepGo=false;
        }];
        this["stepper_"+orderOBJ[0].k].regression_listener=[function(){
            that["stepper_"+orderOBJ[1].k].next(orderOBJ[1].v);
        }];

        var interval= setInterval(function (){
            if(
                that._keepGo&&
                (
                    (v["ed"+orderOBJ[1].k]===that["stepper_"+orderOBJ[1].k].valueOf())&&
                    (v["ed"+orderOBJ[0].k]*orderOBJ[0].v)>=(that["stepper_"+orderOBJ[0].k].valueOf()*(orderOBJ[0].v>=0?1:-1))||
                    (v["ed"+orderOBJ[1].k]>that["stepper_"+orderOBJ[1].k].valueOf()*(orderOBJ[1].v>=0?1:-1))
                )
            ){
                that._keepGo=!that.frameCallback(that.stepper_x.valueOf(),that.stepper_y.valueOf(),that)
                that["stepper_"+orderOBJ[0].k].next(orderOBJ[0].v);
                // 继续
            }else{
                // 结束
                that._keepGo=false;
                clearInterval(interval);
                that.callbackList[0].call(that,that.stepper_x.valueOf(),that.stepper_y.valueOf(),that);
                that.callbackList.shift();
            }
        },fs);
        return this;
    }
}


export {
    colorToRGBA,
    AnimationCtrl,
    valueAnimation,
    v2Animation,
    m2tAnimation,
    Sprites,
    Sprites_Animation,
}