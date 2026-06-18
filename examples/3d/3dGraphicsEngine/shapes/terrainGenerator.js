class Terrain extends Plane{
    constructor(params, level){
        super({...params, axis:"y"});
        this.dictMap = [];
        this.level = level;
        this.collisionTest = new PolyCollsion();
    }

    generateFromImage(params){
        this.edit(params);
        this.heightMap=TerrainGenerator.getHeightMapFromImage(getImageData(this.image), this.numRows, this.numCols);
        this.updateVertHeights(this.heightMap);
    }

    generateFromNoise(params){
        this.edit(params);
        this.heightMap=TerrainGenerator.getHeightMapFromNoise(this.noise.fn, this.noise.pos, this.noise.scale, this.noise.maxHeight, this.numCols, this.numRows);
        this.updateVertHeights(this.heightMap);
    }

    generateFlat(params){
        this.heightMap=[];
        for(let y=0;y<this.numRows;y++){
            this.heightMap[y]=[];
            for(let x=0;x<this.numCols;x++){
                this.heightMap[y][x]=0;
            }
        }
        this.updateVertHeights(this.heightMap);
    }

    updateVertHeights(heightMap){
        for(let y=0;y<this.numRows;y++){
            for(let x=0;x<this.numCols;x++){
                this.original.verts[(y*this.numCols)+x].y=-heightMap[y][x];
                this.dictMap[(x-Math.floor(this.numCols/2))+','+(y-Math.floor(this.numRows/2))]={height:heightMap[y][x],ptr:(y*this.numCols)+x};
            }
        }
        return heightMap;
    }

    update(delta){
        if(this.noise?.animate && this.noise?.pos){
            this.noise.pos.y += 1 *delta;
            this.generateFromNoise();
        }
    }   
    
    // use the grid to know what polygon you are on and tween to height
    collideGridMethod(model){
        let cell = {x:Math.floor(model.pos.x/this.scale.x),z:Math.floor(model.pos.z/this.scale.z)};
        let realPos = {x:model.pos.x,z:model.pos.z};
        let cellLoc = {
            x: (Math.abs(realPos.x) - Math.abs(cell.x*this.scale.x))/this.scale.x,
            z: (Math.abs(realPos.z) - Math.abs(cell.z*this.scale.z))/this.scale.z,
        }
        // console.log(`${Math.abs(realPos.x)}-${Math.abs(cell.x*this.scale.x)}=${(Math.abs(realPos.x) - Math.abs(cell.x*this.scale.x))}`)
        // console.log(`${Math.abs(realPos.z)}-${Math.abs(cell.z*this.scale.z)}=${(Math.abs(realPos.z) - Math.abs(cell.z*this.scale.z))}`)
        this.level.addScreenLog("realPos("+realPos.x+',' + realPos.z+") cell("+cell.x+','+cell.z +")");
        this.level.addScreenLog("this.scale("+this.scale.x+',' +this.scale.z+") cellLoc("+cellLoc.x+','+cellLoc.z +")");
        let topLeft = this.dictMap[cell.x+','+cell.z];    
        topLeft.y = this.original.verts[topLeft.ptr].y*this.scale.y;   
        let topRight = this.dictMap[(cell.x+1)+','+cell.z];
        topRight.y = this.original.verts[topRight.ptr].y*this.scale.y;   
        let botLeft = this.dictMap[cell.x+','+(cell.z+1)];
        botLeft.y = this.original.verts[botLeft.ptr].y*this.scale.y;   
        let botRight = this.dictMap[(cell.x+1)+','+(cell.z+1)];
        botRight.y = this.original.verts[botRight.ptr].y*this.scale.y;   

        let newY = topLeft.y;
        if(cellLoc.x+cellLoc.z<=1){
            let horY = lerp(topLeft.y, topRight.y, cellLoc.x);
            let horYDiff = topLeft.y - horY;
            let vertY = lerp(topLeft.y, botLeft.y, cellLoc.z);
            let vertYDiff = topLeft.y - vertY;            
            newY-=(vertYDiff )
            newY-=(horYDiff )
            this.level.addScreenLog("diff:("+horYDiff +","+vertYDiff+")");
            this.level.addScreenLog("topLeft.y:"+topLeft.y +" topRight.y:"+topRight.y);
            this.level.addScreenLog("botLeft.y:"+botLeft.y +" botRight.y:"+botRight.y);
            this.level.addScreenLog("horY:"+horY + " vertY:"+vertY);             
            this.level.addScreenLog(`Y:${topLeft.y}+${vertYDiff}*(1-${cellLoc.x}):${(vertYDiff * (1-cellLoc.x))}`); 
            this.level.addScreenLog(`Y:${horYDiff}*(1-${cellLoc.z}):${(horYDiff * (1-cellLoc.z))}`); 
        }
        this.level.addScreenLog("newY:"+newY);
        model.pos.y = newY;
    }
    // search every polygon in the terrain to find collision
    collidePolyMethod(model){
        for(let i_face=0;i_face<this.faces.length;i_face++){
            let poly = [];
            for(let index=0;index<3;index++){
                poly[index]={
                    x:this.original.verts[this.faces[i_face][index]].x*this.scale.x,
                    y:this.original.verts[this.faces[i_face][index]].y*this.scale.y,
                    z:this.original.verts[this.faces[i_face][index]].z*this.scale.z
                }                    
            }
            let hitVert = this.collisionTest.getCollisionLoc(poly,{...model.pos,y:1000},{x:0,y:1,z:0},10);
            if(hitVert.x!==0 && hitVert.y!==0 && hitVert.z!==0 ){
                // console.log({...poly},{...model.pos},{x:0,y:-1,z:0})
                // console.log("found")
                model.pos.y=hitVert.y;
                return;
            }
        }
        
    }
    collide(model){
        //this.collideGridMethod(model);
        this.collidePolyMethod(model);
    }
}

class TerrainGenerator{
    static getHeightMapFromImage(imageData, height, width){
        let heightMap=[];
        for(let y=0;y<height;y++){
            heightMap[y]=[];
            for(let x=0;x<width;x++){
                heightMap[y][x]=imageData.getImageData(x,y,1,1).data[0];
            }
        }
        return heightMap;
    }

    static getHeightMapFromNoise(fn, pos, scale, maxHeight, width, height){
        let heightMap=[];
        let noisefn = fn === 'simplex' ? noise.simplex3 : noise.perlin3;
        for (let y = 0; y < height; y++) {
            heightMap[y]=[];
            let heightsOut = '';
            for (let x = 0; x < width; x++) {
                heightMap[y][x]=TerrainGenerator.getHeightFromNoise(noisefn, {x:x+pos.x,y:pos.y,z:y+pos.z}, scale, maxHeight);
                heightsOut += `(${x-1},${y-1}):${heightMap[y][x]*5} `;
            }
            //console.log(heightsOut);
        }
        return heightMap;          
    }

    static getHeightFromNoise(noisefn, pos, scale, maxHeight){
        let value = noisefn(pos.x / scale, pos.z / scale, pos.y);
        let height = (1 + value) * 1.1 * 128;
        height = (height/255)*maxHeight;
        return height;
    }
}