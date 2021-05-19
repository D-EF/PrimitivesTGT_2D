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
 * @type {Number} 0-2 全局旋轉弧度 單位pi
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

class PPG{
    /**
     * 游戲中的碰撞單位
     * @param {Number} rotate 
     */
    constructor(rotate){
        this.rotateBase=new Matrix2x2T().rotate(rotate);
        this.tgt=new CanvasArcTGT(0,200,20,0,2*pi)
    }
}