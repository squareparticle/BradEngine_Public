class Pipeline3D{
    static K3DtoModel(k3d){
        let mesh = {
            verts:[],
            indexes:[],
            normals:[],
            normalIndexes:[],            
            uvs:[]
        }

        let n = 3;
        mesh.verts = k3d.c_verts.reduce((r, e, i) => (i % n ? r[r.length - 1].push(e) : r.push([e])) && r, []).map(e=>{return {x:e[0],y:e[1],z:e[2]}});
        mesh.indexes = k3d.i_verts.reduce((r, e, i) => (i % n ? r[r.length - 1].push(e) : r.push([e])) && r, []);
        mesh.normals = k3d.c_norms.reduce((r, e, i) => (i % n ? r[r.length - 1].push(e) : r.push([e])) && r, []).map(e=>{return {x:e[0],y:e[1],z:e[2]}});
        mesh.normalIndexes = k3d.i_norms.reduce((r, e, i) => (i % n ? r[r.length - 1].push(e) : r.push([e])) && r, []);

        return mesh;
    }
    
    static parseDirectXFile(content){
        let lines = content.split('\n');
        lines = lines.map(line=>line.trim()).filter(line=>line.length>0);

        let mesh = {
            verts:[],
            indexes:[],
            normals:[],
            normalIndexes:[],            
            uvs:[]
        }

        let numVerts = 0;
        let currentVert = 0;
        let numIndexes = 0;
        let currentIndex = 0;
        
        let numNorms = 0;
        let currentNorm = 0;
        let numNormalIndexes = 0;
        let currentNormalIndex = 0;

        let mode = 'Searching';
        lines.forEach(line => {
            switch(mode){
                case 'Searching':
                    // console.log('searching:'+line);
                    if(line.startsWith('Mesh '))
                        mode = 'MeshStart'
                    if(line.startsWith('MeshNormals'))
                        mode = 'MeshNormals'                        
                break;
                case 'MeshStart':
                    // console.log('MeshStart:'+line);
                    if(line==='{') break;
                    let vertParts = line.split(';');
                    if(vertParts.length === 2){
                        numVerts = parseInt(vertParts[0]);
                    }
                    else{
                        mesh.verts.push({x:parseFloat(vertParts[0]), y:parseFloat(vertParts[1]), z:parseFloat(vertParts[2]) })
                        if(++currentVert===numVerts){
                            mode = 'Indexes';
                            break;
                        }
                    }
                break;
                case 'Indexes':
                    // console.log('MeshStart:'+line);
                    if(line==='') break;
                    let indexOuterParts = line.split(';');
                    if(indexOuterParts.length === 2){
                        numIndexes = parseInt(indexOuterParts[0]);
                    }
                    else{
                        let indexParts = indexOuterParts[1].split(',');
                        indexParts.map(p=>parseInt(p));                        
                        mesh.indexes.push(indexParts)
                        if(++currentIndex===numIndexes){
                            mode = 'Searching';
                            break;
                        }
                    }
                break;
                case 'MeshNormals':
                    // console.log('MeshNormals:'+line);
                    if(line==='{') break;
                    let normalParts = line.split(';');
                    if(normalParts.length === 2){
                        numNorms = parseInt(normalParts[0]);
                    }
                    else{
                        mesh.normals.push({x:parseFloat(normalParts[0]), y:parseFloat(normalParts[1]), z:parseFloat(normalParts[2]) })
                        if(++currentNorm===numNorms){
                            mode = 'NormalIndexes';
                            break;
                        }
                    }
                break;
                case 'NormalIndexes':
                    // console.log('NormalIndexes:'+line);
                    if(line==='') break;
                    let indexOuterParts2 = line.split(';');
                    if(indexOuterParts2.length === 2){
                        numNormalIndexes = parseInt(indexOuterParts2[0]);
                    }
                    else{
                        let indexNormParts = indexOuterParts2[1].split(',');
                        indexNormParts.map(p=>parseInt(p));                        
                        mesh.normalIndexes.push(indexNormParts)
                        if(++currentNormalIndex===numNormalIndexes){
                            mode = 'Searching';
                            break;
                        }
                    }
                break;                
            }            
        });
        return mesh;
    }

    static notCulled(bounds, screenPoints, isTwoSided){
      
        // don't draw anything that is out of bounds
        if(!screenPoints.reduce((acc,point)=>{ 
            if(point.x >= 0 && point.x <= bounds.width && point.y >= 0 && point.y <= bounds.height)
                acc=true;
            return acc;
        },false))
            return false;

        if(screenPoints.length > 2 && !isTwoSided){
            let v1 = {x:screenPoints[0].x-screenPoints[1].x, y:screenPoints[0].y-screenPoints[1].y};
            let v2 = {x:screenPoints[2].x-screenPoints[1].x, y:screenPoints[2].y-screenPoints[1].y};
            
            if((v1.x*v2.y - v1.y*v2.x) < 0) 
                return false;
        }
        return true;
    }
    
    static scale(x,y,z, vertices){
        for(let i=0; i < vertices.length; i++){
            vertices[i].x *= x;  vertices[i].y *= y;  vertices[i].z *= z;
        }
        return vertices;
    }
    
    static scaleStatic(x,y,z, vertices){
        var newVerts = [];
        for(let i=0; i < vertices.length; i++){
            var temp = {
              x: (vertices[i].x * x),
              y: (vertices[i].y * y),
              z: (vertices[i].z * z)
            }
            newVerts.push(temp);
        }
        return newVerts;
    }

    static cosThetaRadians(angle){
        return Math.cos(angle);
    }
    
    static sinThetaRadians(angle){
        return Math.sin(angle);
    }    
    
    static cosTheta(angle){
        return Math.cos(angle*Math.PI/180);
    }
    
    static sinTheta(angle){
        return Math.sin(angle*Math.PI/180);
    }
    
    static translate(x,y,z, vertices){
        for(let i=0; i < vertices.length; i++){
            vertices[i].x+=x; vertices[i].y+=y; vertices[i].z+=z;
        }
        return vertices;
    }
    static translateStatic(x,y,z, vertices){
        var newVerts = [];
        for(let i=0; i < vertices.length; i++){
            newVerts.push({x:vertices[i].x+=x, y:vertices[i].y+=y,z:vertices[i].z+=z});
        }
        return newVerts;
    } 

    static scale(x,y,z, vertices){
        for(let i=0; i < vertices.length; i++){
            vertices[i].x*=x; vertices[i].y*=y; vertices[i].z*=z;
        }
        return vertices;
    }
    static scaleStatic(x,y,z, vertices){
        var newVerts = [];
        for(let i=0; i < vertices.length; i++){
            newVerts.push({x:vertices[i].x*=x, y:vertices[i].y*=y,z:vertices[i].z*=z});
        }
        return newVerts;
    }    

    static rotate(x,y,z, vertices){
        for(let i=0; i < vertices.length; i++){
            vertices[i] = Pipeline3D.rotateVert(vertices[i], x, y, z);
        }
        return vertices;
    }
    static rotateStatic(x,y,z, vertices){
        var newVerts = [];
        for(let i=0; i < vertices.length; i++){
            newVerts.push(Pipeline3D.rotateVert(vertices[i], x, y, z));
        }
        return newVerts;
    }
    
    static rotateStaticRadians(x,y,z, vertices){
        var newVerts = [];
        for(let i=0; i < vertices.length; i++){
            newVerts.push(Pipeline3D.rotateVertRadians(vertices[i], x, y, z));
        }
        return newVerts;
    }

    static rotateVert(obj, rx, ry, rz) {
        var wrld = {};
        var temp = {};
    
        temp.y = obj.y*Pipeline3D.cosTheta(rx) - obj.z*Pipeline3D.sinTheta(rx);
        temp.z = obj.z*Pipeline3D.cosTheta(rx) + obj.y*Pipeline3D.sinTheta(rx);
        wrld.y=temp.y;
        wrld.z=temp.z;
    
        temp.z = wrld.z*Pipeline3D.cosTheta(ry) - obj.x*Pipeline3D.sinTheta(ry);
        temp.x = obj.x*Pipeline3D.cosTheta(ry) + wrld.z*Pipeline3D.sinTheta(ry);
        wrld.z=temp.z;
        wrld.x=temp.x;
    
        temp.x = wrld.x*Pipeline3D.cosTheta(rz) - wrld.y*Pipeline3D.sinTheta(rz);
        temp.y = wrld.y*Pipeline3D.cosTheta(rz) + wrld.x*Pipeline3D.sinTheta(rz);
        wrld.x=temp.x;
        wrld.y=temp.y;
    
        return wrld;
    } 

    static rotateVertRadians(obj, rx, ry, rz) {
        var wrld = {};
        var temp = {};
    
        temp.y = obj.y*Pipeline3D.cosThetaRadians(rx) - obj.z*Pipeline3D.sinThetaRadians(rx);
        temp.z = obj.z*Pipeline3D.cosThetaRadians(rx) + obj.y*Pipeline3D.sinThetaRadians(rx);
        wrld.y=temp.y;
        wrld.z=temp.z;
    
        temp.z = wrld.z*Pipeline3D.cosThetaRadians(ry) - obj.x*Pipeline3D.sinThetaRadians(ry);
        temp.x = obj.x*Pipeline3D.cosThetaRadians(ry) + wrld.z*Pipeline3D.sinThetaRadians(ry);
        wrld.z=temp.z;
        wrld.x=temp.x;
    
        temp.x = wrld.x*Pipeline3D.cosThetaRadians(rz) - wrld.y*Pipeline3D.sinThetaRadians(rz);
        temp.y = wrld.y*Pipeline3D.cosThetaRadians(rz) + wrld.x*Pipeline3D.sinThetaRadians(rz);
        wrld.x=temp.x;
        wrld.y=temp.y;
    
        return wrld;
    } 
    
    static getLitColor(faceNormal, faceColor, lights, ambientLight){        
        let angle=Tools3D.dotProduct(faceNormal, lights[0].norm);
        if(angle>=0)
            return {
                r: Tools.clampMax(((faceColor.r * angle) * (lights[0].col.r/255)) + (faceColor.r*(ambientLight.r/255)),255),
                g: Tools.clampMax(((faceColor.g * angle) * (lights[0].col.g/255)) + (faceColor.g*(ambientLight.g/255)),255),
                b: Tools.clampMax(((faceColor.b * angle) * (lights[0].col.b/255)) + (faceColor.b*(ambientLight.b/255)),255)
            };
        return {
            r: faceColor.r*(ambientLight.r/255),
            g: faceColor.g*(ambientLight.g/255),
            b: faceColor.b*(ambientLight.b/255)
        }
    }
    
    static buildMeshObject(level, scene, pos, rotation, meshes){
        let parts = [];
        meshes.forEach(meshDescript=>{
            let mesh = new MeshObject(level.loadedMeshes[meshDescript.path]);
            mesh.path = meshDescript.path;
            mesh.color = meshDescript.color;
            mesh.pos=pos;
            mesh.rotation = rotation;
            scene.meshObjects.push(mesh);
            parts.push(mesh);
        });
        return parts;
    }    
}

class Tools2D{
    static normalize(v) {
        let length=Math.sqrt(v.x*v.x + v.y*v.y);       
        if(length===0) return v;
        return {x:v.x/length,y:v.y/length};
    }

    static distanceBetweenVerts( v1, v2 ){
        var dx = v1.x - v2.x;
        var dy = v1.y - v2.y;
        return Math.sqrt( dx * dx + dy * dy);
    }

    static fromAngle (angle, length) {
        if (typeof length === 'undefined')  length = 1;        
        return {x:length * Math.cos(angle), y:length * Math.sin(angle)};
    };

    static getRandomVector() {
        return Tools2D.fromAngle(Math.random() * TWO_PI);
    }; 

    static mag(v){return Math.sqrt(v.x*v.x + v.y*v.y);}

    static addVector(vector1, amount){return {x: vector1.x+amount, y: vector1.y+amount};}
    static subVector(vector1, amount){return {x: vector1.x-amount, y: vector1.y-amount};}
    static multVector(vector1, amount){return {x: vector1.x*amount, y: vector1.y*amount};}
    static divVector(vector1, amount){return {x: vector1.x/amount, y: vector1.y/amount};}    

    static addVectors(vector1, vector2){return {x: vector1.x+vector2.x, y: vector1.y+vector2.y};}
    static subVectors(vector1, vector2){return {x: vector1.x-vector2.x, y: vector1.y-vector2.y};}
    static multVectors(vector1, vector2){return {x: vector1.x*vector2.x, y: vector1.y*vector2.y};}    
    static divVectors(vector1, vector2){return {x: vector1.x/vector2.x, y: vector1.y/vector2.y};}      

}

class Tools3D{

    static limit(v,max) {
        const mSq = Tools3D.magSq(v);
        if (mSq > max * max) {
            let n = Tools3D.divVector(v, Math.sqrt(mSq)); //normalize it
            v = Tools3D.multVector(n, max);
        }
        return v;
    };

    static magSq(v) {
        return v.x * v.x + v.y * v.y + v.z * v.z;
    };      

    static dotProduct(v1, v2) {
        return (v1.x * v2.x) + (v1.y * v2.y) + (v1.z * v2.z);
    }
    
    static crossProduct(v1, v2) {
        let v = {x:0,y:0,z:0};
        v.x= (v1.y * v2.z) - (v2.y * v1.z);
        v.y= (v1.z * v2.x) - (v2.z * v1.x);
        v.z= (v1.x * v2.y) - (v2.x * v1.y);
        return v;
    }
    
    static normalize(v) {
        let length=Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z);       
        if(length===0) return v;
        return {x:v.x/length,y:v.y/length,z:v.z/length};
    }

    static setMag(v, length) {
        let n = Tools3D.normalize(v);
        return Tools3D.multVector(n, length)
    };    

    static normalizePoly(p1, p2, p3){
        let n = {x:0,y:0,z:0};
        let v1 = {x:0,y:0,z:0};
        let v2 = {x:0,y:0,z:0};
        
        v1.x=p1.x-p2.x; v1.y=p1.y-p2.y; v1.z=p1.z-p2.z;
        v2.x=p3.x-p2.x; v2.y=p3.y-p2.y; v2.z=p3.z-p2.z;
        
        n = Tools3D.crossProduct(v2, v1);
        n = Tools3D.normalize(n);
        return n;
    }

    static distanceBetweenVerts( v1, v2 ){
        var dx = v1.x - v2.x;
        var dy = v1.y - v2.y;
        var dz = v1.z - v2.z;
        return Math.sqrt( dx * dx + dy * dy + dz * dz );
    }

    static addVector(vector1, amount){
        return {x: vector1.x+amount, y: vector1.y+amount , z: vector1.z+amount};
    }
    static subVector(vector1, amount){
        return {x: vector1.x-amount, y: vector1.y-amount, z: vector1.z-amount};
    }
    static multVector(vector1, amount){
        return {x: vector1.x*amount, y: vector1.y*amount , z: vector1.z*amount};
    }
    static divVector(vector1, amount){
        return {x: vector1.x/amount, y: vector1.y/amount , z: vector1.z/amount};
    }    

    static addVectors(vector1, vector2){
        return {x: vector1.x+vector2.x, y: vector1.y+vector2.y , z: vector1.z+vector2.z};
    }
    static subVectors(vector1, vector2){
        return {x: vector1.x-vector2.x, y: vector1.y-vector2.y , z: vector1.z-vector2.z};
    }
    static multVectors(vector1, vector2){
        return {x: vector1.x*vector2.x, y: vector1.y*vector2.y , z: vector1.z*vector2.z};
    }    
    static divVectors(vector1, vector2){
        return {x: vector1.x/vector2.x, y: vector1.y/vector2.y , z: vector1.z/vector2.z};
    }    

    static negativeVector(vector){
        return Tools3D.multVectors(vector, {x:-1, y:-1, z:-1})
    }
    static getRandomPostision(xBounds, yBounds, zBounds){
        return {
            x: Tools.getNumberBetween(xBounds.min, xBounds.max),
            y: Tools.getNumberBetween(yBounds.min, yBounds.max),
            z: Tools.getNumberBetween(zBounds.min, zBounds.max)
        }
    } 
    
    static getRandomVector() {
        const angle = Math.random() * TWO_PI;
        const vz = Math.random() * 2 - 1;
        const vzBase = Math.sqrt(1 - vz * vz);
        const vx = vzBase * Math.cos(angle);
        const vy = vzBase * Math.sin(angle);
        return {x:vx, y:vy, z:vz};
    };    

    static getRandomVectorXY() {
        return {...Tools2D.fromAngle(Math.random() * TWO_PI), z:0};
    }; 
}

const MoveCamera = {
    FORWARD: 'forward',
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right',
    BACK: 'back',
    YAXIS_RIGHT:'y-axis-right',
    YAXIS_LEFT:'y-axis-left',
    XAXIS_UP:'x-axis-up',
    XAXIS_DOWN:'x-axis-down',
    // No ZXAXIS because that would not change the direction you move
    NONE: 'none'
}

class Camera3D {
    constructor(){
        this.camera = {};
        this.moveCameraType = MoveCamera.NONE;
        this.rotateCamera = MoveCamera.NONE;
    }

    // {pos:{x:10,y:0,z:25},norm:{x:0,y:0,z:1}, rot:{x:0,y:0,z:0}})
    create(camera) { this.camera = camera; }
    setup(pos, norm, rot) { 
        this.camera.pos = pos;
        this.camera.norm = norm;
        this.camera.rot = rot;
    }

    setMovement(direction){ this.moveCameraType = direction; }
    setRotation(direction){ this.rotateCamera = direction; }    

    defaultCameraKeyboardControls(event){
        // in the future use | and & to bitwise add/remove movements together
        // example: MoveCamera.XAXIS_DOWN | MoveCamera.YAXIS_LEFT | MoveCamera.FORWARD
        if(event.type=="down"){
            if(event.key==="w") this.moveCameraType = MoveCamera.FORWARD;            
            if(event.key==="s") this.moveCameraType = MoveCamera.BACK;           
            if(event.key==="a") this.rotateCamera = MoveCamera.YAXIS_LEFT;            
            if(event.key==="d") this.rotateCamera = MoveCamera.YAXIS_RIGHT;
            
            if(event.key==="ArrowDown") this.rotateCamera = MoveCamera.XAXIS_DOWN;
            if(event.key==="ArrowUp") this.rotateCamera = MoveCamera.XAXIS_UP;
        }
        if(event.type=="up"){

            if(event.key==="w" || event.key==="s")
                this.moveCameraType = MoveCamera.NONE;
            
            if(event.key==="a" || event.key==="d" || event.key==="ArrowDown" || event.key==="ArrowUp")
                this.rotateCamera = MoveCamera.NONE;
        }
    }      
    
    runCameraControls(delta, moveSpeed, rotateSpeed){
        this.moveCamera(delta, {type:this.moveCameraType ,speed: moveSpeed}, {type: this.rotateCamera, speed: rotateSpeed});
    }

    moveCamera(delta, move, rotation){

        switch(rotation.type){
            case MoveCamera.YAXIS_RIGHT:
                this.camera.rot.y+= -rotation.speed*delta; 
            break;
            case MoveCamera.YAXIS_LEFT:
                this.camera.rot.y+= rotation.speed*delta; 
            break;
            case MoveCamera.XAXIS_UP:
                this.camera.rot.x+= -rotation.speed*delta; 
            break;
            case MoveCamera.XAXIS_DOWN:
                this.camera.rot.x+= rotation.speed*delta; 
            break;
        }        

        let cameraDirectionVector = Pipeline3D.rotate(this.camera.rot.x,this.camera.rot.y,this.camera.rot.z, [{x:0,y:0,z:1}])[0];

        switch(move.type){
            case MoveCamera.FORWARD:
                this.camera.pos.x += cameraDirectionVector.x * (move.speed * delta);
                this.camera.pos.y += cameraDirectionVector.y * (move.speed * delta);
                this.camera.pos.z += cameraDirectionVector.z * (-move.speed * delta);
            break;

            case MoveCamera.BACK:
                this.camera.pos.x += cameraDirectionVector.x * (-move.speed * delta);
                this.camera.pos.y += cameraDirectionVector.y * (-move.speed * delta);
                this.camera.pos.z += cameraDirectionVector.z * (move.speed * delta);
            break;
        }           
        // console.log(this.camera.pos, this.camera.rot);
    }
}

class Scene{
    constructor(){
        this.camera3D = new Camera3D();
        this.meshObjects = [];
        this.lights = [];
        this.ambientLight = {};
        this.renderType = "Filled";
    }

    render(canvas){
        let drawPolys = [];
        for(let i_mesh=0; i_mesh<this.meshObjects.length; i_mesh++){
            // if(this.meshObjects[i_mesh].testIfBehindCamera(this.camera))
            //     continue;

            // update physics
            if(this.meshObjects[i_mesh].body) this.meshObjects[i_mesh].updatePhyscis();
            if(this.meshObjects[i_mesh].stitches) 
                this.meshObjects[i_mesh].updateSoftBodyPhyscis(this.meshObjects[i_mesh].width, this.meshObjects[i_mesh].height);

            this.meshObjects[i_mesh].toWorldSpace();
            let worldVerts = this.meshObjects[i_mesh].verts.map(vert=>{return {...vert}});
            this.meshObjects[i_mesh].toCameraSpace(this.camera3D.camera);

            // this.meshObjects[i_mesh].calcRotation();
            // this.meshObjects[i_mesh].toWorldPosition(this.camera);
            // this.meshObjects[i_mesh].calcWorldRotation();
            for(let i_poly=0; i_poly<this.meshObjects[i_mesh].indexes.length; i_poly++){
                let points = [];
                let worldPoints = [];
                let infrustrum = true;
                for(let i_point=0; i_point<this.meshObjects[i_mesh].indexes[i_poly].length; i_point++){
                    points.push(Tools.projectTo2D(
                        this.meshObjects[i_mesh].verts[this.meshObjects[i_mesh].indexes[i_poly][i_point]].x, 
                        this.meshObjects[i_mesh].verts[this.meshObjects[i_mesh].indexes[i_poly][i_point]].y, 
                        this.meshObjects[i_mesh].verts[this.meshObjects[i_mesh].indexes[i_poly][i_point]].z,
                    canvas.width, canvas.height));

                    worldPoints.push({
                        x:worldVerts[this.meshObjects[i_mesh].indexes[i_poly][i_point]].x, 
                        y:worldVerts[this.meshObjects[i_mesh].indexes[i_poly][i_point]].y, 
                        z:worldVerts[this.meshObjects[i_mesh].indexes[i_poly][i_point]].z,
                    });
    
                    if(this.meshObjects[i_mesh].verts[this.meshObjects[i_mesh].indexes[i_poly][i_point]].z < 1 ||
                       this.meshObjects[i_mesh].verts[this.meshObjects[i_mesh].indexes[i_poly][i_point]].z > 400)
                            infrustrum = false;
                }        
                if(!infrustrum)
                    continue;

                if(Pipeline3D.notCulled(canvas, points,this.meshObjects[i_mesh].isTwoSided)){
                    let zs = points.map(p=>p.z);
                    //let avgZ = Math.min(...zs);
                    let avgZ = Math.max(...zs);
                    let renderType = this.renderType;
                    if(this.meshObjects[i_mesh].renderType)
                        renderType = this.meshObjects[i_mesh].renderType;
                    //let avgZ = points.reduce((acc,p)=>{acc+=p.z;return acc},0)/points.length;
                    let color = this.meshObjects[i_mesh].color;
                    if(this.meshObjects[i_mesh].faceColors)
                        color = this.meshObjects[i_mesh].faceColors[i_poly];
                    
                    //let faceNormal = Tools3D.normalizePoly(points[0], points[1], points[2]);
                    let faceNormal = Tools3D.normalizePoly(worldPoints[0], worldPoints[1], worldPoints[2]);
                    drawPolys.push({
                        z:avgZ,
                        poly:points,
                        //col: Tools.rgbToHex(color),
                        col: Tools.rgbToHex(Pipeline3D.getLitColor(faceNormal, color, this.lights, this.ambientlight)),
                        renderType,
                    });
                }                
            }
        }
        drawPolys = Tools.sortObjectArray(drawPolys, 'z');
        for(let i=0; i < drawPolys.length; i++){
            if(drawPolys[i].renderType==="Wire")
                drawLines(drawPolys[i].poly, drawPolys[i].col,{lineWidth:2});
            if(drawPolys[i].renderType==="Filled")
                drawFill(drawPolys[i].poly, drawPolys[i].col);
            if(drawPolys[i].renderType==="Solid"){
                drawFill(drawPolys[i].poly, drawPolys[i].col);
                drawFill(drawPolys[i].poly, drawPolys[i].col);
                //drawLines(drawPolys[i].poly, drawPolys[i].col,{lineWidth:2});
            }
        }
    }
}

class MeshObject{
    constructor(model){
        model = Tools.cloneObject(model);
        this.original = model;
        this.pos = {x:0, y:0, z:0};
        this.dir = {x:1, y:0, z:0};
        this.color = {r:0, g:0, b:0};
        this.rotation = {x:0, y:0, z:0};
        this.physicsScale = 1;
        this.isTwoSided = false;
        // this.worldRotation = {x:0, y:0, z:0};

        for (let param in model) 
            this[param] = model[param];
    }

    scaleModel(x, y, z){
        this.original.verts = Pipeline3D.scale(x, y, z, this.original.verts);
    }
    
    addRotation(rot){
        this.rotation.x += rot.x;
        this.rotation.y += rot.y;
        this.rotation.z += rot.z;

        //this.worldRotation.y++;
    }

    rotateToPosition(x,y,z){
        this.rotation.x = x;
        this.rotation.y = y;
        this.rotation.z = z;
    }

    toWorldPosition(camera){
        this.verts.forEach(vert=>{
            vert.x = vert.x + this.pos.x + camera.pos.x;
            vert.y = vert.y + this.pos.y + camera.pos.y;
            vert.z = vert.z + this.pos.z + camera.pos.z;
        });
    }

    toWorldSpace(){
        this.verts = Pipeline3D.rotateStatic(this.rotation.x,this.rotation.y,this.rotation.z, this.original.verts);
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
        Pipeline3D.rotate(0, camera.rot.y, 0, this.verts);
        Pipeline3D.rotate(camera.rot.x, 0, 0, this.verts);
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

    updatePhyscis(){
        this.pos.x = this.body.position.x;
        this.pos.y = -this.body.position.y;
        this.pos.z = this.body.position.z;
        
        // rotate as ThreeJS Euler
        var quaternion = new THREE.Quaternion();
        quaternion.copy(this.body.quaternion);
        var euler = new THREE.Euler().setFromQuaternion( quaternion, 'XYZ' );
        this.rotateToPosition(-euler.x*(180/Math.PI), -euler.y*(180/Math.PI), -euler.z*(180/Math.PI));
    }

    updateSoftBodyPhyscis(width, height){
        for (let i = 0; i < this.verts.length; i++) {
            this.original.verts[i].x = this.stitches[i].position.x / width;
            this.original.verts[i].y = -this.stitches[i].position.y / height;
            this.original.verts[i].z = this.stitches[i].position.z;
        }
    }  
    // testIfBehindCamera(camera){
    //     let vectorToCamera = [{
    //         x:this.pos.x + camera.pos.x,
    //         y:this.pos.y + camera.pos.y,
    //         z:this.pos.z + camera.pos.z
    //     }];
    //     Pipeline3D.rotate(camera.rot.x, camera.rot.y,camera.rot.z, vectorToCamera);

    //     vectorToCamera = Tools3D.normalize(vectorToCamera[0]);
    //     let angle=Tools3D.dotProduct(vectorToCamera, camera.norm);
    //     if(angle < 0)
    //         return true;
    //     return false;
    // }    
}

class CubeModel{
    constructor(scale={x:1,y:1,z:1}){
        this.scale = scale;
        this.pos={x:0,y:0,z:0};
        this.color={r:255,g:255,b:255};
        this.create();
    }
    create(){
        this.indexes=[
            [2,3,1,0], // front
            [6,2,0,4], // Left Side
            [0,1,5,4], // Top 
            [7,3,2,6], // Bottom
            [4,5,7,6], // Back
            [5,1,3,7]  // Right side
        ];

        this.verts=[
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

        this.verts = this.verts.map(vert=>{return {x:vert.x*this.scale.x, y:vert.y*this.scale.y, z:vert.z*this.scale.z}});
    }
}

class PlaneModel{
    constructor(width=10, height=10, scale={x:1,y:1,z:1}, axis="z", useQuads=true){
        this.scale = scale;
        this.width=width;
        this.height=height;
        this.axis = axis;
        this.useQuads = useQuads;
        this.create();
    }

    create(){
        this.indexes=[];

        this.verts=[];
        for(let y=0; y<this.height; y++){
            for(let x=0; x<this.width; x++){            
                if(this.axis==="x") this.verts.push({x:0,y:(x*this.scale.x-this.width/2),z:((y*this.scale.y)-this.height/2)});
                if(this.axis==="y") this.verts.push({x:(x*this.scale.x-this.width/2),y:0,z:(y*this.scale.y-this.height/2)});
                if(this.axis==="z") this.verts.push({x:(x*this.scale.x-this.width/2),y:(y*this.scale.y-this.height/2),z:0});

                if(this.useQuads){ // create squares
                    if(x+1<this.width && y+1<this.height){
                        let topLeft = (y*this.width)+x;  
                        let topRight = (y*this.width)+(x+1);
                        let botRight = ((y+1)*this.width)+(x+1);
                        let botLeft = ((y+1)*this.width)+x;
                        //this.indexes.push([botLeft,botRight,topRight,topLeft]);
                        this.indexes.push([topLeft,topRight,botRight,botLeft]);
                    }
                }
                else{// create triangles
                    if(x+1<this.width && y+1<this.height){
                        let topLeft = (y*this.width)+x;  
                        let topRight = (y*this.width)+(x+1);
                        let botRight = ((y+1)*this.width)+(x+1);
                        let botLeft = ((y+1)*this.width)+x;
                        this.indexes.push([topLeft,topRight,botRight]);
                        this.indexes.push([botRight,botLeft,topLeft]);
                    }
                }
            }
        }
    }

    static createSoftBody(world, plane, mass, linearDamping){
        const particleShape = new CANNON.Particle();
        const verts = plane.verts;
        let stitches = [];
        plane.stitches = stitches;
    
        for (let i = 0; i < verts.length; i++) {
    
            const pos = new CANNON.Vec3(
                verts[i].x * plane.width,
                verts[i].y * plane.height,
                verts[i].z
            );
    
            const stitch = new CANNON.Body({                
                mass: ((verts.length-1)-i < plane.width) ? 0 : mass / verts.length,
                //mass,
                //mass: (i < plane.width) ? 0 : mass / verts.length,
                linearDamping: 0.4,
                position: pos,
                shape: particleShape,
                velocity: new CANNON.Vec3(0, 0, -300)
            });
    
            stitches.push(stitch);
            world.addBody(stitch);
        }

        for(let y=0; y<plane.height; y++){
            for(let x=0; x<plane.width; x++){            
                let topLeft = (y*plane.width)+x;  
                let topRight = (y*plane.width)+(x+1);
                let botRight = ((y+1)*plane.width)+(x+1);
                let botLeft = ((y+1)*plane.width)+x;

                if(!(topLeft>=verts.length || topRight>= verts.length))
                    connectCannonConstraint(world, stitches[topLeft], stitches[topRight]);
                if(!(topLeft>=verts.length || botLeft>= verts.length))
                    connectCannonConstraint(world, stitches[topLeft], stitches[botLeft]);
            }
        }
    }
}

function connectCannonConstraint(world, i, j) {
    const c = new CANNON.DistanceConstraint(i, j);
    world.addConstraint(c);
} 