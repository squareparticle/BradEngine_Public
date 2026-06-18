class GameObject{
    pos;
    speed;
    dir;

    constructor(pos, speed, dir){
        this.pos = pos;
        this.speed = speed;
        this.dir = dir;
    }

    update(delta){
        this.pos.x += this.dir.x * this.speed * delta;
        this.pos.y += this.dir.y * this.speed * delta;
    }
}

class Ball extends GameObject{
    update(delta){
        super.update(delta);
        drawCircle(this.pos.x, this.pos.y, 7, 'white');
    }
}

class Paddle extends GameObject{
    size = {width: 10, height: 75}
    update(delta){
        super.update(delta);
        drawBox(this.pos.x, this.pos.y, this.size.width, this.size.height, 'white');
    }
}

class Player{
    static TYPE_PLAYER = 0;
    static TYPE_CPU = 1;

    static SIDE_LEFT = 1;
    static SIDE_RIGHT = 9;

    score=0;
    level;
    ann;
    predictionVel = 0;

    type = Player.TYPE_CPU;
    paddle;
    speed = 400;

    interceptLocation = 0;

    constructor(level, side){
        this.level = level;
        this.side = side;        
        this.paddle = new Paddle({x:level.canvas.width*0.1*side, y:level.canvas.height*0.5},this.speed,{x:0,y:0});
        this.interceptLocation = level.canvas.height*.8;
        this.ann = new ANN(6, 1, 1, 4, 0.81);
        this.ann.hiddenActivationFunction=this.ann.tanH;
        this.ann.outputActivationFunction=this.ann.tanH;
    }

    brain(delta){
        if(this.type === Player.TYPE_CPU){

            this.paddle.pos.y = clamp(this.paddle.pos.y + (this.predictionVel*delta*this.speed), 0, this.level.canvas.height-this.paddle.size.height);
            let error = this.interceptLocation-this.paddle.pos.y;

            // let inputs =[
            //     this.level.ball.pos.x,
            //     this.level.ball.pos.y,
            //     this.level.ball.dir.x * this.level.ball.speed*delta,
            //     this.level.ball.dir.y * this.level.ball.speed*delta,
            //     this.paddle.pos.x,
            //     this.paddle.pos.y
            // ];

            let inputsNormalized =[
                this.level.ball.pos.x/this.level.canvas.width,
                this.level.ball.pos.y/this.level.canvas.height,
                (this.level.ball.dir.x * this.level.ball.speed)/this.level.canvas.width,
                (this.level.ball.dir.y * this.level.ball.speed)/this.level.canvas.height,
                this.paddle.pos.x/this.level.canvas.width,
                this.paddle.pos.y/this.level.canvas.height
            ];

            let inputs =[1,1,1,1,1,1]; // it appears to not care what the inputs are and it will constantly retrain bases off the error instead

            let outputs=[
                error
            ];

            this.predictionVel = this.ann.train(inputs, outputs)[0];

            /* AI 1
            let distance = Math.abs(this.interceptLocation-this.paddle.pos.y-(this.paddle.size.height/2));
            let direction = Math.sign(this.interceptLocation-this.paddle.pos.y)
            this.paddle.dir.y = 0;
            if(distance > this.paddle.size.height/2)
                this.paddle.dir.y = direction;
            */
            /* AI 2
            this.paddle.dir.y = Math.sign(this.level.ball.pos.y - (this.paddle.pos.y+(this.paddle.size.height/2)));
            */
            /* AI 3
                this.paddle.pos.y = this.level.ball.pos.y - this.paddle.size.height/2;
            */

        }
    }

    update(delta){
        this.paddle.update(delta);
        drawText(this.level.canvas.width*0.1*this.side, this.level.canvas.height*0.1,this.score,40,'white');
        this.brain(delta);
    }
}

class GameController{
    players;
    ball;
    level;
    needBall = true;
    startSpeed = 200;

    constructor(level, players, ball){
        this.level = level;
        this.players = players;
        this.ball = ball;
    }

    resetBall(serveDir){
        this.ball.pos = {x:this.level.canvas.width*0.5, y:this.level.canvas.height*0.5}
        this.ball.speed = this.startSpeed;
        this.ball.dir = {x:serveDir,y:Tools.getRandomObject([-1,1])};
    }

    update(delta){
        if(Collision.testCircleOnBox({...this.ball.pos, r:5},{...this.players[0].paddle.pos, ...this.players[0].paddle.size})){
            this.ball.dir.x = -1;
            this.ball.dir.y = Tools.getRandomObject([-1,0,1]);
        }

        if(Collision.testCircleOnBox({...this.ball.pos, r:5},{...this.players[1].paddle.pos, ...this.players[1].paddle.size})){
            this.ball.dir.x = 1;
            this.ball.dir.y = Tools.getRandomObject([-1,0,1]);
        }

        if(this.ball.pos.y < 0) this.ball.dir.y=1;
        if(this.ball.pos.y > this.level.canvas.height) this.ball.dir.y=-1;
        if(this.ball.pos.x < 0){
            this.resetBall(1);
            this.players[0].score++;
        } 
        if(this.ball.pos.x > this.level.canvas.width){
            this.resetBall(-1);
            this.players[1].score++;
        }         
    }
}

class MainLevel extends LevelInterface {
    players = [];
    ball;
    gameController;
    borderLeft;
    borderRight;
    borderTop;
    borderBottom;
    showDebug = false;

    setup(){
        this.players.push(new Player(this,Player.SIDE_RIGHT));
        this.players.push(new Player(this,Player.SIDE_LEFT));
        this.ball = new Ball({x:this.canvas.width*1.5, y:this.canvas.height*0.5},0,{x:0,y:0});
        this.gameController = new GameController(this, this.players, this.ball);

        this.borderRight = { x1: this.canvas.width*.9, y1: 0, x2: this.canvas.width*.9, y2: this.canvas.height};
        this.borderLeft = { x1: this.canvas.width*.1, y1: 0, x2: this.canvas.width*.1, y2: this.canvas.height};
        this.borderTop = { x1: 0, y1: 0, x2: this.canvas.width, y2: 0 };
        this.borderBottom = { x1: 0, y1: this.canvas.height, x2: this.canvas.width, y2: this.canvas.height};
    }

    update(delta){
        drawBox(0,0,this.canvas.width, this.canvas.height, 'black');
        this.gameController.update();

        this.players.forEach(p=>p.update(delta));
        this.ball.update(delta);

        if(this.showDebug) drawLine(this.borderRight.x1, this.borderRight.y1,this.borderRight.x2, this.borderRight.y2,'green');
        if(this.showDebug) drawLine(this.borderLeft.x1,this. borderLeft.y1,this.borderLeft.x2, this.borderLeft.y2,'green');

        let ballRay = {
            x1: this.ball.pos.x,
            y1: this.ball.pos.y,
            x2: this.ball.pos.x+this.ball.dir.x*1500,
            y2: this.ball.pos.y+this.ball.dir.y*1500
        }
        if(this.showDebug) drawLine(ballRay.x1, ballRay.y1,ballRay.x2, ballRay.y2,'red');

        let intersection = Collision.testLineIntersect(this.borderRight, ballRay);
        if(intersection) { 
            if(this.showDebug) drawCircle(intersection.x, intersection.y, 5, 'blue'); 
            this.players[0].interceptLocation=intersection.y;
            return;
        }

        intersection = Collision.testLineIntersect(this.borderLeft, ballRay);
        if(intersection) { 
            if(this.showDebug) drawCircle(intersection.x, intersection.y, 5, 'blue'); 
            this.players[1].interceptLocation=intersection.y;
            return;
        }

        intersection = Collision.testLineIntersect(this.borderTop, ballRay);
        if(intersection) { 
            if(this.showDebug) drawCircle(intersection.x, intersection.y, 5, 'blue'); 
            let bounceRay ={
                x1:intersection.x,
                y1:intersection.y,
                x2:intersection.x+this.ball.dir.x*1500,
                y2:intersection.y+(-1*this.ball.dir.y)*1500
            }
            drawLine(bounceRay.x1, bounceRay.y1, bounceRay.x2, bounceRay.y2);

            if(this.ball.dir.x===1){
                intersection = Collision.testLineIntersect(this.borderRight, bounceRay);
                if(intersection) { 
                    if(this.showDebug) drawCircle(intersection.x, intersection.y, 5, 'blue'); 
                    this.players[0].interceptLocation=intersection.y;
                    return;
                }
            }
            if(this.ball.dir.x===-1){
                intersection = Collision.testLineIntersect(this.borderLeft, bounceRay);
                if(intersection) { 
                    if(this.showDebug) drawCircle(intersection.x, intersection.y, 5, 'blue'); 
                    this.players[1].interceptLocation=intersection.y;
                    return;
                }
            }
            return; 
        }

        intersection = Collision.testLineIntersect(this.borderBottom, ballRay);
        if(intersection){
            if(this.showDebug) drawCircle(intersection.x, intersection.y, 5, 'blue'); 
            let bounceRay ={
                x1:intersection.x,
                y1:intersection.y,
                x2:intersection.x+this.ball.dir.x*1500,
                y2:intersection.y+(-1*this.ball.dir.y)*1500
            }
            if(this.showDebug) drawLine(bounceRay.x1, bounceRay.y1, bounceRay.x2, bounceRay.y2);

            if(this.ball.dir.x===1){
                intersection = Collision.testLineIntersect(this.borderRight, bounceRay);
                if(intersection) { 
                    if(this.showDebug) drawCircle(intersection.x, intersection.y, 5, 'blue'); 
                    this.players[0].interceptLocation=intersection.y;
                    return;
                }
            }
            if(this.ball.dir.x===-1){
                intersection = Collision.testLineIntersect(this.borderLeft, bounceRay);
                if(intersection) { 
                    if(this.showDebug) drawCircle(intersection.x, intersection.y, 5, 'blue'); 
                    this.players[1].interceptLocation=intersection.y;
                    return;
                }
            }    
            return; 
        }
    }
}
