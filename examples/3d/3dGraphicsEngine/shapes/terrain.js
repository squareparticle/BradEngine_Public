class Terrain extends Plane{
    constructor(params){        
        super({...params, axis:"y"});
        this.gridSize = {width:this.numCols,height:this.numRows};
        (!this.maxHeight) && console.log('>>>>> Missing Max Height <<<<<');

        if(this.image){
            let heightData = HeightMapper.getHeightValuesFromImageData(this.gridSize,getImageData(this.image));
            HeightMapper.buildHeightVerts(this.gridSize,this.original.verts, heightData, this.maxHeight);
        }

        if(this.fn){
            this.z = 0;
            HeightMapper.generateHeightVerts(this.gridSize,this.original.verts, this.fn, this.z, 10, this.maxHeight);
        }        
    }

    update(delta){
        if(this.fn){
            this.z += 1 *delta;
            HeightMapper.generateHeightVerts(this.gridSize,this.original.verts, this.fn, this.z, 10, this.maxHeight);
        }
    }
}