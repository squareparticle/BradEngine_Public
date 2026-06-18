class Mesh extends Model{
    create(){
        
        this.original.verts=[];
        this.faces=[];
        
        this.materials = {};
        this.elements = {}
        let currentElement = '';
        let currentMaterial='';
        let elementColors = {};

        // find material colors
        let lines = this.meshData.split('\n');
        for(let i=0; i<lines.length; i++){
            lines[i] = lines[i].trim();
            if(lines[i].startsWith('newmtl')){
                currentMaterial = lines[i].split(' ')[1];                
            }
            if(lines[i].startsWith('Kd')){
                let matColor = lines[i].split(' ');
                this.materials[currentMaterial]=
                {
                    r: Number(matColor[1])*255,
                    g: Number(matColor[2])*255,
                    b: Number(matColor[3])*255,
                }
            }
        }

        // find the faces and verts
        let faceElementName = [];
        lines = this.meshData.split('\n');
        for(let i=0; i<lines.length; i++){
            lines[i] = lines[i].trim();
            if(lines[i].startsWith('o')){
                currentElement=lines[i].split(' ')[1];
            }
            if(lines[i].startsWith('usemtl')){
                elementColors[currentElement]=lines[i].split(' ')[1];
            }            
            if(lines[i].startsWith('v')){
                let parts = lines[i].split(' ');
                let vert = {
                    x:Number(parts[1]),
                    y:Number(parts[2]),
                    z:Number(parts[3])
                }
                this.original.verts.push(vert);
            }
            if(lines[i].startsWith('f')){
                let parts = lines[i].split(' ');
                let face = [];
                for(let i_face=1; i_face<parts.length; i_face++)
                    face[i_face-1] = Number(parts[i_face])-1;

                this.faces.push(face);
                faceElementName.push(currentElement)
            }
        }

        this.faceColors = [];
        // color the elements
        for(let i=0; i<this.faces.length; i++){
            this.faceColors[i]=this.materials[elementColors[faceElementName[i]]];
        }
        //console.log(this.original.verts, this.faces);
    }
}