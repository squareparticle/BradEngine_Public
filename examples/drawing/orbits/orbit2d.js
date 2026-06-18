class MainLevel extends LevelInterface {
    setup(){
        this.center={x: this.canvas.width/2, y: this.canvas.height/2};
        this.angle = 0;
        this.planets = [
            {orbitSize:0, size:125, color: 'yellow', angle:0, speed:0},
            {orbitSize:250, size:10, color: 'red', angle:0, speed:5},
            {orbitSize:350, size:25, color: 'green', angle:90, speed:2},
            {orbitSize:400, size:35, color: 'blue', angle:200, speed:1}
        ]
    }

    drawPlanet(planet){
        var orbitPoint = Tools.getPointOnCircle(planet.orbitSize, planet.angle+=planet.speed);
        drawCircle(this.center.x+orbitPoint.x, this.center.y+orbitPoint.y, planet.size, planet.color);
    }

    update(delta){
        for(var i=0; i<this.planets.length; i++){
            this.drawPlanet(this.planets[i]);
        }
        this.angle++;
        drawRotatedBox(100,100,100,100,this.angle,'red');
        drawRotatedOffsetBox(100,100,100,100,this.angle,'red',{x:this.center.x, y:this.center.y});
    }
}