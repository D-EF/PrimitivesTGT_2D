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
