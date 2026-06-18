class Plane extends Model{
    create(){
        for(let y=0; y<this.numRows; y++){
            for(let x=0; x<this.numCols; x++){            
                if(this.axis==="x") this.original.verts.push({x:0,y:(x-this.numCols/2)+.5,z:(y*-this.numRows/2)+.5});
                if(this.axis==="y") this.original.verts.push({x:(x-this.numCols/2)+.5,y:0,z:(y-this.numRows/2)+.5});
                if(this.axis==="z") this.original.verts.push({x:(x-this.numCols/2)+.5,y:(y-this.numRows/2)+.5,z:0});

                let topLeft = (y*this.numCols)+x;  
                let topRight = (y*this.numCols)+(x+1);
                let botRight = ((y+1)*this.numCols)+(x+1);
                let botLeft = ((y+1)*this.numCols)+x;
                if(y+1 < this.numRows && x+1 < this.numCols){
                    if(this.useQuads){ // create squares
                        this.faces.push([topLeft,topRight,botRight,botLeft]);
                    }
                    else{// create triangles
                        this.faces.push([topLeft,topRight,botRight]);
                        this.faces.push([botRight,botLeft,topLeft]);
                    }
                }
            }
        }
    }
}