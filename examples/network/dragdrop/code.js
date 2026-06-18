class MainLevel extends LevelInterface {
    loadResources(){
        this.findResources('tank',['src/sharedMedia/images/garage','src/sharedMedia/images/road']);
        this.music = new sound(bradAsset("src/sharedMedia/sounds/road/gametheme.mp3"));
    }

    setup(){
        this.network = bradEngine.initNetwork(this.getNetworkInput,60);
        this.network.startConnection();

        this.center={x: this.canvas.width/2, y: this.canvas.height/2};
        this.cars=[
            {id:0, dir:-1, speed:5, x:this.canvas.width, y:600, wheelAngle:0},
            {id:1, dir:-1, speed:2, x:this.canvas.width-300, y:620, wheelAngle:0},
            {id:2, dir:-1, speed:2, x:this.canvas.width-600, y:620, wheelAngle:0},
            {id:3, dir:1, speed:5, x:0, y:640, wheelAngle:0},
            {id:4, dir:1, speed:2, x:300, y:660, wheelAngle:0},
            {id:5, dir:1, speed:2, x:600, y:660, wheelAngle:0}
        ]        
        this.grabSize={width:10,height:10};
        this.grabRadius = 20;
        this.dragCar = null;
        this.exportInput=null;
    }

    getMouseInput(event){
        if(event.type === "down"){
            for(var i=0; i<this.cars.length; i++){  
                // if( Collision.testPointOnBox(event.position, Collision.buildBounds(this.cars[i], this.grabSize))){
                if( Collision.testPointOnCircle(event.position, this.cars[i], this.grabRadius)){
                    this.dragCar = this.cars[i];
                    break;
                }
            }
        }
        else{
            this.dragCar = null;
            this.exportInput=null;
        }
    }

    getMouseMoveInput(event){
        if(this.dragCar){
            if(this.network.isServer){
                this.dragCar.x = event.position.x;
                this.dragCar.y = event.position.y;
            }
            else{
                this.exportInput={id:this.dragCar.id, x:event.position.x, y:event.position.y}
            }
        }
    }

    getNetworkInput=(data)=>{
        if(this.network.isServer){
            let input = JSON.parse(data);
            this.cars[input.id].x = input.x;
            this.cars[input.id].y = input.y;
        }
        else
            this.cars = JSON.parse(data);
    }

    drawCar(car){
        // move the car
        // car.x+=car.speed*car.dir;
        if(this.network.isServer)
            car.wheelAngle+=car.speed*car.dir
        // draw the car
        drawImage('tire.png',car.x-50, car.y,25,25,car.wheelAngle);
        drawImage('tire.png',car.x+50, car.y,25,25,car.wheelAngle);
        if(car.dir < 0)
            drawImage('car1.png',car.x, car.y-25, 75,25);
        else
            drawImage('car2.png',car.x, car.y-25, 75,25);

        // highlight the grab area
        //drawBox(car.x-this.grabSize.width/2, car.y-this.grabSize.height/2, this.grabSize.width, this.grabSize.height,'green');
        drawCircle(car.x, car.y, this.grabRadius,'green');
    }

    update(delta){
        // draw the background
        drawImageFrom00('background.jpg', 0, 0, this.canvas.width, this.canvas.height);
        for(var i=0; i<this.cars.length; i++){
            this.drawCar(this.cars[i]);
        }
    }

    networkUpdate(delta){
        if(this.network.isServer)
            this.network.sendToAllClients(JSON.stringify(this.cars));
        else {
            if(this.exportInput)
                this.network.sendToServer(JSON.stringify(this.exportInput));
        }
    }
    
}
