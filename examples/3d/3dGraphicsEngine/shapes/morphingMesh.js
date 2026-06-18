class MorphingMesh extends Model{
    create(){
        this.currentKeyFrame = 0;
        this.tweenCnt = 0;
        this.animMeshes = [];
        this.meshData.forEach(data => {this.animMeshes.push(new Mesh({meshData:data}));});
        this.original.verts = this.animMeshes[0].original.verts.map(vert=>{return {...vert}});
        this.faceColors = this.animMeshes[0].faceColors.map(faceColor=>{return {...faceColor}});
        this.faces = this.animMeshes[0].faces.map(face=>[...face]);
    }

    update(delta){        
        this.tweenCnt +=5;
        if(this.tweenCnt >= 100){
            this.currentKeyFrame ++;
            if(this.currentKeyFrame >= this.animMeshes.length)
                this.currentKeyFrame = 0;
            this.tweenCnt=0;
        }
        let nextMap = (this.currentKeyFrame===this.animMeshes.length-1)?this.animMeshes[0]:this.animMeshes[this.currentKeyFrame+1];
        this.tweenVerts(this.animMeshes[this.currentKeyFrame], nextMap, this.tweenCnt/100);
    }

    tweenVerts(mesh1, mesh2, percent){
        for(let i_vert=0; i_vert < this.original.verts.length; i_vert++){
            let newPoint ={
                x:lerp(mesh1.original.verts[i_vert].x, mesh2.original.verts[i_vert].x, percent),
                y:lerp(mesh1.original.verts[i_vert].y, mesh2.original.verts[i_vert].y, percent),
                z:lerp(mesh1.original.verts[i_vert].z, mesh2.original.verts[i_vert].z, percent)
            }
            this.original.verts[i_vert]={...newPoint};
        }
    }   
}