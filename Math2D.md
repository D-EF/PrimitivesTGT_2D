<!--
 * @LastEditors: Darth_Eternalfaith
-->

# Math2D.js 提供一些基础的数据结构和数学函数

## Math2D
静态类，放函数的, 请自看代码中的注释
---
## Data_Rect 基础图形矩形的数据 
### 属性
#### x {Number} 矩形的a顶点x坐标
#### y {Number} 矩形的a顶点y坐标
#### w {Number} 矩形的d定点与a顶点的x坐标的差
#### h {Number} 矩形的d定点与a顶点的y坐标的差
### 方法
#### 构造函数 Data_Rect(x,y,w,h)   
    @param {Number} x 坐标   
    @param {Number} y 坐标   
    @param {Number} w 宽度   
    @param {Number} h 高度   
#### copy()   拷贝函数   
    @returns {Data_Rect} 返回当前图形的拷贝
  
#### get_Min()  
    @returns {Vector2} 返回图形最靠近 {-Infinity,-Infinity} 的顶点

#### get_Max()  
    @returns {Vector2} 返回图形最远离 {-Infinity,-Infinity} 的顶点
#### is_Inside(x,y) 判断点是否在内部   
    @param {Number} x 点的x坐标   
    @param {Number} y 点的y坐标   
    @returns {Boolean} 返回 点是否在内部   
#### create_PolygonProxy()获取代理用的多边形    
    @returns {Polygon} 返回一个多边形
---
## Data_Arc
### 属性    
#### c           {Vector2}  圆心坐标
#### _r          {Number}   半径
#### _startAngle {Number}   开始的弧度
#### _endAngle   {Number}   结束的弧度
#### _opv        {Vector2}  只读属性 开始的弧度对应的坐标 (以圆心作为原点)
#### _edv        {Vector2}  只读属性 结束的弧度对应的坐标 (以圆心作为原点)
#### _angle      {Number}   只读属性 夹角弧度
#### _min        {Vector2}  只读属性 用一个矩形刚好包裹图形时 最接近{-Infinity,-Infinity}的点
#### _max        {Vector2}  只读属性 用一个矩形刚好包裹图形时 最远离{-Infinity,-Infinity}的点
### 方法
构造函数 Data_Arc(cx,cy,r,angle_A,angle_B)  
---
## Data_Sector
---
## Vector2
---
## Matrix2x2
---
## Matrix2x2T
---
## Polygon
---
