class MainLevel extends LevelInterface {
   
    setup(){
        this.scene = new Scene();
        this.scene.camera3D.create({pos:{x:0,y:50,z:150},norm:{x:0,y:0,z:1}, rot:{x:15,y:0,z:0}});
        this.speed = 40;
        this.scene.ambientlight = {r:50,g:50,b:50};
        let lightPos = {x:0,y:-300,z:-500};
        this.scene.lights.push({pos:lightPos,norm:Tools3D.normalize(lightPos),col:{r:255,g:255,b:255}});      

        this.physics = bradEngine.initPhysics3D(1, {x:0,y:-1000,z:0});

        this.cloth = new MeshObject(new PlaneModel(10,20));
        this.cloth.color = {r:255, g:0, b:255};
        this.cloth.pos={x:0,y:0,z:0};
        this.cloth.renderType="Solid"
        this.cloth.isTwoSided = true;    
        PlaneModel.createSoftBody(this.physics.world, this.cloth, 5, 0.4);
        this.scene.meshObjects.push(this.cloth);
    }

    getKeyboardInput(event){ this.scene.camera3D.defaultCameraKeyboardControls(event);}

    update(delta){
        drawBox(0,0,this.canvas.width, this.canvas.height,'black');
        this.scene.camera3D.runCameraControls(delta, this.speed, this.speed);
        this.scene.render(this.canvas);
    }
}