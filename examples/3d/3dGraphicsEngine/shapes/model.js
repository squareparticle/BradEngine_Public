class Model{
    constructor(params){
        this.scale = {x:1,y:1,z:1};
        this.faceColors={r:255,g:0,b:0};
        this.physicsScale = 1;
        this.pos={x:0,y:0,z:0};
        this.rot={x:0,y:0,z:0};
        this.physicsQuaternion = null;
        this.isTwoSided = false;
        this.useQuads=true;
        this.isVisible=true;

        this.edit(params);

        this.faces=[];
        this.original={verts:[]};

        this.create();
        this.setColors(this.faceColors);
    }

    setColors(colors){
        this.faceColors = colors;
        if(!isArray(this.faceColors)) this.faceColors=this.faces.map(()=>this.faceColors);
    }

    edit(params){Tools.overideObject(this,params);}

    rotateBy(x,y,z){ this.rot.x+=x; this.rot.y+=y; this.rot.z+=z; }
    rotateTo(x,y,z){ this.rot.x=x; this.rot.y=y; this.rot.z=z; }
    scaleBy(x,y,z){ this.scale.x+=x; this.scale.y+=y; this.scale.z+=z; }
    scaleTo(x,y,z){ this.scale.x=x; this.scale.y=y; this.scale.z=z; }
    moveBy(x,y,z){ this.pos.x+=x; this.pos.y+=y; this.pos.z+=z; }
    moveTo(x,y,z){ this.pos.x=x; this.pos.y=y; this.pos.z=z; }

    update(delta){}

    toWorldSpace(){

        this.verts = this.original.verts.map(vert=>{
            return {x:vert.x * this.scale.x, y:vert.y * this.scale.y, z: vert.z * this.scale.z};
        });        

        if(this.physicsQuaternion){
            this.rotateFromPhysicsQuaternion(this.verts);
        }
        else{
            Pipeline3D.rotate(this.rot.x,this.rot.y,this.rot.z, this.verts);
        }

        this.verts.forEach(vert=>{
            vert.x = vert.x + this.pos.x;
            vert.y = vert.y + this.pos.y;
            vert.z = vert.z + this.pos.z;
        });
    }

    toCameraSpace(camera){
        this.verts.forEach(vert=>{
            vert.x = vert.x + camera.pos.x;
            vert.y = vert.y + camera.pos.y;
            vert.z = vert.z + camera.pos.z;
        });
        Pipeline3D.rotate(0, 0, camera.rot.z, this.verts);
        Pipeline3D.rotate(0, camera.rot.y, 0, this.verts);
        Pipeline3D.rotate(camera.rot.x, 0, 0, this.verts);
    }    

    getScreenVerts(canvas){
        let screenVerts = [];
        for(let i=0; i<this.verts.length; i++){
            screenVerts[i]=Tools.projectTo2D(
                this.verts[i].x,
                this.verts[i].y,
                this.verts[i].z,
                canvas.width, canvas.height
            );
        }
        return screenVerts;
    }

    getFaces(){
        let worldFaces = [];
        for(let i_face=0;i_face<this.faces.length;i_face++){
            worldFaces[i_face]=[];
            for(let index=0;index<this.faces[i_face].length;index++){
                worldFaces[i_face][index]={
                    x:this.verts[this.faces[i_face][index]].x,
                    y:this.verts[this.faces[i_face][index]].y,
                    z:this.verts[this.faces[i_face][index]].z,
                }                    
            }
        }
        return worldFaces;
    }

    getScreenFaces(canvas, worldFaces, lights){
        let screenFaces = [];
        for(let i_face=0;i_face<this.faces.length;i_face++){
            let screenFace={color:this.faceColors[i_face],verts:[], z:0};
            for(let index=0;index<this.faces[i_face].length;index++){
                screenFace.verts[index]=Tools.projectTo2D(
                    this.verts[this.faces[i_face][index]].x,
                    this.verts[this.faces[i_face][index]].y,
                    this.verts[this.faces[i_face][index]].z,
                    canvas.width, canvas.height
                );
            }

            if(Pipeline3D.notCulled(canvas, screenFace.verts, this.isTwoSided)){
                // find the center z of the polygon used for the sort order
                screenFace.z = screenFace.verts.reduce((acc,vert)=>{acc+=vert.z;return acc},0)/screenFace.verts.length;
                // find if any edge of the polygon has a z < 0
                let cameraMin = Math.min(...screenFace.verts.map(vert=>Number(vert.z)));
                let cameraMax = Math.max(...screenFace.verts.map(vert=>Number(vert.z)));

                // if the closest edge of the polygon is too close or to far away then don't draw it
                if(cameraMin < 1 || cameraMax > 4000) continue;

                // light the polygon
                if(screenFace.verts.length>2){ // polys only
                    let faceNormal = Tools3D.normalizePoly(worldFaces[i_face][0], worldFaces[i_face][1], worldFaces[i_face][2]);
                    screenFace.color = Pipeline3D.getLitColor(faceNormal, screenFace.color, lights, lights[0].ambientColor);
                }
                screenFaces.push(screenFace);
            }
        }
        return screenFaces;
    }

    createRidgidBody(type="box", mass=0, size={x:1,y:1,z:1}){ // size needs to be number for radius of a sphere
        if(type === "sphere"){
            let radius = size; 
            const sphereProps = {
                mass, radius,
                position: new CANNON.Vec3(this.pos.x*this.physicsScale, this.pos.y*this.physicsScale, this.pos.z*this.physicsScale),
                shape: new CANNON.Sphere(radius),
            }
            this.body = new CANNON.Body(sphereProps);
        }

        if(type==="box"){
            const boxProps = {
                mass,
                position: new CANNON.Vec3(this.pos.x*this.physicsScale, this.pos.y*this.physicsScale, this.pos.z*this.physicsScale),
                shape: new CANNON.Box(new CANNON.Vec3(size.x,size.y,size.z)),
            }
            this.body = new CANNON.Body(boxProps);
        }
        
        return this.body;
    }

    rotateFromPhysicsQuaternion(vertices){
        for(let i=0; i<vertices.length; i++){
            let physicsVert = new CANNON.Vec3(vertices[i].x, -vertices[i].y, vertices[i].z);
            this.physicsQuaternion.vmult(physicsVert, physicsVert);
            vertices[i].x = physicsVert.x;
            vertices[i].y = -physicsVert.y;
            vertices[i].z = physicsVert.z;
        }
    }

    updatePhyscis(){
        this.pos.x = this.body.position.x;
        this.pos.y = -this.body.position.y;
        this.pos.z = this.body.position.z;
        this.physicsQuaternion = this.body.quaternion;
    }

    updateSoftBodyPhyscis(width, height){
        for (let i = 0; i < this.verts.length; i++) {
            this.original.verts[i].x = this.stitches[i].position.x / width;
            this.original.verts[i].y = -this.stitches[i].position.y / height;
            this.original.verts[i].z = this.stitches[i].position.z;
        }
    }      
}
