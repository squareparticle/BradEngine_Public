class MainLevel extends LevelInterface {
    setupHelpDialog(){
        const textParts= [`
            <span class="HelpHeader">Description</span><br>
            Using a 3D algorithm to rotate sprites in the z-axis and z sorting before rendering.
        `]; 
        return {textParts, pause:false}   
    }
    loadResources(){
        this.findResources('solarsystem','src/sharedMedia/images/solarsystem');
    }

    setup(){
        this.center={x: this.canvas.width/2, y: this.canvas.height/2};
        this.camera={x:0,y:0,z:500};
        this.planets = [
            {orbitSize:0, size:125, angle:0, speed:0, drawOrder:0, image:'sun.png'},
            {orbitSize:100, size:10, angle:0, speed:40, drawOrder:0, image:'p1.png'},
            {orbitSize:250, size:25, angle:90, speed:20, drawOrder:0, image:'p2.png'},
            {orbitSize:400, size:35, angle:200, speed:10, drawOrder:0, image:'p3.png'}
        ]
    }

    orderPlanets(planets){
        for(var i=0; i<this.planets.length; i++){
            var orbitPoint = Tools.getPointOnCircle(this.planets[i].orbitSize, this.planets[i].angle);
            this.planets[i].drawOrder = orbitPoint.y;
        }
        planets = Tools.sortObjectArray(planets, 'drawOrder');
    }

    drawPlanet(delta,planet){
        // orbit the planet
        var orbitPoint = Tools.getPointOnCircle(planet.orbitSize, planet.angle+=planet.speed*delta);

        // project the planet center into 2D
        var projectPoint = Tools.projectTo2D(orbitPoint.x+this.camera.x, this.camera.y, orbitPoint.y+this.camera.z, this.canvas.width, this.canvas.height);

        // project the edge of the planet in 2D to find out it's size
        var projectPointEdege=Tools.projectTo2D(orbitPoint.x+planet.size+this.camera.x, this.camera.y, orbitPoint.y+this.camera.z, this.canvas.width,this.canvas.height)

        // make sure the planet size doesn't go below 0
        var planetRadius = Tools.clampMin(projectPointEdege.x - projectPoint.x,0); 

        // draw the planet
        drawImage(planet.image,projectPoint.x, projectPoint.y,planetRadius, planetRadius)
    }

    update(delta){
        drawImageFrom00('background.jpg',0,0,this.canvas.width, this.canvas.height);
        this.orderPlanets(this.planets);
        for(var i=0; i<this.planets.length; i++){
            this.drawPlanet(delta, this.planets[i]);
        }
    }
}