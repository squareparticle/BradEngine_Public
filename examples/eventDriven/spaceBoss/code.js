class Bullet {
    constructor(level, position){
        this.position = position;
        this.speed = -500;
        this.moveDirection = {x:0, y:this.speed}
        this.image='bullet.png';
        this.size = { w: level.images[this.image].width, h: level.images[this.image].height}
        
    }

    update(delta){
        this.position.x += this.moveDirection.x * delta;
        this.position.y += this.moveDirection.y * delta;
        drawImage(this.image, this.position.x, this.position.y,this.size.w, this.size.h);
    }
}

class Player {
    constructor(level){
        this.level = level;
        this.position = {x:500, y:600}
        this.moveDirection = {x:0, y:0}
        this.speed = 400;
        this.image='player.png';
        this.size = { w: level.images[this.image].width, h: level.images[this.image].height}
        this.firedBullets = [];
        this.lastTime = (new Date()).getTime();
        this.reloadTime = 100; 

        this.kbMoveControls = [
            {moveKey:"ArrowRight", axis:'x', speed: this.speed},
            {moveKey:"ArrowLeft", axis:'x', speed: -this.speed},
            {moveKey:"ArrowUp", axis:'y', speed: -this.speed},
            {moveKey:"ArrowDown", axis:'y', speed: this.speed},
            {actionKey:" ", method:this.fireBullet}
        ]
        this.moveRules = [
            {axis:'x', dir: 1, bounds: level.canvas.width-this.size.w/2},
            {axis:'x', dir:-1, bounds: this.size.w/2},
            {axis:'y', dir: 1, bounds: level.canvas.height-this.size.h/2},
            {axis:'y', dir:-1, bounds: this.size.h/2},
        ]
    }

    fireBullet(player, keyType){
        var currenTime = (new Date()).getTime();
        // if(keyType==="down")
        if(currenTime > (this.lastTime+this.reloadTime)){
            this.lastTime = currenTime;
            player.firedBullets.push(new Bullet(player.level,{x:player.position.x+60, y:player.position.y-40}));
            player.firedBullets.push(new Bullet(player.level,{x:player.position.x-60, y:player.position.y-40}));
        }
    }

    getKeyboardInput(event){
        for(var i=0; i< this.kbMoveControls.length; i++){

            for(var i=0; i< this.kbMoveControls.length; i++){
                if(this.kbMoveControls[i].moveKey && this.kbMoveControls[i].moveKey === event.key)  // check if the key pressed is a move key
                    this.moveDirection[this.kbMoveControls[i].axis] = (event.type==="down") ? this.kbMoveControls[i].speed : 0; // change the speed of the moveDirection[axis] or set it to 0 on key up
                if(this.kbMoveControls[i].actionKey && this.kbMoveControls[i].actionKey === event.key) // check if the key pressed is a action key the run its method
                    this.kbMoveControls[i].method(this, event.type);
            }
        }
    }

    update(delta){
        // move the player but keep them within bounds.
        for(var i=0; i< this.moveRules.length; i++){
            if( this.moveDirection[this.moveRules[i].axis] !== 0 && // make sure the input axis for the moveRules is actually moving 
                Math.sign(this.moveDirection[this.moveRules[i].axis]) === Math.sign(this.moveRules[i].dir) && // input axis is moving in the same direction as the rule axis
                (this.moveRules[i].dir > 0 && (this.moveDirection[this.moveRules[i].axis] * delta) + this.position[this.moveRules[i].axis] < (this.moveRules[i].bounds) || // check positive direction bounds rule
                (this.moveRules[i].dir < 0 && (this.moveDirection[this.moveRules[i].axis] * delta) + this.position[this.moveRules[i].axis] > (this.moveRules[i].bounds))) // check negative direction bounds rule
            )
                this.position[this.moveRules[i].axis] += this.moveDirection[this.moveRules[i].axis] * delta; // add the axis's move position 
        }
        // draw the player image
        drawImage(this.image, this.position.x, this.position.y,this.size.w, this.size.h);

        this.fireBullet(this);

        for(var i=0; i<this.firedBullets.length; i++){
            this.firedBullets[i].update(delta);
            if(this.firedBullets[i].position.y < 20){
                this.firedBullets.splice(i, 1);
            }
        }
    }
}

class MainLevel extends LevelInterface {
    loadResources(){this.findResources('spaceBoss','images');}
    getKeyboardInput(event){this.player.getKeyboardInput(event);}

    setup(){
        this.starField = new StarField(this.canvas, 500, {x:{min:-700, max:700}, y:{min:-1000, max:1000}, z:{min: 500, max: 2000}}, ParticleProps.DIR_DOWN, 4);
        this.player = new Player(this);
    }

    update(delta){
        drawImageFrom00('background.jpg',0,0,this.canvas.width, this.canvas.height);
        //drawBox(0,0,this.canvas.width, this.canvas.height,'black')
        this.starField.update(delta);
        this.player.update(delta);
        this.addScreenLog('Number of Bullets: '+this.player.firedBullets.length, 'red');  
    }
}