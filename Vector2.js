/*!
 *  Polygon.js 
 *  这个文件部分依赖于 Matrix2x2_mod.js
 */


/**
 * 2维向量
 * @class 
 * @param {Number}  x
 * @param {Number}  y
 */
class Vector2{
    /**
     * @param {Number}  x
     * @param {Number}  y
     */
    constructor(x,y){
        this.x=x||0;
        this.y=y||0;
    }
    /** 归零 */
    zero(){
        this.x=this.y=0;
    }
    /**拷贝向量
     * @return {Vector2} 
     */
    copy(){
        return new Vector2(this.x,this.y);
    }
    /**
	 * @brief 求模
     * @return {Number} 
	*/
	mag() {
		return Math.sqrt(this.x*this.x+this.y*this.y);
    }
	/**
	 * @brief 标准化向量
	*/
	normalize() {
        if(this.x==0&&this.y==0)return;
		var magSq = this.vectorMag(),oneOverMag=0;
		if (magSq>0) {
			oneOverMag = 1.0/magSq;
			this.x *= oneOverMag;
			this.y *= oneOverMag;
		}
    }
    getXY(){
        return [this.x,this.y];
    }
    
    /**判断向量是不是零向量
     * @return {Boolean}
     */
    judgeZero(){return !(this.x||this.y);}
    
    /**取反
     * @return {Vector2}
     */
    instead(){return new Vector2(-1*this.x,-1*this.y);}

    /**向量和
     * @param {Vector2} v2
     * @return {Vector2}
     */
    add(v2){return new Vector2(this.x+v2.x,this.y+v2.y);}
    /**数字乘向量 
     * @param {Number} n
     * @param {Vector2} v
     * @return {Vector2}
    */
    np(n){return new Vector2(this.x*n,this.y*n);}
    /**向量差
     * @param {Vector2} v2 减
     * @return {Vector2}
     */
    dif(v2){return new Vector2(this.x-v2.x,this.y-v2.y);}
    /**
     * 向量内积
     * @param {Vector2} v2
     * @return {Number}
     */
    ip(v2){return this.x*v2.x+this.y*v2.y;}
    /**向量外积
     * @param {Vector2} v2 
     * @return {Number}
     */
    op(v2){return this.x*v2.y-this.y*v2.x;}
    
    /**向量和
     * @param {Vector2} v1
     * @param {Vector2} v2
     * @return {Vector2}
     */
     static add(v1,v2){return new Vector2(v1.x+v2.x,v1.y+v2.y);}
    /**向量差1-2
     * @param {Vector2} v1
     * @param {Vector2} v2
     * @return {Vector2}
     */
    static dif(v1,v2){return new Vector2(v1.x-v2.x,v1.y-v2.y);}
    
    /**
     * 向量内积
     * @param {Vector2} v1
     * @param {Vector2} v2
     * @return {Number}
     */
    static ip(v1,v2){return v1.x*v2.x+v1.y*v2.y;}
    /**向量外积
     * @param {Vector2} v1
     * @param {Vector2} v2
     * @return {Number}
     */
    static op(v1,v2){return v1.x*v2.y-v1.y*v2.x;}
    
    /**
     * 线性变换(矩阵和向量的乘法), 根据实参的顺序重载后乘对象
     * (v,m)行向量后乘矩阵
     * (m,v)矩阵后乘列向量
     * @param {Vector2} v 向量
     * @param {Matrix2x2} m 矩阵
     * @returns {Vector2} 返回一个向量
     */
    static baseLinearMapping(v,m){
    }
    /**
     * 先进行2x2变换 再平移
     * @param {Vector2} v 
     * @param {Matrix2x2T} m 
     * @returns {Vector2} 返回一个向量
     */
    static afterTranslate_linearMapping(v,m){
        var rtnv=Vector2.baseLinearMapping(v,m),
            tm=(arguments[0].constructor==Vector2)?arguments[1]:arguments[0];
        rtnv.x+=tm.e;
        rtnv.y+=tm.f;
        return rtnv;
    }
    /**
     * 先平移 再 进行2x2变换, 根据实参的顺序重载后乘对象
     * @param {Vector2} v 
     * @param {Matrix2x2T} m 
     * @returns {Vector2} 返回一个向量
     */
    static beforeTranslate_linearMapping(v,m){
        var tv,tm,rtn;
        if(arguments[0].constructor==Vector2){
            tv=arguments[0];
            tm=arguments[1];
            if(tm.constructor==Matrix2x2T){
                tv.x+=tm.e;
                tv.y+=tm.f;
            }
            rtn=Vector2.baseLinearMapping(tv,tm);
        }
        else{
            tm=arguments[0];
            tv=arguments[1];
            if(tm.constructor==Matrix2x2T){
                tv.x+=tm.e;
                tv.y+=tm.f;
            }
            rtn=Vector2.baseLinearMapping(tm,tv);
        }
        
        return rtn;
    }
    /**
     * 线性变换(矩阵和向量的乘法), 根据实参的顺序重载后乘对象
     * (v,m)行向量后乘矩阵
     * (m,v)矩阵后乘列向量
     * @param {Vector2} v 向量
     * @param {Matrix2x2} m 矩阵
     * @param {Boolean} translate_befroeOrAfter 先平移或后平移; 默认后平移
     * @returns {Vector2} 返回一个向量
     */
    static linearMapping(v,m,translate_befroeOrAfter=false){
        if(translate_befroeOrAfter){
            return Vector2.beforeTranslate_linearMapping(v,m)
        }else{
            return Vector2.afterTranslate_linearMapping(v,m)
        }
    }
    static isEqual(v1,v2){
        return (v1.x==v2.x&&v1.y==v2.y);
    }
    
    /**
     * 向量的旋转倾向 如果旋转角度为0或180度会认为是顺时针
     * @param {Vector2} v1  起点向量
     * @param {Vector2} v2  终点向量
     * @returns {Boolean} true为顺时针
     */
    static rotateF(v1,v2){
        if((v1.x===0&&v1.y===0)||(v2.x===0&&v2.y===0)){
            // 有一个是原点，不能形成夹角
            return false;
        }
        var k1,k2;
        k1=(v1.y/v1.x),
        k2=(v2.y/v2.x);
        if(k1===k2)return true;
        var f=(v2.x>0)!==(v1.x>0);

        if((k1===-Infinity&&v2.x<=0)||(k2===-Infinity&&v1.x<0)){
            f=!f;
        }
        return !!((k1>k2)^f);
    }
    
    /**
     * 向量夹角运算
     * @param {Vector2} v1 向量
     * @param {Vector2} v2 向量
     * @returns {Number} 返回夹角的cos值
     */
    static cos_VV(v1,v2){
        return Vector2.ip(v1,v2)/(v1.mag()*v2.mag());
    }
}

Vector2.baseLinearMapping=OlFunction.create();
/**
 * 行向量后乘矩阵
 */
Vector2.baseLinearMapping.addOverload([Vector2,Matrix2x2],function(v,m){
    var rtn = new Vector2(
        v.x*m.a+v.y*m.c,
        v.x*m.b+v.y*m.d
    )
    return rtn;
},"行向量后乘矩阵");
/**
 * 矩阵后乘列向量
 */
Vector2.baseLinearMapping.addOverload([Matrix2x2,Vector2],function(m,v){
    var rtn = new Vector2(
        v.x*m.a+v.y*m.b,
        v.x*m.c+v.y*m.d
    );
    return rtn;
},"矩阵后乘列向量");
