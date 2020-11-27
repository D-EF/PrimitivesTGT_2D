/**
 * [judgeOs UA & 内核 判断]
 * @return {[type]} [description]
 */
function judgeOs() {
    var ua = navigator.userAgent,
        isWindowsPhone = /(?:Windows Phone)/.test(ua),
        isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
        // 平板
        isFireFox = ua.indexOf("Mozilla") != -1,
        isTabvar = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tabvar)/.test(ua)),
        isPhone = /(?:iPhone)/.test(ua) && !isTabvar,
        isPc = !isPhone && !isAndroid && !isSymbian,
        isAndroid = ua.indexOf("Android") != -1,
        isAndroid = ua.indexOf("Android") != -1,
        isIE = ua.indexOf("Trident") != -1,
        isWebkit = ua.indexOf("isWebkit") != -1,
        isMozilla = ua.indexOf("Mozilla") != -1;
    return {
        isTabvar: isTabvar,
        isPhone: isPhone,
        isAndroid: isAndroid,
        isPc: isPc,
        isFireFox: isFireFox,
        isWebkit: isWebkit,
        isIE: isIE
    };
}
/*判断客户端的浏览器UA ed.  资料参考HTML5学堂*/

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
Sprites.Matrix = document.createElementNS('http://www.w3.org/2000/svg', "svg").createSVGMatrix();
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
        var tempPattern = ctx.createPattern(this.img,"repeat");
        scaleX = (this.img.width) / (dw * this.SpritesX*sw),
        scaleY = (this.img.height) / (dh * this.SpritesY*sh),
        translateX=dw-scaleX*dw*sx,
        translateY=dh-scaleY*dh*sy;
// svg矩阵不够完善，不能在指定轴向上缩放，待修改
// svg矩阵的内容 abcd分别为22变换方阵的参数，ef控制平移 
        tempPattern.setTransform(Sprites.Matrix.scale(scaleX, scaleY).translate(translateX,translateY));
        ctx.fillStyle = tempPattern;
        ctx.fillRect(dx, dy, dw, dh);
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
    }
}
