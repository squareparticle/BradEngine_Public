// hooks law
// Fspring = -k * x;
// k = how springy
// anchor.y - other end,y = rest length
// x = displacement or the distance pulled away from the rest length

class MainLevel extends LevelInterface { 
    k = 0.01;
    velocity = {x:0, y:0};
    restLength = 200;
    anchor = {x:this.canvas.width/2, y:10}
    bobber = {x:(this.canvas.width/2)+50, y:250};
    gravity = {x:0, y:0.1};
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

    update(){

        if(this.mouseDown){ 
            this.velocity = {x:0, y:0};
            this.bobber.x = this.mouseDown.position.x;
            this.bobber.y = this.mouseDown.position.y;
        }

        let direction = Tools2D.subVectors(this.bobber, this.anchor);
        let x = Tools2D.mag(direction)-this.restLength;
        let force = Tools2D.multVector(Tools2D.normalize(direction), (-1*this.k*x))

        this.velocity = Tools2D.addVectors(this.velocity, force);
        this.velocity = Tools2D.addVectors(this.velocity, this.gravity);
        this.bobber = Tools2D.addVectors(this.bobber, this.velocity);
        this.velocity = Tools2D.multVector(this.velocity, 0.99); // slow down over time

        drawLine(this.anchor.x, this.anchor.y,this.bobber.x, this.bobber.y,'black');
        drawCircle(this.anchor.x, this.anchor.y, 5, 'black');
        drawCircle(this.bobber.x, this.bobber.y, 10, 'black');
    }
}