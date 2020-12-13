
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
