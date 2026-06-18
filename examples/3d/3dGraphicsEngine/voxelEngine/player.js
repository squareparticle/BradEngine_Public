class Player extends Mob{
    init(){
        this.currentClusterCenter = undefined;
    }

    getKeyboardControls(event){
        if(event.type=="down"){
            if(event.key==="+") {
                //this.voxelLoc.y+=1;
                this.level.cluster.addBlock(stoneBlock,this.voxelLoc);
                this.alignWithGound();
            }
            if(event.key==="-") {
                this.voxelLoc.y-=1;
                this.level.cluster.removeBlock(this.voxelLoc);
                this.alignWithGound();
            }
            if(event.key==="8") {this.voxelLoc.z++; this.move();}
            if(event.key==="2") {this.voxelLoc.z--; this.move();}

            if(event.key==="4") {this.voxelLoc.x--; this.move();}
            if(event.key==="6") {this.voxelLoc.x++; this.move();}
        }
        if(event.type=="up"){}
    }
    
    move(){
        this.alignWithGound();
        let direction = {
            x: this.chunkLoc.col-this.currentClusterCenter.col,
            y: 0,
            z: this.chunkLoc.row-this.currentClusterCenter.row,
            //z: this.currentClusterCenter.row-this.chunkLoc.row,
        }
        // console.log(this.currentClusterCenter, this.chunkLoc, direction)
        //this.currentClusterCenter={...this.chunkLoc};
        this.level.cluster.moveWorld(direction);
    }

    alignWithGound(){
        let ground = super.alignWithGound();
        // level has loaded and there is a ground
        if(ground){
            this.chunkLoc = ground.groundLoc.chunk.chunk;
            // remember the center chunk of the cluster after first loaded
            if(this.chunkLoc && !this.currentClusterCenter)
                this.currentClusterCenter = {...this.chunkLoc};

            // console.log(this.chunkLoc)
        }
    }

}