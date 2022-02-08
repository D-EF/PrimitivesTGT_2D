/*!
 *  图元 面向对象化的 库
 *  坐标系 大部分情况是 x 正方向向右, y 正方向向下的。
 *  默认渲染时的变换矩阵 是向量后乘矩阵再偏移, 如果需要修改, 自己派生
 */
import {
    OlFunction,
    Delegate
} from "../basics/basics.js";
import {
    Math2D,
    Rect_Data,
    Arc_Data,
    Sector_Data,
    Vector2,
    Matrix2x2,
    Matrix2x2T,
    Polygon,
    Bezier_Node,
    Bezier_Polygon,
    BezierCurve,
        }from "./Math2d.js";

/** @type {Number} 默认转换多边形的精度 用于圆弧或曲线转换 */
var def_accuracy=20;

/**材质抽象类 */
class Material{
    constructor(texture){
        /**@type {Sprites} */
        this.texture=texture;
    }
    /**
     * 获取2d材质
     * @param {PrimitiveTGT} tgt 图元对象
     * @param {*} ctx 渲染上下文
     * @param {String} type 类型 (用于选择使用哪个 uv)
     */
    get(tgt,ctx,type){
        // 虚函数
    }
}
/**渲染器抽象类 */
class PrimitiveTGT_Renderer{
    /**
     * @param {PrimitiveTGT[]} tgtList 等待渲染的对象列表
     */
    constructor(tgtList){
        this.tgtList=tgtList.concat();
        this.rendererIndex=PrimitiveTGT_Renderer.rendererIndex++;
        PrimitiveTGT_Renderer.rendererList.push(this);
    }
    /**@type {Number} 渲染器在列表中的下标 */
    static rendererIndex=0;
    /**@type {PrimitiveTGT_Renderer[]} 已有的渲染器列表 */
    static rendererList=[];
    /**
     * 将渲染器从静态渲染器列表中移除
     * @param {PrimitiveTGT_Renderer} renderer 渲染器实例
     */
    static remove_in_rendererList(renderer){
        PrimitiveTGT_Renderer.rendererList.splice(
            PrimitiveTGT_Renderer.rendererList.indexOf(renderer),1
        )
    }
    /**
     * 拷贝函数
     * @param {PrimitiveTGT_Renderer} tgt 
     * @returns 
     */
    static copy(tgt){
        var rtn = new PrimitiveTGT_Renderer(tgt.tgtList);
        return rtn;
    }
    /** 拷贝函数 */
    copy(){
        return this.constructor.copy(this);
    }
    /**
     * @param {PrimitiveTGT} tgt 
     */
    render(tgt){}
    render_all(){
        for(var i=0;i<this.tgtList.length;++i){
            this.render(this.tgtList[i]);
        }
    }
}


/**
 * 图元抽象类
 */
class PrimitiveTGT{
    constructor(){
        /**@type {Object} 数据*/
        this.data;
        /**@type {Boolean} 自动闭合路径 开关*/
        this.want_to_closePath=false;
        /**@type {Matrix2x2T} 局部坐标变换到世界坐标的矩阵*/
        this._transformMatrix=new Matrix2x2T();
        /**@type {Matrix2x2T} 世界坐标变换到局部坐标的矩阵*/
        this._worldToLocalM;

        /**@type {Material} 填充 材质*/
        this.fill_Material;
        /**@type {Vector2} 填充 贴图坐标 */
        this.fill_uv=new Vector2();
        /**@type {Vector2} 填充 贴图坐标宽高 */
        this.fill_uvwh=new Vector2(1,1);
        
        /**@type {Material} 描边 材质*/
        this.stroke_Material;
        /**@type {Vector2} 描边 贴图坐标*/
        this.stroke_uv=new Vector2();
        /**@type {Vector2} 描边 贴图坐标宽高 */
        this.stroke_uvwh=new Vector2(1,1);
        /**@type {Number} 描边线宽度 */
        this.lineWidth=1;
        /**@type {Number} 图形不透明度 */
        this.globalAlpha=1;
        /**@type {Number[]} 虚线间隔和长度*/
        this.lineDash=[0];
        /**@type {Number} 虚线起始偏移*/
        this.lineDashOffset=0;

        /**
         * tgt的 data的类型 用于将json实例化为 PrimitiveTGT
         * @type {String}
         */
        this.dataType="Object";
    }
    /**
     * 拷贝函数 注:json互相转化时,无法正常转换成json的类型 fillStyle strokeStyle 会丢失
     * @param {PrimitiveTGT} tgt
     * @return {PrimitiveTGT} 返回一个拷贝
     */
    static copy(tgt){
        var rtn;
        rtn                   = PrimitiveTGT.create_ByDataType[tgt.dataType](tgt.data);
        rtn.transformMatrix   = Matrix2x2T.copy(tgt._transformMatrix);
        rtn._worldToLocalM    = Matrix2x2T.copy(tgt._worldToLocalM);
        rtn.want_to_closePath = tgt.want_to_closePath;
        rtn.fill_Material     = this.fill_Material;
        rtn.stroke_Material   = this.stroke_Material;
        rtn.fill_uv           = Vector2.copy(this.fill_uv);
        rtn.fill_uvwh         = Vector2.copy(this.fill_uvwh);
        rtn.uv                = Vector2.copy(this.uv);
        rtn.uvwh              = Vector2.copy(this.uvwh);
        return rtn;
    }
    /**
     * 拷贝函数
     * @return {PrimitiveTGT} 返回一个拷贝
     */
    copy(){
        return PrimitiveTGT.copy(this);
    }
    /** 
     * 获取最小的(局部)坐标
     * @returns {Vector2} 返回一个向量
     */
    getMin(){
        return this.data.getMin();
    }
    /** 
     * 获取最大的(局部)坐标
     * @returns {Vector2} 返回一个向量
     */
    getMax(){
        return this.data.getMax();
    }
    /** 变换矩阵 不要直接修改矩阵的参数 
     * @param {Matrix2x2T} m 
     */
    set transformMatrix(m){
        this._transformMatrix=m.copy();
        this._worldToLocalM=undefined;
        return this._transformMatrix;
    }
    /**@type {Matrix2x2T} 变换矩阵 不要直接修改矩阵的参数 */
    get transformMatrix(){
        return this._transformMatrix;
    }
    /** 世界坐标变成局部坐标的矩阵 */
    get worldToLocalM(){
        this.re_worldToLocalM();
        return this._worldToLocalM;
    }
    // 这是个有多个重载的函数 , 在class定义的外面实现
    /**
     * 将局部坐标系变换到世界坐标系
     * @method localToWorld 拥有两个重载
     * @param {Number} x 重载1的参数 局部坐标x
     * @param {Number} y 重载1的参数 局部坐标y
     * @param {Vector2} v  重载2的参数 局部坐标向量
     * @returns {Vector2} 返回一个世界坐标系的向量
     */
    localToWorld (x,y){
        // 这是个有多个重载的函数 , 在class定义的外面实现
    }
    /**
     * 将世界坐标系变换到局部坐标系
     * @method localToWorld 拥有两个重载
     * @param {Number} x 重载1的参数 世界坐标x
     * @param {Number} y 重载1的参数 世界坐标y
     * @param {Vector2} v  重载2的参数 世界坐标向量
     * @returns {Vector2} 返回一个局部坐标系的向量
     */
    worldToLocal (x,y){
        // 在class定义的外面, 实现重载
    }
    /**
     * 刷新逆变换矩阵
     */
    re_worldToLocalM(){
        if(this._worldToLocalM===undefined){
            this._worldToLocalM=this.transformMatrix.inverse();
        }
    }
    /** 
     * 判断某一点是否在目标内部
     * @param {Number} _x    重载1的参数 世界坐标x
     * @param {Number} _y    重载1的参数 世界坐标y
     * @param {Vector2} _v   重载2的参数 世界坐标向量
     * @returns {Boolean} 
    */
    isInside(_x,_y){
        // 2个重载
    }
    /** 转换成多边形
     * @param {Number} _accuracy 转换精度 用于圆弧或曲线转换
     * @returns {PrimitivePolygonTGT}
     */
    toPolygon(_accuracy=def_accuracy){
        var rtn = new PrimitivePolygonTGT(this.data.createPolygonProxy(...arguments));
        rtn.fillStyle   =this.fillStyle;
        rtn.strokeStyle =this.strokeStyle;
        rtn.lineWidth   =this.lineWidth;
        rtn.transformMatrix=(this.transformMatrix);
        return rtn;
    }
    
    /**
     * 生成世界坐标的多边形集合
     * @param {Boolean} f 是否作拷贝 默认 true, 为 false 时会影响 this
     * @param {Number} _accuracy 转换精度 用于圆弧或曲线转换
     * @returns {PrimitivePolygonTGT[]} 因为只有一个tgt所以是 length 为 1 的数组
     */
    create_worldPolygons(f,_accuracy=def_accuracy){
        /** @type {PrimitivePolygonTGT} */
        var rtn;
        if((!f)&&(rtn instanceof PrimitivePolygonTGT)){
            rtn=this;
        }
        else{
            rtn=this.toPolygon(_accuracy);
        }

        rtn.nodesToWorld(true);
        return [rtn];
    }
    /**
     * 碰撞检测 有多个重载, 在class外面实现
     * @param {PrimitiveTGT} primitiveTGT1 需要检测碰撞的对象
     * @param {PrimitiveTGT} primitiveTGT2 需要检测碰撞的对象
     */
    static isTouch(primitiveTGT1,primitiveTGT2){}
    /** 
     * 根据数据类型创建
     */
    static create_ByDataType={
        /**
         * @param {Arc_Data} data 
         * @returns {PrimitiveArcTGT}
         */
        "Arc_Data":function(data){
            return new PrimitiveArcTGT(data.c.x,data.c.y,data._r,data._startAngle,data._endAngle);
        },
        /**
         * @param {Rect_Data} data 
         * @returns {PrimitiveRectTGT}
         */
        "Rect_Data":function(data){
            return new PrimitiveRectTGT(data.x,data.y,data.w,data.h);
        },
        /**
         * @param {Polygon} data 
         * @returns {PrimitivePolygonTGT}
         */
        "Polygon":function(data){
            return new PrimitivePolygonTGT(data);
        },
        "Bezier_Polygon":function(data){
            return new PrimitiveBezierTGT(data);
        },
        "Group":function (data){
            var rtn=new PrimitiveTGT_Group();
            for(var i=tgt.data.length-1;i>=0;--i){
                rtn.data.push(PrimitiveTGT_Group.copy(tgt.data[i]));
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
class PrimitiveRectTGT extends PrimitiveTGT{
    constructor(x,y,w,h){
        super();
        /**@type {Rect_Data} */
        this.data=new Rect_Data(x,y,w,h);
        this.dataType="Rect_Data";
        /** 矩形一直是封闭图形 */
        this.want_to_closePath=true;
    }
}

/**
 * 弧形
 * 需要注意旋转方向因为坐标系不同而有所变动
 */
class PrimitiveArcTGT extends PrimitiveTGT{
    /**
     * @param {Number} cx 圆心的坐标
     * @param {Number} cy 圆心的坐标
     * @param {Number} r  半径
     * @param {Number} startAngle       起点的弧度
     * @param {Number} endAngle         终点的弧度
     */
    constructor(cx,cy,r,startAngle,endAngle){
        super();
        /**@type {Arc_Data} */
        this.data=new Arc_Data(cx,cy,r,startAngle,endAngle);
        this.dataType="Arc_Data";
    }
}
/**
 * 扇形
 */
class PrimitiveSectorTGT extends PrimitiveTGT{
    /**
     * @param {Number} cx 圆心的坐标
     * @param {Number} cy 圆心的坐标
     * @param {Number} r  半径
     * @param {Number} startAngle       起点的弧度
     * @param {Number} endAngle         终点的弧度
     */
     constructor(cx,cy,r,startAngle,endAngle){
        super();
        /**@type {Sector_Data} */
        this.data=new Sector_Data(cx,cy,r,startAngle,endAngle);
        this.dataType="Sector_Data";
        /** 扇形一直是封闭图形 */
        this.want_to_closePath=true;
    }
}

/** 
 * 多边形
 */
class PrimitivePolygonTGT extends PrimitiveTGT{
    /**
     * @param {Polygon} _polygon 多边形
     */
    constructor(_polygon){
        super();
        /**
         * @type {Polygon}
         */
        this.data=Polygon.copy(_polygon);
        if(this.data)this.data.reMinMax();
        this.dataType="Polygon"
    }

    /**
     * 将局部坐标系的 nodes 转换到世界坐标系
     * @param {Boolean} clear_tfm_f 是否清理变换矩阵属性 默认清理(true)
     */
    nodesToWorld(clear_tfm_f=true){
        // this.data.linearMapping(this.transformMatrix,true)
        for(var i=this.data.nodes.length-1;i>=0;--i){
            this.data.nodes[i]=this.localToWorld(this.data.nodes[i]);
        }
        if(clear_tfm_f){
            this.transformMatrix=new Matrix2x2T();
        }
    }   
    
    getPolygonProxy(){
        return this.data.copy();
    }
}


// todo BezierTGT
/**
 * 贝塞尔曲线多边形
 */
class PrimitiveBezierTGT extends PrimitiveTGT{
    /**
     * @param {Bezier_Polygon} bezier_polygon 
     */
    constructor(bezier_polygon){
        super();
        if(bezier_polygon)
        /**@type {Bezier_Polygon} */
        this.data=Bezier_Polygon.copy(bezier_polygon);
        this.dataType="Bezier_Polygon";
        this._want_to_closePath=false;
        /**@type {Bezier_Polygon} */
        this._world_bezier=null;
    }
    set transformMatrix(m){
        super.transformMatrix=m;
        this._world_bezier=null;
    }
    get transformMatrix(){
        return this._transformMatrix;
    }
    get want_to_closePath(){
        return this._want_to_closePath;
    }
    set want_to_closePath(val){
        this._want_to_closePath=val;
        if(this.data)this.data.closedFlag=val;
    }
    set data(val){
        this._data=val;
        this.data.closedFlag=this._want_to_closePath;
        this.data.unins_bezierCurve_Delegate.addAct(this,   this.in_data_nodeChange);
        this.data.emptied_bezierCurve_Delegate.addAct(this, this.in_data_nodesChange);
        this._world_bezier=null;
    }
    /**@type {Bezier_Polygon} */
    get data(){
        return this._data;
    }
    get world_bezier(){
        if(!this._world_bezier)this.reload_worldBezier();
        return this._world_bezier;
    }
    /**
     * data顶点修改时的回调委托
     * @param {Number} i 被修改的点的下标
     */
    in_data_nodeChange(i){
        if(this._world_bezier)
        this.world_bezier.setNode(i,this.calc_worldNode(i));
    }
    /**
     * data顶点被增加或删除的回调委托
     * @param {Number} i 被修改的点的下标
     * @param {Boolean} f 插入或删除
     */
    in_data_nodesChange(i,f){
        if(this._world_bezier)
        if(f){
            this.world_bezier.insert(i,this.calc_worldNode(i));
        }
        else{
            this.world_bezier.remove(i);
        }
    }
    /**
     * 重新加载世界坐标系的所有节点 在变换矩阵或data被修改后使用
     * @returns {Bezier_Polygon}
     */
    reload_worldBezier(){
        return this._world_bezier=Bezier_Polygon.linearMapping(this.data,this.transformMatrix);
    }
    /**
     * 获取世界坐标的节点
     * @param {Number} i 节点下标
     * @returns 世界坐标的节点
     */
    get_worldNode(i){
        return this.world_bezier.nodes[i];
    }
    /**
     * 获取世界坐标下的节点的数学曲线对象
     * @param {Number} i 前驱节点下标
     * @return {BezierCurve}
     */
    get_worldBezierCurve(i){
        return this.world_bezier.get_bezierCurve(i);
    }
    /**
     * 计算世界坐标的节点
     * @param {Number} i 节点下标
     * @returns 世界坐标的节点
     */
    calc_worldNode(i){
        return new Bezier_Node(
            this.localToWorld(this.data.nodes[i].node),
            this.localToWorld(this.data.nodes[i].hand_before),
            this.localToWorld(this.data.nodes[i].hand_after)
        );
    }
    /**
    * 将局部坐标系的 nodes 转换到世界坐标系
    * @param {Boolean} clear_tfm_f 是否清理变换矩阵属性 默认清理(true)
    */
    nodesToWorld(clear_tfm_f=true){
        // this.data.linearMapping(this.transformMatrix,true)
        for(var i=this.data.nodes.length-1;i>=0;--i){
            this.data.nodes[i].node=this.localToWorld(this.data.nodes[i].node);
            this.data.nodes[i].hand_before=this.localToWorld(this.data.nodes[i].hand_before);
            this.data.nodes[i].hand_after=this.localToWorld(this.data.nodes[i].hand_after);
        }
        if(clear_tfm_f){
            this.transformMatrix=new Matrix2x2T();
        }
    }
}

/**
 * PrimitiveTGT 组
 */
 class PrimitiveTGT_Group extends PrimitiveTGT{
    /**
     * 
     * @param {PrimitiveTGT[],PrimitiveTGT_Group[]} tgts 
     */
    constructor(tgts){
        super()
        /**@type {PrimitiveTGT[],PrimitiveTGT_Group[]} */
        this.data;
        if(tgts!==undefined){
            this.data=[].concat(tgts);
        }
        else{
            this.data=[]
        }
        this.dataType="Group";
        /** 用于控制绘制 精灵图 贴图的 属性 */
        this.sp_min=new Vector2(0,0);
        /** 用于控制绘制 精灵图 贴图的 属性 */
        this.sp_max=new Vector2(100,100);
    }
    /** 
     * 获取最小的(局部)坐标
     * @returns {Vector2} 返回一个向量
     */
     getMin(){
        return this.min;
    }
    /** 
     * 获取最大的(局部)坐标
     * @returns {Vector2} 返回一个向量
     */
    getMax(){
        return this.max;
    }
    /**
     * 添加子项
     * @param {PrimitiveTGT} tgt PrimitiveTGT对象
     */
    addChildren(tgt){
        this.data.push(tgt);
    }
    /**
     * 添加子项
     * @param {PrimitiveTGT[]} tgt PrimitiveTGT对象
     */
    addChildrens(tgts){
        this.data=this.data.concat(tgts);
    }
    /**
     * 移除一个子项
     * @param {Number} index 下标
     */
    removeChildrenByIndex(index){
        this.data.splice(index,1);
    }
    /**
     * 移除一个子项
     * @param {PrimitiveTGT} tgt 必须是同一个子项
     */
    removeChildren(tgt){
        this.data.splice(this.data.indexOf,1);
    }
    /** 
     * 获取点在某子项内部
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
            if(this.data[i].isInside(v)){
                console.log(i)
                return i;
            }
        }
        return -1;
    }
    
    /** 
     * 获取点是否在子项内部
     * @param {Number} _x    重载1的参数 世界坐标x
     * @param {Number} _y    重载1的参数 世界坐标y
     * @param {Vector2} _v   重载2的参数 世界坐标向量
     * @returns {Boolean} 返回是否在子项内
     */
    isInside(_x,_y){
        return this.inside_i(_x,_y)!==-1;
    }
    /**
     * 生成世界坐标的多边形集合
     * @param {Boolean} f 组的该方法中的是无用的属性
     * @param {Number} _accuracy 转换精度 用于圆弧或曲线转换
     * @returns {PrimitivePolygonTGT[]}
     */
    create_worldPolygons(f,_accuracy=def_accuracy){
        /**@type {PrimitivePolygonTGT[]}  */
        var rtn=[];
        var i = this.data.length-1;
        for(;i>=0;--i){
            rtn=rtn.concat(this.data[i].create_worldPolygons(true,_accuracy));
        }
        console.log('rtn :>> ', rtn);
        for(i=rtn.length-1;i>=0;--i){
            rtn[i].transformMatrix=this.transformMatrix;
            rtn[i].nodesToWorld();
        }
        return rtn;
    }
}

// PrimitiveTGT 函数重载 ----------------------------------------------------------------------------------------------------------------------------------

function _PrimitiveTGT_isInside(_x,_y){
    var v=this.worldToLocal(_x,_y);
    return this.data.isInside(v.x,v.y,this.want_to_closePath);
}
PrimitiveTGT.prototype.isInside=OlFunction.create();
PrimitiveTGT.prototype.isInside.addOverload([Number,Number],_PrimitiveTGT_isInside);
PrimitiveTGT.prototype.isInside.addOverload([Vector2],function(_v){
    return _PrimitiveTGT_isInside.call(this,_v.x,_v.y)
});

// 局部坐标 to 世界坐标
function _PrimitiveTGT_localToWorld(v){
    return Vector2.afterTranslate_linearMapping(v,this.transformMatrix);
}
PrimitiveTGT.prototype.localToWorld=OlFunction.create();
PrimitiveTGT.prototype.localToWorld.addOverload([Number,Number],function (x,y){
    return _PrimitiveTGT_localToWorld.call(this,new Vector2(x,y));
});
PrimitiveTGT.prototype.localToWorld.addOverload([Vector2],_PrimitiveTGT_localToWorld);

// 世界坐标 to 局部坐标
function _PrimitiveTGT_worldToLocal(v){
    var tm=this.worldToLocalM;
    return Vector2.beforeTranslate_linearMapping(v,tm);
}
PrimitiveTGT.prototype.worldToLocal=OlFunction.create();
PrimitiveTGT.prototype.worldToLocal.addOverload([Number,Number],function (x,y){
    return _PrimitiveTGT_worldToLocal.call(this,new Vector2(x,y));
});
PrimitiveTGT.prototype.worldToLocal.addOverload([Vector2],_PrimitiveTGT_worldToLocal
);
//碰撞检测函数 ----------------------------------------------------------------------------------------------------------------------------------

/** @type {Number} 默认精度 用于弧形转换成多边形 */
PrimitiveTGT.accuracy=20;
PrimitiveTGT.isTouch=OlFunction.create(isTouch_base);

/**
 * 可以通用的碰撞检测函数 将对象转换成多边形 开销较大
 * @param {PrimitiveTGT} primitiveTGT1
 * @param {PrimitiveTGT} primitiveTGT2
 */
function isTouch_base(primitiveTGT1,primitiveTGT2){
    var tgt1 = primitiveTGT1.toPolygon(PrimitiveTGT.accuracy,primitiveTGT1.want_to_closePath);
    var tgt2 = primitiveTGT2.toPolygon(PrimitiveTGT.accuracy,primitiveTGT2.want_to_closePath);
    var i;
    for(i=tgt1.data.nodes.length-1;i>=0;--i){
        tgt1.data.nodes[i]=tgt1.localToWorld(tgt1.data.nodes[i]);
    }
    for(i=tgt2.data.nodes.length-1;i>=0;--i){
        tgt2.data.nodes[i]=tgt2.localToWorld(tgt2.data.nodes[i]);
    }
    tgt1.data.reMinMax();
    tgt2.data.reMinMax();
    
    if(Polygon.getImpactFlag(tgt1.data,tgt2.data)){
        return true;                                         
    }
    return primitiveTGT1.isInside(primitiveTGT2.localToWorld(primitiveTGT2.data.nodes[0]))||primitiveTGT2.isInside(primitiveTGT1.localToWorld(primitiveTGT1.data.nodes[0]));
}

/**
 * 碰撞检测函数 矩形 弧形(圆形)
 * @param {PrimitiveRectTGT} tgt1 进行碰撞检测的对象
 * @param {PrimitiveArcTGT}  tgt2 进行碰撞检测的对象
 */
function isTouch_Rect_Arc(tgt1,tgt2){
    var t1=tgt1.toPolygon();
    return isTouch_Arc_Polygon(tgt2,t1);
}
PrimitiveTGT.isTouch.addOverload([PrimitiveRectTGT,PrimitiveArcTGT],isTouch_Rect_Arc);
PrimitiveTGT.isTouch.addOverload([PrimitiveArcTGT,PrimitiveRectTGT],function(tgt1,tgt2){
    return isTouch_Rect_Arc(tgt2,tgt1)
});

/**
 * 碰撞检测函数 矩形 多边形
 * @param {PrimitiveRectTGT} tgt1
 * @param {PrimitivePolygonTGT} tgt2
 */
function isTouch_Rect_Polygon(tgt1,tgt2){
    
    var t2d=Polygon.linearMapping(tgt2.data,tgt2.transformMatrix,false);
        nodes=t2d.nodes;

    var i =nodes.length-1;
    for(;i>=0;--i){
        if(tgt1.isInside(nodes[i].x,nodes[i].y)){
            return true;
        }
    }
    if(tgt2.want_to_closePath||t2d.isClosed()){
        var min=tgt1.localToWorld(tgt1.getMin());
            max=tgt1.localToWorld(tgt1.getMax());
        return tgt2.isInside(min.x,min.y)||
            tgt2.isInside(max.x,max.y)||
            tgt2.isInside(max.x,min.y)||
            tgt2.isInside(min.x,max.y);
    }
    else{
        return false;
    }
}
PrimitiveTGT.isTouch.addOverload([PrimitiveRectTGT,PrimitivePolygonTGT],isTouch_Rect_Polygon);
PrimitiveTGT.isTouch.addOverload([PrimitivePolygonTGT,PrimitiveRectTGT],function(tgt1,tgt2){
    return isTouch_Rect_Polygon(tgt2,tgt1);
});

/**
 * 碰撞检测函数 弧形(圆形) 多边形
 * @param {PrimitiveArcTGT} tgt1
 * @param {PrimitivePolygonTGT} tgt2
 */
 function isTouch_Arc_Polygon(tgt1,tgt2){
    var i =tgt2.data.nodes.length-1,
        l=i;
    if(l<0)return false;
    console.log(1)
    var t2d1=Polygon.linearMapping(tgt2.data,tgt2.transformMatrix,false);
    var t2d=Polygon.linearMapping(t2d1,tgt1.worldToLocalM,true);
        nodes=t2d.nodes;

    for(;i>0;--i){
        if(Math2D.arc_i_line(tgt1.data,nodes[i],nodes[i-1])){
            return true;
        }
    }
    var opv,edv;
    if(tgt1.want_to_closePath){
        // 割圆 的线段也要判断
        opv=Vector2.add(tgt1.data.opv,tgt1.data.c);
        edv=tgt1.data.edv.add(tgt1.data.c);
        for(i=l;i>0;--i){
            if(Math2D.line_i_line(opv,edv,nodes[i],nodes[i-1])){
                return true;
            }
        }
    }
    if((l>1&&tgt2.want_to_closePath)&&(!tgt2.data.isClosed())){
        // 规定闭合路径的多边形, 多算一次
        if(Math2D.arc_i_line(tgt1.data,nodes[0],nodes[l])){
            return true;
        }
        if(tgt1.want_to_closePath){
            if(Math2D.line_i_line(tgt1.data.opv,tgt1.data.edv,nodes[0],nodes[l])){
                return true;
            }
        }
    }
    if(tgt2.want_to_closePath||tgt2.data.isClosed()){
        return t2d.isInside(tgt1.data.c.x+tgt1.data.opv.x,tgt1.data.c.y+tgt1.data.opv.y,true);
    }
    return false;
}
PrimitiveTGT.isTouch.addOverload([PrimitiveArcTGT,PrimitivePolygonTGT],isTouch_Arc_Polygon);
PrimitiveTGT.isTouch.addOverload([PrimitivePolygonTGT,PrimitiveArcTGT],function(tgt1,tgt2){
    return isTouch_Arc_Polygon(tgt2,tgt1);
});

/**
 * 碰撞检测函数 弧形(圆形) 弧形
 * @param {PrimitiveArcTGT} tgt1 
 * @param {PrimitiveArcTGT} tgt2 
 */
function isTouch_Arc_Arc(tgt1,tgt2){
    var tgtt=tgt1.toPolygon();
    return isTouch_Arc_Polygon(tgt2,tgtt);
}

PrimitiveTGT.isTouch.addOverload([PrimitiveArcTGT,PrimitiveArcTGT],isTouch_Arc_Arc);

// 扇形碰撞 -------------------------------------------------------------------------------------------------

/**
 * 碰撞检测函数 矩形 扇形(圆形)
 * @param {PrimitiveRectTGT} tgt1 进行碰撞检测的对象
 * @param {PrimitiveSectorTGT}  tgt2 进行碰撞检测的对象
 */
 function isTouch_Rect_Sector(tgt1,tgt2){
    var t1=tgt1.toPolygon();
    return isTouch_Sector_Polygon(tgt2,t1);
}
PrimitiveTGT.isTouch.addOverload([PrimitiveRectTGT,PrimitiveSectorTGT],isTouch_Rect_Sector);
PrimitiveTGT.isTouch.addOverload([PrimitiveSectorTGT,PrimitiveRectTGT],function(tgt1,tgt2){
    return isTouch_Rect_Sector(tgt2,tgt1);
});

/**
 * 碰撞检测函数 扇形(圆形) 多边形
 * @param {PrimitiveSectorTGT} tgt1 
 * @param {PrimitivePolygonTGT} tgt2 
 */
 function isTouch_Sector_Polygon(tgt1,tgt2){
    var i =tgt2.data.nodes.length-1,
        l=i;
    if(l<0)return false;
    console.log(1)
    var t2d1=Polygon.linearMapping(tgt2.data,tgt2.transformMatrix,false);
    var t2d=Polygon.linearMapping(t2d1,tgt1.worldToLocalM,true);
        nodes=t2d.nodes;

    for(;i>0;--i){
        if(Math2D.sector_i_line(tgt1.data,nodes[i],nodes[i-1])){
            return true;
        }
    }
    if((l>1&&tgt2.want_to_closePath)&&(!tgt2.data.isClosed())){
        // 规定闭合路径的多边形, 多算一次
        if(Math2D.sector_i_line(tgt1.data,nodes[0],nodes[l])){
            return true;
        }
    }
    if(tgt2.want_to_closePath||tgt2.data.isClosed()){
        return t2d.isInside(tgt1.data.c.x,tgt1.data.c.y,true);
    }
    return false;
}

PrimitiveTGT.isTouch.addOverload([PrimitiveSectorTGT,PrimitivePolygonTGT],isTouch_Sector_Polygon);
PrimitiveTGT.isTouch.addOverload([PrimitivePolygonTGT,PrimitiveSectorTGT],function(tgt1,tgt2){
    return isTouch_Sector_Polygon(tgt2,tgt1)
});

/**
 * 碰撞检测函数 扇形(圆形) 弧形
 * @param {PrimitiveSectorTGT} tgt1 
 * @param {PrimitiveArcTGT} tgt2 
 */
 function isTouch_Sector_Arc(tgt1,tgt2){
    var tgtt=tgt1.toPolygon();
    return isTouch_Arc_Polygon(tgt2,tgtt);
}

PrimitiveTGT.isTouch.addOverload([PrimitiveSectorTGT,PrimitiveArcTGT],isTouch_Sector_Arc);
PrimitiveTGT.isTouch.addOverload([PrimitiveArcTGT,PrimitiveSectorTGT],function(tgt1,tgt2){
    return isTouch_Sector_Arc(tgt2,tgt1)
});

/**
 * 碰撞检测函数 扇形(圆形) 弧形
 * @param {PrimitiveSectorTGT} tgt1 
 * @param {PrimitiveSectorTGT} tgt2 
 */
 function isTouch_Sector_Sector(tgt1,tgt2){
    var tgtt=tgt1.toPolygon();
    return isTouch_Sector_Polygon(tgt2,tgtt);
}

PrimitiveTGT.isTouch.addOverload([PrimitiveSectorTGT,PrimitiveSectorTGT],isTouch_Sector_Sector);

/**
 * 碰撞检测函数 贝塞尔曲线 多边形
 * @param {PrimitiveBezierTGT} tgt1 
 * @param {PrimitivePolygonTGT} tgt2 
 */
function isTouch_Bezier_Polygon(tgt1,tgt2){
    var t1d_w=tgt1.world_bezier;
    var t2d1=Polygon.linearMapping(tgt2.data,tgt2.transformMatrix,false);
    if(t2d1.isInside(t1d_w.nodes[0].node)||t1d_w.isInside(t2d1.nodes[0])){
        return true;
    }
    var i=0,j=0;
    var tempBezierCurve=null;

    i=t1d_w.nodes.length-1;
    if(tgt1._want_to_closePath!==1)--i;
    for(;i>=0;--i){
        tempBezierCurve=t1d_w.get_bezierCurve(i);

        j=t2d1.nodes.length-1;
        if(tgt2.want_to_closePath){
            if(Math2D.line_i_bezier_v(t2d1.nodes[j],t2d1.nodes[0],tempBezierCurve).length>0)return true;
        }
        for(--j;j>=0;--j){
            if(Math2D.line_i_bezier_v(t2d1.nodes[j+1],t2d1.nodes[j],tempBezierCurve).length>0)return true;
        }
    }
    if(tgt1._want_to_closePath===-1){
        // 曲线对象正在使用直线闭合起点~终点 
        i=t1d_w.nodes.length-1;
        j=t2d1.nodes.length-1;
        if(tgt2.want_to_closePath){
            if(Math2D.line_i_line(t2d1.nodes[j],t2d1.nodes[0],t1d_w.nodes[0].node,t1d_w.nodes[i].node))return true;
        }
        for(--j;j>=0;--j){
            if(Math2D.line_i_line(t1d_w.nodes[0].node,t1d_w.nodes[i].node,t2d1[j],t2d1[j+1]))return true;
        }
    }
    return false;
}
PrimitiveTGT.isTouch.addOverload([PrimitiveBezierTGT,PrimitivePolygonTGT],isTouch_Bezier_Polygon);
PrimitiveTGT.isTouch.addOverload([PrimitivePolygonTGT,PrimitiveBezierTGT],function(tgt1,tgt2){
    return isTouch_Bezier_Polygon(tgt2,tgt1);
});

/**
 * 碰撞检测函数 贝塞尔曲线 矩形
 * @param {PrimitiveBezierTGT} tgt1 
 * @param {PrimitiveRectTGT} tgt2 
 */
function isTouch_Bezier_Rect(tgt1,tgt2){
    var t_tgt2=tgt2.toPolygon();
    return isTouch_Bezier_Polygon(tgt1,t_tgt2);
}
PrimitiveTGT.isTouch.addOverload([PrimitiveBezierTGT,PrimitiveRectTGT],isTouch_Bezier_Rect);
PrimitiveTGT.isTouch.addOverload([PrimitiveRectTGT,PrimitiveBezierTGT],function(tgt1,tgt2){
    return isTouch_Bezier_Rect(tgt2,tgt1);
});
/**
 * 碰撞检测函数 贝塞尔曲线 弧形
 * @param {PrimitiveBezierTGT} tgt1 
 * @param {PrimitiveArcTGT} tgt2 
 */
function isTouch_Bezier_Arc(tgt1,tgt2){
    var t1d_l2=Bezier_Polygon.linearMapping(tgt1.world_bezier,tgt2.worldToLocalM,true);
    isTouch_Bezier_Arc
}
/**
 * 碰撞检测函数 贝塞尔曲线 扇形
 * @param {PrimitiveBezierTGT} tgt1 
 * @param {PrimitiveSectorTGT} tgt2 
 */
 function isTouch_Bezier_Sector(tgt1,tgt2){
    
}
/**
 * 碰撞检测函数 贝塞尔曲线 贝塞尔曲线
 * @param {PrimitiveBezierTGT} tgt1 
 * @param {PrimitiveBezierTGT} tgt2 
 */
function isTouch_Bezier_Bezier(tgt1,tgt2){
    
}


/**
 * 没有进行矩阵变换的世界坐标系多边形tgt数组 和 tgt组 碰撞检测
 * @param {PrimitivePolygonTGT[]} _tgts 多边形对象数组 不要加矩阵
 * @param {PrimitiveTGT_Group} g 组
 * @param {PrimitiveTGT_Group} pg g的父组
 */
function isTouch_noTransformPolygons_Group(_tgts,g,pg){
    var tgts=_tgts;
    var i,j,t_nodes;
    // 将顶点数据转换到 pg 的局部坐标系
    if(pg){
        for(i=tgts.lengthi;i>=0;--i){
            tgts[i]=tgts[i].copy();
            t_nodes=tgts[i].data.nodes;
            for(j=t_nodes.length-1;j>=0;--j){
                t_nodes[j]=pg.worldToLocal(t_nodes[j]);
            }
        }
    }
    for(i=tgts.length-1;i>=0;--i){
        tgts[i].transformMatrix=g.transformMatrix;
        for(j=g.data.length-1;j>=0;--j){
            if(g.data[j] instanceof PrimitiveTGT_Group){
                if(isTouch_noTransformPolygons_Group(tgts,g.data[j],g)){
                    return true;
                }
            }else{
                if(PrimitiveTGT.isTouch(tgts[i],g.data[j])){
                    return true;
                }
            }
        }
    }
    return false;
}
/**
 * 碰撞检测函数 组 组
 * @param {PrimitiveTGT_Group} group1
 * @param {PrimitiveTGT_Group} group2
 */
function isTouch_Group_Group(group1,group2){
    var g1_Polygons=group1.create_worldPolygons();
    return isTouch_noTransformPolygons_Group(g1_Polygons,group2);
}
PrimitiveTGT.isTouch.addOverload([PrimitiveTGT_Group,PrimitiveTGT_Group],isTouch_Group_Group);

PrimitiveTGT.isTouch.addOverload([PrimitiveTGT_Group,PrimitiveTGT],function (group,tgt){
    return isTouch_noTransformPolygons_Group([tgt],group);
});
PrimitiveTGT.isTouch.addOverload([PrimitiveTGT,PrimitiveTGT_Group],function (tgt,group){
    return isTouch_noTransformPolygons_Group([tgt],group);
});


export{
    Material,
    PrimitiveTGT_Renderer,
    PrimitiveTGT,
    PrimitiveRectTGT,
    PrimitiveArcTGT,
    PrimitiveSectorTGT,
    PrimitivePolygonTGT,
    PrimitiveBezierTGT,
    PrimitiveTGT_Group
};