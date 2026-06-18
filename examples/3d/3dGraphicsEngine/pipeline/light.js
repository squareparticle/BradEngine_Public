class Light {
    constructor(params){
        this.pos = {x:0,y:0,z:0};
        this.rot = {x:0,y:0,z:0};
        this.norm = {x:0,y:0,z:1};

        this.moveSpeed = 0;
        this.rotateSpeed = 0;

        this.edit(params);
    }

    edit(params){Tools.overideObject(this,params);}
}