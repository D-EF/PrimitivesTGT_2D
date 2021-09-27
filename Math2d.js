/*
 * @LastEditors: Darth_Eternalfaith
 */
class Math2D{
    /**
     * 圆形和线段 的 交点 坐标
     * @param {Vector2} lop 线段起点
     * @param {Vector2} led 线段终点
     * @param {Vector2} cv   圆心
     * @param {Number}  r   圆形的半径
     * @returns {Array<Vector2>} 长度最多为2的数组，两个交点的坐标
     */
    static circle_i_line(lop,led,c,r) {
        var d=Vector2.dif(led,lop);
        var f=Vector2.dif(lop,c);
        var a = d.ip(d);
        var b = 2 * f.ip(d);
        var c = f.ip(f) - r * r;
        var rtn=[];
        var discriminant = b * b - 4 * a * c;
        if (discriminant < 0) {
            return rtn;
        } else {
            discriminant = Math.sqrt(discriminant);
            var t1 = (-b - discriminant) / (2 * a);
            var t2 = (-b + discriminant) / (2 * a);
            if (t1 >= 0 && t1 <= 1) {
                rtn.push(d.np(t1).add(lop));
            }

            if (t2 >= 0 && t2 <= 1) {
                rtn.push(d.np(t2).add(lop));
            }
            return rtn;
        }
    }
    /**
     * 弧形与线段相交的坐标 弧度是顺时针
     * @param {Vector2} lop     线段起点坐标
     * @param {Vector2} led     线段终点坐标
     * @param {Vector2} c       圆心坐标
     * @param {Number}  r       弧的半径
     * @param {Number}  opRad   起点弧度
     * @param {Number}  edRad   终点弧度 
     * @returns {Array<Vector2>}  返回交点坐标
     */
    static arc_i_line(lop,led,c,r,opRad,edRad){
        
        var t_opRad,t_edRad;
        if(opRad>edRad){
            t_opRad=edRad;
            t_edRad=opRad;
        }else{
            t_opRad=opRad;
            t_edRad=edRad;
        }

        var k=t_edRad-t_opRad;
        if(k<=0){
            // 夹角小于0,跳出
            return [];
        }
        var cis=Math2D.circle_i_line(lop,led,c,r);
        if(k>2*Math.PI){
            // 完整的圆型
            return cis;
        }
        var f=k>Math.PI;
        var oprv=new Vector2(Math.cos(t_opRad)*r,Math.sin(t_opRad)*r),
            edrv=new Vector2(Math.cos(t_edRad)*r,Math.sin(t_edRad)*r);
        var rtn=[];
        for(var i =cis.length-1;i>=0;--i){
            if(Math2D.in_angle_V(oprv,edrv,cis[i].dif(c),f)){
                rtn.push(cis[i]) 
            }
        }
        return rtn;
    }
    /**
     * 弧形与线段相交的坐标 优化计算速度版本
     * @param {Vector2} lop   线段起点
     * @param {Vector2} led   线段终点
     * @param {Vector2} c     圆心坐标
     * @param {Number}  r     圆半径
     * @param {Vector2} oprv  弧 的起点 用向量表示 需要先弄成顺时针 op to ed
     * @param {Vector2} edrv  弧 的终点 用向量表示 需要先弄成顺时针 op to ed
     * @param {Boolean} f     弧是否大于半圆 用于优化计算
     * @returns {Array<Vector2>}  返回交点坐标
     */
    static arc_i_line_V(lop,led,c,r,oprv,edrv,f){
        var cis=Math2D.circle_i_line(lop,led,c,r);
        var rtn=[];
        for(var i =cis.length-1;i>=0;--i){
            if(Math2D.in_angle_V(oprv,edrv,cis[i].dif(c),f)){
                rtn.push(cis[i]) 
            }
        }
        return rtn;
    }
    /**
     * 判断 tgtv 是否在 顺时针旋转 op 到 ed 的夹角内, 角不会超过360度 
     * @param {Vector2} angle_op_V    夹角的射线 开始
     * @param {Vector2} angle_ed_V    夹角的射线 结束
     * @param {Vector2} tgtv        夹角的射线
     * @param {Boolean} f 表示角度的大小是否大于半圆
     */
    static in_angle_V(angle_op_V,angle_ed_V,tgtv,f){
        if(f){
            if((Vector2.op(angle_op_V,tgtv)>=0)&&(Vector2.op(angle_ed_V,tgtv)<=0)){
                return true;
            }
        }else{
            if((Vector2.op(angle_op_V,tgtv)>=0)||(Vector2.op(angle_ed_V,tgtv)<=0)){
                return true;
            }
        }
        
        return false;
    }

    /** 判断两条线段是否相交, 仅供 getImpactCount 使用 相撞时有两种结果
     * @param {Vector2} l1op    线段1的起点
     * @param {Vector2} l1ed    线段1的终点
     * @param {Vector2} l2op    线段2的起点
     * @param {Vector2} l2ed    线段2的终点
     * @return {Number} 返回 1 表示相交; 0 表示没有相交; -1 表示 l1 终点在 l2 上, 或者 l2 起点在 l1 上; 2 表示 l2 终点在 l1 上, 或者 l1 起点在 l2 上; 
     */
    static line_i_line(l1op,l1ed,l2op,l2ed){
        var temp1=Vector2.dif(l1ed,l1op),
            t1o=Vector2.dif(l1ed,l2op),
            t1e=Vector2.dif(l1ed,l2ed);
        var temp2=Vector2.dif(l2ed,l2op),
            t2o=Vector2.dif(l2ed,l1op),
            t2e=Vector2.dif(l2ed,l1ed);
        // fx   x是线段号码 (1 or 2)
        // fx1 是起点的 flag, fx2 是终点的 flag
        var f11=Vector2.op(temp1,t1o),
            f12=Vector2.op(temp1,t1e);
        var f21=Vector2.op(temp2,t2o),
            f22=Vector2.op(temp2,t2e);
        
        if((f11==0)&&((f22>0)!=(f21>0))){
            // l1 起点在 l2 上
            return 2;
        }
        else if((f12==0)&&((f22>0)!=(f21>0))){
            // l1 终点在 l2 上
            return -1;
        }else if((f21==0)&&((f11>0)!=(f12>0))){
            // l2 起点在 l1 上
            return -1;
        }
        else if((f22==0)&&((f11>0)!=(f12>0))){
            // l2 终点在 l1 上
            return 2;
        }
        
        if((f11>0)!=(f12>0)&&(f22>0)!=(f21>0)){
            // 两线段相交
            return 1;
        }
        return 0;
    }
}

/* 基础图形------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * 矩形的数据
 */
class Ract_Data{
    /**
     * @param {Number} x 坐标
     * @param {Number} y 坐标
     * @param {Number} w 宽度
     * @param {Number} h 高度
     */
    constructor(x,y,w,h){
        this.x=x;
        this.y=y;
        this.w=w;
        this.h=h;
    }
    copy(){
        return new Ract_Data(
            this.x,
            this.y,
            this.w,
            this.h
        );
    }
    
    getMin(){
        var rtnx,rtny;
        if(this.w>=0){
            rtnx=this.x;
        }else{
            rtnx=this.x+this.w;
        }
        
        if(this.h>=0){
            rtny=this.y;
        }else{
            rtny=this.y+this.h;
        }
        return new Vector2(rtnx,rtny);
    }
    
    getMax(){
        var rtnx,rtny;
        if(this.w<=0){
            rtnx=this.x;
        }else{
            rtnx=this.x+this.w;
        }
        
        if(this.h<=0){
            rtny=this.y;
        }else{
            rtny=this.y+this.h;
        }
        return new Vector2(rtnx,rtny);
    }
}

/**
 * 弧形的图形数据
 */
 class Arc_Data{
     /**
      * 
      * @param {Number} cx 圆心坐标
      * @param {Number} cy 圆心坐标
      * @param {Number} r  半径
      * @param {Number} startAngle  弧形起点弧度
      * @param {Number} endAngle    弧形终点弧度
      * @param {Boolean} anticlockwise 旋转方向
      */
    constructor(cx,cy,r,startAngle,endAngle,anticlockwise){
        /**圆心的坐标 */
        this.c=new Vector2(cx,cy);
        /**圆半径 */
        this.r=r;
        /**弧形的起点弧度 */
        this.startAngle=startAngle;
        /**弧形的终点弧度 */
        this.endAngle=endAngle;
        /**弧形弧度的旋转方向 */
        this.anticlockwise=anticlockwise;

        //以下应该是只读的 
        /**弧形起点 */
        this.opv=this.get_opv();
        /**弧形终点 */
        this.edv=this.get_edv();
        /**弧度差  */
    }
    /**
     * 拷贝函数
     * @returns {Arc_Data}
     */
    copy(){
        return new Arc_Data(
            this.c.x,
            this.c.y,
            this.r,
            this.startAngle,
            this.endAngle,
            this.anticlockwise
            );
    }
    /**
     * 重新计算起点和重点的坐标 (相对于圆心)
     */
    re_oped(){
        /**弧形起点 */
        this.opv=this.get_opv();
        /**弧形终点 */
        this.edv=this.get_edv();
    }
    
    /**
     * 获取起点的向量 (相对于圆心)
     */
     get_opv(){
        var tempAngle=this.data.startAngle;
        if(!this.data.anticlockwise){
            tempAngle*=-1;
        }
        
        return (new Vector2(Math.cos(tempAngle)*r,Math.sin(tempAngle)*r));
    }
    
    /**
     * 获取终点的向量 (相对于圆心)
     */
    get_edv(){
        var tempAngle=this.data.endAngle;
        if(!this.data.anticlockwise){
            tempAngle*=-1;
        }
        
        return (new Vector2(Math.cos(tempAngle)*r,Math.sin(tempAngle)*r));
    }
    get_min(){
        var a=this.get_opv(),
            b=this.get_edv();
        var f=Math.abs(this.startAngle-this.endAngle)>Math.PI,
            f1=a.x>=0,
            f2=a.y>=0,
            f3=b.x>=0,
            f4=b.y>=0,
            f5=f1===f3,
            f6=f2===f4;

            var f7=!!(f5^f6),
                f8=f5===f6;
            if(f7===false&&f8===false){
                
            }
            


    }
    get_max(){

    }

}

/* 向量------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

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
     * 向量夹角运算
     * @param {Vector2} v1 向量
     * @param {Vector2} v2 向量
     * @returns {Number} 返回夹角的cos值
     */
    static cos_VV(v1,v2){
        return Vector2.ip(v1,v2)/(v1.mag()*v2.mag());
    }
}

/* 矩阵 ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

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
    /**
     * 矩阵乘法
     * @param {Matrix2x2} m1 
     * @param {Matrix2x2} m2 
     */
    static product(m1,m2){
        return new Matrix2x2(
            m1.a*m2.a+m1.b*m2.c , m1.a*m2.b+m1.b*m2.d,
            m1.c*m2.a+m1.d*m2.c , m1.c*m2.b+m1.d*m2.d
            );
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
 * 创建矩阵
 */
Matrix2x2.create={
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
     * 切变
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
    /**
     * 单位矩阵
     */
    identity:function(){
        return new Matrix2x2(1,0,0,1);
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

/* 多边形 ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/*!
 *  Polygon.js 
 *  这个文件依赖于 Vector2.js 和 Matrix2x2_mod.js
 *  用途主要是在 html canvas 
 */



class Polygon{
    /** 多边形
     * @param {Array<Vector2>} nodes 装着顶点的数组
     */
    constructor(nodes){
        /** @type {Array<Vector2>}  存放 向量 的列表  */
        this.nodes=[];

        this.transformMatrix=new Matrix2x2T();

        this.min    =new Vector2();
        this.max    =new Vector2();

        if(nodes&&nodes.constructor==Array){
            this.pushNodes(nodes);
        }
    }
    copy(){
        var ret=new Polygon();
        if(this&&this.nodes){
            ret.nodes=[];
            ret.min=Vector2.prototype.copy.call(this.min);
            ret.max=Vector2.prototype.copy.call(this.max);
            ret.transformMatrix=Matrix2x2T.prototype.copy.call(this.transformMatrix);
            var l=this.nodes.length,i=0;
            for(;i<l;++i){
                ret.pushNode(this.nodes[i]);
            }
        }

        return ret;
    }
    /**
     * 刷新 最大xy 最小xy
     */
    reMinMax(){
        if(!this.nodes.length)return;
        this.max.x=this.nodes[0].x;
        this.max.y=this.nodes[0].y;
        this.min.x=this.nodes[0].x;
        this.min.y=this.nodes[0].y;
        for(var i=this.nodes.length-1;i>=0;--i){
                 if(this.nodes[i].x>this.max.x)this.max.x=this.nodes[i].x;
            else if(this.nodes[i].x<this.min.x)this.min.x=this.nodes[i].x;
                 if(this.nodes[i].y>this.max.y)this.max.y=this.nodes[i].y;
            else if(this.nodes[i].y<this.min.y)this.min.y=this.nodes[i].y;
        }
    }
    
    /**追加顶点
     * @param {Vector2} v       要追加的顶点
     */
    pushNode(v){
        this.nodes.push(Vector2.prototype.copy.call(v));
        if(this.nodes.length>1){
            if(v.x>this.max.x){
                this.max.x=v.x;
            }
            else if(v.x<this.min.x){
                this.min.x=v.x;
            }
            if(v.y>this.max.y){
                this.max.y=v.y;
            }
            else if(v.y<this.min.y){
                this.min.y=v.y;
            }
        }
        else{
            this.reMinMax();
        }
    }
    /**
     * 加入一组数组
     * @param {Array <Vector2>} nodes 装着顶点的数组
     */
    pushNodes(nodes){
        for(var i=0;i<nodes.length;++i){
            this.pushNode(nodes[i]);
        }
    }
    /**插入顶点
     * @param {Number} index    要插入的顶点的下标
     * @param {Vector2} v       要插入的顶点
     */
    insert(index,v){
        this.nodes.splice(index,0,v);
        if(this.nodes.length>1){
                 if(v.x>this.max.x)this.max.x=v.x;
            else if(v.y<this.min.x)this.min.x=v.x;
                 if(v.y>this.max.y)this.max.y=v.y;
            else if(v.y<this.min.y)this.min.y=v.y;
        }else{
            this.reMinMax();
        }
    }
    /**移除顶点
     * @param {Number} index 要删除的顶点的下标
     */
    remove(index){
        var tflag;
        if(
            this.nodes[index].x==this.max.x||this.nodes[index].y==this.min.x||
            this.nodes[index].x==this.max.y||this.nodes[index].y==this.min.y
            ){
                tflag=1;
            }
        this.nodes.splice(index,1);
        if(tflag)this.reMinMax();
    }
    /**移除所有顶点 */
    removeAll(){
        this.nodes=[];
    }
    /** 闭合路径 */
    seal(){
        if(!this.isClosed()){
            this.nodes.push(this.nodes[0].copy());
        }
    }
    /** 是否密封 */
    isClosed(){
        var l=this.nodes.length-1;
        return this.nodes[0].x==this.nodes[l].x&&this.nodes[0].y==this.nodes[l].y;
    }
    /**
     * 使用局部坐标系判断某点是否在内部, 
     * 也可以使用向量作为实参
     * @param {Number} x 局部坐标系中的坐标
     * @param {Number} y 局部坐标系中的坐标
     */
    isInside(x,y){
        // 如果图形不是密封的, 直接返回否
        if(!this.isClosed()) return false;

        var i,j,rtn=false,temp=0,tempK;
        i=this.nodes.length-1;
        if(this.nodes[i].x==x&&this.nodes[i].y==y) return true;
        for(;i>0;--i){
            j=i-1;
            if(this.nodes[i].x==x&&this.nodes[i].y==y) return true;//如果正好在顶点上直接算在内部
            else if((this.nodes[i].y>=y)!=(this.nodes[j].y>=y)){
                // 点的 y 坐标 在范围内
                tempK=((temp=this.nodes[j].y-this.nodes[i].y)?
                        (((this.nodes[j].x-this.nodes[i].x)*(y-this.nodes[i].y))/(temp)+this.nodes[i].x):
                        (this.nodes[i].x)
                    );
                if(x==tempK){
                    // 斜率相等, 点在边线上 直接算内部
                    return true;
                }
                else if(x>tempK){
                    // 射线穿过
                    rtn=!rtn;
                }
            }
        }
        return rtn;
    }
    /**
     * 平移
     * @param {Vector2} v
     */
    translate(v){
        var i;
        for(i=this.nodes.length-1;i>=0;--i){
            this.nodes[i].x+=v.x;
            this.nodes[i].y+=v.y;
        }
        this.min.x+=v.x;
        this.min.y+=v.y;
    }
    /** 
     * 创建矩形
     */
    static rect(x,y,width,height){
        var ret=new Polygon();
        ret.pushNode(new Vector2(x,y));
        ret.pushNode(new Vector2(x+width,y));
        ret.pushNode(new Vector2(x+width,y+height));
        ret.pushNode(new Vector2(x,y+height));
        ret.seal();
        return ret;
    }
    /**
     * 把弧形转换成多边形, 如果弧度的 绝对值 大于 2π 将作为圆形而不是弧形
     * @param {Number} r                半径
     * @param {Number} _accuracy         精度 最小为2, 表示弧形由个顶点构成
     * @param {Number} startAngle       开始的弧度(rad)
     * @param {Number} endAngle         结束的弧度(rad)
     * @param {Boolean} anticlockwise   逆时针或顺时针
     */
    static arc(r,_startAngle,_endAngle,_accuracy,anticlockwise){
        var rtn=new Polygon();
        var accuracy=_accuracy>=2?_accuracy:2,
            startAngle,endAngle,cyclesflag,
            stepLong,
            cycles=Math.PI*2,
            i,tempAngle;
        if(anticlockwise){
            // 逆时针
            startAngle=_endAngle;
            endAngle=_startAngle;
        }
        else{
            // 顺时针
            startAngle=_startAngle;
            endAngle=_endAngle;
        }
        if(endAngle-startAngle>=cycles||endAngle-startAngle<=-1*cycles){
            // 如果弧度 绝对值 大于 2π 将作为圆形而不是弧形
            stepLong=cycles/accuracy;
            cyclesflag=true;
        }
        else{
            stepLong=(endAngle-startAngle)/(accuracy-1);
        }
        for(i=accuracy-1;i>=0;--i){
            tempAngle=endAngle-i*stepLong;
            rtn.pushNode(new Vector2(Math.cos(tempAngle)*r,Math.sin(tempAngle)*r));
        }
        if(cyclesflag){
            rtn.seal();
        }
        return rtn;
    }
    
    /** 获取两个多边形的相交次数
     * @param   {Polygon}   _polygon1
     * @param   {Polygon}   _polygon2
     * @return  {Number}    相交的次数
     */
    static getImpactCount(_polygon1,_polygon2){
        // TODO: 当两个多边形的角碰到角的时候，会出现两次计算，会比预算结果多1
        if(_polygon1.minX>_polygon2.maxX||_polygon2.minX>_polygon1.maxX||_polygon1.minY>_polygon2.maxY||_polygon1.minY>_polygon1.maxY)return 0;
        var vl1=_polygon1.nodes,vl2=_polygon2.nodes;
        var i=vl1.length-1,j;
        var f=0;
        for(--i;i>=0;--i){
            for(j=vl2.length-2;j>=0;--j){
                f+=Math2D.line_i_line(vl1[i],vl1[i+1],vl2[j],vl2[j+1]);
            }
        }
        return f;
    }
    /** 获取两个多边形是否相交
     * @param   {Polygon}   _polygon1
     * @param   {Polygon}   _polygon2
     * @return  {Boolean}   是否相交
     */
    static getImpactFlag(_polygon1,_polygon2){
        if(_polygon1.minX>_polygon2.maxX||_polygon2.minX>_polygon1.maxX||_polygon1.minY>_polygon2.maxY||_polygon1.minY>_polygon1.maxY)return false;
        var vl1=_polygon1.nodes,vl2=_polygon2.nodes;
        var i=vl1.length-1,j;
        for(--i;i>=0;--i){
            for(j=vl2.length-2;j>=0;--j){
                if(Math2D.line_i_line(vl1[i],vl1[i+1],vl2[j],vl2[j+1]))
                return true;
            }
        }
        return false;
    }
    
    /**
     * 矩阵和多边形内部所有向量变换, 根据实参的顺序重载后乘对象
     * (p,m)行向量后乘矩阵
     * (m,p)矩阵后乘列向量
     * @param {Matrix2x2T} m 矩阵
     * @param {Polygon} p 多边形
     * @param {Boolean} translate_befroeOrAfter 先平移或后平移; 默认后平移
     * @returns {Polygon} 返回一个新的多边形
     */
    static linearMapping(p,m,translate_befroeOrAfter=false){
        return Polygon.EX_linearMapping(p,m,!!translate_befroeOrAfter);
    }
    static EX_linearMapping(p,m,translate_befroeOrAfter){}

}

// 函数重载 -------------------------------------------------------------------------------------------


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


Polygon.EX_linearMapping=OlFunction.create();
Polygon.EX_linearMapping.addOverload([Polygon,Matrix2x2,Boolean],function(p,m,f){
    var i=0,
        rtn=new Polygon();
    for(;i<p.nodes.length;++i){
        rtn.pushNode(Vector2.linearMapping(p.nodes[i],m,f));
    }
    return rtn;
});
Polygon.EX_linearMapping.addOverload([Matrix2x2,Polygon,Boolean],function(m,p,f){
    var i=0,
        rtn=new Polygon();
    for(;i<p.nodes.length;++i){
        rtn.pushNode(Vector2.linearMapping(m,p.nodes[i],f));
    }
    return rtn;
});
