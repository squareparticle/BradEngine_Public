class MainLevel extends LevelInterface {
   
    setup(){
        this.scene = new Scene();
        this.scene.camera3D.create({pos:{x:0,y:50,z:150},norm:{x:0,y:0,z:1}, rot:{x:15,y:0,z:0}});
        this.speed = 40;
        this.scene.ambientlight = {r:50,g:50,b:50};
        let lightPos = {x:0,y:-300,z:-500};
        this.scene.lights.push({pos:lightPos,norm:Tools3D.normalize(lightPos),col:{r:255,g:255,b:255}});      

        this.physics = bradEngine.initPhysics3D(1, {x:0,y:-1000,z:0});

        //this.flag = new MeshObject(new PlaneModel(10,20,{x:1,y:1,z:1}, "z", false));
        this.flag = new MeshObject(new PlaneModel(10,20,{x:1,y:1,z:1}, "z", true));
        this.flag.color = {r:255, g:0, b:255};
        this.flag.pos={x:0,y:0,z:0};
        this.flag.renderType="Solid"
        this.flag.isTwoSided = true;    
        PlaneModel.createSoftBody(this.physics.world, this.flag, 5, 0.4);
        this.scene.meshObjects.push(this.flag);
        this.colorFlag(this.flag);
    }

    getPixel(row, col){ return row*9+col;}

    colorFlag(flag){
        flag.faceColors=[];
        for(let i=0; i< flag.indexes.length; i++) flag.faceColors[i] = {r:255,g:0,b:0};
        for(let i=54; i< 126; i++) flag.faceColors[i] = {r:255,g:255,b:255};
        
        flag.faceColors[this.getPixel(10,1)] = {r:255,g:0,b:0};
        flag.faceColors[this.getPixel(10,2)] = {r:255,g:0,b:0};

        flag.faceColors[this.getPixel(9,3)] = {r:255,g:0,b:0};
        flag.faceColors[this.getPixel(10,3)] = {r:255,g:0,b:0};
        flag.faceColors[this.getPixel(11,3)] = {r:255,g:0,b:0};

        flag.faceColors[this.getPixel(8,4)] = {r:255,g:0,b:0};
        flag.faceColors[this.getPixel(9,4)] = {r:255,g:0,b:0};
        flag.faceColors[this.getPixel(10,4)] = {r:255,g:0,b:0};
        flag.faceColors[this.getPixel(11,4)] = {r:255,g:0,b:0};
        flag.faceColors[this.getPixel(12,4)] = {r:255,g:0,b:0};

        flag.faceColors[this.getPixel(8,5)] = {r:255,g:0,b:0};
        flag.faceColors[this.getPixel(9,5)] = {r:255,g:0,b:0};
        flag.faceColors[this.getPixel(10,5)] = {r:255,g:0,b:0};
        flag.faceColors[this.getPixel(11,5)] = {r:255,g:0,b:0};
        flag.faceColors[this.getPixel(12,5)] = {r:255,g:0,b:0};

        flag.faceColors[this.getPixel(11,6)] = {r:255,g:0,b:0};
        flag.faceColors[this.getPixel(10,6)] = {r:255,g:0,b:0};
        flag.faceColors[this.getPixel(9,6)] = {r:255,g:0,b:0};

        flag.faceColors[this.getPixel(10,7)] = {r:255,g:0,b:0};
    }

    getKeyboardInput(event){ this.scene.camera3D.defaultCameraKeyboardControls(event);}
    update(delta){
        drawBox(0,0,this.canvas.width, this.canvas.height,'black');
        this.scene.camera3D.runCameraControls(delta, this.speed, this.speed);
        this.scene.render(this.canvas);
    }
}