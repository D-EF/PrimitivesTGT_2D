/*
 * @Date: 2022-04-20 14:48:10
 * @LastEditors: Darth_Eternalfaith
 * @LastEditTime: 2022-04-20 17:01:28
 * @FilePath: \def-web\js\visual\MatrixController.js
 */

import { Iterator__Tree } from "../basics/Basics.js";
import { Matrix2x2, Matrix2x2T } from "./Math2d.js";


/** 矩阵转换成css的样子
 * @param {Matrix2x2T} m 
 * @returns {String}
 */
 function matrixToCSS(m){
    return "matrix("+
    [
        m.a,
        m.b,
        m.c,
        m.d,
        m.e||0,
        m.f||0,
    ].join(',')
    +")"
}

class MatrixController__base{
    /** 转换成最终使用的矩阵
     * @virtual
     */
    toMatrix(){}
    /** 转换成字符串,语法 与 css 中的 transform 属性的值相似
     * @virtual
     */
    toMatrix(){}
    /** 转换成矩阵的控制器 
     */
    toMatrixController(){
        return new MatrixController__matrix(this.toMatrix());
    }
}

/** 复合型 */
class MatrixController extends MatrixController__base{
    constructor(){
        super();
        /** @type {MatrixController__base} 子控制*/
        this.controllers=[];
        this.i=new Iterator__Tree(this,"controllers");
    }
    toMatrix(){
        var i=this.i;
        var rtn=new Matrix2x2T();
        for(i.init();i.is_NotEnd();i.next()){
            rtn.multiplication(i.get_Now().toMatrix());
        }
        return rtn;
    }
    toString(){
        var i=this.i;
        var rtn=[];
        for(i.init();i.is_NotEnd();i.next()){
            rtn.push(i.get_Now().toString());
        }
        return rtn.join(" ");
    }
}

/** 矩阵 */
class MatrixController__matrix extends MatrixController__base{
    /**
     * @param {Number} a 矩阵计算参数 m11   重载  使用矩阵
     * @param {Number} b 矩阵计算参数 m12
     * @param {Number} c 矩阵计算参数 m21
     * @param {Number} d 矩阵计算参数 m22
     * @param {Number} e 齐次坐标 平移量
     * @param {Number} f 齐次坐标 平移量
     */
    constructor(a,b,c,d,e,f){
        this.type="matrix";
        if(a instanceof Matrix2x2){
            this.matrix=a;
        }
        else{
            this.matrix=new Matrix2x2T(a,b,c,d,e,f);
        }
    }
    toMatrix(){
        return this.matrix.copy();
    }
    toString(){
        return matrixToCSS(this.matrix);
    }
}
/** 旋转 */
 class MatrixController__rotate extends MatrixController__base{
    /**
     * @param {Number} rotate 旋转弧度
     */
    constructor(rotate){
        this.type="rotate";
        this.rotate=rotate;
    }
    toMatrix(){
        return new Matrix2x2T().rotate(this.rotate);
    }
    toString(){
        return "rotate("+this.rotate+")";
    }
}
/** 平移 */
 class MatrixController__translate extends MatrixController__base{
    /**
     * @param {Number} x x坐标平移量
     * @param {Number} y y坐标平移量
     */
    constructor(x,y){
        this.type="translate";
        this.x=x;
        this.y=y;
    }
    toMatrix(){
        return new Matrix2x2T().set_Translate(this.x,this.y);
    }
    toString(){
        return "translate("+this.x+','+this.y+")";
    }
}
/** 镜像 */
 class MatrixController__horizontal extends MatrixController__base{
    /**
     * @param {Number} x 对称轴的法向坐标
     * @param {Number} y 对称轴的法向坐标
     */
    constructor(x,y){
        this.type="horizontal";
        this.x=x;
        this.y=y;
    }
    toMatrix(){
        return new Matrix2x2T().horizontal(this.x,this.y);
    }
    toString(){
        return "horizontal("+this.x+','+this.y+")";
    }
}
/** 切变 */
 class MatrixController__shear extends MatrixController__base{
    /**
     * @param {Number} axis 方向轴 0:x 非零:y
     * @param {Number} k 切变系数
     */
    constructor(axis,k){
        this.type="shear";
        this.axis=axis;
        this.k=k;
    }
    toMatrix(){
        return new Matrix2x2T().shear(this.axis,this.k);
    }
    toString(){
        return "shear("+this.axis+','+this.k+")";
    }
}
/** 缩放 */
class MatrixController__scale extends MatrixController__base{
    /** 
     * @param {Number} x x方向的缩放系数
     * @param {Number} y y方向的缩放系数
     */
    constructor(x,y){
        super();
        this.type="scale";
        this.x=x;
        this.y=y;
    }
    
    toMatrix(){
        return new Matrix2x2T().scale(this.x,this.y);
    }
    toString(){
        return "shear("+this.axis+','+this.k+")";
    }
}

export{
    matrixToCSS,
    MatrixController,
    MatrixController__matrix,
    MatrixController__rotate,
    MatrixController__translate,
    MatrixController__horizontal,
    MatrixController__shear,
    MatrixController__scale
}