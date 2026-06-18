class MainLevel extends LevelInterface {
    setup(){

        this.x=this.canvas.width/2;
        this.y=this.canvas.height/2;
        this.camera={x:0,y:0,z:1000};
        this.cameraSpeed={x:0,y:0,z:0};
        //this.speed=0.1;
        this.planets=[
            {color:'yellow',size:200,radius:0,angle:0,speed:0, drawOrder:0},
            {color:'red',size:40,radius:250,angle:100,speed:4, drawOrder:0},
            {color:'blue',size:50,radius:400,angle:50,speed:3, drawOrder:0},
            {color:'orange',size:75,radius:400,angle:300,speed:2, drawOrder:0},
            {color:'green',size:25,radius:310,angle:200,speed:1, drawOrder:0}


        ];
     
        //console.log(this.planets[2]);
        //onsole.log(Tools.getPointOnCircle(50,135));
        this.angle=0;
    }
    
    orderPlanets(){
        for(var i=0; i<this.planets.length; i++){
            var orbitPoint = Tools.getPointOnCircle(this.planets[i].radius, this.planets[i].angle);
            this.planets[i].drawOrder = orbitPoint.y;
        }
        return Tools.sortObjectArray(this.planets, 'drawOrder');
    }

    update(delta){
       this.camera.x += this.cameraSpeed.x;
       this.camera.y += this.cameraSpeed.y;
       this.camera.z += this.cameraSpeed.z;
       this.planets = this.orderPlanets(this.planets);

       for(var i=0;i<this.planets.length;i++){
        var point=Tools.getPointOnCircle(this.planets[i].radius,this.planets[i].angle+=this.planets[i].speed);
        var projectPoint=Tools.projectTo2D(point.x+this.camera.x,this.camera.y,point.y+this.camera.z,this.canvas.width,this.canvas.height)
        var projectPointEdege=Tools.projectTo2D(point.x+this.planets[i].size+this.camera.x,this.camera.y,point.y+this.camera.z,this.canvas.width,this.canvas.height)
        var planetSize = Tools.clampMin(projectPointEdege.x - projectPoint.x,0); 
        //this.planets[i].x += this.speed;  
        drawCircle(
            projectPoint.x,
            projectPoint.y,
            planetSize,
            this.planets[i].color
            )
        }
     }

}

