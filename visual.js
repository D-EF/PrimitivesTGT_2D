/*
 * @LastEditors: Darth_Eternalfaith
 */

import {
    Math2D,
    Data_Rect,
    Data_Arc,
    Data_Sector,
    Vector2,
    Matrix2x2,
    Matrix2x2T,
    Polygon,
    Bezier_Node,
    Bezier_Polygon,
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
     * @param {Function} frameCallback 每次进行动作的回调 frameCallback(t,this)
     * @param {Function} stopCallback 结束时的回调 stopCallback(this)
     */
    constructor(frameCallback,stopCallback){
        /**@type {Boolean}表示是否正在进行动作 设置为false可以急停动画*/
        this._keepGo=false;
        /**@type {Number}开始的时间*/
        this._startTime=0;
        /**@type {Number} 用于表示时间长度, 值为 1/时间长度 */
        this.time_reciprocal;
        /**@type {Function} 每次进行动作的回调 frameCallback(t,this)*/
        this.frameCallback=frameCallback;
        /**@type {Function} 结束时的回调 stopCallback(this)*/
        this.stopCallback=stopCallback;
        /**@type {Function} 控制结束函数 返回true时会停下动画*/
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
        this.r_frame();
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
     r_frame(){
        var that=this;
        if(this._keepGo&&!that.discontinueFunction())
        this.animationID=requestAnimationFrame(
            function(){
                var t=(performance.now()-that._startTime)*that.time_reciprocal;
                if(t>=1){
                    t=1;
                    if(that.frameCallback instanceof Function) that.frameCallback(t,this);
                    that.r_frame();
                    that.stop();
                    return;
                }
                if(that.frameCallback instanceof Function) that.frameCallback(t,this);
                that.r_frame();
            }
        )
    }
}

/**
 * 动画中向量使用的函数
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

export {
    colorToRGBA,
    AnimationCtrl,
    valueAnimation,
    v2Animation,
    m2tAnimation
}