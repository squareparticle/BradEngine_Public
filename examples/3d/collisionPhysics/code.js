// let k3dMesh = {};
// function Start(){
//     // http://k3d.ivank.net/?p=documentation
//     K3D.load("cube.obj", loaded);		// loading file ...
// }

// function loaded(data){
//     var m = K3D.parse.fromOBJ(data);	// done !
//     k3dMesh = m;
//     //console.log(m);
// }

// Start();

class MainLevel extends LevelInterface {

    loadResources(){ this.findResources('wiremesh','meshes'); }

    buildTank(pos, rotation){
        let mesh_base = new MeshObject(this.loadedMeshes['meshes/base.obj']);
        mesh_base.color = {r:255, g:0, b:0};
        mesh_base.pos=pos;
        mesh_base.randRotation = rotation;
        this.scene.meshObjects.push(mesh_base);

        let mesh_turret = new MeshObject(this.loadedMeshes['meshes/turret.obj']);
        mesh_turret.color = {r:0, g:255, b:0};
        mesh_turret.pos=pos;
        mesh_turret.randRotation = rotation;
        this.scene.meshObjects.push(mesh_turret);

        let mesh_gun = new MeshObject(this.loadedMeshes['meshes/gun.obj']);
        mesh_gun.color = {r:0, g:0, b:255};
        mesh_gun.pos=pos;
        mesh_gun.randRotation = rotation;
        this.scene.meshObjects.push(mesh_gun);
    }

    setup(){
        this.scene = new Scene();
        this.scene.camera3D.create({pos:{x:10,y:0,z:25},norm:{x:0,y:0,z:1}, rot:{x:0,y:0,z:0}});
        this.speed = 40;
        this.scene.ambientlight = {r:50,g:50,b:50};
        let lightPos = {x:-97,y:30,z:-50};
        this.scene.lights.push({pos:lightPos,norm:Tools3D.normalize(lightPos),col:{r:255,g:255,b:255}});

        for(let i=0; i<35; i++){
            this.buildTank(
                { x:((Math.random()*100)-50), y:((Math.random()*100)-50), z:((Math.random()*500)-200) }, 
                Tools.getRandomObject([{x:1,y:0,z:0},{x:0,y:1,z:0},{x:0,y:0,z:1}]));
        }
    }

    getKeyboardInput(event){ this.scene.camera3D.defaultCameraKeyboardControls(event); }

    update(delta){
        drawBox(0,0,this.canvas.width, this.canvas.height,'black');
        this.scene.camera3D.runCameraControls(delta, this.speed, this.speed);

        for(let i=0; i<this.scene.meshObjects.length; i++){
            this.scene.meshObjects[i].addRotation(this.scene.meshObjects[i].randRotation);
        }
        this.scene.render(this.canvas);
    }
}