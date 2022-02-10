/*
 * @LastEditors: Darth_Eternalfaith
 */
class Vector3{
    constructor(x,y,z){
        this.x=x||0;
        this.y=y||0;
        this.z=z||0;
    }
    /** 拷贝函数
     */
    static copy(v3){
        return new Vector3(v3.x,v3.y,v3.z);
    }
    /** 向量和
     * @param {Vector3} 传入的向量
     * @returns {Vector3} 返回新的向量
     */
    static add(v3_0,v3_1){
        return new Vector3(
            v3_1.x+v3_0.x,
            v3_1.y+v3_0.y,
            v3_1.z+v3_0.z
        );
    }
}

/** 3x3变换矩阵
 */
class Matrix3x3{

}
/** 齐次矩阵 
 */
class Matrix3x3T extends Matrix3x3{

}