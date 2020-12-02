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
     * @param {Vector2} v1
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
    ip(v2){return v1.x*v2.x+v1.y*v2.y;}
    /**向量外积
     * @param {Vector2} v2 
     * @return {Number}
     */
    op(v2){return this.x*v2.y-this.y*v2.x;}
    /**向量差
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
     * 矩阵和向量的乘法, 根据实参的顺序重载后乘对象
     * (v,m)行向量后乘矩阵
     * (m,v)矩阵后乘列向量
     * 如果使用 Matrix2x2T 矩阵, 平移参数变换之后才会进行计算
     * @param {Vector2} v 向量
     * @param {Matrix2x2} m 矩阵
     * @returns {Vector2} 返回一个向量
     */
    static linearMapping(v,m){
    }
}

Vector2.linearMapping=createOlFnc();
/**
 * 行向量后乘矩阵
 */
Vector2.linearMapping.addOverload([Vector2,Matrix2x2],function(v,m){
    var rtn = new Vector2(
        v.x*m.a+v.y*m.c,
        v.x*m.b+v.y*m.d
    )
    if(m.constructor==Matrix2x2T){
        rtn.x+=m.e;
        rtn.y+=m.f;
    }
    return rtn;
},"行向量后乘矩阵");
/**
 * 矩阵后乘列向量
 */
Vector2.linearMapping.addOverload([Matrix2x2,Vector2],function(m,v){
    var rtn = new Vector2(
        v.x*m.a+v.y*m.b,
        v.x*m.c+v.y*m.d
    );
    if(m.constructor==Matrix2x2T){
        rtn.x+=m.e;
        rtn.y+=m.f;
    }
    return rtn;
},"矩阵后乘列向量");
