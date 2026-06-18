class KBCamera extends Camera {
    constructor(params){
        super(params);

        this.moveSpeed = 40;
        this.rotateSpeed = 40;

        this.moveCameraType = MoveCamera.NONE;
        this.rotateCamera = MoveCamera.NONE;
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
    
    runCameraControls(delta){
        this.moveCamera(delta, {type:this.moveCameraType ,speed: this.moveSpeed}, {type: this.rotateCamera, speed: this.rotateSpeed});
        //console.log(this.pos, this.rot);
    }

    moveCamera(delta, move, rotation){

        switch(rotation.type){
            case MoveCamera.YAXIS_RIGHT:
                this.rot.y+= -rotation.speed*delta; 
            break;
            case MoveCamera.YAXIS_LEFT:
                this.rot.y+= rotation.speed*delta; 
            break;
            case MoveCamera.XAXIS_UP:
                this.rot.x+= -rotation.speed*delta; 
            break;
            case MoveCamera.XAXIS_DOWN:
                this.rot.x+= rotation.speed*delta; 
            break;
        }        

        let cameraDirectionVector = Pipeline3D.rotate(this.rot.x,this.rot.y,this.rot.z, [{x:0,y:0,z:1}])[0];

        switch(move.type){
            case MoveCamera.FORWARD:
                this.pos.x += cameraDirectionVector.x * (move.speed * delta);
                this.pos.y += cameraDirectionVector.y * (move.speed * delta);
                this.pos.z += cameraDirectionVector.z * (-move.speed * delta);
            break;

            case MoveCamera.BACK:
                this.pos.x += cameraDirectionVector.x * (-move.speed * delta);
                this.pos.y += cameraDirectionVector.y * (-move.speed * delta);
                this.pos.z += cameraDirectionVector.z * (move.speed * delta);
            break;
        }           
        //console.log(this.pos, this.rot);
    }
}