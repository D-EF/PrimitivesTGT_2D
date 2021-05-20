/**
 * @type {HTMLCanvasElement} canvas
 */
var canvas=document.getElementById("canvasTGT");
var pi=Math.PI;

canvas.width=500;
canvas.height=800;

var ctext=canvas.getContext("2d");

var ppg=[];

var base=new CanvasArcTGT(0,0,80,0,1*pi);

/**
 * @type {Number} 0-2 全局旋轉弧度 單位 pi弧度
 */
var absRotate=0;
var baseM22t=new Matrix2x2T();
function createRotateMatrix(){
    return baseM22t.rotate(absRotate*pi);
}

base.setTransformMatrix(new Matrix2x2T().translate(250,250).rotate(0.5*pi));

base.fillStyle="#000";
base.render(ctext);

/**
 * 根据当前旋转角度, 添加碰撞单位
 */
function setPPG(){
    var tempTGT=new CanvasArcTGT()
    ppg.push(tempTGT)
}
/** 游戏中的物体的蓝图 */
var ppg_blueprint={
    arc:new CanvasArcTGT(0,200,20,0,2*pi),
    solid:new CanvasPolygonTGT(new Polygon([
        {x:0,y:0},
        {x:0,y:200}
    ]))
}
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
        ppg_blueprint.arc.setTransformMatrix(tempM);
        ppg_blueprint.arc.render(ctext);
        ppg_blueprint.solid.setTransformMatrix(tempM);
        ppg_blueprint.solid.render(ctext);
    }
    /**
     * 判断对象是否碰撞
     * @param {CanvasTGT} touchTGT 碰撞对象
     */
    isTouch(touchTGT){
        var tempM=this.rotateBase.rotate(absRotate*pi)
        ppg_blueprint.arc.setTransformMatrix(tempM);
        return CanvasTGT.isTouch(ppg_blueprint.arc,touchTGT);
    }
}