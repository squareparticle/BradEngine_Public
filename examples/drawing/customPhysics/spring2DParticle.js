// hooks law
// Fspring = -k * x;
// k = how springy
// anchor.y - other end,y = rest length
// x = displacement or the distance pulled away from the rest length

class Spring{
    constructor(k, restLength, a, b){
        this.k = k;
        this.restLength = restLength;
        this.a = a;
        this.b = b;
    }

    update(delta){
        let direction = Tools2D.subVectors(this.b.pos, this.a.pos);
        let x = Tools2D.mag(direction)-this.restLength;
        let force1 = Tools2D.multVector(Tools2D.normalize(direction), ( 1*this.k*x));
        let force2 = Tools2D.multVector(Tools2D.normalize(direction), ( -1*this.k*x));

        this.a.applyForce(force1);
        this.b.applyForce(force2);

        drawLine(this.a.pos.x, this.a.pos.y,this.b.pos.x, this.b.pos.y,'black');

        this.a.update(delta);
        this.b.update(delta);
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

    constructor(pos, size){
        this.pos={...pos}
        this.size = size;        
    }

    applyForce(force){
        this.velocity = Tools2D.addVectors(this.velocity, force);
        this.velocity = Tools2D.addVectors(this.velocity, this.gravity);
        this.pos = Tools2D.addVectors(this.pos, this.velocity);
        this.velocity = Tools2D.multVector(this.velocity, 0.99); // slow down over time
    }

    update(delta){
        let color = `rgba(${this.color.r},${this.color.g},${this.color.b},${this.color.a})`;
        drawCircle(this.pos.x, this.pos.y, this.size, color);        
    }
}

class MainLevel extends LevelInterface { 
    spring;
    mouseDown;

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
        let anchor = new Particle({x:this.canvas.width/2, y:10}, 5);
        let bobber = new Particle({x:(this.canvas.width/2)+50, y:250}, 10);
        this.spring = new Spring(0.01, 100, anchor, bobber);
    }

    update(delta){

        if(this.mouseDown){ 
            this.spring.a.velocity = {x:0, y:0};
            this.spring.a.pos.x = this.mouseDown.position.x;
            this.spring.a.pos.y = this.mouseDown.position.y;
        }

        this.spring.update(delta);
    }
}