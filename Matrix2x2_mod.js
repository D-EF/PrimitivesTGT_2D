/*!
 *  Matrix2x2_mod 2d矩阵， 用于2d线性变换
 *  
 */

/**
 * 2*2矩阵
 * @param {Number} a  矩阵的参数 m11
 * @param {Number} b  矩阵的参数 m12
 * @param {Number} c  矩阵的参数 m21
 * @param {Number} d  矩阵的参数 m22
 */
class Matrix2x2{
    constructor(a,b,c,d){
        this.a=a||1;
        this.b=b||0;
        this.c=c||0;
        this.d=d||1;
    }
    copy(){
        return new Matrix2x2(this.a,this.b,this.c,this.d);
    }
    /** 
     * 当前矩阵后乘一个矩阵
     * @param {Matrix2x2} m2 右(后)矩阵
     * @returns {Matrix2x2} 新的矩阵
     */
    multiplication(m2){
        var rtn=this.copy();
        rtn.a=this.a*m2.a+this.b*m2.c;
        rtn.b=this.a*m2.b+this.b*m2.d;
        rtn.c=this.c*m2.a+this.d*m2.c;
        rtn.d=this.c*m2.b+this.d*m2.d;
        return rtn;
    }
    /**
     * 转置矩阵
     */
    transposed(){
        var rtn=this.copy();
        rtn.a=this.a;
        rtn.b=this.c;
        rtn.c=this.b;
        rtn.d=this.d
        return rtn;
    }
    /**
     * 矩阵的行列式
     * @return {Number} 行列式
     */
    det(){
        return this.a*this.d-this.b*this.c;
    }
    /**
     * 矩阵的逆
     * @returns {Matrix2x2} 返回一个矩阵
     */
    inverse(){
        var m=this,
            det=this.det(m);
        // assert(det<0.00001);
        if(det==0){
            console.error("this is a singular matrix !");
            // 这是个奇异矩阵，所以没有逆
            return;
        }
        var oneOverDet=1/det,
            rtn=new Matrix2x2();
        rtn.a=  m.d*oneOverDet;
        rtn.b= -m.b*oneOverDet;
        rtn.c= -m.c*oneOverDet;
        rtn.d=  m.a*oneOverDet;
        return rtn;
    }
    static product(m1,m2){
        return new Matrix2x2(
            m1.a*m2.a+m1.b*m2.c , m1.a*m2.b+m1.b*m2.d,
            m1.c*m2.a+m1.d*m2.c , m1.c*m2.b+m1.d*m2.d
            );
    }
    /**
     * 创建矩阵
     */
    static create={
        /**
         * @param {Number} theta 顺时针 旋转角弧度
         */
        rotate:function(theta){
            var s=Math.sin(theta),
                c=Math.cos(theta);
            return new Matrix2x2(c,s,-s,c);
        },
        /**
         * @param {Number} x x 轴方向上的缩放系数
         * @param {Number} y y 轴方向上的缩放系数
         */
        scale:function(x,y){
            return new Matrix2x2(x,0,0,y);
        },
        
        /**
         * @param {Number} axis 方向轴 0:x 非零:y
         * @param {Number} k 切变系数
         */
        shear:function(axis,k){
            if(axis){
                // y轴
                return new Matrix2x2(1,0,k,1);
            }
            else{
                // x轴
                return new Matrix2x2(1,k,0,1);
            }
        },
        identity:function(){
            return new Matrix2x2(1,0,0,1);
        }
    }
    
    /**
     * 缩放
     * @param {Number} x x 轴方向上的缩放系
     * @param {Number} y y 轴方向上的缩放系
     */
    scale(x,y){
        return this.multiplication(
            Matrix2x2.create.scale(x,y)
        )
    }
    /**
     * 旋转
     * @param {Number} theta 顺时针 旋转角弧度
     */
    rotate(theta){
        return this.multiplication(
            Matrix2x2.create.rotate(theta)
        )
    }
    /**
     * 切变
     * @param {Number} axis 方向轴 0:x 非零:y
     * @param {Number} k 切变系数
     */
    shear(axis,k){
        return this.multiplication(
            Matrix2x2.create.shear(axis,k)
        )
    }
}

/**
 * 2*2矩阵 + 平移
 * @param {Number} a  矩阵的参数 m11
 * @param {Number} b  矩阵的参数 m12
 * @param {Number} c  矩阵的参数 m21
 * @param {Number} d  矩阵的参数 m22
 * @param {Number} e  平移量x
 * @param {Number} f  平移量y
 */
class Matrix2x2T extends Matrix2x2{
    constructor(a,b,c,d,e,f){
        super(a,b,c,d);
        this.e=e||0;    //tx
        this.f=f||0;    //ty
    }
    copy(){
        return new Matrix2x2T(this.a,this.b,this.c,this.d,this.e,this.f);
    }

    inverse(){
        var temp=Matrix2x2.prototype.inverse.call(this);
        if(temp){
            temp=Matrix2x2T.prototype.copy.call(temp);
            temp.e=-1*this.e;
            temp.f=-1*this.f;
            return temp;
        }
        else{
            // 这个矩阵没有逆
            return;
        }
    }

    /**
     * 设置 translate 值
     * @param {Number} x 
     * @param {Number} y 
     */
    setTranslate(x,y){
        this.e=x;
        this.f=y;
        return this;
    }
    /**
     * 再平移
     * @param {Number} x x轴偏移量
     * @param {Number} y y轴偏移量
     */
    translate(x,y){
        var rtn = this.copy();
        rtn.e+=x;
        rtn.f+=y;
        return rtn;
    }
    /**
     * 归零平移
     */
    translateZero(){
        var rtn = this.copy();
        rtn.e=0;
        rtn.f=0;
        return rtn;
    }
}
/**
 * 创建一个新的2x2t矩阵
 * @for Matrix2x2T
 */
function createMatrix2x2T(){
    return new Matrix2x2T(1,0,0,1,0,0);
}
