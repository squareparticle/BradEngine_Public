class Cluster{

    constructor(level){
        this.level = level;
        this.isReady = false;

        this.chunks={};
        this.chunkArray = [];
        this.numCols=7;
        this.numRows=7;
        this.depth=3;
        this.numVoxelCols=9;
        this.numVoxelRows=9;
        this.voxelDepth=20;

        this.location = {x: -3, y: 0, z: -3};
        this.bounds = {x1:0, x2:0, y1:0, y2:0, z1:0, z2:0};
        this.voxelSize = {x:2,y:2,z:2};

        for(let i_depth=0; i_depth<this.depth; i_depth++){
            this.chunks[i_depth]=[];
            for(let i_row=0; i_row<this.numRows; i_row++){
                this.chunks[i_depth][i_row]=[];
                for(let i_col=0; i_col<this.numCols; i_col++){
                    this.chunks[i_depth][i_row][i_col]=this.addChunk({
                        worldLoc:{
                            x:(i_col+this.location.x),
                            y:(i_depth+this.location.y-1),
                            z:(i_row+this.location.z)
                        },
                        chunkLoc:{x:i_col-(this.numCols/2),y:i_depth-1,z:i_row-(this.numRows/2)}
                    });
                }
            }
        }
        this.chunkArray.forEach(chunk=>chunk.init());
    }

    // getKeyboardControls(event){
    //     if(event.type=="down"){
    //         if(event.key==="8") this.moveWorld({x:0, y:0, z:1});
    //         if(event.key==="2") this.moveWorld({x:0, y:0, z:-1});
    //         if(event.key==="4") this.moveWorld({x:-1,y:0, z:0});
    //         if(event.key==="6") this.moveWorld({x:1, y:0, z:0});
    //     }
    //     if(event.type=="up"){}
    // }  

    moveWorld(direction){
        if(direction.x===0 && direction.y ===0 && direction.z ===0) return;  // never moved
        this.location = {
            x: this.location.x+direction.x,
            y: this.location.y+direction.y,
            z: this.location.z+direction.z
        }   
        // console.log('moveWorld',direction,this.location);
        this.createBounds();
        for(let i_depth=0; i_depth<this.depth; i_depth++){
            for(let i_row=0; i_row<this.numRows; i_row++){
                for(let i_col=0; i_col<this.numCols; i_col++){
                    let xptr, zptr = 0;
                    if(direction.z >= 0) zptr=i_row;
                    if(direction.z < 0) zptr=((this.numRows-1)-i_row);
                    if(direction.x >= 0) xptr=i_col;
                    if(direction.x < 0) xptr=((this.numCols-1)-i_col);

                    if((direction.x > 0) && (xptr < this.numCols-1)){
                        this.chunks[i_depth][zptr][xptr+1].copyTo(this.chunks[i_depth][zptr][xptr]);
                    }
                    else if((direction.x < 0) && (xptr > 0)){
                        this.chunks[i_depth][zptr][xptr-1].copyTo(this.chunks[i_depth][zptr][xptr]);
                    }
                    else if((direction.z > 0) && (zptr < this.numRows-1)){
                        this.chunks[i_depth][zptr+1][xptr].copyTo(this.chunks[i_depth][zptr][xptr]);
                    }
                    else if((direction.z < 0) && (zptr > 0)){
                        this.chunks[i_depth][zptr-1][xptr].copyTo(this.chunks[i_depth][zptr][xptr]);
                    }
                    else{
                        this.replaceChunk(this.chunks[i_depth][zptr][xptr],{
                            worldLoc:{
                                x:(xptr+this.location.x),
                                y:(i_depth+this.location.y-1),
                                z:(zptr+this.location.z)
                            },
                        });                            
                    }
                }
            }
        }
        this.level.player.alignWithGound();
        if(this.level.mobs)
            this.level.mobs.forEach(mob=>mob.alignWithGound());
    }

    createBounds(){
        this.bounds.x1=this.location.x*this.numVoxelCols;
        this.bounds.x2=(this.bounds.x1+this.numCols*this.numVoxelCols)-1;
        this.bounds.y1=-this.voxelDepth
        this.bounds.y2=(this.voxelDepth*2)-1
        this.bounds.z1=this.location.z*this.numVoxelRows;
        this.bounds.z2=(this.bounds.z1+this.numRows*this.numVoxelRows)-1;
    }

    forceCreateBounds(){
        this.bounds.x1=Math.min(...this.chunkArray.map(chunk=>chunk.bounds.x1));
        this.bounds.x2=Math.max(...this.chunkArray.map(chunk=>chunk.bounds.x2));
        this.bounds.y1=Math.min(...this.chunkArray.map(chunk=>chunk.bounds.y1));
        this.bounds.y2=Math.max(...this.chunkArray.map(chunk=>chunk.bounds.y2));
        this.bounds.z1=Math.min(...this.chunkArray.map(chunk=>chunk.bounds.z1));
        this.bounds.z2=Math.max(...this.chunkArray.map(chunk=>chunk.bounds.z2));
    }

    saveClusterToStorage(){
        for(let i_depth=0; i_depth<this.depth; i_depth++){
            for(let i_row=0; i_row<this.numRows; i_row++){
                for(let i_col=0; i_col<this.numCols; i_col++){ 
                    let localStorageAddress = JSON.stringify(this.chunks[i_depth][i_row][i_col].worldLoc);
                    if (localStorage.getItem(localStorageAddress) === null) 
                        console.log("Address "+localStorageAddress+' Not found');
                    localStorage[localStorageAddress] = this.chunks[i_depth][i_row][i_col].toStorage();
                }
            }
        }
        console.log(new Blob(Object.values(localStorage)).size)
    }

    chunkReady(){
        // let loading = this.chunkArray.filter(chunk=> chunk.blocks.length==0); // only works for chunks that needed to be generated
        let loading = this.chunkArray.filter(chunk=> chunk.isLoadingInit); // only works for chunks that needed to be generated
        if(loading.length===0){   
            this.clusterReady();
        }
    }

    clusterReady(){
        this.isReady = true;
        //this.saveClusterToStorage();

        this.chunkArray.forEach((chunk)=>chunk.buildModel());
        this.createBounds();

        this.level.player.alignWithGound();
        if(this.level.mobs)
            this.level.mobs.forEach(mob=>mob.alignWithGound());
        //console.log(this.bounds);
    }

    alignMobToGround(mob){
        if(!this.isReady) return {error: "cluster is still loading"};
        let groundLoc = this.findClosestGround(mob.voxelLoc);
        // console.log('groundLoc',groundLoc)
        if(groundLoc.error) return {error: groundLoc.error};
        //console.log('ground at',groundLoc);
        return {world:this.voxelToWorld(groundLoc.loc),groundLoc};
    }

    isInsideCluster(loc){
        if(loc.x>=this.bounds.x1 && loc.x<=this.bounds.x2 &&
            loc.y>=this.bounds.y1 && loc.y<=this.bounds.y2 &&
            loc.z>=this.bounds.z1 && loc.z<=this.bounds.z2 )
             return true;
        return false;
    }

    changeChunkAt(blockType, loc){
        if(!this.isInsideCluster(loc))
            return {error:'out of bounds'}

        for(let i_depth=0; i_depth<this.depth; i_depth++){
            for(let i_row=0; i_row<this.numRows; i_row++){
                for(let i_col=0; i_col<this.numCols; i_col++){
                    // check if voxel is inside the bounds of the chunk
                    if(this.chunks[i_depth][i_row][i_col].isInsideChunk(loc)){
                        return{
                            //chunk:{depth:i_depth,row:i_row,col:i_col},
                            chunk: this.chunks[i_depth][i_row][i_col],
                            voxel: this.chunks[i_depth][i_row][i_col].setVoxelLocInsideChunk(blockType,loc)
                        };
                    }
                }
            }
        }
        return {error:'out of bounds'}  // not found
    }

    findChunkFromLoc(loc){
        if(!this.isInsideCluster(loc))
            return {error:'out of bounds'}

        for(let i_depth=0; i_depth<this.depth; i_depth++){
            for(let i_row=0; i_row<this.numRows; i_row++){
                for(let i_col=0; i_col<this.numCols; i_col++){
                    // check if voxel is inside the bounds of the chunk
                    if(this.chunks[i_depth][i_row][i_col].isInsideChunk(loc)){
                        return{
                            chunk:{depth:i_depth,row:i_row,col:i_col},
                            voxel: this.chunks[i_depth][i_row][i_col].getVoxelLocInsideChunk(loc)  // calc loc of voxel inside chunk
                        };
                    }
                }
            }
        }
        return {error:'out of bounds'}  // not found
    }

    voxelToWorld(loc){
        let chunkLoc = this.findChunkFromLoc(loc);
        // console.log(chunkLoc);
        // if the location is not on any chunk then throw an error        
        if(chunkLoc.error) return chunkLoc.error

        // find the chunks physical position in the grid
        let currentChunk = this.chunks[chunkLoc.chunk.depth][chunkLoc.chunk.row][chunkLoc.chunk.col];
        let chunkPos = {...currentChunk.pos};

        // find the first voxel at col,row = [0,0]
        let col0 = chunkPos.x-((currentChunk.numCols/2)*this.voxelSize.x);
        let row0 = chunkPos.z-((currentChunk.numRows/2)*this.voxelSize.z);

        // center to the center of the voxel
        chunkPos.x=col0+this.voxelSize.x/2;
        chunkPos.y-=this.voxelSize.y/2;
        chunkPos.z=row0+this.voxelSize.z/2;
        
        // move to the voxel location on the chunk
        chunkPos.x+=chunkLoc.voxel.loc.x*this.voxelSize.x;
        chunkPos.y-=chunkLoc.voxel.loc.y*this.voxelSize.y;
        chunkPos.z+=chunkLoc.voxel.loc.z*this.voxelSize.z;

        return chunkPos;
    }

    findClosestGround(loc){
        let chunkLoc = this.findChunkFromLoc(loc); // returns chunk and voxel location
        // console.log('chunkLoc',chunkLoc)
        if(chunkLoc.error) return chunkLoc;
        if(!chunkLoc.voxel) return {error:"nothing found"};
        // could be in the air
        if(chunkLoc.voxel.type===0) { 
            let ptr=0;
            while(true){
                let chunkLocDown = this.findChunkFromLoc({...loc, y:loc.y-ptr});
                if(!chunkLocDown || chunkLocDown.error) return {error:"nothing found"};
                if(chunkLocDown.voxel && chunkLocDown.voxel.type!==0) { return {loc:{...loc, y:loc.y-ptr+1},chunk:chunkLoc}};
                ptr++;
            }    
        };

        let ptr=0;
        while(true){
            let chunkLocUp = this.findChunkFromLoc({...loc, y:loc.y+ptr});
            let chunkLocDown = this.findChunkFromLoc({...loc, y:loc.y-ptr});
            if(chunkLocUp.error && chunkLocDown.error) return {error:"nothing found"};
            if(!chunkLocUp.voxel && chunkLocDown) return {error:"nothing found"};
            if(chunkLocUp.voxel && chunkLocUp.voxel.type===0) { return {loc:{...loc, y:loc.y+ptr},chunk:chunkLoc}};
            if(chunkLocDown.voxel && chunkLocDown.voxel.type===0) { return {loc:{...loc, y:loc.y-ptr},chunk:chunkLoc}};
            ptr++;
        }
    }

    addBlock(blockType, loc){
        let chunk = this.changeChunkAt(blockType,loc); // returns chunk and voxel location
        chunk.chunk.isDirtyModel = true;
        chunk.chunk.buildModel()
        //console.log(blockType, loc);
    }

    removeBlock(loc){
        this.addBlock(emptyBlock,loc);
    }

    replaceChunk(chunk,params){
        // console.log('replaceChunk',params.worldLoc);
        chunk.worldLoc = params.worldLoc;
        chunk.original.verts=[];
        chunk.faces = [];
        chunk.blocks=[];        
        chunk.create();
        chunk.init();
    }    

    addChunk(params){
        let chunk = new Chunk({...params,
            cluster:this,
            groundHeight:10,
            numCols:this.numVoxelCols,
            numRows:this.numVoxelRows,
            depth:this.voxelDepth,
            voxelSize:this.voxelSize
        });
        let gap = 0;
        let chunkWidth = (chunk.numCols*this.voxelSize.x)+gap;
        let chunkLength = (chunk.numRows*this.voxelSize.z)+gap;
        let chunkHeight = (chunk.depth*this.voxelSize.y)+gap;

        chunk.pos={
            x:(params.chunkLoc.x*chunkWidth)+(chunkWidth/2),
            y:-params.chunkLoc.y*chunkHeight+this.voxelSize.y,
            z:(params.chunkLoc.z*chunkLength)+(chunkLength/2)
        };

        chunk.name = params.worldLoc.x+' '+params.worldLoc.y+' '+params.worldLoc.z;
        this.chunkArray.push(chunk);
        return chunk;
    }    

    getObjects(){
        return this.chunkArray;
    }

}
