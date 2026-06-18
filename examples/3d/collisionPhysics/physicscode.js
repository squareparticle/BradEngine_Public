class MainLevel extends LevelInterface {
    fixedTimeStep = 1.0 / 60.0;
    maxSubSteps = 3;
    
    loadResources(){ this.findResources('wiremesh','meshes'); }

    createGround(){
        const groundProps = {
            mass: 0,
            position: new CANNON.Vec3(0, -1, 0),
            shape: new CANNON.Plane(),
        }
        const groundBody = new CANNON.Body(groundProps);

        // Rotate the ground so it is flat (facing upwards)
        const angle = -Math.PI / 2;
        const xAxis = new CANNON.Vec3(1, 0, 0);
        groundBody.quaternion.setFromAxisAngle(xAxis, angle);
        return groundBody;

    }
    setup(){
        this.scene = new Scene();
         
        this.scene.camera3D.create({pos:{x: 0, y: 107.33564072522222, z: 170.90060109775084},norm:{x:0,y:0,z:1}, rot:{x: 17.394277343749962, y: 0, z: 0}});
        this.speed = 40;
        this.scene.ambientlight = {r:50,g:50,b:50};
        let lightPos = {x:0,y:-300,z:-500};
        this.scene.lights.push({pos:lightPos,norm:Tools3D.normalize(lightPos),col:{r:255,g:255,b:255}});      

        this.world = new CANNON.World();
        this.world.gravity.set(0, -9.82, 0);

        this.cubes = [];       
        this.models = [];       
        for(let i=1; i<11; i++){
            let boxSize = {x:10,y:6,z:3}
            //let cube =new MeshObject(this.loadedMeshes['meshes/spaceship.x']);
            let cube = new MeshObject(new CubeModel(boxSize));
            cube.renderType="Wire";
            cube.color = {r:255, g:0, b:0};
            cube.pos={x:0,y:0,z:0};
            this.scene.meshObjects.push(cube);
            this.cubes.push(cube);

            let model =new MeshObject(this.loadedMeshes['meshes/spaceship.x']);
            model.color = {r:255, g:0, b:0};
            model.pos={x:(Math.random()*-1)+1,y:i*50,z:(Math.random()*-1)+1};
            this.scene.meshObjects.push(model);
            this.world.addBody(model.createRidgidBody("box",5,boxSize));
            this.models.push(model);
        }
        this.world.addBody(this.createGround());
    }

    getKeyboardInput(event){ this.scene.camera3D.defaultCameraKeyboardControls(event); }
    update(delta){
        this.world.step(this.fixedTimeStep, delta, this.maxSubSteps)
        drawBox(0,0,this.canvas.width, this.canvas.height,'black');
        this.scene.camera3D.runCameraControls(delta, this.speed, this.speed);

        for(let i=0; i<this.models.length; i++){
            this.cubes[i].pos=this.models[i].pos;
            this.cubes[i].rotation=this.models[i].rotation;
        }

        this.scene.render(this.canvas);
    }
}

/*
        this.cubes = [];       
        this.models = [];
        let boxSize = {x:5,y:3,z:3}
        for(let i=1; i<2; i++){
            let cube = new MeshObject(new CubeModel(this.canvas,boxSize));
            cube.renderType="Wire";
            cube.color = {r:255, g:0, b:0};
            cube.pos={x:0,y:0,z:0};
            this.scene.meshObjects.push(cube);
            this.cubes.push(model);

            let model =new MeshObject(this.loadedMeshes['meshes/spaceship.x']);
            model.color = {r:255, g:0, b:0};
            model.pos={x:(Math.random()*-1)+1,y:i*50,z:(Math.random()*-1)+1};
            this.scene.meshObjects.push(model);
            this.world.addBody(model.createRidgidBody("box",5,boxSize));
            this.models.push(model);
        }


        this.world.addBody(this.createGround());
    }

    getKeyboardInput(event){ this.scene.camera3D.defaultCameraKeyboardControls(event); }
    update(delta){
        this.world.step(this.fixedTimeStep, delta, this.maxSubSteps);
        drawBox(0,0,this.canvas.width, this.canvas.height,'black');
        this.scene.camera3D.runCameraControls(delta, this.speed, this.speed);

        // for(let i=0; i<this.models.length; i++){
        //     this.cudes[i].pos=this.models[i].pos;
        // }

        this.scene.render(this.canvas);
    }
}
*/