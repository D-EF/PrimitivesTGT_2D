/*
 * @LastEditors: Darth_Eternalfaith
 */
class Bezier_Node{
    /**
     * @param {Vector2} node
     * @param {Vector2} hand1
     * @param {Vector2} hand2
     */
    constructor(node,hand1,hand2) {
        /**
         * @type {Vector2} 顶点
         */
        this.node=node;
        /** 
         * @type {Vector2} 前驱控制点
         */
        this.hand1=hand1;
        /** 
         * @type {Vector2} 后置控制点
         */
        this.hand2=hand2;
    }
    static copy(tgt){
        return new Bezier_Node(
            tgt.node,
            tgt.hand1,
            tgt.hand2
        )
    }
    copy(){
        return Bezier_Node.copy(this);
    }
}

class Bezier_Polygon{
    /**
     * @param {Array<Vector2>} nodes  
     * @param {Array<Vector2>} hand1s 
     * @param {Array<Vector2>} hand2s 
     */
    constructor(nodes,hand1s,hand2s){
        this.nodes=[];
        if(nodes)
        for(var i=0;i<nodes.length;i++){
            this.nodes.push(new Bezier_Node(nodes[i],hand1s[i],hand2s[i]));
        }
    }
    static copy(tgt){
        var rtn=new Bezier_Polygon();
        for(var i=0;i<tgt.nodes.length;++i){
            tgt.nodes.push(Bezier_Node.copy(tgt.nodes[i]));
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
     * @param {Array<Bezier_Node>} bezierNodes  装着顶点的数组
     */
    pushNodes(bezierNodes){
        for(var i=0;i<nodes.length;++i){
            this.pushNode(bezierNodes[i]);
        }
    }
    /**
     * 插入顶点
     * @param {Number} index    要插入的顶点的下标
     * @param {Array<Bezier_Node>} bezierNodes 要插入的顶点
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
    
}

class CanvasBezierTGT extends CanvasTGT{
    /**
     * @param {Bezier_Polygon} bezier_polygon 
     */
    constructor(bezier_polygon){
           super();
           if(bezier_polygon)
           /**@type {Bezier_Polygon} */
           this.data=Bezier_Polygon.copy(bezier_polygon);
           this.dataType="Bezier_Data";
       }
       /**
        * 将局部坐标系的 nodes 转换到世界坐标系
        * @param {Boolean} clear_tfm_f 是否清理变换矩阵属性 默认清理(true)
        */
       nodesToWorld(clear_tfm_f=true){
           // this.data.linearMapping(this.transformMatrix,true)
           for(var i=this.data.nodes.length-1;i>=0;--i){
               this.data.nodes[i].node=this.localToWorld(this.data.nodes[i].node);
               this.data.nodes[i].hand1=this.localToWorld(this.data.nodes[i].hand1);
               this.data.nodes[i].hand2=this.localToWorld(this.data.nodes[i].hand2);
           }
           if(clear_tfm_f){
               this.transformMatrix=new Matrix2x2T();
           }
       }
       /**
        * @param {CanvasRenderingContext2D} ctx 
        */
       createCanvasPath(ctx){
           var nodes=this.data.nodes,i=0;
           ctx.moveTo(nodes[i].node.x,nodes[i].node.y);

           for(i=1;i<this.data.nodes.length;++i){
               ctx.bezierCurveTo(nodes[i-1].hand2.x,nodes[i-1].hand2.y,nodes[i].hand1.x,nodes[i].hand1.y,nodes[i].node.x,nodes[i].node.y);
           }
           if(this.want_to_closePath){
            //    ctx.closePath();
            ctx.bezierCurveTo(nodes[i-1].hand2.x,nodes[i-1].hand2.y,nodes[0].hand1.x,nodes[0].hand1.y,nodes[0].node.x,nodes[0].node.y);
           }
       }
}


var d=new CanvasBezierTGT();
d.data=new Bezier_Polygon();
d.data.pushNode({
    node:{
        x:100,
        y:100
    },
    hand1:{
        x:100,
        y:200
    },
    hand2:{
        x:200,
        y:100
    },
});
d.data.pushNode({
    node:{
        x:200,
        y:200
    },
    hand1:{
        x:100,
        y:200
    },
    hand2:{
        x:200,
        y:100
    },
});


var canvas=document.getElementById("canvas");
var ctx=canvas.getContext('2d');
d.strokeStyle="#000";
d.lineWidth=1;
d.want_to_closePath=true;
d.render(ctx);


/**
 * @param {Bezier_Node} curve1d1
 * @param {Bezier_Node} curve1d2
 * @param {Bezier_Node} curve2d1
 * @param {Bezier_Node} curve2d2
 */
function bezier_i_bezier(curve1d1,curve1d2,curve2d1,curve2d2){
    var p0=curve1d1.node,
        p1=curve1d1.hand2.dif(p0),
        p2=curve1d2.hand1.dif(p0),
        p3=curve1d2.node,
        q0=curve2d1.node,
        q1=curve2d1.hand2.dif(q0),
        q2=curve2d2.hand1.dif(q0),
        q3=curve2d2.node;

    var ps=p3.dif(p0),
        qs=q3.dif(q0);
    
    var psm=new Matrix2x2T().scale(1/ps.x,1/px.y),
        qsm=new Matrix2x2T().scale(1/qs.x,1/qx.y);
}


