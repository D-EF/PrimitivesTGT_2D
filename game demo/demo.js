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
base.setTransformMatrix(new Matrix2x2T().translate(250,250).rotate(0.5*pi));

base.fillStyle="#000"
base.render(ctext);

/**
 * 根据当前旋转角度, 添加碰撞单位
 */
function setPPG(){
    var tempTGT=new CanvasArcTGT()
    ppg.push(tempTGT)
}

