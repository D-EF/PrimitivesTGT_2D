/*
 * @LastEditors: Darth_Eternalfaith
 */
var canvas=document.getElementById("canvasTGT"), 
    ctx=canvas.getContext('2d');


var logo_items = [];
var logoitem_data=new Polygon([
    {x:0,y:0},
    // {x:12.06794919,y:0},
    {x:12.06794919,y:12.6794919},
    {x:12.06794919,y:38.0384758},
    // {x:12.06794919,y:60},
    {x:0,y:60},
    // {x:-12.06794919,y:60},
    {x:-12.06794919,y:38.0384758},
    {x:-12.06794919,y:12.6794919},
    // {x:-12.06794919,y:0},
    {x:0,y:0}
]);

var logoitem_base=new CanvasPolygonTGT(logoitem_data);

class CanvasTGT_Group extends CanvasTGT{
    /**
     * @param {Array<CanvasTGT>} data_list 子对象集合
     */
    constructor(data_list){
        super();
        /**
         * @type {Array<CanvasTGT>} 子对象集合
         */
        this.data=[].concat(data_list);
        this.re_max_min();
        this.min_V2 = new Vector2();
        this.max_V2 = new Vector2();
    }
    copy(){
        var rtn=new this.constructor();
    }
    /**
     * 刷新最大最小 
     */
    re_max_min(){
        var tempp;
        for(var i = this.data.length-1;i>=0;--i){
            if(this.data[i].isInside(v.x,v.y)){
                tempp=this.data[i].getMax();
                if(this.max_V2.x<tempp.x){
                    this.max_V2.x=tempp.x
                }
                if(this.max_V2.y<tempp.y){
                    this.max_V2.y=tempp.y
                }
                tempp=this.data[i].getMin();
                if(this.min_V2.x>tempp.x){
                    this.min_V2.x=tempp.x
                }
                if(this.min_V2.y>tempp.y){
                    this.min_V2.y=tempp.y
                }
            }
        }
    }
    getMin(){
        return this.min_V2;
    }
    getMax(){
        return this.max_V2;
    }
    isInside(_x,_y){
        var v=this.worldToLocal(_x,_y);
        for(var i = this.data.length-1;i>=0;--i){
            if(this.data[i].isInside(v.x,v.y)){
                return true;
            }
        }
        return false;
    }
    createCanvasPath(ctx){
        for(var i = this.data.length-1;i>=0;--i){
            this.data[i].createCanvasPath(ctx);
        }
    }
    getPolygonProxy(){
        // 禁止
        console.error("禁止使用组的该方法");
        return;
    }
}

logoitem_base.transformMatrix=(createMatrix2x2T().scale(4,4).rotate(Math.DEG*-90).translate(55.176627778208555,76.90110367884861));

logoitem_base.fillStyle="#000";

logoitem_base.render(ctx);