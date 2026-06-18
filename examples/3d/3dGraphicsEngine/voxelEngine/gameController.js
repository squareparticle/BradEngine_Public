class GameController{
    constructor(level){
        this.level = level;
        this.currentCamera = 0;
    }
    getKeyboardControls(event){
        if(event.type==="down"){           
            // cycle through cameras
            if(event.key==="5"){
                this.currentCamera++;
                if(this.currentCamera>this.level.scene.cameras.length-1)
                    this.currentCamera = 0;
                this.level.scene.switchCamera(this.currentCamera);                
            } 

            if(event.key===" ") this.level.cluster.saveClusterToStorage();
        }
    }
}