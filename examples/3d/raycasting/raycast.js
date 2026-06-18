class Walls{
    segments = [];
    constructor(){}
    
    createWalls(numberOfWalls){
        this.segments = [];
        let bounds = { x: -1, y: -1, width: canvas.width+1, height: canvas.height+1 }; // fullScreen
        for (let i = 0; i < numberOfWalls; i++) {
            this.segments[i] = {
                x1: Tools.getNumberBetween(bounds.x,bounds.width), 
                x2: Tools.getNumberBetween(bounds.x,bounds.width), 
                y1: Tools.getNumberBetween(bounds.y,bounds.height), 
                y2: Tools.getNumberBetween(bounds.y,bounds.height)
            };
        }
        this.segments.push({x1: bounds.x, y1: bounds.y, x2: bounds.width, y2: bounds.y});
        this.segments.push({x1: bounds.width, y1: bounds.y, x2: bounds.width, y2: bounds.height});
        this.segments.push({x1: bounds.width, y1: bounds.height, x2: bounds.x, y2: bounds.height});
        this.segments.push({x1: bounds.x, y1: bounds.height, x2: bounds.x, y2: bounds.y});
    }

    update(delta){
        this.segments.forEach(wall => {
            drawLine(wall.x1,wall.y1,wall.x2,wall.y2,"white");
        });
    }
}

class Ray{
    constructor(pos, angle) {
        this.pos = pos;
        this.dir = {
            x: Math.cos(angle),
            y: Math.sin(angle)            
        }
    }
       
    update(delta, walls) {

        let closest = null;
        let record = Infinity;
        walls.forEach(wall => {         
            const hit = Tools.rayCast(this.pos, this.dir, wall);
            if (hit) {
                const d = Tools.distanceBetweenPoints(this.pos, hit);
                if (d < record) {
                    record = d;
                    closest = hit;
                }
            }
        });

        if (closest) drawLine(this.pos.x, this.pos.y, closest.x, closest.y,"blue");        
    }
}

class Player{
    dragging = false; 
    pos={x:0,y:0};
    constructor(pos){
        this.pos = pos;
        this.rays = [];
        this.createRays();
    }

    createRays(){
        for (let a = 0; a < 360; a += 1) 
            this.rays.push(new Ray(this.pos, Tools.toRadians(a)));
    }

    getMouseInput(event){
        this.dragging = false;        
        if(event.type === "down") 
            this.dragging = true;
    }

    getMouseMoveInput(event){
        if(this.dragging){
            this.pos.x = event.position.x;
            this.pos.y = event.position.y;
        }
    }

    update(delta, walls){
        drawCircle(this.pos.x,this.pos.y,5,"white");
        this.rays.forEach(ray => {
            ray.update(delta, walls);
        });
    }
}

class MainLevel extends LevelInterface {
    walls = new Walls();
    player = new Player({x:300,y:200});
    getMouseInput(event){ this.player.getMouseInput(event); }
    getMouseMoveInput(event) { this.player.getMouseMoveInput(event); }

    setupHelpDialog(){
        const textParts = [`
            <span class="HelpHeader">Description</span><br>
                Ray casting demo for visualizing line-of-sight against maze walls.
            `,`
            <span class="HelpHeader">Instructions</span><br>
              ${drawHelpKey('Mouse')} Click and drag around the maze to move the ray source.<br>
            `];
        return {textParts, pause:false}
    }
    
    setup(){
        this.walls.createWalls(5);
    }

    update(delta){
        drawBox(0,0,this.canvas.width, this.canvas.height,'black');
        this.player.update(delta, this.walls.segments);
        this.walls.update(delta);
    }
}
