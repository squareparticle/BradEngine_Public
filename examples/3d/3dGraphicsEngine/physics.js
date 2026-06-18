class MainLevel extends LevelInterface {
   
    setup(){
        this.ambientlight={r:100,g:100,b:100};
        this.scene = new WorldScene(this,{drawVerts:false,fillPolys:true,drawLines:false});
        this.scene.addLight({x:0,y:-300,z:-500},{r:255,g:255,b:255});   

        this.physics = bradEngine.initPhysics3D();

        this.numCubes = 10;
        if(Math.random()>0.5) this.numCubes = Tools.getNumberBetween(40,80);

        for(let i=0; i<this.numCubes; i++){
            let cube = new Cube();
            cube.setColors({r:Tools.getNumberBetween(0,255), g:Tools.getNumberBetween(0,255), b:Tools.getNumberBetween(0,255)});
            cube.pos={x:(Math.random()*-1)+1,y:i*5,z:(Math.random()*-1)+1};
            this.scene.addObject(cube);
            this.physics.addBody(cube.createRidgidBody("box",5));
        }

        this.physics.createGroundPlane({x:0, y:-1, z:0}, {x:1, y:0, z:0}, (-Math.PI / 2))
    }

    getKeyboardInput(event){this.scene.getCamera().defaultCameraKeyboardControls(event);}

    update(delta){
        this.scene.getCamera().runCameraControls(delta);
        drawBox(0,0,this.canvas.width, this.canvas.height, 'black');
        this.scene.render(delta);
    }
}