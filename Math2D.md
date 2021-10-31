<!--
 * @LastEditors: Darth_Eternalfaith
-->

# Math2D.js 提供一些基础的数据结构和数学函数

## Math2D
静态类，放函数的
### 静态函数
* circular_i_circular(c1,r1,c2,r2)  判断两个圆形是否相交   
    @param {Vector2} c1  圆1 圆心坐标   
    @param {Number} r1   圆1 半径   
    @param {Vector2} c2  圆2 圆心坐标   
    @param {Number} r2   圆2 半径   
    @returns {Boolean} 返回相交情况   
    
* circular_i_circular_V(c1,r1,c2,r2)  获得两个圆形的交点   
    @param {Vector2} c1  圆1 圆心坐标   
    @param {Number} r1   圆1 半径   
    @param {Vector2} c2  圆2 圆心坐标   
    @param {Number} r2   圆2 半径   
    @returns {Array\<Vector2\>} 返回交点   

* arc_i_arc(arc1,arc2) 弧形是否相交
    @param {Arc_Data} arc1 弧形1
    @param {Arc_Data} arc2 弧形2
    @returns {Boolean} 返回相交情况

* circle_i_line_V(lop,led,c,r) 获得圆形和线段 的 交点 坐标   
    @param {Vector2} lop 线段起点   
    @param {Vector2} led 线段终点   
    @param {Vector2} c   圆心   
    @param {Number}  r   圆形的半径   
    @returns {Array\<Vector2\>} 长度最多为2的数组，两个交点的坐标   

* in_angle_V(angle_op_V,angle_ed_V,tgtv,f) 判断 tgtv 是否在 顺时针旋转 op 到 ed 的夹角内, 角不会超过360度    
    @param {Vector2} angle_op_V    夹角的射线 开始   
    @param {Vector2} angle_ed_V    夹角的射线 结束   
    @param {Vector2} tgtv        目标   
    @param {Boolean} f  表示角度的大小是否大于半圆   
    @param {Boolean} f1 半圆时使用，表示是顺时针还是逆时针   

* arc_i_line_V(arc,lop,led) 获得弧形与线段的交点   
    @param {Arc_Data} arc    弧形数据   
    @param {Vector2} lop     线段端点   
    @param {Vector2} led     线段端点   
    @returns {Array\<Vector2\>} 弧形与线段的交点   
* arc_i_line(arc,lop,led) 判断弧形与线段是否相交   
    @param {Arc_Data} arc    弧形数据   
    @param {Vector2} lop     线段端点   
    @param {Vector2} led     线段端点   
    @returns {Boolean}       相交情况   

* sector_i_line(sector,lop,led) 扇形与线段是否相交   
    @param {Sector_Data} sector     弧形数据   
    @param {Vector2} lop     线段端点   
    @param {Vector2} led     线段端点   
    @returns {Boolean} 相交情况   

* line_i_line(l1op,l1ed,l2op,l2ed) 判断两条线段相交情况   
    @param {Vector2} l1op    线段1的起点   
    @param {Vector2} l1ed    线段1的终点   
    @param {Vector2} l2op    线段2的起点   
    @param {Vector2} l2ed    线段2的终点   
    @return {Number} 返回 1 表示相交; 0 表示没有相交; -1 表示 l1 终点在 l2 上, 或者 l2 起点在 l1 上; 2 表示 l2 终点在 l1 上, 或者 l1 起点在 l2 上;    
---
## Rect_Data 基础图形矩形的数据 
### 属性
* x {Number} 矩形的a顶点x坐标
* y {Number} 矩形的a顶点y坐标
* w {Number} 矩形的d定点与a顶点的x坐标的差
* h {Number} 矩形的d定点与a顶点的y坐标的差
### 方法
* 构造函数 Rect_Data(x,y,w,h)   
    @param {Number} x 坐标   
    @param {Number} y 坐标   
    @param {Number} w 宽度   
    @param {Number} h 高度   
* copy()   拷贝函数   
    @returns {Rect_Data} 返回当前图形的拷贝
  
* getMin()  
    @returns {Vector2} 返回图形最靠近 {-Infinity,-Infinity} 的顶点

* getMax()  
    @returns {Vector2} 返回图形最远离 {-Infinity,-Infinity} 的顶点
* isInside(x,y) 判断点是否在内部   
    @param {Number} x 点的x坐标   
    @param {Number} y 点的y坐标   
    @returns {Boolean} 返回 点是否在内部   
* ceratePolygonProxy()获取代理用的多边形    
    @returns {Polygon} 返回一个多边形
---
## Arc_Data
### 属性    
* c           {Vector2}  圆心坐标
* _r          {Number}   半径
* _startAngle {Number}   开始的弧度
* _endAngle   {Number}   结束的弧度
* _opv        {Vector2}  只读属性 开始的弧度对应的坐标 (以圆心作为原点)
* _edv        {Vector2}  只读属性 结束的弧度对应的坐标 (以圆心作为原点)
* _angle      {Number}   只读属性 夹角弧度
* _min        {Vector2}  只读属性 用一个矩形刚好包裹图形时 最接近{-Infinity,-Infinity}的点
* _max        {Vector2}  只读属性 用一个矩形刚好包裹图形时 最远离{-Infinity,-Infinity}的点
### 方法
构造函数 Arc_Data(cx,cy,r,angle_A,angle_B)  
---
## Sector_Data
---
## Vector2
---
## Matrix2x2
---
## Matrix2x2T
---
## Polygon
---
