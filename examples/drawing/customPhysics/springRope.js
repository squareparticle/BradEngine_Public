// hooks law
// Fspring = -k * x;
// k = how springy
// anchor.y - other end,y = rest length
// x = displacement or the distance pulled away from the rest length
class Rope{
    springs = [];
    distance = 50;
    drawPoints = true;
    lineThickness= 1;

    constructor(numSprings, distance, lineThickness, dotSize, pos){
        if(dotSize===0) this.drawPoints = false;
        this.distance = distance;
        this.lineThickness = lineThickness;
        let a = new Particle({...pos},dotSize); 
        a.locked = true;        

        for(let i=1; i<numSprings; i++){
            let b = new Particle({x:pos.x, y:pos.y+(i*this.distance)},dotSize); 
            let spring = new Spring(0.1, this.distance/2, lineThickness, a, b, this.drawPoints);
            this.springs.push(spring);
            a = b;
        }
    }

    getTail(){
        return this.springs[this.springs.length-1].b;
    }

    update(delta){
        this.springs.forEach(spring=>spring.update(delta))
        let path = this.springs.map(spring=>spring.a.pos);
        path.push(this.springs[this.springs.length-1].b.pos);
        drawLines(path, 'black', {lineWidth:this.lineThickness, openPath:true});
    }
}

class Spring{
    constructor(k, restLength, thickness, a, b, drawPoints){
        this.k = k;
        this.restLength = restLength;
        this.a = a;
        this.b = b;
        this.drawPoints = drawPoints;
        this.thickness = thickness
    }

    update(delta){
        let direction = Tools2D.subVectors(this.b.pos, this.a.pos);
        let x = Tools2D.mag(direction)-this.restLength;
        let force1 = Tools2D.multVector(Tools2D.normalize(direction), ( 1*this.k*x));
        let force2 = Tools2D.multVector(Tools2D.normalize(direction), ( -1*this.k*x));

        this.a.applyForce(force1);
        this.b.applyForce(force2);

        //drawLine(this.a.pos.x, this.a.pos.y,this.b.pos.x, this.b.pos.y,'black',{lineWidth:this.thickness});

        if(this.drawPoints){
            this.a.update(delta);
            this.b.update(delta);
        }
    }
}

class Particle{
    velocity = {x:0, y:0};
    gravity = {x:0, y:0.1};
    pastPositions = [];
    color={ r:0, g:0, b:0, a:1}
    size=7
    pos={x:0,y:0}
    startPos={x:0,y:0}
    locked = false;

    constructor(pos, size){
        this.pos={...pos}
        this.size = size;        
    }

    applyForce(force){
        if(!this.locked){
            this.velocity = Tools2D.addVectors(this.velocity, force);
            this.velocity = Tools2D.addVectors(this.velocity, this.gravity);
            this.pos = Tools2D.addVectors(this.pos, this.velocity);
            this.velocity = Tools2D.multVector(this.velocity, 0.99); // slow down over time
        }
    }

    update(delta){
        let color = `rgba(${this.color.r},${this.color.g},${this.color.b},${this.color.a})`;
        drawCircle(this.pos.x, this.pos.y, this.size, color);        
    }
}

class MainLevel extends LevelInterface { 
    rope; tail;
    mouseDown;

    setupHelpDialog(){
        const textParts = [`
            <span class="HelpHeader">Description</span><br>
                Custom rope physics built from a chain of particles connected by springs.
            `,`
            <span class="HelpHeader">Math</span><br>
                Each segment uses Hooke's law: force equals stiffness times stretch. The spring compares the current distance between two particles to its rest length, then pushes one particle and pulls the other along that direction. Gravity adds downward velocity, and damping slowly removes energy so the rope settles instead of bouncing forever.
            `,`
            <span class="HelpHeader">Instructions</span><br>
                ${drawHelpKey('Mouse')} Grab the bottom of the rope and drag it around.<br>
            `];
        return {textParts, pause:false}
    }

    getMouseInput(event){
        this.mouseDown = null;
        if(event.type === "down"){
            this.mouseDown = {position:{...event.position}};
        }
    }

    getMouseMoveInput(event){
        if(this.mouseDown){
            this.mouseDown = {position:{...event.position}};
        }
    }

    setup(){
        this.rope=new Rope(20, 25, 5, 0, {x:this.canvas.width/2, y:10});
        this.tail = this.rope.getTail();
    }

    update(delta){

        if(this.mouseDown){ 
            this.tail.velocity = {x:0, y:0};
            this.tail.pos.x = this.mouseDown.position.x;
            this.tail.pos.y = this.mouseDown.position.y;
        }

        this.rope.update(delta);
    }
}
