class PPG{
    /**
     * 游戲中的碰撞單位
     * @param {Number} rotate 旋转偏移量 单位 弧度
     */
    constructor(rotate){
        this.rotateBase=new Matrix2x2T().rotate(rotate);
    }
    /** 渲染 */
    render(){
        var tempM=this.rotateBase.rotate(absRotate*pi)
        ppg_blueprint.arc.transformMatrix=(tempM);
        ppg_blueprint.arc.render(ctext);
        ppg_blueprint.solid.transformMatrix=(tempM);
        ppg_blueprint.solid.render(ctext);
    }
    /**
     * @param {Array<PPG>} tgts
     */
    static ppgsAdd(tgts){
        var i;
        for(i=tgts.length-1;i>=0;--i){
            tgts[i].isTouch
        }
    }
}
PPG.prototype.isTouch=OlFunction.create()

/**
 * 判断对象是否碰撞
 * @param {CanvasTGT} touchTGT 碰撞对象
 */
 PPG.prototype.isTouch.addOverload([CanvasTGT],function(touchTGT){
    var tempM=this.rotateBase.rotate(absRotate*pi)
    ppg_blueprint.arc.transformMatrix=(tempM);
    return CanvasTGT.isTouch(ppg_blueprint.arc,touchTGT);
});
/**
 * 判断对象是否碰撞
 * @param {PPG} touchTGT 碰撞对象
 */
 PPG.prototype.isTouch.addOverload([PPG],function(touchTGT){
    var tempTGT1=ppg_blueprint.arc.copy().transformMatrix=(touchTGT.rotateBase.rotate(absRotate*pi));
    var tempTGT2=ppg_blueprint.arc.copy().transformMatrix=(this.rotateBase.rotate(absRotate*pi));
    return CanvasTGT.isTouch(tempTGT2,tempTGT1);
});
/**
 * @type {HTMLCanvasElement} canvas
 */
var canvas=document.getElementById("canvasTGT");
var pi=Math.PI;

canvas.width=500;
canvas.height=800;

var ctext=canvas.getContext("2d");

var base=new CanvasArcTGT(0,0,80,0,2*pi);

/**
 * @type {Number} 0-2 全局旋轉弧度 單位 pi弧度
 */
var absRotate=0;
var baseM22t=new Matrix2x2T();
function createRotateMatrix(){
    return baseM22t.rotate(absRotate*pi);
}
base.fillStyle="#000";

/** 游戏中的物体的蓝图 */
var ppg_blueprint={
    arc:new CanvasArcTGT(0,200,20,0,2*pi),
    solid:new CanvasPolygonTGT(new Polygon([
        {x:0,y:0},
        {x:0,y:200}
    ]))
}

/** @type {Array<PPG>} 碰撞单位集合*/
var ppgs=[];

// 将要加入的单位
var readyP={
    tgt:new CanvasArcTGT(0,0,20,0,2*pi).transformMatrix=(new Matrix2x2T().translate(250,750)),
}

/**
 * 渲染画面
 */
function reRender(val){
    // 清空画布
    ctext.clearRect(0,0,canvas.width,canvas.height);
    // 渲染 base
    base.render(ctext);
    // 渲染碰撞单位
    for(var i=ppgs.length-1;i>=0;--i){
        ppgs[i].render();
    }
    // 渲染剩余目标

}

render();

// var doc_hidden_flag=false,
//     then=this;
// document.addEventListener("visibilitychange", () => { 
//     if(document.hidden) {
//         // 页面被挂起
//         doc_hidden_flag=true
//     }
//     else {
//         // 页面呼出
//         if(doc_hidden_flag){
//             doc_hidden_flag
//             then.k_next();
//         }
//     }
// });