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
     */
    static arc_i_line(lop,led,c,r,opRad,edRad){
        var cis=circle_i_line(lop,led,c,r);
        var k=edRad-opRad;
        if(k>2*Math.PI){
            // 完整的圆型
            return cis;
        }
        var f=k>Math.PI;
        var t_opRad,t_edRad;
        if(opRad>edRad){
            t_opRad=edRad;
            t_edRad=opRad;
        }else{
            t_opRad=opRad;
            t_edRad=edRad;
        }
        var oprv=new Vector2(Math.cos(t_opRad)*r,Math.sin(t_opRad)*r),
            edrv=new Vector2(Math.cos(t_edRad)*r,Math.sin(t_edRad)*r);
        var rtn=[];
        for(var i =cis.length-1;i>=0;--i){
            if(f){
                if((Vector2.rotateF(oprv,cis[i])==true)&&(Vector2.rotateF(edrv,cis[i])==false)){
                    rtn.push(cis[i]);
                }
            }else{
                if((Vector2.rotateF(oprv,cis[i])==true)||(Vector2.rotateF(edrv,cis[i])==false)){
                    rtn.push(cis[i]);
                }
            }
        }
        return rtn;
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