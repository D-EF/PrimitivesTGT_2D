/*
 * @LastEditors: Darth_Eternalfaith
 * @LastEditTime: 2022-01-10 20:47:03
 */
/**
 * 提供一点点2d数学支持的js文件
 * 如无另外注释，在这个文件下的所有2d坐标系都应为  x轴朝右, y轴朝上 的坐标系
 */
/**
 * 放了一点2d静态函数
 */
class Math2D{
    /**
     * 判断两个圆形是否相交
     * @param {Vector2} c1  圆1 圆心坐标
     * @param {Number} r1   圆1 半径
     * @param {Vector2} c2  圆2 圆心坐标
     * @param {Number} r2   圆2 半径
     * @returns {Boolean} 返回相交情况
     */
    static circular_i_circular(c1,r1,c2,r2){
        var l=Vector2.dif(c2,c1).mag(),
            l1=r1+r2,
            l2=Math.abs(r1-r2);
        if(l>l1||l<l2){
            return false;
        }
        return true;
    }

    /**
     * 获得两个圆形的交点
     * @param {Vector2} c1  圆1 圆心坐标
     * @param {Number} r1   圆1 半径
     * @param {Vector2} c2  圆2 圆心坐标
     * @param {Number} r2   圆2 半径
     * @returns {Vector2[]} 返回交点
     */
    static circular_i_circular_V(c1,r1,c2,r2){
        var d=Vector2.dif(c2,c1).mag(),
            a=(r1*r1-r2*r2+d*d)/(2*d),
            fv=r1*r1-a*a;

        if(fv<0){
            return [];
        }

        var x0=c1.x+(a/d)*(c2.x-c1.x),
        y0=c1.y+(a/d)*(c2.y-c1.y),
        h=Math.sqrt(fv);
        
        var x1=x0-h*(c2.y-c1.y)/d,
            y1=y0+h*(c2.x-c1.x)/d,
            x2=x0+h*(c2.y-c1.y)/d,
            y2=y0-h*(c2.x-c1.x)/d;

        return [
            new Vector2(x1,y1),
            new Vector2(x2,y2)
        ];
    }

    /**
     * 弧形是否相交
     * @param {Arc_Data} arc1 弧形1
     * @param {Arc_Data} arc2 弧形2
     * @returns {Boolean} 返回相交情况
     */
    static arc_i_arc(arc1,arc2){
        var cis=Math2D.circular_i_circular_V(arc1.c,arc1.r,arc2.c,arc2.r);
        var rtn=[];
        var f=arc.angle>Math.PI;
        var a1c=cis[i].dif(arc1.c),
            a2c=cis[i].dif(arc2.c);
        for(var i =cis.length-1;i>=0;--i){
            if(Math2D.in_angle_V(arc1.opv,arc1.edv,a1c,f)&&
               Math2D.in_angle_V(arc2.opv,arc2.edv,a2c,f)){
                rtn.push(cis[i]);
            }
        }
        return rtn;
    }

    /**
     * 获得圆形和线段 的 交点 坐标
     * @param {Vector2} lop 线段起点
     * @param {Vector2} led 线段终点
     * @param {Vector2} c   圆心
     * @param {Number}  r   圆形的半径
     * @returns {Vector2[]} 长度最多为2的数组，两个交点的坐标
     */
    static circle_i_line_V(lop,led,c,r) {
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
     * 判断 tgtv 是否在 顺时针旋转 op 到 ed 的夹角内, 角不会超过360度 
     * @param {Vector2} angle_op_V    夹角的射线 开始
     * @param {Vector2} angle_ed_V    夹角的射线 结束
     * @param {Vector2} tgtv        目标
     * @param {Boolean} f 表示角度的大小是否大于半圆
     * @param {Boolean} f1 半圆时使用，表示是顺时针还是逆时针
     */
    static in_angle_V(angle_op_V,angle_ed_V,tgtv,f){
        var v1=angle_op_V.copy(),v2=angle_ed_V.copy();
        // v1.y*=-1;
        // v2.y*=-1;
        if(!f){
            if((Vector2.op(v1,tgtv)>=0)&&(Vector2.op(v2,tgtv)<=0)){
                return true;
            }
        }else{
            if((Vector2.op(v1,tgtv)>=0)||(Vector2.op(v2,tgtv)<=0)){
                return true;
            }
        }
        
        return false;
    }
    /**
     * 获得弧形与线段的交点
     * @param {Arc_Data} arc    弧形数据
     * @param {Vector2} lop     线段端点
     * @param {Vector2} led     线段端点
     * @returns {Vector2[]} 弧形与线段的交点
     */
    static arc_i_line_V(arc,lop,led){
        var cis=Math2D.circle_i_line_V(lop,led,arc.c,arc.r);
        var rtn=[];
        var f=arc.angle>Math.PI;
        for(var i =cis.length-1;i>=0;--i){
            if(Math2D.in_angle_V(arc.opv,arc.edv,cis[i].dif(arc.c),f)){
                rtn.push(cis[i]);
            }
        }
        return rtn;
    }
    /**
     * 判断弧形与线段是否相交
     * @param {Arc_Data} arc    弧形数据
     * @param {Vector2} lop     线段端点
     * @param {Vector2} led     线段端点
     * @returns {Boolean} 相交情况
     */
    static arc_i_line(arc,lop,led){
        var cis=Math2D.circle_i_line_V(lop,led,arc.c,arc.r);
        var opv=arc.opv,edv=arc.edv;
        
        if(arc.angle>=2*Math.PI)return true;
        var f=arc.angle>Math.PI;
        for(var i =cis.length-1;i>=0;--i){
            if(Math2D.in_angle_V(opv,edv,cis[i].dif(arc.c),f)){
                return true;
            }
        }
        return false;
    }

    /**
     * 扇形与线段是否相交
     * @param {Sector_Data} sector     弧形数据
     * @param {Vector2} lop     线段端点
     * @param {Vector2} led     线段端点
     * @returns {Boolean} 相交情况
     */
    static sector_i_line(sector,lop,led){
        if(Math2D.arc_i_line(sector,lop,led)){
            return true
        }
        return( Math2D.line_i_line(lop,led,sector.c.add(sector.opv),sector.c)||
                Math2D.line_i_line(lop,led,sector.c.add(sector.edv),sector.c)
        );
    }

    /** 
     * 判断两条线段相交情况
     * @param {Vector2} l1op    线段1的起点
     * @param {Vector2} l1ed    线段1的终点
     * @param {Vector2} l2op    线段2的起点
     * @param {Vector2} l2ed    线段2的终点
     * @returns{Number} 返回 1 表示相交; 0 表示没有相交; -1 表示 l1 终点在 l2 上, 或者 l2 起点在 l1 上; 2 表示 l2 终点在 l1 上, 或者 l1 起点在 l2 上; 
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
    
    /**
     * 求线段交点坐标
     * @param {Number} x1 线段a端点1 x坐标
     * @param {Number} y1 线段a端点1 y坐标
     * @param {Number} x2 线段a端点2 x坐标
     * @param {Number} y2 线段a端点2 y坐标
     * @param {Number} x3 线段a端点1 x坐标
     * @param {Number} y3 线段a端点1 y坐标
     * @param {Number} x4 线段a端点2 x坐标
     * @param {Number} y4 线段a端点2 y坐标
     * @returns {x:Number,y:Number} 如果返回 Infinity 或 -Infinity 则为未相交
     */
    static line_i_line_v(x1,y1,x2,y2,x3,y3,x4,y4){
        var bx=x2-x1,
            by=y2-y1,
            dx=x4-x3,
            dy=y4-y3;
        var t=binaryLinearEquation(x1,bx,x3,dx,y1,by,y3,dy);
        // console.log(t);
        if(isNaN(t.x)||isNaN(t.x)){
            // 共线时为 NaN, 未相交时为 Infinity
            // 暂不处理共线，视作未相交
            return {x:Infinity,y:Infinity};
        }
        if(t.x<=1&&t.x>=0&&t.y<=1&&t.y>=0){
            return {x:t.x*bx+x1,y:t.x*by+y1};
        }else{
            return {x:Infinity,y:Infinity};
        }
        return {x:t.x*bx+x1,y:t.x*by+y1};
    }
    
    /**
     * 求贝塞尔曲线的导函数的控制点
     * @param {{x:Number,y:Number}[]} points 原曲线的控制点集合 
     * @returns {{x:Number,y:Number}[]} 导函数的控制点
     */
    static bezierDerivatives_points(points){
        var n=points.length-1,
            i=n-1,
            rtn=new Array(i);
        if(n<0)return {x:0,y:0}
        for(;i>=0;--i){
            rtn[i]={
                x:n*(points[i+1].x-points[i].x),
                y:n*(points[i+1].y-points[i].y)
            }
        }
        return rtn;
    }

    /**
     * 二维中的贝塞尔曲线分割
     * @param {Vector2[]} points 控制点集合
     * @param {Number} t t时间参数
     * @returns {Vector2[][]} 返回新的两组贝塞尔曲线的点
     */
    static BezierCut(points,t){
        var l=points.length,
            q=createBezierCutMatrix_Q(l-1,t),
            points_x=new Array(l),
            points_y=new Array(l);
        for(var i = l-1;i>=0;--i){
            points_x[i]=points[i].x;
            points_y[i]=points[i].y;
        }
        return [
            Vector2.createByArray(
                bezierCut_By_Matrix(points_x,q),
                bezierCut_By_Matrix(points_y,q)
            ),
            Vector2.createByArray(
                bezierCut_By_Matrix(points_x,q,true),
                bezierCut_By_Matrix(points_y,q,true)
            )
        ];
    }

    /**
     * 判断三阶以下的贝塞尔曲线 t取值范围内曲线是否单调
     * @param {Vector2[]} points 贝塞尔曲线的控制点
     * @returns {{x:Boolean,y:Boolean}} t取值范围内曲线是否单调 true为单调
     */
    static bezier_lower3_unilateral(points){
        if(points.length>4) return {};
        var l=points.length-1,
            i,
            x=true,y=true;
        for(i=l-1;i>0&&(x||y);--i){
            x=((points[l].x>points[i].x)!==(points[0].x>points[i].x))||(points[0].x===points[i].x)||(points[l].x===points[i].x);
            y=((points[l].y>points[i].y)!==(points[0].y>points[i].y))||(points[0].y===points[i].y)||(points[l].y===points[i].y);
        }
        return {x:x,y:y};
    }

    /**
     * 获取曲线和线段相交的点的坐标
     * @param {Vector2} v1      线段起点
     * @param {Vector2} v2      线段终点
     * @param {BezierCurve} bezierCurve   贝塞尔曲线实例
     * @returns {Vector2[]} 返回交点的集合(数组)
     */
    static line_i_bezier_v(v1,v2,bezierCurve){
        var temp=BezierCurve.copy(bezierCurve),
            nd=Vector2.dif(v1,v2).normalize(),
            m=Matrix2x2T.createByVector2(nd).setTranslate(-v1.x,-v1.y);
        temp.linearMapping(m,false,true);
        
        var ts=temp.get_t_by_y(0),
        tv,
        rtn=[];
        for(var i=ts.length-1;i>=0;--i){
            tv=bezierCurve.sampleCurve(ts[[i]]);
            if( ((tv.x>v1.x&&tv.x<v2.x)||(tv.x>v2.x&&tv.x<v1.x)) && ((tv.y>v1.y&&tv.y<v2.y)||(tv.y>v2.y&&tv.y<v1.y)) ){
                rtn.push(tv);
            }
        }
        return rtn;
    }
    /**
     * box线框相交情况
     * @param {Vector2} va1 矩形a的向量1
     * @param {Vector2} va2 矩形a的向量2
     * @param {Vector2} vb1 矩形b的向量1
     * @param {Vector2} vb2 矩形b的向量2
     * @returns {Boolean} 返回是否相交
     */
    static boxL_i_boxL(va1,va2,vb1,vb2){
        return  (((va1.x>vb1.x)!==(va1.x>vb2.x))||((va2.x>vb1.x)!==(va2.x>vb2.x))||((vb1.x>va1.x)!==(vb1.x>va2.x))||((vb2.x>va1.x)!==(vb2.x>va2.x)))&&
                (((va1.y>vb1.y)!==(va1.y>vb2.y))||((va2.y>vb1.y)!==(va2.y>vb2.y))||((vb1.y>va1.y)!==(vb1.y>va2.y))||((vb2.y>va1.y)!==(vb2.y>va2.y)));
    }
    
    /**
     * 使用曲线的根将曲线变成单调的多条曲线
     * @param {BezierCurve} bezier1 
     * @returns {BezierCurve[]} 返回多条曲线
     */
    static cut_bezier_to_unilateral_by_root(bezier1){
        var f=this.bezier_lower3_unilateral(bezier1.points);
        if(f.x&&f.y){
            return [bezier1];
        }
        var ts=bezier1.get_root_t(1);
        var i,j,temp,l=ts.length-1;
        for(i=l;i>=0;--i){
            for(j=l-i;j>0;--j){
                if(ts[j]<ts[j-1]){
                    temp=ts[j];
                    ts[j]=ts[j-1];
                    ts[j-1]=temp;
                }
            }
        }
        
        var rtn=[];
        i=0;
        while(approximately(ts[i],0))++i;
        var temp1=this.BezierCut(bezier1.points,ts[i]);
        l=i;
        rtn.push(new BezierCurve(temp1[0]));

        for(++i;i<ts.length;++i){
            if(approximately(ts[i],0)||approximately(ts[i],1)){
                continue;
            }
            temp1=Math2D.BezierCut(temp1[1],(ts[i]-ts[l])/(1-ts[l]));
            rtn.push(new BezierCurve(temp1[0]));
            l=i;
        }
        rtn.push(new BezierCurve(temp1[1]));

        return rtn;
    }
}


/* 基础图形------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * 矩形的数据
 */
class Rect_Data{
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
    static createByVector2(v1,v2){
        return new Rect_Data(
            v1.x,v1.y,
            v2.x-v1.x,
            v2.y-v1.y
        );
    }
    static sopy(d){
        return new Rect_Data(
            d.x,
            d.y,
            d.w,
            d.h
        );
    }
    /**
     * 拷贝函数
     * @returns {Rect_Data} 返回一个当前对象的拷贝
     */
    copy(){
        return new Rect_Data(
            this.x,
            this.y,
            this.w,
            this.h
        );
    }
    /**
     * @returns {Vector2} 返回图形最靠近 {0,0} 的顶点
     */
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
    
    /**
     * @returns {Vector2} 返回图形最远离 {0,0} 的顶点
     */
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
    /**
     * 判断点是否在内部
     * @param {Number} x 点的x坐标
     * @param {Number} y 点的y坐标
     * @returns {Boolean} 返回 点是否在内部
     */
    isInside(x,y){
        var max=this.getMax(),
            min=this.getMin();
        return (x>min.x&&x<max.x&&y>min.y&&y<max.y);
    }
    /**
     * 获取代理用的多边形
     * @returns {Polygon} 返回一个多边形
     */
    createPolygonProxy(){
        return Polygon.rect(this.x,this.y,this.w,this.h);
    }
}

/**
 * 弧形的图形数据
 */
 class Arc_Data{
     /**
      * 旋转方向默认是顺时针, 并且 起点弧度 始终 会 小于 终点弧度
      * @param {Number} cx 圆心坐标
      * @param {Number} cy 圆心坐标
      * @param {Number} r  半径
      * @param {Number} angle_A     弧形端点弧度
      * @param {Number} angle_B     弧形端点弧度
      */
    constructor(cx,cy,r,angle_A,angle_B){
        /**圆心的坐标 */
        this.c=new Vector2(cx,cy);
        /**圆半径 */
        this._r=r;
        this._startAngle=0;
        this._endAngle=0;

        //以下应该是只读的 只在 startAngle, endAngle 的访问器中修改

        this._opv;
        this._edv;
        this._angle;
        this._min;
        this._max;
        // 访问器
        this.setAngle_AB(angle_A,angle_B);
    }
    /**
     * 重设两个端点的弧度
     * @param {Number} angle_A     弧形端点弧度
     * @param {Number} angle_B     弧形端点弧度
     */
    setAngle_AB(angle_A,angle_B){
        this._startAngle=angle_A;
        this._endAngle=angle_B;
        this.reStartEnd_Angle();
        this.re_onlyread();
    }
    /**刷新起点终点的弧度; 较大的数会作为end */
    reStartEnd_Angle(){
        if(this._startAngle>this._endAngle){
            var ta=this._startAngle;
            this._startAngle=this._endAngle;
            this._endAngle=ta;
        }
    }
    
    static copy(d){
        return new Arc_Data(
            d.c.x,
            d.c.y,
            d._r,
            d._startAngle,
            d._endAngle,
            );
    }
    /**
     * 拷贝函数
     * @returns {Arc_Data}
     */
    copy(){
        return new Arc_Data(
            this.c.x,
            this.c.y,
            this._r,
            this._startAngle,
            this._endAngle,
            );
    }
    /**弧形起点
     * @returns {Vector2}
     */
    get opv(){
        return this._opv;
    }
    /**弧形终点
     * @returns {Vector2}
     */
    get edv(){
        return this._edv;
    }
    /** 一个 刚好包裹 弧形 的 矩形 的 最大坐标
     * @returns {Vector2}
     */
    get max(){
        return this._max;
    }
    /**一个 刚好包裹 弧形 的 矩形 的 最小坐标
     * @returns {Vector2}
     */
    get min(){
        return this._min;
    }
    /** 夹角弧度 Angle 
     * @returns {Number}
     */
    get angle(){
        return this._angle;
    }
    /**
     * 录入 弧形起点的弧度 startAngle , 根据大小关系会修改起点和终点的顺序
     * @param {Number} val
     */
    set startAngle(val){
        if(val.constructor===Number){
            this._startAngle=val;
            this.reStartEnd_Angle();
            this.re_onlyread();
            return this._startAngle;
        }else{
            throw new Error("错误的类型 ! Unexpected Type !");
        }
    }
    /**
     * 录入 弧形终点的弧度 endAngle , 根据大小关系会修改起点和终点的顺序
     * @param {Number} val
     */
    set endAngle(val){
        if(val.constructor===Number){
            this._endAngle=val;
            this.reStartEnd_Angle();
            this.re_onlyread();
            return this._endAngle;
        }else{
            throw new Error("错误的类型 ! Unexpected Type !");
        }
    }
    /**
     * 录入 两个端点的弧度
     * @param {Number} val1 端点的弧度
     * @param {Number} val2 端点的弧度
     */
    setEndpointAngle(val1,val2){
        if((val1.constructor!==Number)||(val2.constructor!==Number)){
            throw new Error("错误的类型 ! Unexpected Type !");
        }
        var f=val1>val2;
        this._startAngle=f?val2:val1;
        this._endAngle=f?val1:val2;
        this.re_onlyread();
    }
    /**
     * 读取 弧形起点的弧度 _startAngle
     */
    get startAngle(){
        return this._startAngle;
    }
    /**
     * 读取 弧形终点的弧度 endAngle
     */
    get endAngle(){
        return this._endAngle
    }
    /**
     * 录入半径
     */
    set r(val){
        this._r=val;
        this.re_onlyread();
        return this._r;
    }
    /**
     * 获取半径
     */
    get r(){
        return this._r;
    }
    /**刷新只读属性 */
    re_onlyread(){
        /**夹角弧度 */
        this._angle=Math.abs(this.startAngle-this.endAngle);
        /**弧形起点 */
        this._opv=this.get_opv();
        /**弧形终点 */
        this._edv=this.get_edv();
        var mm=this.get_min_A_max();
        this._max=mm.max;
        this._min=mm.min;
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
        var tempAngle=this.startAngle;
        var r= this.r;
        
        return (new Vector2(Math.cos(tempAngle)*r,Math.sin(tempAngle)*r));
    }
    
    /**
     * 获取终点的向量 (相对于圆心)
     */
    get_edv(){
        var tempAngle=this.endAngle;
        var r= this.r;
        
        return (new Vector2(Math.cos(tempAngle)*r,Math.sin(tempAngle)*r));
    }
    /**
     * 获取一个 刚好包裹 弧形 的 矩形 的 x和y最小的顶点的 和 x和y最大的顶点 的 坐标
     * @returns {{min:Vector2,max:Vector2}}
     */
    get_min_A_max(){
        if(this.angle>=2*Math.PI){
            return {
                min:new Vector2(this.c.x-this.r,this.c.y-this.r),
                max:new Vector2(this.c.x+this.r,this.c.y+this.r)
            };
        }
        var r= this.r;
        var a=this.opv,
            b=this.edv;
        var f=this.angle>Math.PI,
            f1=a.x>=0,
            f2=a.y>=0,
            f3=b.x>=0,
            f4=b.y>=0,
            f5=f1===f3,
            f6=f2===f4;

        var min=new Vector2(),
            max=new Vector2();

        if(f5&&f6){// 在同一象限
            if(f){// 大于半圆
                min.x=-r;
                min.y=-r;
                max.x=r;
                max.y=r;
            }else{
                min.x=(a.x>b.x)?(b.x):(a.x);
                min.y=(a.y>b.y)?(b.y):(a.y);
                max.x=(a.x<b.x)?(b.x):(a.x);
                max.y=(a.y<b.y)?(b.y):(a.y);
            }
        }else if(f2){// a1 || a2
            if(f1){
                if((!f3)&&(f4)){// a1 b2
                    min.x=b.x;
                    min.y=(a.y>b.y)?(b.y):(a.y);
                    max.x=a.x;
                    max.y=r;
                }else if((!f3)&&(!f4)){// a1 b3
                    min.x=-r;
                    min.y=b.y;
                    max.x=a.x;
                    max.y=r;
                }else if((f3)&&(!f4)){// a1 b4
                    min.x=-r;
                    min.y=-r;
                    max.x=(a.x<b.x)?(b.x):(a.x);
                    max.y=r;
                }
            }else{//a2
                if(f3&&f4){// a2 b1
                    min.x=-r;
                    min.y=-r;
                    max.x=r;
                    max.y=(a.y<b.y)?(b.y):(a.y);
                }else if((!f3)&&(!f4)){// a2 b3
                    min.x=-r;
                    min.y=b.y;
                    max.x=(a.x<b.x)?(b.x):(a.x);
                    max.y=a.y;
                }else if((f3)&&(!f4)){// a2 b4
                    min.x=-r;
                    min.y=-r;
                    max.x=b.x;
                    max.y=a.y;
                }
            }
        }else{  // a3 || a4
            if(!f1){
                if(f3&&f4){// a3 b1
                    min.x=-r;
                    min.y=-r;
                    max.x=b.x;
                    max.y=a.y;
                }if((!f3)&&(f4)){// a3 b2
                    min.x=(a.x>b.x)?(b.x):(a.x);
                    min.y=-r;
                    max.x=r;
                    max.y=r;
                }else if((f3)&&(!f4)){// a3 b4
                    min.x=a.x;
                    min.y=-r;
                    max.x=b.x;
                    max.y=(a.y<b.y)?(b.y):(a.y);
                }
            }else{//a4
                if(f3&&f4){// a4 b1
                    min.x=(a.x>b.x)?(b.x):(a.x);
                    min.y=a.y;
                    max.x=r;
                    max.y=b.y;
                }if((!f3)&&(f4)){// a4 b2
                    min.x=b.x;
                    min.y=-r;
                    max.x=r;
                    max.y=r;
                }else if((!f3)&&(!f4)){// a4 b3
                    min.x=-r;
                    min.y=a.y;
                    max.x=r;
                    max.y=r;
                }
            }
        } 
        

        // min.y*=-1;
        // max.y*=-1;

        min.x+=this.c.x;
        max.x+=this.c.x;
        min.y+=this.c.y;
        max.y+=this.c.y;

        return {
            min:min,
            max:max
        };
    }
    /**
     * 一个 刚好包裹 弧形 的 矩形 的 x和y最大的顶点
     * @returns {Vector2}
     */
    getMax(){
        return this.max;
    }
    /**
     * 一个 刚好包裹 弧形 的 矩形 的 x和y最小的顶点
     * @returns {Vector2}
     */
    getMin(){
        return this.min;
    }
    /**
     * 点是否在内部
     * @param {Number} _x 点的坐标x
     * @param {Number} _y 点的坐标y
     * @param {Boolean} f want_to_closePath 当没有成为完整的圆时, 是否需要将其当作一个割圆
     * @returns {Boolean} 返回 点是否在内部
     */
    isInside(_x,_y,f){
        if((_x>this.max.x)||(_x<this.min.x)||(_y>this.max.y)||(_y<this.min.y)){
            return false;
        }
        var r=this._r;
        var x=_x-this.c.x,
            y=_y-this.c.y;
        var arcA=this.angle;
        var tr=Math.sqrt(x*x+y*y);
        if(tr<=r){
            // 在半径内
            if(Math.PI*2<=arcA){
                return true;//圆形
            }
            else{
                if(f===false){
                    return false;
                }
                // 弧线的两端点
                var l1op=this.opv,
                    l1ed=this.edv;
                // 圆心和实参的坐标
                var l2op=new Vector2(0,0);
                var l2ed=new Vector2(x,y);
                var ISF=Math2D.line_i_line(l1op,l1ed,l2op,l2ed);  //相交情况
                if(arcA>=Math.PI){
                    // 大于半圆
                    return ISF===0;
                }
                else{
                    // 小于半圆
                    return ISF!==0;
                }
            }
        }
        // 不在半径内直接判定为外
        return false;
    }

    /**
     * 获取代理用的多边形
     * @param {Number}  _accuracy   弧形转换成多边形时代精度
     * @param {Boolean} _closeFlag  当不足为整个圆时 是否要封闭
     */
    createPolygonProxy(_accuracy,_closeFlag){
        var rtn=Polygon.arc(this.r,this.startAngle,this.endAngle,_accuracy,_closeFlag);
        rtn.translate(this.c);
        return rtn;
    }
}

// 扇形------------------------------------

/**
 * 扇形的数据
 */
class Sector_Data extends Arc_Data{
     /**
      * 旋转方向默认是顺时针, 并且 起点弧度 始终 会 小于 终点弧度
      * @param {Number} cx 圆心坐标
      * @param {Number} cy 圆心坐标
      * @param {Number} r  半径
      * @param {Number} angle_A     弧形端点弧度
      * @param {Number} angle_B     弧形端点弧度
      */
    constructor(cx,cy,r,angle_A,angle_B){
        super(cx,cy,r,angle_A,angle_B);
    }
    createPolygonProxy(_accuracy){
        var rtn=Polygon.sector(this.r,this.startAngle,this.endAngle,_accuracy);
        rtn.translate(this.c);
        return rtn;
    }
    isInside(_x,_y){
        if((_x>this.max.x)||(_x<this.min.x)||(_y>this.max.y)||(_y<this.min.y)){
            return false;
        }
        var r=this._r;
        var x=_x-this.c.x,
            y=_y-this.c.y;
        var arcA=this.angle;
        var tr=Math.sqrt(x*x+y*y);
        if(tr<=r){
            // 在半径内
            if(Math.PI*2<=arcA){
                return true;//圆形
            }
            else{
                return Math2D.in_angle_V(this.opv,this.edv,new Vector2(x,y),arcA>Math.PI);
            }
        }
        // 不在半径内直接判定为外
        return false;
    }
    get_min_A_max(){
        var d=super.get_min_A_max();
        var c=this.c;
        if(d.min.x>c.x){
            d.min.x=c.x;
        }
        if(d.min.y>c.y){
            d.min.y=c.y;
        }
        if(d.max.x<c.x){
            d.max.x=c.x;
        }
        if(d.max.y<c.y){
            d.max.y=c.y;
        }
        return d;
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
    /**
     * 向量在哪个象限上, 规定 0 视作正
     */
    get_quadrant(){
        var f1=this.x>=0,f2=this.y>=0;
        if(f1){
            if(f2){
                return 1;
            }else{
                return 4;
            }
        }else{
            if(f2){
                return 2;
            }else{
                return 3;
            }
        }
    }
    /** 归零 */
    zero(){
        this.x=this.y=0;
    }
    /**
     * 使用x坐标和y坐标的数组创建向量
     * @param {Number[]} x_arr x坐标的集合
     * @param {Number[]} y_arr y坐标的集合
     * @returns {Vector2[]} 返回坐标向量集合
     */
    static createByArray(x_arr,y_arr){
        var rtn=new Array(x_arr.length);
        for(var i = x_arr.length-1;i>=0;--i){
            rtn[i]=new Vector2(x_arr[i],y_arr[i]);
        }
        return rtn
    }
    static copy(tgt){
        return new Vector2(tgt.x,tgt.y);
    }
    /**拷贝向量
     * @returns {Vector2} 
     */
    copy(){
        return new Vector2(this.x,this.y);
    }
    /**
	 * @brief 求模
     * @returns {Number} 
	*/
	mag() {
		return Math.sqrt(this.x*this.x+this.y*this.y);
    }
	/**
	 * @brief 标准化向量
	*/
	normalize() {
        if(this.x==0&&this.y==0)return;
		var magSq = this.mag(),oneOverMag=0;
		if (magSq>0) {
			oneOverMag = 1.0/magSq;
			this.x *= oneOverMag;
			this.y *= oneOverMag;
		}
        return this;
    }
    /**判断向量是不是零向量
     * @returns{Boolean}
     */
    judgeZero(){return !(this.x||this.y);}
    
    /**取反
     * @returns{Vector2} 返回新的向量
     */
    instead(){return new Vector2(-1*this.x,-1*this.y);}

    /**向量和
     * @param {Vector2} v2
     * @returns {Vector2} 返回新的向量
     */
    add(v2){return new Vector2(this.x+v2.x,this.y+v2.y);}
    /**数字乘向量 
     * @param {Number} n
     * @param {Vector2} v
     * @returns{Vector2} 返回新的向量
    */
    np(n){return new Vector2(this.x*n,this.y*n);}
    /**向量差
     * @param {Vector2} v2 减
     * @returns{Vector2} 返回新的向量
     */
    dif(v2){return new Vector2(this.x-v2.x,this.y-v2.y);}
    /**
     * 向量内积
     * @param {Vector2} v2
     * @returns{Number} 
     */
    ip(v2){return this.x*v2.x+this.y*v2.y;}
    /**向量外积
     * @param {Vector2} v2 
     * @returns{Number} 
     */
    op(v2){return this.x*v2.y-this.y*v2.x;}
    /**
     * 进行线性变换
     * @param {Matrix2x2T}  m   变换矩阵
     * @param {Boolean}     fln 向量前乘还是前后乘矩阵  默认是前乘 (默认为true) 
     * @param {Boolean}     f   先平移还是先变换 默认先变换再平移 (默认为false) 
     * @param {Vector2}     anchorPoint   锚点的坐标 变换会以锚点为中心
     * @returns {BezierCurve} 返回this
     */ 
    linearMapping(m,fln=false,f=false,anchorPoint){
        if(anchorPoint){
            this.x-=anchorPoint.x
            this.y-=anchorPoint.y
        }

        if(f){
            if(m.e){
                this.x+=m.e;
            }
            if(m.f){
                this.y+=m.f;
            }
        }
        var tempx=this.x;
        var tempy=this.y;
        if(fln){   
            this.x=tempx*m.a+tempy*m.c;
            this.y=tempx*m.b+tempy*m.d;
        }else{
            this.x=tempx*m.a+tempy*m.b;
            this.y=tempx*m.c+tempy*m.d;
        }
        if(!f){
            if(m.e){
                this.x+=m.e;
            }
            if(m.f){
                this.y+=m.f;
            }
        }
        if(anchorPoint){
            this.x+=anchorPoint.x
            this.y+=anchorPoint.y
        }
        return this;
    }

    /**向量和
     * @param {Vector2} v1
     * @param {Vector2} v2
     * @returns{Vector2}
     */
     static add(v1,v2){return new Vector2(v1.x+v2.x,v1.y+v2.y);}
    /**向量差1-2
     * @param {Vector2} v1
     * @param {Vector2} v2
     * @returns{Vector2}
     */
    static dif(v1,v2){return new Vector2(v1.x-v2.x,v1.y-v2.y);}
    
    /**
     * 向量内积
     * @param {Vector2} v1
     * @param {Vector2} v2
     * @returns{Number}
     */
    static ip(v1,v2){return v1.x*v2.x+v1.y*v2.y;}
    /**向量外积
     * @param {Vector2} v1
     * @param {Vector2} v2
     * @returns{Number}
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
            tv=arguments[0].copy();
            tm=arguments[1];
            if(tm.constructor==Matrix2x2T){
                tv.x+=tm.e;
                tv.y+=tm.f;
            }
            rtn=Vector2.baseLinearMapping(tv,tm);
        }
        else{
            tm=arguments[0];
            tv=arguments[1].copy();
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
    /**
     * 判断向量是否相等
     */
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
        this.a= a===undefined ? 1 : a;
        this.b= b===undefined ? 0 : b;
        this.c= c===undefined ? 0 : c;
        this.d= d===undefined ? 1 : d;
    }
    static copy(m){
        return new Matrix2x2(m.a,m.b,m.c,m.d);
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
        rtn.b=this.c;
        rtn.c=this.b;
        return rtn;
    }
    /**
     * 矩阵的行列式
     * @returns{Number} 行列式
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
    /**
     * 根据向量生成 等比缩放&旋转 矩阵
     * @param {Vector2} v 
     */
    static createByVector2(v){
        return new this(v.x,v.y,-1*v.y,v.x);
    }
}

/**
 * 创建矩阵
 */
Matrix2x2.create={
    /**
     * 旋转
     * @param {Number} theta 顺时针 旋转角弧度
     */
    rotate:function(theta){
        var s=Math.sin(theta),
            c=Math.cos(theta);
        return new Matrix2x2(c,s,-s,c);
    },
    /**
     * 缩放
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
    },
    /**
     * 使用向量方向设置旋转矩阵
     * @param {Vector2} _v 向量
     */
    rotate_v(_v){
        var v=Vector2.copy(_v).normalize();
        return new Matrix2x2(v.x,v.y,-v.y,v.x)
    }
}
Matrix2x2.rotate90=new Matrix2x2(0,1,-1,0);

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
    
    static copy(m){
        if(m===undefined)return;
        return new Matrix2x2T(m.a,m.b,m.c,m.d,m.e,m.f);
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
    /**
     * 将线段作为局部坐标系x轴正方向单位生成矩阵
     * @param {Vector2} v1 线段的起点
     * @param {Vector2} v2 线段的终点
     */
    static createByLine(v1,v2){
        var v3={x:v2.x-v1.x,y:v2.y-v1.y};
        return new Matrix2x2T(v3.x,v3.y,-1*v3.y,v3.x,v1.x,v1.y);
    }

    // /**
    //  * 齐次矩阵 乘 齐次矩阵
    //  * @param {Matrix2x2T} m
    //  */
    // linearMapping(m){
    //     var v=new Vector2(this.x,this.y);
    //     v.linearMapping(m);
    //     var rtn=this.multiplication(m);
    //     rtn.e=v.x;
    //     rtn.f=v.y;
    //     console.log('m.x,m.y :>> ', m.e,m.f);
    //     return rtn
    //     // todo
    // }
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
     * @param {Vector2[]} nodes 装着顶点的数组
     */
    constructor(nodes){
        /** @type {Vector2[]}  存放 向量 的列表  */
        this.nodes=[];
        /** @type {Vectro2} 能正好包住多边形的矩形的x和y最小的顶点 */
        this.min    =new Vector2();
        /** @type {Vectro2} 能正好包住多边形的矩形的x和y最大的顶点 */
        this.max    =new Vector2();

        if(nodes&&nodes.constructor==Array){
            this.pushNodes(nodes);
        }
    }
    static copy(polygon){
        var ret=new Polygon();
        if(polygon&&polygon.nodes){
            ret.nodes=[];
            ret.min=Vector2.prototype.copy.call(polygon.min);
            ret.max=Vector2.prototype.copy.call(polygon.max);
            var l=polygon.nodes.length,i=0;
            for(;i<l;++i){
                ret.pushNode(polygon.nodes[i]);
            }
        }

        return ret;
    }
    copy(){
        return Polygon.copy(this);
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
    /**获取一个能正好包住多边形的矩形的x和y最小的顶点 */
    getMin(){
        return this.min;
    }
    /**获取一个能正好包住多边形的矩形的x和y最大的顶点 */
    getMax(){
        return this.max;
    }
    /**
     * 使用局部坐标系判断某点是否在内部, 
     * 也可以使用向量作为实参
     * @param {Number} x 局部坐标系中的坐标
     * @param {Number} y 局部坐标系中的坐标
     * @param {Boolean} f 是否认作是一个密封的多边形 为true时会多计算一个起点和终点的线
     */
    isInside(x,y,f){
        // 如果图形不是密封的, 直接返回否
        var _cf=this.isClosed()||f;
        if(this.min.x>x||this.max.x<x||this.min.y>y||this.max.y<y) return false;
        
        if(!_cf){
            return false;
        }

        var i,j,rtn=false,temp=0,tempK;
        i=this.nodes.length-1;
        if(this.nodes[i].x==x&&this.nodes[i].y==y) return true;
        for(;i>=0;--i){
            j=i-1;
            if(i<=0){
                if(f){
                    if(!_cf)
                        j=this.nodes.length-1;
                    else 
                        break;
                }else{
                    break;
                }
            }
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
     * 线性变换
     * @param {Matrix2x2T} m    矩阵
     * @param {Boolean} fln     矩阵后乘向量 还是 矩阵前乘向量 默认true
     * @param {Boolean} translate_befroeOrAfter 先变换还是先平移 默认false
     * @param {Boolean} anchorPoint 变换锚点的坐标
     */
    linearMapping(m,fln=true,translate_befroeOrAfter=true,anchorPoint){
        for(var i=this.nodes.length-1;i>=0;--i){
            this.nodes[i].linearMapping(m,fln,translate_befroeOrAfter,anchorPoint);
        }
    }
    /** 获取代理用的多边形
     * @param {Number} _accuracy 精度 在这里是无用的
     * @param {Number} _closeFlag 是否需要封闭
     */
    createPolygonProxy(_accuracy,_closeFlag){
        var rtn= this.copy();
        if(_closeFlag&&!rtn.isClosed()){
            rtn.seal();
        }
        return rtn;
    }

    /**
     * 多边形所有边的长度和
     * @param {Boolean} closeFlag 是否闭合多边形
     * @returns {Number}
     */
    line_length(closeFlag){
        var rtn=0;
        var i=this.nodes.length-1;
        if(closeFlag&&this.isClosed()&&this.node.length>2){
            rtn+=this.nodes[0].dif(this.nodes[i-1]).mag();
        }
        for(;i>0;--i){
            rtn+=this.nodes[i].dif(this.nodes[i-1]).mag();
        }
        return rtn;
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
     * @param {Number} startAngle       开始的弧度(rad)
     * @param {Number} endAngle         结束的弧度(rad)
     * @param {Number} _accuracy         精度 最小为2, 表示弧形由个顶点构成
     * @param {Boolean} _closeFlag 当不足为整个圆时 是否要封闭
     */
    static arc(r,_startAngle,_endAngle,_accuracy,_closeFlag){
        var rtn=new Polygon();
        var accuracy=_accuracy>=2?_accuracy:2,
            startAngle,endAngle,cyclesflag,
            stepLong,
            cycles=Math.PI*2,
            i,tempAngle;
        // if(anticlockwise){
        //     // 逆时针
        //     startAngle=_endAngle;
        //     endAngle=_startAngle;
        // }
        // else{
        //     // 顺时针
            startAngle=_startAngle;
            endAngle=_endAngle;
        // }
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
        if(cyclesflag||_closeFlag){
            rtn.seal();
        }
        return rtn;
    }
    static sector(r,_startAngle,_endAngle,_accuracy){
        var rtn=Polygon.arc(r,_startAngle,_endAngle,_accuracy,false)
        rtn.insert(0,new Vector2(0,0));
        rtn.pushNode(new Vector2(0,0));
        return rtn;
    }
    
    /** 获取两个多边形的相交次数
     * @param   {Polygon}   _polygon1
     * @param   {Polygon}   _polygon2
     * @returns {Number}    相交的次数
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
     * @returns {Boolean}   是否相交
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
     * @param {Boolean} translate_befroeOrAfter 先平移或后平移; 默认后平移(默认false)
     * @returns {Polygon} 返回一个新的多边形
     */
    static linearMapping(p,m,translate_befroeOrAfter=false){
        return Polygon.EX_linearMapping(p,m,!!translate_befroeOrAfter);
    }
    static EX_linearMapping(p,m,translate_befroeOrAfter){}
    static EX_linearMapping_nt(p,m,translate_befroeOrAfter){}

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

Polygon.EX_linearMapping_nt=OlFunction.create();
Polygon.EX_linearMapping_nt.addOverload([Polygon,Matrix2x2,Boolean],function(p,m,f){
    for(var i=p.nodes.length-1;i>=0;--i){
        p.nodes[i].linearMapping(m,true,f);
    }
    return p;
});
Polygon.EX_linearMapping_nt.addOverload([Matrix2x2,Polygon,Boolean],function(m,p,f){
    for(var i=p.nodes.length-1;i>=0;--i){
        p.nodes[i].linearMapping(m,false,f);
    }
    return p;
});


class Bezier_Node{
    /**
     * @param {Vector2} node
     * @param {Vector2} hand_before
     * @param {Vector2} hand_after
     */
    constructor(node,hand_before,hand_after) {
        /**
         * @type {Vector2} 顶点 p1 兼 p4
         */
        this.node=node;
        /** 
         * @type {Vector2} 前驱控制点 p2
         */
        this.hand_before=hand_before;
        /** 
         * @type {Vector2} 后置控制点 p3
         */
        this.hand_after=hand_after;
    }
    static copy(tgt){
        return new Bezier_Node(
            Vector2.copy(tgt.node),
            Vector2.copy(tgt.hand_before),
            Vector2.copy(tgt.hand_after)
        )
    }
    copy(){
        return Bezier_Node.copy(this);
    }
}

class Bezier_Polygon{
    /**
     * @param {Vector2[]} nodes  
     * @param {Vector2[]} hand_befores 
     * @param {Vector2[]} hand_afters 
     */
    constructor(nodes,hand_befores,hand_afters){
        this.nodes=[];
        if(nodes)
        for(var i=0;i<nodes.length;i++){
            this.nodes.push(new Bezier_Node(nodes[i],hand_befores[i],hand_afters[i]));
        }
    }
    static copy(tgt){
        var rtn=new Bezier_Polygon();
        for(var i=0;i<tgt.nodes.length;++i){
            rtn.nodes.push(Bezier_Node.copy(tgt.nodes[i]));
        }
        return rtn;
    }
    copy(){
        return Bezier_Polygon.copy(this);
    }
    /**
     * 追加顶点
     * @param {Bezier_Node} bezierNode  要追加的顶点
     */
    pushNode(bezierNode){
        this.nodes.push(Bezier_Node.copy(bezierNode));
    }
    /**
     * 追加顶点数组
     * @param {Bezier_Node[]} bezierNodes  装着顶点的数组
     */
    pushNodes(bezierNodes){
        for(var i=0;i<nodes.length;++i){
            this.pushNode(bezierNodes[i]);
        }
    }
    /**
     * 插入顶点
     * @param {Number} index    要插入的顶点的下标
     * @param {Bezier_Node[]} bezierNodes 要插入的顶点
     */
    insert(index,bezierNode){
        this.nodes.splice(index,0,bezierNode.copy());
    }
    /**
     * 移除顶点
     * @param {Number} index 要删除的顶点的下标
     */
    remove(index){
        this.nodes.splice(index,1);
    }
    /**
     * 分割贝塞尔曲线
     * @param {Number} index 下标
     * @param {Number} z     t参数 
     */
    cut(index,z){
        if(this.nodes[index]===undefined||this.nodes[index+1]===undefined)return;
        var points=[
            this.nodes[index].node,
            this.nodes[index].hand_after,
            this.nodes[index+1].hand_before,
            this.nodes[index+1].node
        ];
        var newPoints=Math2D.BezierCut(points,z);

        var newNode=Bezier_Node.copy(
            {
                node: newPoints[0][3],
                hand_before:newPoints[0][2],
                hand_after:newPoints[1][1],
            }
        );
        // console.log(newPoints)
        this.nodes[index].hand_after.x=newPoints[0][1].x;
        this.nodes[index].hand_after.y=newPoints[0][1].y;
        this.nodes[index+1].hand_before.x=newPoints[1][2].x;
        this.nodes[index+1].hand_before.y=newPoints[1][2].y;

        this.nodes.splice(index+1,0,newNode);
    }
}

class BezierCurve{
    /**
     * @param {Vector2[]} points 控制点们 Vector2
     */
    constructor(points){
        /**@type {Vector2[]}*/
        this._points=null;
        /**@type {Number[]}*/
        this._coefficient_X=null;
        /**@type {Number[]}*/
        this._coefficient_Y=null;
        /**@type {BezierCurve}*/
        this._derivatives=null;
        /**@type {BezierCurve} 对齐后的曲线的代理 用于求紧包围框*/
        this._align_proxy=null;
        /**@type {Matrix2x2} 对齐曲线使用的矩阵 用于求紧包围框*/
        this._align_matrix=null;
        /**@type {Matrix2x2} 对齐曲线使用的矩阵的逆矩阵 用于求紧包围框*/
        this._align_matrix_i=null;
        /**@type {Polygon} 多边形代理,拟合曲线的多边形*/
        this._polygon_proxy=null;
        /**@type {Number} 多边形代理的步长*/
        this._polygon_proxy_sp=0;
        /**@type {Number} 目标的多边形代理的步长,如果和_polygon_proxy_sp不同时，get访问器会重新生成多边形代理*/
        this._polygon_proxy_want_sp;
        this.polygon_proxy_want_sp=0.1;
        /**@type {Number[]} 弧长记录表 */
        this._arc_length_table=null;
        if(points) this.reset_points(points);
    }
    /**
     * 清空所有代理对象和导函数, 应该在控制点或计算系数改动时使用
     */
    clearProxy(){
        this._derivatives=null;
        this._align_proxy=null;
        this._align_matrix=null;
        this._align_matrix_i=null;
        this._polygon_proxy=null;
        this._polygon_proxy_sp=0;
        this._arc_length_table=null;
    }
    /**
     * 清理控制点
     */
    clearPoints(){
        this._points=null;
    }

    /**
     * 重新设置控制点
     * @param {Vector2} points 控制点们 Vector2
     */
     reset_points(points){
        this._derivatives=null;
        if(points&&points.length){
            this._points=new Array(points.length);
            for(var i=points.length-1;i>=0;--i){
                this._points[i]=Vector2.copy(points[i]);
            }
            this.reload_coefficient();
        }
        this.clearProxy();
    }

    /**
     * 重新设置系数
     * @param {Number[]} coefficient_X X系数
     * @param {Number[]} coefficient_Y Y系数
     */
    reset_coefficient(coefficient_X,coefficient_Y){
        this._coefficient_X=coefficient_X.concat();
        this._coefficient_Y=coefficient_Y.concat();
    }
    /**
     * 拷贝函数
     * @param {BezierCurve} bezierCurve 
     * @returns {BezierCurve}
     */
    static copy(bezierCurve){
        var rtn=new BezierCurve();
        if(bezierCurve.points&&bezierCurve.points.length){
            rtn._points=new Array(bezierCurve._points.length);
            for(var i=rtn._points.length-1;i>=0;--i){
                rtn._points[i]=Vector2.copy(bezierCurve._points[i]);
            }
        }
        rtn.coefficient_X=bezierCurve.coefficient_X;
        rtn.coefficient_Y=bezierCurve.coefficient_Y;
        return rtn;
    }
    copy(){
        return BezierCurve.copy(this);
    }
    /**
     * 生成 BezierNode (当前曲线的应该是三阶或二阶曲线才能正常使用)
     * @returns {Bezier_Node[]}  BezierNode
     */
    toBezierNode(){
        var l=this.points.length-1;
        return [
            new Bezier_Node(this.points[0],
                this.points[0].add(this.points[0].dif(this.points[1])),
                this.points[1]
                ),
            new Bezier_Node(this.points[0],
                this.points[l-1],
                this.points[l].add(this.points[l].dif(this.points[l-1]))
                ),                
        ]

    }
    /**
     * 使用 Bezier_Node 创建 (三阶贝塞尔曲线)
     * @param {Bezier_Node} node1
     * @param {Bezier_Node} node2
     */
     static createBy_BezierNode(node1,node2){
        return new BezierCurve([node1.node,node1.hand_after,node2.hand_before,node2.node]);
    }
    
    set points(points){
        this.reset_points(points);
    }
    /** 
     * @returns {Vector2[]}
     */
    get points(){
        if(this._points===null){
            this.reload_points();
        }
        return this._points;
    }
    set coefficient_Y(coefficient_Y){
        this._coefficient_Y=coefficient_Y;
        this.clearPoints();
    }
    set coefficient_X(coefficient_X){
        this._coefficient_X=coefficient_X;
        this.clearPoints();
    }
    get coefficient_Y(){
        return this._coefficient_Y;
    }
    get coefficient_X(){
        return this._coefficient_X;
    }
    /**
     * @returns {BezierCurve} 返回一条对齐到x轴后的曲线
     */
    get align_proxy(){
        if(this._align_proxy===null){
            this.reload_align();
        }
        return this._align_proxy;
    }
    get polygon_proxy_want_sp(){
        return this._polygon_proxy_want_sp;
    }
    set polygon_proxy_want_sp(step_size){
        var sp=Math.abs(step_size);
        this._polygon_proxy_want_sp=sp>1?1:sp;
    }
    /**
     * 重新加载对齐后的曲线
     */
    reload_align(){
        var d=this.points[this.points.length-1].dif(this.points[0]),
            nd=d.copy().normalize();
            // var m=new Matrix2x2T().setTranslate(di.x,di.y),
        var m=Matrix2x2T.createByVector2(nd).setTranslate(-this.points[0].x,-this.points[0].y);
        this._align_matrix=m;
        this._align_matrix_i=m.inverse();
        this._align_proxy=BezierCurve.copy(this);
        this._align_proxy.linearMapping(this._align_matrix,false,true);
    }

    /**
     * 设置控制点之后, 重新加载 各次幂的系数
     */
    reload_coefficient(){
        var points=this.points,
            n=points.length-1,
            m=get_Bezier_Matrix(n);
        this._coefficient_X=new Array(points.length);
        this._coefficient_Y=new Array(points.length);
        var i,j,tempx,tempy;
        for(i=n;i>=0;--i){
            tempx=tempy=0;
            for(j=i;j>=0;--j){
                tempx+=m[i][j]*points[j].x;
                tempy+=m[i][j]*points[j].y;
            }
            this._coefficient_X[i]=tempx;
            this._coefficient_Y[i]=tempy;
        }
    }
    /**
     * 设置系数后, 重新加载 控制点坐标
     */
    reload_points(){
        this._points=Vector2.createByArray(
            coefficientToPoints(this._coefficient_X),
            coefficientToPoints(this._coefficient_Y)
        );
        this.clearProxy();
    }
    
    /**
     * 使用矩阵进行线性变换
     * @param {Matrix2x2T}  m   变换矩阵
     * @param {Boolean}     fln 向量前乘还是前后乘矩阵  默认是前乘 (默认为true) 
     * @param {Boolean}     f   先平移还是先变换 默认先变换再平移 (默认为false) 
     * @param {Vector2}     anchorPoint   锚点的坐标 变换会以锚点为中心 默认 (0,0)
     * @returns {BezierCurve} 返回this
     */
     linearMapping(m,fln,f,anchorPoint){
        for(var i=this.points.length-1;i>=0;--i){
            this.points[i].linearMapping(m,fln,f,anchorPoint);
        }
        this.reload_coefficient();
        this.clearProxy();
        return this;
    }
    /**
     * 获取 x 坐标
     * @param {Number} t t 参数
     * @returns {Number}
     */
    sampleCurveX(t){
        var rtn=0;
        for(var i = this._coefficient_X.length-1;i>=0;--i){
            rtn*=t;
            rtn+=this._coefficient_X[i];
        }
        return rtn;
    }
    /**
     * 获取 y 坐标
     * @param {Number} t t 参数
     * @returns {Number}
     */
    sampleCurveY(t){
        var rtn=0;
        for(var i = this._coefficient_Y.length-1;i>=0;--i){
            rtn*=t;
            rtn+=this._coefficient_Y[i];
        }
        return rtn;
    }
    /**
     * 获取坐标
     * @param {Number} t t 参数
     * @returns {Vector2} 返回坐标
     */
    sampleCurve(t){
        return new Vector2(this.sampleCurveX(t),this.sampleCurveY(t));
    }
    /**
     * 导函数
     * @returns {BezierCurve}低一阶的贝塞尔曲线
     */
    get derivatives(){
        if(!(this._coefficient_X.length||this._coefficient_Y.length)){
            return null;
        }
        if(this._derivatives===null){
            // this._derivatives=new BezierCurve(Math2D.bezierDerivatives_points(this.points));
            this._derivatives=new BezierCurve();
            this._derivatives.reset_coefficient(
                derivative(this._coefficient_X),
                derivative(this._coefficient_Y)
            );
        }
        return this._derivatives;
    }
    /**
     * 获取当前点的移动方向
     * @param {Number} t 时间参数 t
     * @returns {Vector2[]} 返回曲线上的点和导数的绝对坐标
     */
    tangent(t){
        var pt=this.sampleCurve(t),
            d=Vector2.add(pt,this.derivatives.sampleCurve(t));
        return [pt,d];
    }
    /**
     * 当前点的法线
     * @param {Number} 时间参数 t
     * @param {Vector2} 返回曲线上的点和法向的绝对坐标
     */
    abs_normal(t){
        var pt=this.sampleCurve(t),
            d=Vector2.add(pt,this.normal(t));
        return [pt,d];
    }
    /**
     * 当前点的法线
     * @param {Number} 时间参数 t
     * @param {Vector2} 返回一个相对坐标
     */
    normal(t){
        var d=this.derivatives.sampleCurve(t);
        return new Vector2(
            d.y,
            -d.x
        )
    }
    /**
     * 获取当前点的导数
     * @param {Number} t 时间参数 t
     * @returns {Vector2} 返回一个相对坐标
     */
    derivative(t){
        return this.derivatives.sampleCurve(t);
    }
    /**
     * 获取曲线的 根 的 t 参数
     * 目前只能得到四阶以下曲线的根
     * @param {Number} ddepth 取到几阶导数的根 默认取全部
     * @param {Boolean} range_flag 是否要取超过t的合法取值范围(0~1) 默认不超过
     * @returns {Number[]} 返回导函数的根的 t 参数集合
     */
    get_root_t(ddepth,range_flag){
        var depth=ddepth===undefined?Infinity:ddepth;
        if(depth<=0){
            return [];
        }
        var rtn=this.derivatives?root_of_1_3(this.derivatives.coefficient_X).concat(root_of_1_3(this.derivatives.coefficient_Y)).concat(this.derivatives.get_root_t(depth-1)):[];
        if(!range_flag){
            rtn=rtn.filter(BezierCurve.t_range);
        }
        return rtn;
    }
    /**
     * 获取曲线的 根 的 t 参数
     * 目前只能得到四阶以下曲线的根
     * @param {Boolean} range_flag 是否要取超过t的合法取值范围(0~1) 默认不超过
     * @returns {Vector2[]} 返回曲线的根的集合
     */
    get_root_v(range_flag){
        var pts=this.get_root_t(range_flag),
            i=pts.length,
            rtn=new Array(i)
        for(--i;i>=0;--i){
            rtn[i]=this.sampleCurve(pts[i]);
        }
        return rtn;
    }
    /**
     * 轴对齐包围框 (边界框) axis aligned bounding box
     * @returns {Rect_Data} 轴对齐包围框 (边界框) axis aligned bounding box
     */
    get_aabb(){
        var pts=this.get_root_v().concat([this.sampleCurve(0),this.sampleCurve(1)]),
            max=new Vector2(),
            min=new Vector2();
        max.x=pts[0].x;
        max.y=pts[0].y;
        min.x=pts[0].x;
        min.y=pts[0].y;
        for(var i=pts.length-1;i>=0;--i){
                 if(pts[i].x>max.x)max.x=pts[i].x;
            else if(pts[i].x<min.x)min.x=pts[i].x;
                 if(pts[i].y>max.y)max.y=pts[i].y;
            else if(pts[i].y<min.y)min.y=pts[i].y;
        }
        return Rect_Data.createByVector2(min,max);
    }
    /**
     * 获取紧包围框
     * @returns {Polygon}
     */
    get_tightBoundsBox(){
        var pts=this.align_proxy.get_root_v().concat([this.align_proxy.sampleCurve(0),this.align_proxy.sampleCurve(1)]),
            max=new Vector2(),
            min=new Vector2();
        max.x=pts[0].x;
        max.y=pts[0].y;
        min.x=pts[0].x;
        min.y=pts[0].y;
        for(var i=pts.length-1;i>=0;--i){
                 if(pts[i].x>max.x)max.x=pts[i].x;
            else if(pts[i].x<min.x)min.x=pts[i].x;
                 if(pts[i].y>max.y)max.y=pts[i].y;
            else if(pts[i].y<min.y)min.y=pts[i].y;
        }
        var p_lb=new Vector2(min.x,max.y),
            p_rt=new Vector2(max.x,min.y),
            polygon=new Polygon([min,p_rt,max,p_lb]);
        polygon.linearMapping(this._align_matrix_i,false,false);
        return polygon;
    }
    /**
     * t 是否在合法的取值范围
     * @param {Number} t 
     */
    static t_range(t){
        return t>=0&&t<=1;
    }
    /**
     * 曲线的拐点 仅用于三阶曲线
     * @returns {Number[]} 曲线拐点的 t 参数的集合
     */
    inflections(){
        var points=this.align_proxy.points,
            a=points[2].x*points[1].y,
            b=points[3].x*points[1].y,
            c=points[1].x*points[2].y,
            d=points[3].x*points[2].y,
            z=c-a,
            y=-3*z-b,
            x=-y+b-d,
            x2=2*x,
            k=y*y-2*x2*z;
            if(x2===0){
                return [-z/y];
            }
            if(k>=0){
                var q = Math.sqrt(k)
                return [(q - y) / x2, (-y - q) / y2];
            }
            return [];
    }
    /**
     * 使用坐标求t值
     * @param {Number} x X坐标
     * @returns 对应的t值
     */
    get_t_by_x(x){
        var temp=this.coefficient_X.concat();
        temp[0]-=x;
        return root_of_1_3(temp).filter(BezierCurve.t_range);
    }
    /**
     * 使用坐标求t值
     * @param {Number} y Y坐标
     * @returns 对应的t值
     */
    get_t_by_y(y){
        var temp=this.coefficient_Y.concat();
        temp[0]-=y;
        return root_of_1_3(temp).filter(BezierCurve.t_range);
    }
    /**
     * 求弧长
     * @param {Number} step_size t 时间参数的采样步长, 设置越接近0精度越高; 默认为 0.1 或者保留原有的
     * @returns {Number} 使用多边形拟合曲线求得的长度
     */
    get_arc_length(step_size){
        if(step_size) this.polygon_proxy_want_sp=Math.abs(step_size);
        var tb=this.arc_length_table;
        return tb[tb.length-1];
    }

    /**
     * 使用弧长求t值
     * @param {Number} length 当前弧长, 为负数时使用终点开始算; 当弧长超出取值范围时会出现错误的结果
     * @param {Number} step_size t 时间参数的采样步长, 设置越接近0精度越高; 默认为 0.1 或者保留原有的
     * @returns {Number} 对应的时间参数t
     */
    get_t_by_arc_length(length,step_size){
        if(step_size) this.polygon_proxy_want_sp=step_size;
        var tb=this.arc_length_table,
            i=tb.length-1,
            l=length>=0?length:tb[i]+length;
        for(--i;i>=0;--i){
            if(tb[i]<l){
                return this._polygon_proxy_sp*(i+(l-tb[i])/(tb[i+1]-tb[i]))
            }
        }
        return 0;
    }
    /** 弧长表 */
    get arc_length_table(){
        var polygon=this.polygon_proxy;
        if(this._arc_length_table===null){
            this._arc_length_table=[];
            var temp;
            this._arc_length_table[0]=0;
            for(var i=1;i<polygon.nodes.length;++i){
                temp=polygon.nodes[i].dif(polygon.nodes[i-1]).mag();
                this._arc_length_table[i]=this._arc_length_table[i-1]+temp;
            }
        }
        return this._arc_length_table;
    }
    get polygon_proxy(){
        if(this._polygon_proxy===null||this._polygon_proxy_sp!==this.polygon_proxy_want_sp){
            this._polygon_proxy=this.createPolygonProxy(this.polygon_proxy_want_sp);
        }
        return this._polygon_proxy;
    }
    /**
     * 创建多边形拟合曲线
     * @param {Number} step_size t 时间参数的步长, 设置越接近0精度越高; 默认为 0.1
     * @returns {Polygon} 多边形拟合曲线
     */
    createPolygonProxy(step_size){
        var sp=Math.abs(step_size)||0.1,
            temp=[];
        for(var i = 0; i<1; i+=sp){
            temp.push(this.sampleCurve(i));
        }
        temp.push(this.sampleCurve(1));
        this._arc_length_table===null;
        this._polygon_proxy_sp=step_size;
        return new Polygon(temp);
    }
    /**
     * 某点的曲率
     * @param {Number} t 时间参数 t
     * @returns {Number} 当前点曲率
     */
    kappa(t){
        var d = this.derivative(t),
            dd = this.derivatives.derivative(t),
            numerator = d.x * dd.y - dd.x * d.y,
            denominator = Math.pow(d.x*d.x + d.y*d.y, 3/2);
        // if (denominator === 0) return NaN;
        return numerator / denominator
    }
    /**
     * 当前点的曲率拟合圆
     * @param {Number} t 时间参数 t
     * @param {Arc_Data} tgtData 目标 data, 该参数传入后值将会被修改并返回，而不是返回新实例化的数据
     * @returns {Arc_Data} 当前点曲率拟合圆
     */
    kappa_circle(t,tgtData){
        var kr=-1/this.kappa(t),
            pt=this.sampleCurve(t),
            n=this.normal(t).normalize(),
            c=pt.add(n.np(kr));
        kr=Math.abs(kr);
        if(tgtData){
            tgtData.c=c;
            tgtData.r=kr;
        }
        return new Arc_Data(c.x,c.y,kr,0,2*Math.PI);
    }

}

/**
 * 用来求交点的边界框, 需要事先确定曲线的单调性 属性全只读
 */
class Unilateral_Bezier_Box{
    constructor(b,t1,t2){
        this.b=b;
        this.t1=t1||0;
        this.t2=t2||1;
        this._v1;
        this._v2;
        /**@type {Number} 细分迭代次数 */
        this.iterations=0;
        /**@type {Unilateral_Bezier_Box[]} 配对的边界框 */
        this.sb=[];
    }
    get v1(){
        return this._v1||this.b.sampleCurve(this.t1);
    }
    get v2(){
        return this._v2||this.b.sampleCurve(this.t2);
    }
    set v1(v){return this._v1=v;}
    set v2(v){return this._v2=v;}
    
    /**进一步细分 */
    ex_box(){
        var b=this.b,
            b1=new Unilateral_Bezier_Box(b),
            b2=new Unilateral_Bezier_Box(b),
            p=0.5*(this.t1+this.t2),
            pt=this.b.sampleCurve(p);
        b1.t1=this.t1||0;
        b1.t2=b2.t1=p;
        b2.t2=this.t2;
        b1.v1=this.v1||this.b.sampleCurve(this.t1);
        b1.v2=pt;
        b2.v1=pt;
        b2.v2=this.v2||this.b.sampleCurve(this.t2);

        // 刷新配对 迭代次数计数器+1
        b1.sb=this.sb.concat();
        b2.sb=this.sb.concat();
        b1.iterations=this.iterations+1;
        b2.iterations=this.iterations+1;

        for(var i=this.sb.length-1;i>=0;--i){
            this.sb[i].sb.splice(this.sb[i].sb.indexOf(this),1,b1,b2);
        }

        return [b1,b2];
    }
    /**@returns {Boolean} 是否足够精度 */
    has_accuracy(_accuracy){
        if(!(this.v2&&this.v1)){
            this.v1=this.b.sampleCurve(0);
            this.v2=this.b.sampleCurve(1);
        }
        return (Math.abs(this.v2.x-this.v1.x)<_accuracy)&&(Math.abs(this.v2.y-this.v1.y)<_accuracy);
    }
    /**清除无重叠的配对 */
    weed_out(){
        for(var i=0;i<this.sb.length;++i){
            if(!this.has_overlap(this.sb[i])){
                this.sb[i].sb.splice(this.sb[i].sb.indexOf(this),1);
                this.sb.splice(i,1);
                --i;
            }
        }
    }
    /**
     * box是否有重叠
     * @param {Unilateral_Bezier_Box} bb 另一个实例
     * @returns {Boolean}
     */
    has_overlap(bb){
        var v11=this.v1 ||this.b.sampleCurve(this.t1),
            v12=this.v2 ||this.b.sampleCurve(this.t2),
            v21=bb.v1   ||  bb.b.sampleCurve(  bb.t1),
            v22=bb.v2   ||  bb.b.sampleCurve(  bb.t2);
        return Math2D.boxL_i_boxL(v11,v12,v21,v22);
    }
    /**
     * 立刻使用向量求交, 如果曲线的导数差异较大可能会导致求交失败
     * @returns {Vector2[]}
     */
    all_line_i_line(){
        var tb,rtn=[];
        for(var i=this.sb.length-1;i>=0;--i){
            tb=this.sb[i];
            rtn.push(Math2D.line_i_line_v(this.v1.x,this.v1.y,this.v2.x,this.v2.y,tb.v1.x,tb.v1.y,tb.v2.x,tb.v2.y));
        }
        return rtn;
    }
    
    /**
     * 立刻使用向量求交, 如果曲线的导数差异较大可能会导致求交失败
     * @param {Unilateral_Bezier_Box} 
     * @returns {Vector2}
     */
    line_i_line(bb){
            return Math2D.line_i_line_v(this.v1.x,this.v1.y,this.v2.x,this.v2.y,bb.v1.x,bb.v1.y,bb.v2.x,bb.v2.y);
    }
}

/**
 * 贝塞尔曲线求交
 * @param {BezierCurve} bezier1 贝塞尔曲线1
 * @param {BezierCurve} bezier2 贝塞尔曲线2
 * @param {Number} _accuracy 采样临界值(最终包围框的宽高最大不超过) 默认 1 值越小精度越高
 * @param {Boolean} f_lil 是否使用最后得到的向量配对进行交点计算, 默认为true, 注意 如果采样精度太低进行求交可能会导致交点丢失
 * @returns {Vectore2[]}  返回交点的集合
 */
function bezier_i_bezier_v(bezier1,bezier2,_accuracy,f_lil){
    /**@type {BezierCurve[][]} 两条曲线的单调子曲线*/
    var group_bezier=[Math2D.cut_bezier_to_unilateral_by_root(bezier1),Math2D.cut_bezier_to_unilateral_by_root(bezier2)],
        l=group_bezier[0].length-1,
        k=group_bezier[1].length-1,
        i,j;
    /**@type {Number} 精度 */
    var accuracy=(_accuracy&&(_accuracy>0))?_accuracy:1;
    /**@type {Unilateral_Bezier_Box[]} 用来配对的集合*/
    var group=new Array(l),
    /**@type {Unilateral_Bezier_Box[]} 暂存*/
    temp_group=new Array(k);
    var tempVector2;
    
    for(j=k;j>=0;--j){
        temp_group[j]=new Unilateral_Bezier_Box(group_bezier[1][j]);
    }
    for(i=l;i>=0;--i){
        group[i]=new Unilateral_Bezier_Box(group_bezier[0][i]);
        group[i].sb=temp_group.concat();
    }
    for(j=k;j>=0;--j){
        temp_group[j].sb=group.concat();
    }

    var rtn=[],d=0,f=false;
    temp_group=[];

    while(group.length){
        ++d;
        f=false;
        // ctx.clearRect(0,0,1000,1000);
        for(i=group.length-1;(i>=0)&&group[i].sb.length;--i){
            group[i].weed_out();
            if(!group[i].sb.length){
                // 左组i项无配对
                continue;
            }
            // tgt_d.render(ctx);
            // tgt_d1.render(ctx);

            if(group[i].has_accuracy(accuracy)){
                // 左组i项精度达成
                f=true;
                temp_group.push(group[i]);
            }else{
                // 左组的精度不足 左组派生细分
                temp_group=temp_group.concat(group[i].ex_box());
            }
            for(j=0;j<group[i].sb.length;++j){
                if(f&&group[i].sb[j].has_accuracy(accuracy)){
                    // 精度都足够 剔除配对并增加返回
                    if(f_lil){
                        rtn.push(center_v2([group[i].v1,group[i].v2,group[i].sb[j].v1,group[i].sb[j].v2]));
                    }
                    else{
                        tempVector2=group[i].line_i_line(group[i].sb[j]);
                        if(!(isNaN(tempVector2.x)||(tempVector2.x===Infinity)||(tempVector2.x===-Infinity)||
                        isNaN(tempVector2.y)||(tempVector2.y===Infinity)||(tempVector2.y===-Infinity)))
                        rtn.push(tempVector2);
                    }
                    group[i].sb.splice(j,1);
                    --j;
                }
                else if(group[i].sb[j].iterations<d){
                    // 精度未达成 并且这次迭代中未细分
                    group[i].sb[j].ex_box();
                    ++j;
                }
            }
        }
        group=temp_group;
        temp_group=[];
    }
    
    return rtn;
}

/**
 * 坐标的中心点
 * @param {Vector2[]} ordinates 坐标集合
 * @returns {Vector2} 返回中心的坐标
 */
function center_v2(ordinates){
    var min=new Vector2(),max=new Vector2();
    max.x=ordinates[0].x;
    max.y=ordinates[0].y;
    min.x=ordinates[0].x;
    min.y=ordinates[0].y;

    for(var i=ordinates.length-1;i>0;--i){
        if(ordinates[i].x>max.x)max.x=ordinates[i].x;
   else if(ordinates[i].x<min.x)min.x=ordinates[i].x;
        if(ordinates[i].y>max.y)max.y=ordinates[i].y;
   else if(ordinates[i].y<min.y)min.y=ordinates[i].y;
    }

    return new Vector2(0.5*(max.x-min.x),0.5*(max.y-min.y));
}