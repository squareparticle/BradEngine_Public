// Fspring = -k ^ x;
// k = how springy
// anchor.y - other end,y = rest length
// x = displacement or the distance pulled away from the rest length

class MainLevel extends LevelInterface {   
    k = 0.01;
    velocity = 0;
    restLength = 400;
    pos = {x:this.canvas.width/2, y:200};

    setup(){
        
    }

    update(){
        let x = this.pos.y-this.restLength;
        let force = -this.k *x;
        this.velocity+=force;
        this.velocity *=0.99;
        this.pos.y += this.velocity;

        drawCircle(this.pos.x, this.pos.y, 10, 'black');
    }
}