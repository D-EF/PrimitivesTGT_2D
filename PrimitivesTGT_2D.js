/*
 * @Author: Darth_Eternalfaith
 * @Date: 2022-03-14 23:34:06
 * @LastEditors: Darth_Eternalfaith
 * @LastEditTime: 2022-04-25 12:50:19
 * @FilePath: \def-web\js\visual\PrimitivesTGT_2D.js
 * 
 */
/*!
 *  图元 面向对象化的 库
 *  坐标系 大部分情况是 x 正方向向右, y 正方向向下的。
 *  默认渲染时的变换矩阵 是向量后乘矩阵再偏移, 如果需要修改, 自己派生
 */
import {
    OlFunction,
    Delegate,
    dependencyMapping,
} from "../basics/basics.js";
import {
    Math2D,
    Data_Rect,
    Data_Arc,
    Data_Sector,
    Vector2,
    Matrix2x2,
    Matrix2x2T,
    Polygon,
    BezierCurve,
    Path,
        }from "./Math2d.js";

/** @type {Number} 默认转换多边形的精度 用于圆弧或曲线转换 */
var def_accuracy=20;

/**材质抽象类 */
class Material{
    constructor(texture){
        /**@type {String|Sprites} */
        this.texture=texture;
        this.ID=Material.index++;
        this.name="Material"+this.Material_ID;
    }
    /** 获取2d材质
     * @virtual
     * @param {PrimitiveTGT} tgt 图元对象
     * @param {*} ctx 渲染上下文
     * @param {String} type 类型 (用于选择使用哪个 uv)
     */
    get(tgt,ctx,type){
        // 虚函数
    }
    static index=0;
}
/**渲染器抽象类 */
class Renderer_PrimitiveTGT{
    /** 
     * @param {PrimitiveTGT[]} tgtList 等待渲染的对象列表
     */
    constructor(tgtList){
        this.tgtList=tgtList instanceof  Array ? Array.from(tgtList):[];
        this.rendererIndex=Renderer_PrimitiveTGT.rendererIndex++;
        Renderer_PrimitiveTGT.rendererList.push(this);
    }
    /**@type {Number} 渲染器在列表中的下标 */
    static rendererIndex=0;
    /**@type {Renderer_PrimitiveTGT[]} 已有的渲染器列表 */
    static rendererList=[];
    /** 将渲染器从静态渲染器列表中移除
     * @param {Renderer_PrimitiveTGT} renderer 渲染器实例
     */
    static remove_in_RendererList(renderer){
        Renderer_PrimitiveTGT.rendererList.splice(
            Renderer_PrimitiveTGT.rendererList.indexOf(renderer),1
        )
    }
    /** 拷贝函数
     * @param {Renderer_PrimitiveTGT} tgt 
     * @returns 
     */
    static copy(tgt){
        var rtn = new Renderer_PrimitiveTGT(tgt.tgtList);
        return rtn;
    }
    /** 拷贝函数 */
    copy(){
        return this.constructor.copy(this);
    }
    /** 
     * @virtual
     * @param {PrimitiveTGT} tgt 
     */
    render(tgt){}
    render_All(){
        for(var i=0;i<this.tgtList.length;++i){
            this.render(this.tgtList[i]);
        }
    }
    /** 追加入待渲染对象
     * @param {PrimitiveTGT} tgt 待渲染对象
     */
    add(tgt){
        this.tgtList.push(tgt);
    }
}


/** 图元抽象类
 */
class PrimitiveTGT{
    constructor(){
        /**@type {Object} 对象名字 没啥用的属性*/
        this.name="PrimitiveTGT";
        /**
         * @virtual
         * @type {Object} 数据
         */
        this.data;
        /**@type {Boolean} 自动闭合路径 开关*/
        this.want_to_closePath=false;
        /**@type {Matrix2x2T} 局部坐标变换到世界坐标的矩阵*/
        this._transform_matrix=new Matrix2x2T();
        /**@type {Matrix2x2T} 世界坐标变换到局部坐标的矩阵*/
        this._worldToLocalM;
        /**@type {Boolean} 是否渲染*/
        this.visibility=true;
        /** @type {Vector2} 锚点 */
        this.origin=new Vector2();

        /**@type {Material} 填充 材质*/
        this.fill_material;
        /**@type {Vector2} 填充 贴图坐标 */
        this.fill_uv=new Vector2();
        /**@type {Vector2} 填充 贴图坐标宽高 */
        this.fill_uvwh=new Vector2(1,1);
        
        /**@type {Material} 描边 材质*/
        this.stroke_material;
        /**@type {Vector2} 描边 贴图坐标*/
        this.stroke_uv=new Vector2();
        /**@type {Vector2} 描边 贴图坐标宽高 */
        this.stroke_uvwh=new Vector2(1,1);
        /**@type {Number|null} 描边线宽度 默认由父级传递(null) */
        this.lineWidth=null;
        /**@type {String|null} 线末端类型 默认由父级传递(null) 可用值参考  https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/lineCap */
        this.lineCap=null;
        /**@type {String|null} 两线相交拐点的类型 默认由父级传递(null) 可用值参考 https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/lineJoin */
        this.lineJoin=null;
        /**@type {Number} 图形不透明度 */
        this.globalAlpha=1;
        /**@type {Number[]} 虚线间隔和长度*/
        this.lineDash=[0];
        /**@type {Number} 虚线起始偏移*/
        this.lineDashOffset=0;

        /** @type {String} tgt的 data的类型 用于将json实例化为 PrimitiveTGT*/
        this.dataType="Object";
    }
    /** 拷贝函数 注:json互相转化时,无法正常转换成json的类型 fillStyle strokeStyle 会丢失
     * @param {PrimitiveTGT} tgt
     * @return {PrimitiveTGT} 返回一个拷贝
     */
    static copy(tgt){
        var rtn;
        rtn                   = PrimitiveTGT.create_ByDataType[tgt.dataType](tgt.data);
        rtn.transform_matrix   = Matrix2x2T.copy(tgt._transform_matrix);
        rtn._worldToLocalM    = Matrix2x2T.copy(tgt._worldToLocalM);
        rtn.want_to_closePath = tgt.want_to_closePath;
        rtn.fill_material     = tgt.fill_material;
        rtn.stroke_material   = tgt.stroke_material;
        rtn.fill_uv           = Vector2.copy(tgt.fill_uv);
        rtn.fill_uvwh         = Vector2.copy(tgt.fill_uvwh);
        rtn.uv                = Vector2.copy(tgt.uv);
        rtn.uvwh              = Vector2.copy(tgt.uvwh);
        rtn.origin            = Vector2.copy(tgt.origin);
        return rtn;
    }
    /** 拷贝函数
     * @return {PrimitiveTGT} 返回一个拷贝
     */
    copy(){
        return PrimitiveTGT.copy(this);
    }
    /** 获取最小的(局部)坐标
     * @returns {Vector2} 返回一个向量
     */
    get_Min(){
        return this.data.get_Min();
    }
    /** 获取最大的(局部)坐标
     * @returns {Vector2} 返回一个向量
     */
    get_Max(){
        return this.data.get_Max();
    }
    /** 变换矩阵 不要直接修改矩阵的参数 
     * @param {Matrix2x2T} m 
     */
    set transform_matrix(m){
        this._transform_matrix=m.copy();
        this._worldToLocalM=undefined;
        return this._transform_matrix;
    }
    /**@type {Matrix2x2T} 变换矩阵 不要直接修改矩阵的参数 */
    get transform_matrix(){
        return this._transform_matrix;
    }
    /** 世界坐标变成局部坐标的矩阵 */
    get worldToLocalM(){
        this.refresh_WorldToLocalM();
        return this._worldToLocalM;
    }
    // 这是个有多个重载的函数 , 在class定义的外面实现
    /** 将局部坐标系变换到世界坐标系
     * @method localToWorld 拥有两个重载
     * @param {Number} x 重载1的参数 局部坐标x
     * @param {Number} y 重载1的参数 局部坐标y
     * @param {Vector2} v  重载2的参数 局部坐标向量
     * @returns {Vector2} 返回一个世界坐标系的向量
     */
    localToWorld (x,y){
        // 这是个有多个重载的函数 , 在class定义的外面实现
    }
    /** 将世界坐标系变换到局部坐标系
     * @method localToWorld 拥有两个重载
     * @param {Number} x 重载1的参数 世界坐标x
     * @param {Number} y 重载1的参数 世界坐标y
     * @param {Vector2} v  重载2的参数 世界坐标向量
     * @returns {Vector2} 返回一个局部坐标系的向量
     */
    worldToLocal (x,y){
        // 在class定义的外面, 实现重载
    }
    /** 刷新逆变换矩阵
     */
    refresh_WorldToLocalM(){
        if(this._worldToLocalM===undefined){
            this._worldToLocalM=this.transform_matrix.create_Inverse();
        }
    }
    /** 判断某一点是否在目标内部
     * @param {Number} _x    重载1的参数1 世界坐标x
     * @param {Number} _y    重载1的参数2 世界坐标y
     * @param {Vector2} _v   重载2的参数1 世界坐标向量
     * @returns {Boolean} 
    */
    is_Inside(_x,_y){
        // 2个重载
    }
    /** 转换成多边形
     * @param {Number} _accuracy 转换精度 用于圆弧或曲线转换
     * @returns {PrimitiveTGT__Polygon}
     */
    toPolygon(_accuracy=def_accuracy){
        var rtn = new PrimitiveTGT__Polygon(this.data.create_PolygonProxy(...arguments));
        rtn.fillStyle   =this.fillStyle;
        rtn.strokeStyle =this.strokeStyle;
        rtn.lineWidth   =this.lineWidth;
        rtn.transform_matrix=(this.transform_matrix);
        return rtn;
    }
    
    /** 生成世界坐标的多边形集合
     * @param {Boolean} f 是否作拷贝 默认 true, 为 false 时会影响 this
     * @param {Number} _accuracy 转换精度 用于圆弧或曲线转换
     * @returns {PrimitiveTGT__Polygon[]} 因为只有一个tgt所以是 length 为 1 的数组
     */
    create_WorldPolygons(f,_accuracy=def_accuracy){
        /** @type {PrimitiveTGT__Polygon} */
        var rtn;
        if((!f)&&(rtn instanceof PrimitiveTGT__Polygon)){
            rtn=this;
        }
        else{
            rtn=this.toPolygon(_accuracy);
        }

        rtn.nodesToWorld(true);
        return [rtn];
    }
    /** 碰撞检测 有多个重载, 在 PrimitivesTGT_Touch.js 实现
     * @param {PrimitiveTGT} primitive1 需要检测碰撞的对象
     * @param {PrimitiveTGT} primitive2 需要检测碰撞的对象
     */
    static isTouch(primitiveTGT1,primitiveTGT2){}
    /** 根据数据类型创建
     */
    static create_ByDataType={
        /** @param {Data_Arc} data 
         * @returns {PrimitiveTGT__Arc}
         */
        "Data_Arc":function(data){
            return new PrimitiveTGT__Arc(data.c.x,data.c.y,data._r,data._startAngle,data._endAngle);
        },
        /** @param {Data_Rect} data 
         * @returns {PrimitiveTGT__Rect}
         */
        "Data_Rect":function(data){
            return new PrimitiveTGT__Rect(data.x,data.y,data.w,data.h);
        },
        /** @param {Polygon} data 
         * @returns {PrimitiveTGT__Polygon}
         */
        "Polygon":function(data){
            return new PrimitiveTGT__Polygon(data);
        },
        "Group":function (data){
            var rtn=new PrimitiveTGT__Group();
            for(var i=data.length-1;i>=0;--i){
                rtn.data.push(PrimitiveTGT__Group.copy(tgt.data[i]));
            }
            return rtn;
        }
    }
}

/** 矩形
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} width 
 * @param {Number} height 
 */
class PrimitiveTGT__Rect extends PrimitiveTGT{
    constructor(x,y,w,h){
        super();
        /**@type {Data_Rect} */
        this.data=new Data_Rect(x,y,w,h);
        this.dataType="Data_Rect";
        /** 矩形一直是封闭图形 */
        this.want_to_closePath=true;
    }
}

/** 弧形
 * 需要注意旋转方向因为坐标系不同而有所变动
 */
class PrimitiveTGT__Arc extends PrimitiveTGT{
    /** @param {Number} cx 圆心的坐标
     * @param {Number} cy 圆心的坐标
     * @param {Number} r  半径
     * @param {Number} startAngle       起点的弧度
     * @param {Number} endAngle         终点的弧度
     */
    constructor(cx,cy,r,startAngle,endAngle){
        super();
        /**@type {Data_Arc} */
        this.data=new Data_Arc(cx,cy,r,startAngle,endAngle);
        this.dataType="Data_Arc";
    }
}

/** 扇形
 */
class PrimitiveTGT__Sector extends PrimitiveTGT{
    /** @param {Number} cx 圆心的坐标
     * @param {Number} cy 圆心的坐标
     * @param {Number} r  半径
     * @param {Number} startAngle       起点的弧度
     * @param {Number} endAngle         终点的弧度
     */
     constructor(cx,cy,r,startAngle,endAngle){
        super();
        /**@type {Data_Sector} */
        this.data=new Data_Sector(cx,cy,r,startAngle,endAngle);
        this.dataType="Data_Sector";
        /** 扇形一直是封闭图形 */
        this.want_to_closePath=true;
    }
}

/** 多边形
 */
class PrimitiveTGT__Polygon extends PrimitiveTGT{
    /** @param {Polygon} _polygon 多边形
     */
    constructor(_polygon){
        super();
        /** @type {Polygon}
         */
        this.data=Polygon.copy(_polygon);
        if(this.data)this.data.refresh_MinMax();
        this.dataType="Polygon"
    }

    /** 将局部坐标系的 nodes 转换到世界坐标系
     * @param {Boolean} clear_tfm_f 是否清理变换矩阵属性 默认清理(true)
     */
    nodesToWorld(clear_tfm_f=true){
        // this.data.linearMapping(this.transform_matrix,true)
        for(var i=this.data.nodes.length-1;i>=0;--i){
            this.data.nodes[i]=this.localToWorld(this.data.nodes[i]);
        }
        if(clear_tfm_f){
            this.transform_matrix=new Matrix2x2T();
        }
    }   
    
    getPolygonProxy(){
        return this.data.copy();
    }
}

class PrimitiveTGT__Path extends PrimitiveTGT{
    /**
     * @param {Path} path 
     */
    constructor(path){
        super();
        // if(path)
        /** @type {Path} */
        this.data=new Path(path);
        this.dataType="Path";
        this.want_to_closePath=false;
    }
}

/** PrimitiveTGT 组
 */
class PrimitiveTGT__Group extends PrimitiveTGT{
    /** 
     * @param {PrimitiveTGT[]} tgts 子节点数组
     */
    constructor(tgts){
        super()
        /**@type {PrimitiveTGT[]} 子节点集合*/
        this.data;
        if(tgts!==undefined){
            this.data=[].concat(tgts);
        }
        else{
            this.data=[]
        }
        this.name="group";
        this.dataType="Group";
        /** 用于控制绘制 精灵图 贴图的 属性 */
        this.sp_min=new Vector2(0,0);
        /** 用于控制绘制 精灵图 贴图的 属性 */
        this.sp_max=new Vector2(100,100);
    }
    /** 获取最小的(局部)坐标
     * @returns {Vector2} 返回一个向量
     */
     get_Min(){
        return this.min;
    }
    /** 获取最大的(局部)坐标
     * @returns {Vector2} 返回一个向量
     */
    get_Max(){
        return this.max;
    }
    insert(index,tgt){
        this.data.splice(index,0,tgt);
    }
    /** 添加子项
     * @param {PrimitiveTGT} tgt Primitive对象
     * @returns {Numer} 返回长度
     */
    add_Children(tgt){
        return this.data.push(tgt);
    }
    /** 添加子项
     * @param {PrimitiveTGT[]} tgt Primitive对象
     */
    add_Childrens(tgts){
        this.data=this.data.concat(tgts);
    }
    /** 使用路径增加一个后代元素
     * @param {Number[]} path 下标形式的路径 倒数第二项应为 group
     */
    remove_DescendantByPath(path,tgt){
        var pg=this.get_ParentByPath(path);
        pg.insert(path[path.length-1],tgt);
    }
    /** 移除一个子项
     * @param {Number} index 下标
     */
    remove_ChildrenByIndex(index){
        this.data.splice(index,1);
    }
    /** 使用路径移除一个后代元素
     * @param {Number[]} path 下标形式的路径 倒数第二项应为 group
     */
    remove_DescendantByPath(path){
        this.get_ParentByPath(path).remove_ChildrenByIndex(path[path.length-1]);
    }
    /** 移除一个子项
     * @param {PrimitiveTGT} tgt 必须是同一个子项
     */
    remove_Children(tgt){
        this.data.splice(this.data.indexOf(tgt),1);
    }
    /** 获取点在某子项内部
     * @param {Number} _x    重载1的参数 世界坐标x
     * @param {Number} _y    重载1的参数 世界坐标y
     * @param {Vector2} _v   重载2的参数 世界坐标向量
     * @returns {Number} 返回下标
    */
    inside_i(_x,_y){
        var x,y;
        if(_x.x!==undefined){
            x=_x.x;
            y=_x.y
        }else{
            x=_x;
            y=_y;
        }
        var v=this.worldToLocal(x,y);
        for(var i=this.data.length-1;i>=0;--i){
            if(this.data[i].is_Inside(v)){
                console.log(i)
                return i;
            }
        }
        return -1;
    }
    
    /** 获取点是否在子项内部
     * @param {Number} _x    重载1的参数 世界坐标x
     * @param {Number} _y    重载1的参数 世界坐标y
     * @param {Vector2} _v   重载2的参数 世界坐标向量
     * @returns {Boolean} 返回是否在子项内
     */
    is_Inside(_x,_y){
        return this.inside_i(_x,_y)!==-1;
    }
    /** 生成世界坐标的多边形集合
     * @param {Boolean} f 组的该方法中的是无用的属性
     * @param {Number} _accuracy 转换精度 用于圆弧或曲线转换
     * @returns {PrimitiveTGT__Polygon[]}
     */
    create_WorldPolygons(f,_accuracy=def_accuracy){
        /**@type {PrimitiveTGT__Polygon[]}  */
        var rtn=[];
        var i = this.data.length-1;
        for(;i>=0;--i){
            rtn=rtn.concat(this.data[i].create_WorldPolygons(true,_accuracy));
        }
        console.log('rtn :>> ', rtn);
        for(i=rtn.length-1;i>=0;--i){
            rtn[i].transform_matrix=this.transform_matrix;
            rtn[i].nodesToWorld();
        }
        return rtn;
    }
    /** 获取后代的tgt对象
     * @param {Number[]} path 
     */
    get_DescendantByPath(path){
        var i=0,
            rtn=this;
        while(path[i]!==undefined&&path[i]>=0){
            rtn=rtn.data[path[i]];
            ++i;
        }
        return rtn;
    }
    
    /** 获取后代的tgt对象的父级
     * @param {Number[]} path 
     */
    get_ParentByPath(path){
        var i=0,
            rtn=this;
        if(path)
        while(path[i+1]!==undefined&&path[i+1]>=0){
            rtn=rtn.data[path[i]];
            ++i;
        }
        return rtn;
    }
    /** 计算获取后代的局部坐标系相对世界坐标系的变换矩阵
     * @param {Number[]} path 以下标形式的路径
     * @param {Matrix2x2T} [m] 初始化矩阵 返回值将先使用这个矩阵然后再乘
     * @return {Matrix2x2T} 返回一个新的矩阵
     */
    get_DescendantTransformMatrix(path){
        var rtn=Matrix2x2T.copy(this.transform_matrix);
        var i=0,
            temp=this;
        while(path[i]!==undefined&&path[i]>=0){
            temp=temp.data[path[i]];
            rtn.multiplication(temp.transform_matrix);
            ++i;
        }
        return rtn;
    }
    /** 计算获取后代的世界坐标系相对局部坐标系的变换矩阵
     * @param {Number[]} path 以下标形式的路径
     * @return {Matrix2x2T} 返回一个新的矩阵
     */
    get_DescendantTransformMatrix__I(path){
        return this.get_DescendantTransformMatrix(path).create_Inverse();
    }
    
    /** 使用路径加入新后代
     * @param {Number[]} path 路径, 如果最后指向 group 将会 addend 到当前group,否则会插入到当前位置后
     * @param {PrimitiveTGT} tgt
     * @return {Number[]} 返回指向新加入的对象的path
     */
    add_ByPath(path,tgt){
        var i=0,j;
        var a,b;
        b=this;
        var newpath=Array.from(path);
        j=path[i];
        while(b.data[j]){
            a=b;
            b=b.data[j];
            ++i;
            j=path[i];
        }
        if(i<path.length){
            throw new Error ("Can not find this path!");
        }
        if(b.dataType==="Group"){
            newpath[i]=b.add_Children(tgt)-1;
        }else{
            --i;
            newpath[i]=newpath[i]+1;
            
            a.insert(newpath[i],tgt);
        }
        return newpath;
    }
    /** 使用路径插入后代
     * @param {Number[]} path 新加入的对象的路径
     * @param {PrimitiveTGT} tgt 新对象
     * @return {Number[]} 返回指向新加入的对象的path
     */
    insert_ByPath(path,tgt){
        var i=0,j;
        var a,b;
        a=b=this;
        var newpath=Array.from(path);
        j=path[i];
        while(a.data[j]){
            a=b;
            b=b.data[j];
            ++i;
            j=path[i];
        }
        if(i<path.length){
            throw new Error ("Can not find this path!");
        }
        --i;
        a.insert(newpath[i],tgt);
        if(a.data[newpath[i]]){
            newpath[i]=a.data.length-1;
        }
        console.log(i);
        return newpath;

    }
    /** 世界坐标to后代的局部坐标, 没用缓存
     * @param {Number[]} path   路径
     * @param {Vector2} v       世界坐标系的点
     */
    worldToDescendant(path,v){
        var m=this.get_DescendantTransformMatrix__I(path);
        return Vector2.linearMapping__BeforeTranslate(v,m);
    }
    descendantToWorld(path,v){
        var m=this.get_DescendantTransformMatrix(path);
        return Vector2.linearMapping__AfterTranslate(v,m);
    }
}

// PrimitiveTGT 函数重载 ----------------------------------------------------------------------------------------------------------------------------------

function _PrimitiveTGT__Is_Inside(_x,_y){

    var v=this.worldToLocal(_x,_y);
    return this.data.is_Inside(v.x,v.y,this.want_to_closePath);
}
PrimitiveTGT.prototype.is_Inside=OlFunction.create();
PrimitiveTGT.prototype.is_Inside.addOverload([Number,Number],_PrimitiveTGT__Is_Inside);
PrimitiveTGT.prototype.is_Inside.addOverload([Vector2],function(_v){
    return _PrimitiveTGT__Is_Inside.call(this,_v.x,_v.y)
});

// 局部坐标 to 世界坐标
function _localToWorld__PrimitiveTGT(v){
    return Vector2.linearMapping__AfterTranslate(v,this.transform_matrix,this.origin);
}
PrimitiveTGT.prototype.localToWorld=OlFunction.create();
PrimitiveTGT.prototype.localToWorld.addOverload([Number,Number],function (x,y){
    return _localToWorld__PrimitiveTGT.call(this,new Vector2(x,y));
});
PrimitiveTGT.prototype.localToWorld.addOverload([Vector2],_localToWorld__PrimitiveTGT);

// 世界坐标 to 局部坐标
function _worldToLocal__PrimitiveTGT(v){
    var tm=this.worldToLocalM;
    return Vector2.linearMapping__BeforeTranslate(v,tm,this.origin);
}
PrimitiveTGT.prototype.worldToLocal=OlFunction.create();
PrimitiveTGT.prototype.worldToLocal.addOverload([Number,Number],function (x,y){
    return _worldToLocal__PrimitiveTGT.call(this,new Vector2(x,y));
});
PrimitiveTGT.prototype.worldToLocal.addOverload([Vector2],_worldToLocal__PrimitiveTGT);


export{
    Material,
    Renderer_PrimitiveTGT,
    PrimitiveTGT,
    PrimitiveTGT__Rect,
    PrimitiveTGT__Arc,
    PrimitiveTGT__Sector,
    PrimitiveTGT__Polygon,
    PrimitiveTGT__Group,
    PrimitiveTGT__Path,
};