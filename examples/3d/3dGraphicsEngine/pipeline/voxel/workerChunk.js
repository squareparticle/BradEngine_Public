importScripts('../heightMapper.js');
importScripts('../../voxelEngine/blockTypes.js');
importScripts('../../../../../src/js/lib/perlin.js');

class Tools{
    static overideObject(obj, params){
        if(!params) return;
        
        for (const [key, value] of Object.entries(params)) {
            obj[key] = value;
        }
    }
}

class Voxel{

    static buildVoxelData(faceIndex, pos, block){
        if (block.type === emptyBlock) return {verts:[], faces:[], colors:[]};
        
        let blank = 0;
        let draw = 1;

        let cubeVerts=[
            //Front 
            {x:-1,y:1,z:1},          // 0
            {x:1,y:1,z:1},           // 1
            {x:-1,y:-1,z:1},         // 2
            {x:1,y:-1,z:1},          // 3

            //Back
            {x:-1,y:1,z:-1},         // 4
            {x:1,y:1,z:-1},          // 5
            {x:-1,y:-1,z:-1},        // 6
            {x:1,y:-1,z:-1},         // 7
        ];

        let cubeFaces=[
            [2,3,1,0], // Back          -0
            [6,2,0,4], // Left Side     -1
            [0,1,5,4], // Bottom        -2
            [7,3,2,6], // Top           -3
            [4,5,7,6], // Front         -4
            [5,1,3,7]  // Right side    -5
        ];

        // move the voxel into location of the chunk
        cubeVerts.forEach(vert=>{
            vert.x=vert.x+(pos.x);
            vert.y=vert.y+(pos.y);
            vert.z=vert.z+(pos.z);
        })

        let includedFaces = []; //[0,1,2,3,4,5];
        if(block.neighbors.back===draw) includedFaces.push(0);
        if(block.neighbors.left===draw) includedFaces.push(1);
        if(block.neighbors.below===draw) includedFaces.push(2);
        if(block.neighbors.above===draw) includedFaces.push(3);
        if(block.neighbors.front===draw) includedFaces.push(4);
        if(block.neighbors.right===draw) includedFaces.push(5);

        let vertsTable = [];
        let verts = [];
        let faces = [];
        let colors = [];

        // remove vert duplicates in a vert dictionary 
        for(let i_face=0; i_face<includedFaces.length; i_face++){
            for(let i=0; i < cubeFaces[includedFaces[i_face]].length; i++){
                let vertIndex = cubeFaces[includedFaces[i_face]][i];
                vertsTable[vertIndex+""] = cubeVerts[cubeFaces[includedFaces[i_face]][i]];
            }
        }

        // reindex to new vert size
        for(let i_vert=0; i_vert < cubeVerts.length; i_vert++){
            if(i_vert+"" in vertsTable){
                verts.push(vertsTable[i_vert+""]);
                vertsTable[i_vert+""]=verts.length-1;
            }
        }        

        // remap included Faces to reduced verts
        for(let i_face=0; i_face<includedFaces.length; i_face++){
            let face = [];
            for(let i=0; i < cubeFaces[includedFaces[i_face]].length; i++){
                face[i]=vertsTable[cubeFaces[includedFaces[i_face]][i]];
                face[i]+=faceIndex;
            }
            faces.push(face);
            colors.push(blockColors[block.type][includedFaces[i_face]]);
        }       

         return {verts, faces, colors};
    } 
}

class WorkerChunk {
    
    constructor(params){
        this.groundHeight = 10;
        this.numCols = 20;
        this.numRows = 20;
        this.depth = 50;
        this.verts=[];
        this.faces = [];
        this.faceColors = [];
        this.blocks=[];
        Tools.overideObject(this,params);
        if(this.blocks.length===0)
            this.genererateWorldChunk();
        else
            this.createModelChunk();
    }

    getGoundLevel(position, blockType){
        let currentHeight = Math.round(HeightMapper.getHeightAt('simplex',{x:position.x,y:position.z,z:0},20,this.groundHeight));        
        // let rightBlock = Math.round(HeightMapper.getHeightAt('simplex',{x:position.x+1,y:position.z,z:0},20,this.groundHeight));
        // let leftBlock = Math.round(HeightMapper.getHeightAt('simplex',{x:position.x-1,y:position.z,z:0},20,this.groundHeight));
        // let frontBlock = Math.round(HeightMapper.getHeightAt('simplex',{x:position.x,y:position.z-1,z:0},20,this.groundHeight));
        // let backBlock = Math.round(HeightMapper.getHeightAt('simplex',{x:position.x,y:position.z+1,z:0},20,this.groundHeight));

        if(position.y === currentHeight) blockType = grassBlock; 
        if(position.y === currentHeight){
            if(position.x===0 && position.z===0)
                blockType = stoneBlock; 
        }
        if(position.y < currentHeight) blockType = dirtBlock;
        return blockType; 
    }

    getBlockType(position){
        let block = this.getGoundLevel(position, emptyBlock); 
        return block;
    }

    genererateWorldChunk(){
        //find all the block types
        for(let i_depth=0; i_depth<this.depth+2; i_depth++){ // add (up down) overlap with bordering chunks
            this.blocks[i_depth]=[];
            for(let i_rows=0; i_rows<this.numRows+2; i_rows++){ // add (front back) overlap with bordering chunks
                this.blocks[i_depth][i_rows]=[];
                for(let i_cols=0; i_cols<this.numCols+2; i_cols++){ // add (left right) overlap with bordering chunks
                    let block = this.getBlockType({
                        x:(i_cols + (this.numCols)*this.loc.x)-1,  // find the current blocktype starting at the end of the 
                        y:(i_depth + (this.depth)*this.loc.y)-1,   // neighboring chunk all the way to the begining of the 
                        z:(i_rows+(this.numRows)*this.loc.z)-1     // adjacent neighbor chunk.
                    });                    
                    this.blocks[i_depth][i_rows][i_cols]=block;
                }
            }
        }
        return this.blocks;
    }

    createModelChunk(){
        // generate all the verts and faces
        let faceIndex = 0;        
        for(let i_depth=1; i_depth<this.depth+1; i_depth++){
            for(let i_rows=1; i_rows<this.numRows+1; i_rows++){
                for(let i_cols=1; i_cols<this.numCols+1; i_cols++){

                    let neighbors = this.getNeighbors(this.blocks,{x:i_cols,y:i_depth,z:i_rows});  
                    let type = this.blocks[i_depth][i_rows][i_cols];

                    let voxel=Voxel.buildVoxelData(faceIndex, {
                        x:(i_cols*2)-(this.numCols-1)-this.voxelSize.x,
                        //y:-(i_depth*2)+(this.depth-1), <- center by y
                        y:-(i_depth*2),
                        z:(i_rows*2)-(this.numRows-1)-this.voxelSize.z,
                    }, {neighbors, type});
                    this.verts = this.verts.concat(voxel.verts);
                    this.faces = this.faces.concat(voxel.faces);
                    this.faceColors = this.faceColors.concat(voxel.colors);
                    faceIndex = this.verts.length;
                }
            }
        }
        //console.log(this.faces.length);
    }

    getNeighbors(blocks,pos){

        let blank = 0;
        let draw = 1;

        let voxelShape = {
            front: blank,
            back:  blank,
            left:  blank,
            right: blank,
            above: blank,
            below: blank
        }
        // no block to draw
        if(!blocks[pos.y][pos.z][pos.x]) return voxelShape;

        if((blocks[pos.y+1][pos.z][pos.x]===0)) voxelShape.above=draw;
        if((blocks[pos.y-1][pos.z][pos.x]===0)) voxelShape.below=draw;
        if((!blocks[pos.y][pos.z][pos.x-1])) voxelShape.left=draw;
        if((!blocks[pos.y][pos.z][pos.x+1])) voxelShape.right=draw;
        if((!blocks[pos.y][pos.z-1][pos.x])) voxelShape.front=draw;
        if((!blocks[pos.y][pos.z+1][pos.x])) voxelShape.back=draw;

        return voxelShape;
    }    
}

this.onmessage = function(e){
    
    if(e.data){
        let chunk = new WorkerChunk({...e.data});

        if(!e.data.blocks)
            this.postMessage({blocks:chunk.blocks});
        else
            this.postMessage({verts:chunk.verts, faces: chunk.faces, colors: chunk.faceColors});
        
        // throw JSON.stringify({data:data}) // debug worker
    }
}
