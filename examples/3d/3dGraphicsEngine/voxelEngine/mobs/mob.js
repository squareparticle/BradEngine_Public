class Mob{
    constructor(level, model){
        this.level = level;
        this.model = model;
        this.voxelLoc = {x:0,y:0,z:0}
        this.model.rot.y=180;
        this.init();
    }

    init(){}

    setPosition(loc){
        this.model.pos = loc;
        // this.model.pos.y-=0.5;
    }

    alignWithGound(){
        if(!this.level.cluster) return;  // the cluster isn't finished building
        let ground = this.level.cluster.alignMobToGround(this);
        this.model.isVisible=true;
        if(ground.error) {
            this.model.isVisible=false;
            return;
        }
        this.setPosition(ground.world);
        //console.log('ground',ground.groundLoc.y);
        this.voxelLoc.y=ground.groundLoc.loc.y;
        return ground; 
    }     
}