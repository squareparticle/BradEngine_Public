class HeightMapper{
    static getHeightValuesFromImageData(gridSize,imageData){
        let heightMap=[];
        for(let y=0; y< gridSize.height; y++){
            heightMap[y]=[];
            for(let x=0; x< gridSize.width; x++){
                heightMap[y][x] = imageData.getImageData(x, y, 1, 1).data[0];
            }
        }
        return heightMap;
    }

    static tweenHeightVerts(gridSize, verts, heightData1, heightData2, percent, maxHeight){
        for(let y=0; y< gridSize.height; y++){
            for(let x=0; x< gridSize.width; x++){
                let height1 = heightData1[y][x];
                let height2 = heightData2[y][x];
                let height = lerp(height1, height2, percent)
                let i_vert = (y * gridSize.width)+x;
                verts[i_vert].y=-height*1/maxHeight; 
            }
        }
    }

    // static buildHeightVerts(gridSize, verts, heightData, maxHeight){
    //     for(let y=0; y< gridSize.height; y++){
    //         for(let x=0; x< gridSize.width; x++){
    //             let height = heightData[y][x];
    //             let i_vert = (y * gridSize.width)+x;
    //             verts[i_vert].y=-height*1/maxHeight; 
    //         }
    //     }
    // }

    // static generateHeightVerts(gridSize, verts, fn, depth, scale, maxVertHeight){
    //     let noisefn = fn === 'simplex' ? noise.simplex3 : noise.perlin3;
    //     for (let y = 0; y < gridSize.height; y++) {
    //         for (let x = 0; x < gridSize.width; x++) {
    //             let value = noisefn(x / scale, y / scale, depth);
    //             let height = (1 + value) * 1.1 * 128;
    //             height = (height/255)*maxVertHeight;
    //             let i_vert = (y * gridSize.width)+x;
    //             verts[i_vert].y=-height; 
    //         }
    //     }        
    // }

    static getHeightAt(fn, pos, scale, maxVertHeight){
        let noisefn = fn === 'simplex' ? noise.simplex3 : noise.perlin3;
        let value = noisefn(pos.x / scale, pos.y / scale, pos.z);
        let height = (1 + value) * 1.1 * 128;
        height = (height/255)*maxVertHeight;
        return height;
    }

    // colorTerrainMesh(){
    //     this.terrain.faceColors=[];
    //     for(let i_face=0; i_face< this.terrain.indexes.length; i_face++){
    //          this.terrain.faceColors[i_face] = {r:0,g:255,b:0};
    //          let heightAvg = 0;
    //          for(let i_vert=0; i_vert< this.terrain.indexes[i_face].length; i_vert++){
    //             heightAvg+=Math.abs( this.terrain.verts[this.terrain.indexes[i_face][i_vert]].y);
    //          }
    //          heightAvg = (heightAvg/this.terrain.indexes[i_face].length) * this.maxHeight;
    //          if(heightAvg < 30) this.terrain.faceColors[i_face] = {r:0,g:0,b:255};

    //          if(heightAvg > 100) this.terrain.faceColors[i_face] = {r:139,g:69,b:19};
    //          if(heightAvg > 200) this.terrain.faceColors[i_face] = {r:255,g:255,b:255};
    //     }
    // }

}
