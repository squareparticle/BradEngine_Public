class Chunk extends Model{
    create(){
        this.original.verts=[];
        this.faces = [];
        this.blocks=[];
        this.worker = new Worker("pipeline/voxel/workerChunk.js");
        this.isDirtyModel = true;
        this.isLoadingInit = true;
        this.message = {
            groundHeight:this.groundHeight,
            numCols:this.numCols,
            numRows:this.numRows,
            depth:this.depth,
            loc:this.worldLoc,
        };

        this.bounds = {
            x1:((this.numCols)*this.worldLoc.x),
            x2:((this.numCols)*this.worldLoc.x)+this.numCols-1,
            y1:((this.depth)*this.worldLoc.y),
            y2:((this.depth)*this.worldLoc.y)+this.depth-1,
            z1:((this.numCols)*this.worldLoc.z),
            z2:((this.numCols)*this.worldLoc.z)+this.numRows-1
        };
        this.paddedBounds = {
            x1:this.bounds.x1-1, x2: this.bounds.x2+1,
            y1:this.bounds.y1-1, y2: this.bounds.y2+1,
            z1:this.bounds.z1-1, z2: this.bounds.z2+1
        };

        //console.log(this.bounds);
    }

    init(){
        this.isLoadingInit = true;
        let localStorageAddress = JSON.stringify(this.worldLoc);

        // check if chunk is stored in localStorage
        if (localStorage.getItem(localStorageAddress) !== null) {
            this.fromStorage(localStorageAddress);
            if(this.hasValidBlocks()){
                this.isLoadingInit = false;
                this.cluster.chunkReady();
            }
            else{
                console.log('>>>>invalid chunk storage, regenerating: '+localStorageAddress);
                localStorage.removeItem(localStorageAddress);
                this.generateBlocks();
            }
        }
        else{ // generate new chunk with worker
            console.log('>>>>chunk not found: '+localStorageAddress);
            this.generateBlocks();
        }
    }

    generateBlocks(){
        this.worker.postMessage(this.message);
        this.worker.onmessage=(blocks)=>{
            this.blocks = blocks.data.blocks;
            this.isLoadingInit = false;
            this.cluster.chunkReady();
        }
    }

    hasValidBlocks(){
        return this.blocks.length === this.depth+2 &&
            this.blocks[0] && this.blocks[0].length === this.numRows+2 &&
            this.blocks[0][0] && this.blocks[0][0].length === this.numCols+2;
    }

    isInsideChunk(loc){
        //console.log(loc,this.bounds);
        if(loc.x<this.bounds.x1 || loc.x>this.bounds.x2 ||
            loc.y<this.bounds.y1 || loc.y>this.bounds.y2 ||
            loc.z<this.bounds.z1 || loc.z>this.bounds.z2 )
             return false;
        return true;
    }
    getVoxelLocInsideChunk(loc){ 
        let innerLoc={x: loc.x-this.bounds.x1,y: loc.y-this.bounds.y1,z: loc.z-this.bounds.z1};
        if(!this.hasValidBlocks())
            return {loc:innerLoc,type:emptyBlock,error:'chunk is not loaded'};
        if(!this.blocks[innerLoc.y+1] || !this.blocks[innerLoc.y+1][innerLoc.z+1])
            return {loc:innerLoc,type:emptyBlock,error:'voxel is outside loaded chunk data'};
        let type = this.blocks[innerLoc.y+1][innerLoc.z+1][innerLoc.x+1]; // take neighbor chunk buffer in account
        return {loc:innerLoc,type}
    }
    setVoxelLocInsideChunk(blockType,loc){ 
        let innerLoc={x: loc.x-this.bounds.x1,y: loc.y-this.bounds.y1,z: loc.z-this.bounds.z1};
        if(!this.hasValidBlocks())
            return {loc:innerLoc,type:emptyBlock,error:'chunk is not loaded'};
        if(!this.blocks[innerLoc.y+1] || !this.blocks[innerLoc.y+1][innerLoc.z+1])
            return {loc:innerLoc,type:emptyBlock,error:'voxel is outside loaded chunk data'};
        let type = this.blocks[innerLoc.y+1][innerLoc.z+1][innerLoc.x+1]; // take neighbor chunk buffer in account
        this.blocks[innerLoc.y+1][innerLoc.z+1][innerLoc.x+1] = blockType; // replace Block Type
        return {loc:innerLoc,type}
    }
    buildModel(){
        //if(this.original.verts.length>0) return; // already built
        if(!this.isDirtyModel) return; // already built

        this.message.voxelSize = this.voxelSize;
        this.message.blocks=this.blocks;            
        this.worker.postMessage(this.message);
        this.worker.onmessage=(model)=>{
            this.original.verts = model.data.verts;
            this.faces = model.data.faces;
            this.faceColors = model.data.colors;
            this.isDirtyModel = false;
            //this.blocks = model.data.blocks;
        }
    }
    copyTo(targetChunk){
        targetChunk.name = this.name;
        targetChunk.original.verts = this.original.verts.map(vert=>{return {...vert}});
        targetChunk.faces = this.faces.map(indexes=>{return [...indexes]});
        targetChunk.faceColors = this.faceColors.map(color=>{return {...color}});
        targetChunk.blocks = JSON.parse(JSON.stringify(this.blocks));
        targetChunk.bounds = {...this.bounds};
        targetChunk.paddedBounds = {...this.paddedBounds};
        targetChunk.worldLoc = {...this.worldLoc};
    }

    toStorage(){
        let compressed = '';
        let blockArray = [];
        for(let i_depth=0; i_depth<this.blocks.length; i_depth++){
            for(let i_row = 0; i_row < this.blocks[i_depth].length; i_row++){
                for(let i_col = 0; i_col < this.blocks[i_depth][i_row].length; i_col++){
                    blockArray.push(this.blocks[i_depth][i_row][i_col]);
                }
            }
        }

        let numOfTheSame = 0;
        let currentBlock = blockArray[0];
        for(let i=0;i<blockArray.length;i++){
            if(blockArray[i]===currentBlock){
                numOfTheSame++;
            }
            else{
                compressed+=','+numOfTheSame+','+currentBlock;
                numOfTheSame = 1;
                currentBlock = blockArray[i];
            }
        } 
        compressed+=','+numOfTheSame+','+currentBlock;

        return compressed.substring(1);
    }

    fromStorage(loc){
        let blockArray = [];
        let unCompress = localStorage[loc].split(',');
        
        for(let i_ptr=0; i_ptr < unCompress.length; i_ptr+=2){
            let numOfTheSame = unCompress[i_ptr];
            let currentBlock = unCompress[i_ptr+1];
            for(let i = 0; i < numOfTheSame; i++){
                blockArray.push(currentBlock);
            }
        }

        let ptr = 0;
        let newBlocks = [];
        for(let i_depth=0; i_depth<this.depth+2; i_depth++){
            newBlocks[i_depth] = [];
            for(let i_row = 0; i_row < this.numRows+2; i_row++){
                newBlocks[i_depth][i_row] = [];
                for(let i_col = 0; i_col < this.numCols+2; i_col++){
                    newBlocks[i_depth][i_row][i_col]=Number(blockArray[ptr++]);
                }
            }
        }
        this.blocks = newBlocks;
        //console.log(newBlocks,this.blocks);
    }
}
