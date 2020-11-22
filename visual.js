/**
 * [judgeOs UA & 内核 判断]
 * @return {[type]} [description]
 */
function judgeOs() {
    var ua          = navigator.userAgent,
    isWindowsPhone  = /(?:Windows Phone)/.test(ua),
    isSymbian       = /(?:SymbianOS)/.test(ua) || isWindowsPhone,   
    // 平板
    isFireFox       =ua.indexOf("Mozilla")!=-1,
    isTabvar        = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tabvar)/.test(ua)),  
    isPhone         = /(?:iPhone)/.test(ua) && !isTabvar,  
    isPc            = !isPhone && !isAndroid && !isSymbian,
    isAndroid       =ua.indexOf("Android")!=-1,
    isAndroid       =ua.indexOf("Android")!=-1,
    isIE            =ua.indexOf("Trident")!=-1,
    isWebkit        =ua.indexOf("isWebkit")!=-1,
    isMozilla       =ua.indexOf("Mozilla")!=-1;
    return {
        isTabvar: isTabvar,
        isPhone: isPhone,
        isAndroid : isAndroid,
        isPc : isPc,
        isFireFox:isFireFox,
        isWebkit: isWebkit,
        isIE:isIE
    };
}
/*判断客户端的浏览器UA ed.  资料参考HTML5学堂*/

/**把色卡(#xxx)变成rgba的格式 */
function colorToRGBA(str){
    var rgbass;
    var i=-1;
    if((i=str.indexOf("#"))!=-1){
        var strlength=str.length;
        var colorStrLength=strlength-i-1;
        var j=0;
        if(colorStrLength==3){
            rgbass=new Array(4);
            for(++i;i<=3;++i,++j){
                if(str[i].charCodeAt()>=48&&str[i].charCodeAt()<=57){
                    rgbass[j]=(str[i].charCodeAt()-37)*16-1;
                }
                else if(str[i].charCodeAt()>=97&&str[i].charCodeAt()<=102){
                    rgbass[j]=(str[i].charCodeAt()-86)*16-1;
                }
                else if(str[i].charCodeAt()>=65&&str[i].charCodeAt()<=70){
                    rgbass[j]=(str[i].charCodeAt()-54)*16-1;
                }
            }
            rgbass[3]=1;
        }
        else if(colorStrLength==4){
            rgbass=new Array(4);
            for(++i;i<=4;++i,++j){
                if(str[i].charCodeAt()>=48&&str[i]<=57){
                    rgbass[j]=(str[i].charCodeAt()-37)*16-1;
                }
                else if(str[i].charCodeAt()>=97&&str[i]<=102){
                    rgbass[j]=(str[i].charCodeAt()-37)*16-1;
                }
                else if(str[i].charCodeAt()>=65&&str[i]<=70){
                    rgbass[j]=(str[i].charCodeAt()-37)*16-1;
                }
            }
            rgbass[3]=rgbass[3]*0.0625;
        }
        else if(colorStrLength=6){
            rgbass=new Array(4);
            for(++i;i<=6;++i,++j){
                if(str[i].charCodeAt()>=48&&str[i]<=57){
                    rgbass[j]=(str[i].charCodeAt()-37)*16+(str[++i].charCodeAt()-38)-1;
                }
                else if(str[i].charCodeAt()>=97&&str[i]<=102){
                    rgbass[j]=(str[i].charCodeAt()-87)*16+(str[++i].charCodeAt()-87)-1;
                }
                else if(str[i].charCodeAt()>=65&&str[i]<=70){
                    rgbass[j]=(str[i].charCodeAt()-57)*16+(str[++i].charCodeAt()-55)-1;
                }
            }
            rgbass[3]=1;
        }
        return "rgba("+rgbass.join(',')+")";
    }
}

/**
 * 精灵图像
 * @param {Number} _SpritesX X轴有几格精灵图像
 * @param {Number} _SpritesY Y轴有几格精灵图像
 */
function Sprites(_SpritesX, _SpritesY,imgUrl){
    this.SpritesX=Number(_SpritesX);
    this.SpritesY=Number(_SpritesY);
    this.img=new Image();
    this.img.src=imgUrl;
}
Sprites.prototype={
    constructor:Sprites,
    /**
     * 图像显示的尺寸 (铺满)
     * @return {Object{height : Number , width : Number}}
     */
    SpritesClipSize:function(flagElement) {
        //return (flagElement.offsetHeight > flagElement.offsetWidth ? flagElement.offsetWidth : flagElement.offsetHeight);
        return {height:flagElement.offsetHeight,width:flagElement.offsetWidth};
    },
    /** 把精灵图像应用到 css 的 background 属性上
     * @param {Number} X    当前的X坐标(单位: 格)
     * @param {Number} Y    当前的Y坐标(单位: 格)
     * @param {Number} SX   当前图像在整张图像中X占据多少格子
     * @param {Number} SY   当前图像在整张图像中Y占据多少格子
     */
    renderCssbgSprites : function (_element,sx,sy,sw=1,sh=1) {
        var _spritesize =this.SpritesClipSize(_element),
        sx=-1 * x * _spritesize.width + "px",
        sy=-1 * y * _spritesize.height + "px",
        sw=1/(sw||1),
        sh=1/(sh||1),
        sizestyleTGT=this.SpritesX * _spritesize.width*sw + "px " + this.SpritesY * _spritesize.height*sh + "px";
        
        var styles=window.getComputedStyle(_element);
        if(styles.backgroundSize!=sizestyleTGT){
            _element.style.backgroundSize = sizestyleTGT;
        }

        _element.style.backgroundPositionX = sx;
        _element.style.backgroundPositionY = sy;
    },
    /** 把精灵图像应用到 canvas 上
     * @param {Number} X    当前的X坐标(单位: 格)
     * @param {Number} Y    当前的Y坐标(单位: 格)
     * @param {Number} SX   当前图像在整张图像中X占据多少格子
     * @param {Number} SY   当前图像在整张图像中Y占据多少格子
     * @param {Object{height : Number , width : Number}} SpritesClipSize   图像显示的尺寸
     */
    renderCanvasSprites : function(ctx,X,Y,SX=1,SY=1,SpritesClipSize){
        var sx=-1 * X * _spritesize.width + "px",
            sy=-1 * Y * _spritesize.height + "px";
        // void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    },
    renderSprites:function(tgt,X,Y,SX=1,SY=1,SpritesClipSizeX,SpritesClipSizeY){
        if(tgt instanceof Element){
            this.renderCssbgSprites.apply(this,arguments);
        }
        else if(tgt instanceof CanvasRenderingContext2D){
            this.renderCanvasSprites.apply(this,arguments);
        }
    }
}
