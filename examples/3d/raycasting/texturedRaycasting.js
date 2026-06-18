const FOV = 45;
const WALL_TILE_SIZE = 64;
const WALL_TILE_COLUMNS = 6;

class Walls{
    segments = [];
    constructor(){}
    
    createWallsFromMap(map){
        this.segments = [];
        const cellSize = {width:40, height: 40} 
        const bounds = { x:10, y:150, width: 500, height: 500 };

        map.forEach((row,i_row)=>{
            row.forEach((cell, i_col)=>{
                if(cell.startsWith("0")) return;
                
                const x1 = bounds.x+(i_col*cellSize.width);
                const x2 = x1+cellSize.width;
                const y1 = bounds.y+(i_row*cellSize.height);
                const y2 = y1+cellSize.height;
                const texture = Number(cell.split(" - ")[1]);

                if(cell.startsWith("N")) this.segments.push({x1, y1, x2, y2:y1, texture});
                if(cell.startsWith("S")) this.segments.push({x1, y1:y2, x2, y2, texture});
                if(cell.startsWith("E")) this.segments.push({x1:x2, y1, x2, y2, texture});
                if(cell.startsWith("W")) this.segments.push({x1, y1, x2:x1, y2, texture});

            });
        });
    }

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
        this.textureLoc = 0;
        this.texture = 0;
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
                    this.textureLoc = percentage({x:wall.x1, y:wall.y1},{x:wall.x2, y:wall.y2}, hit);
                    this.texture=wall.texture;
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
    plankTextureSlice = [];
    plankTexture = [];
    sceneBounds = { x: 510, y: 150, width: 500-10, height: 500-150 }

    constructor(pos){
        this.pos = pos;
        this.rays = [];
        this.createRays(FOV);
    }

    createRays(fov=this.fov){
        if(this.fov != fov){
            this.fov = fov;
            this.rays = []; 
            for (let a = -this.fov / 2; a < this.fov / 2; a += 0.25) 
                this.rays.push(new Ray(this.pos, Tools.toRadians(a) + this.heading));
            return;
        }

        let index = 0;
        for (let a = -this.fov / 2; a < this.fov / 2; a += 0.25) {
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
            this.plankTextureSlice[i] = ray.textureLoc;
            this.plankTexture[i] = ray.texture;
        });

        const HALF_WIDTH = 490/2;
        const HALF_FOV = 90/2;

        const w = this.sceneBounds.width / this.planks.length;
        for (let i = 0; i < this.planks.length; i++) {
            const litColor = (1-(this.planks[i]/this.sceneBounds.width));
            //const height = (1-(this.planks[i]/this.sceneBounds.width))*this.sceneBounds.height;
            const SCREEN_DIST = HALF_WIDTH / Math.tan(HALF_FOV);
            const height = (SCREEN_DIST / (this.planks[i]+0.0001))*150
            const texture = Math.max(0, Math.floor(this.plankTexture[i])) % WALL_TILE_COLUMNS;
            const textureCol = texture * WALL_TILE_SIZE;

            drawSpritePixel(bradEngine.currentLevel.images['sciFiWalls.png'],
                Math.floor(this.plankTextureSlice[i]*WALL_TILE_SIZE)+textureCol,0,1,WALL_TILE_SIZE,
                this.sceneBounds.x+(i * w)-1, 
                this.sceneBounds.y+((this.sceneBounds.height-height)/2), 
                w+1, 
                (height>0) ? height: 0, 
                litColor
            )            

        }        
    }
}

function percentage (a, b, c){
    let distAC = Math.sqrt((c.x-a.x)**2+(c.y-a.y)**2); // distance from A to C
    let distAB = Math.sqrt((b.x-a.x)**2+(b.y-a.y)**2); // distance from A to B
    let ratio = distAC / distAB; // ratio of AC to AB returns ratio *100
    return ratio; // percentage of AC to AB
}

// let a = {x:0, y:0};
// let b = {x:10, y:10};
// let c = {x:2.5, y:2.5};

// let result = percentage(a,b,c);
// console.log(result);


class MainLevel extends LevelInterface {
    loadResources(){this.findResources('raycasting','images');}

    walls = new Walls();
    player = new Player({x:300,y:200});
    getMouseInput(event){ this.player.getMouseInput(event); }
    getMouseMoveInput(event) { this.player.getMouseMoveInput(event); }
    getKeyboardInput(event){this.player.getKeyboardInput(event);}

    setupHelpDialog(){
        const textParts = [`
            <span class="HelpHeader">Description</span><br>
                Textured ray casting demo with a first-person wall view.
            `,`
            <span class="HelpHeader">Instructions</span><br>
              ${drawHelpKey('Mouse')} Click and drag around the maze to move the ray source.<br>
              ${drawHelpKey('w')} Walk forward.<br>
              ${drawHelpKey('s')} Walk backward.<br>
              ${drawHelpKey('a')} Turn left.<br>
              ${drawHelpKey('d')} Turn right.<br>
            `];
        return {textParts, pause:false}
    }

    setup(){
        //this.walls.createWalls(5);
        this.walls.createWallsFromMap([
            ["0 - 00", "S - 00", "S - 01", "S - 02", "S - 03", "S - 04", "S - 05", "S - 00", "S - 01", "0 - 00"],
            ["E - 05", "0 - 00", "0 - 00", "0 - 00", "0 - 00", "0 - 00", "0 - 00", "0 - 00", "0 - 00", "W - 02"],
            ["E - 04", "0 - 00", "0 - 00", "0 - 00", "0 - 00", "0 - 00", "0 - 00", "0 - 00", "0 - 00", "W - 03"],
            ["E - 03", "0 - 00", "0 - 00", "0 - 00", "S - 05", "0 - 00", "0 - 00", "0 - 00", "0 - 00", "W - 04"],
            ["E - 02", "0 - 00", "0 - 00", "0 - 00", "0 - 00", "0 - 00", "0 - 00", "0 - 00", "0 - 00", "W - 05"],
            ["E - 01", "0 - 00", "0 - 00", "0 - 00", "0 - 00", "0 - 00", "0 - 00", "0 - 00", "0 - 00", "W - 00"],
            ["E - 00", "0 - 00", "0 - 00", "0 - 00", "0 - 00", "0 - 00", "0 - 00", "0 - 00", "0 - 00", "W - 01"],
            ["E - 05", "0 - 00", "0 - 00", "0 - 00", "0 - 00", "0 - 00", "0 - 00", "0 - 00", "0 - 00", "W - 02"],
            ["E - 04", "0 - 00", "0 - 00", "0 - 00", "0 - 00", "0 - 00", "0 - 00", "0 - 00", "0 - 00", "W - 03"],
            ["E - 03", "0 - 00", "0 - 00", "0 - 00", "0 - 00", "0 - 00", "0 - 00", "0 - 00", "0 - 00", "W - 04"],
            ["0 - 00", "N - 02", "N - 03", "N - 04", "N - 05", "N - 00", "N - 01", "N - 02", "N - 03", "0 - 00"]
        ]);
    }
    // 6 x 64px columns
    // 1 x 64px row
    update(delta){
        //drawImageFrom00('sciFiWalls.png',0,0,this.canvas.width, this.canvas.height);
        // drawSpritePixel(bradEngine.currentLevel.images['sciFiWalls.png'],
        //     0,0,1,64,
        //     0,0,this.canvas.width, this.canvas.height
        // )
        drawBox(0,0,this.canvas.width, this.canvas.height,'black');
        drawBox(510, 150, 500-10, 175,'#1F1F1F');
        drawBox(510, 150+175, 500-10, 175,'#7F7F7F');
        this.player.update(delta, this.walls.segments);
        this.walls.update(delta);
        drawBox(0,0,this.canvas.width, 149,'black');
        drawBox(0,501,this.canvas.width, 500,'black');
    }
}
