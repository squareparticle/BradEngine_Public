class MainLevel extends LevelInterface {
    setup(){
        this.starField = [];
        this.starField.push(new StarField(this.canvas, 500, {x:{min:-50, max:50}, y:{min:-50, max:50}, z:{min: 20, max: 500}}, ParticleProps.DIR_IN, 0,ParticleProps.TYPE_POINT));
        this.starField.push(new StarField(this.canvas, 500, {x:{min:-50, max:50}, y:{min:-50, max:50}, z:{min: 20, max: 500}}, ParticleProps.DIR_IN, 2));
        this.starField.push(new StarField(this.canvas, 500, {x:{min:-50, max:50}, y:{min:-50, max:50}, z:{min: 20, max: 500}}, ParticleProps.DIR_OUT, 2));
        this.starField.push(new StarField(this.canvas, 500, {x:{min:-1000, max:1000}, y:{min:-300, max:300}, z:{min: 500, max: 2000}}, ParticleProps.DIR_LEFT, 4));
        this.starField.push(new StarField(this.canvas, 500, {x:{min:-700, max:700}, y:{min:-1000, max:1000}, z:{min: 500, max: 2000}}, ParticleProps.DIR_UP, 4));
        this.starField.push(new StarField(this.canvas, 500, {x:{min:-1000, max:1000}, y:{min:-300, max:300}, z:{min: 500, max: 2000}}, ParticleProps.DIR_RIGHT, 4));
        this.starField.push(new StarField(this.canvas, 500, {x:{min:-700, max:700}, y:{min:-1000, max:1000}, z:{min: 500, max: 2000}}, ParticleProps.DIR_DOWN, 4));
    }

    update(delta){
        //drawImage('background.jpg',0,0,this.canvas.width, this.canvas.height);
        drawBox(0,0,this.canvas.width, this.canvas.height,'black')
        for(var i=0; i<this.starField.length; i++)
            this.starField[i].update(delta);
    }
}