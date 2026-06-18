class Walls{
    segments = [];
    constructor(){}
    
    createWalls(numberOfWalls){
        this.segments = [];
        let bounds = { x:10, y:150, width: 500, height: 500 };
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
        this.shortestDist = Infinity;
        this.setAngle(angle);
    }

    setAngle(angle) { this.dir = { x: Math.cos(angle), y: Math.sin(angle) }; }    
       
    update(delta, walls, heading) {

        let hitPos = null;
        this.shortestDist = Infinity;        
        walls.forEach(wall => {         
            const hit = Tools.rayCast(this.pos, this.dir, wall);
            if (hit) {
                let dist = Tools.distanceBetweenPoints(this.pos, hit);

                const a = Tools.vecToAngle(this.dir) - heading;
                dist *= Math.cos(a);                

                if (dist < this.shortestDist) {
                    this.shortestDist = dist;
                    hitPos = hit;
                }
            }
        });

        if (hitPos) drawLine(this.pos.x, this.pos.y, hitPos.x, hitPos.y,"blue");        
    }
}

class Player{
    dragging = false; 
    rotateForward = false;
    rotateBackward = false;
    moveForward = false;
    moveBackward = false;
    speed = 2;
    turnSpeed = 0.04;
    pos={x:0,y:0};
    fov = 0;
    rays = [];
    heading = 0;
    planks = [];
    sceneBounds = { x: 510, y: 150, width: 500-10, height: 500-150 }

    constructor(pos){
        this.pos = pos;
        this.rays = [];
        this.createRays(120);
    }

    createRays(fov=this.fov){
        if(this.fov != fov){
            this.fov = fov;
            this.rays = []; 
            for (let a = -this.fov / 2; a < this.fov / 2; a += 1) 
                this.rays.push(new Ray(this.pos, Tools.toRadians(a) + this.heading));
            return;
        }

        let index = 0;
        for (let a = -this.fov / 2; a < this.fov / 2; a += 1) {
          this.rays[index].setAngle(Tools.toRadians(a) + this.heading);
          index++;
        }
    }

    rotate(angle) {
        this.heading += angle;
        this.createRays();
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

    move(speed) {
        this.pos.x = this.pos.x + (Math.cos(this.heading)*speed);
        this.pos.y = this.pos.y + (Math.sin(this.heading)*speed);        
    }

    getKeyboardInput(event){
        if(event.type==="down" && event.key==="w") this.moveForward = true;
        if(event.type==="down" && event.key==="s") this.moveBackward = true;
        if(event.type==="down" && event.key==="d") this.rotateForward = true;
        if(event.type==="down" && event.key==="a") this.rotateBackward = true;

        if(event.type==="up" && event.key==="w") this.moveForward = false;
        if(event.type==="up" && event.key==="s") this.moveBackward = false;
        if(event.type==="up" && event.key==="d") this.rotateForward = false;
        if(event.type==="up" && event.key==="a") this.rotateBackward = false;
    }

    update(delta, walls){

        if(this.rotateBackward) this.rotate(-this.turnSpeed);
        if(this.rotateForward) this.rotate(this.turnSpeed);
        if(this.moveForward) this.move(this.speed);
        if(this.moveBackward) this.move(-this.speed);

        drawCircle(this.pos.x,this.pos.y,5,"white");
        this.rays.forEach((ray,i) => {
            ray.update(delta, walls, this.heading);
            this.planks[i] = ray.shortestDist;
        });

        const w = this.sceneBounds.width / this.planks.length;
        for (let i = 0; i < this.planks.length; i++) {
            const litColor = (1-(this.planks[i]/this.sceneBounds.width))*255;
            const height = (1-(this.planks[i]/this.sceneBounds.width))*this.sceneBounds.height;
            drawBox(
                this.sceneBounds.x+(i * w)-1, 
                this.sceneBounds.y+((this.sceneBounds.height-height)/2), 
                w+1, 
                (height>0) ? height: 0, 
                `rgb(0,0,${litColor})`
            );
        }        
    }
}

class MainLevel extends LevelInterface {
    walls = new Walls();
    player = new Player({x:300,y:200});
    getMouseInput(event){ this.player.getMouseInput(event); }
    getMouseMoveInput(event) { this.player.getMouseMoveInput(event); }
    getKeyboardInput(event){this.player.getKeyboardInput(event);}

    setup(){
        this.walls.createWalls(5);
    }

    update(delta){
        drawBox(0,0,this.canvas.width, this.canvas.height,'black');
        this.player.update(delta, this.walls.segments);
        this.walls.update(delta);
    }
}