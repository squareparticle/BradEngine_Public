const ParticleProps = {
    DIR_IN: 'IN',
    DIR_OUT: 'OUT',
    DIR_LEFT: 'LEFT',
    DIR_RIGHT: 'RIGHT',
    DIR_UP: 'UP',
    DIR_DOWN: 'DOWN',
    TYPE_LINE:'line',
    TYPE_POINT:'POINT'
}

class StarField{
    constructor(canvas, numStars, bounds, direction, speed, type=ParticleProps.TYPE_LINE){
        this.xMinMax = bounds.x;
        this.yMinMax = bounds.y;
        this.zMinMax = bounds.z;
        this.pointSize = 2;
        this.line={thickness:3, size: 10};
        this.canvas = canvas;
        this.direction = direction;
        this.speed = speed;
        this.setDirectionSpeed();
        this.stars = [];
        this.type = type;

        for(var i=0; i<numStars; i++){
            this.stars[i] = Tools3D.getRandomPostision(this.xMinMax, this.yMinMax, this.zMinMax);
        }
    }

    setDirectionSpeed(){
        switch(this.direction){
            case ParticleProps.DIR_RIGHT:
                this.directionSpeed = {x:this.speed, y:0, z:0};
            break;
            case ParticleProps.DIR_LEFT:
                this.directionSpeed = {x:-this.speed, y:0, z:0};
            break;
            case ParticleProps.DIR_DOWN:
                this.directionSpeed = {x:0, y:this.speed, z:0};
            break;
            case ParticleProps.DIR_UP:
                this.directionSpeed = {x:0, y:-this.speed, z:0};
            break;
            case ParticleProps.DIR_OUT:
                this.directionSpeed = {x:0, y:0, z:this.speed};
            break;
            case ParticleProps.DIR_IN:
                this.directionSpeed = {x:0, y:0, z:-this.speed};
            break;
        }        
    }

    getNewSpawnPosition(i){
        switch(this.direction){
            case ParticleProps.DIR_RIGHT:
                this.stars[i] = Tools3D.getRandomPostision( {min:this.xMinMax.min-10, max: this.xMinMax.min}, this.yMinMax, this.zMinMax, this.zMinMax,);
            break;
            case ParticleProps.DIR_LEFT:
                this.stars[i] = Tools3D.getRandomPostision( {min:this.xMinMax.max-10, max: this.xMinMax.max}, this.yMinMax, this.zMinMax, this.zMinMax );
            break;
            case ParticleProps.DIR_DOWN:
                this.stars[i] = Tools3D.getRandomPostision( this.xMinMax, {min:this.yMinMax.min-10, max: this.yMinMax.min}, this.zMinMax, this.zMinMax,);
            break;
            case ParticleProps.DIR_UP:
                this.stars[i] = Tools3D.getRandomPostision( this.xMinMax, {min:this.yMinMax.max-10, max: this.yMinMax.max}, this.zMinMax, this.zMinMax );
            break;
            case ParticleProps.DIR_OUT:
                this.stars[i] = Tools3D.getRandomPostision( this.xMinMax, this.yMinMax, {min:this.zMinMax.min-10, max: this.zMinMax.min} );
            break;
            case ParticleProps.DIR_IN:
                this.stars[i] = Tools3D.getRandomPostision( this.xMinMax, this.yMinMax, {min:this.zMinMax.max-10, max: this.zMinMax.max} );
            break;
        }
    }

    update(delta){
        for(var i=0; i<this.stars.length; i++){
            this.stars[i] = Tools3D.addVectors(this.stars[i], this.directionSpeed);
            var depth = this.zMinMax.max - this.zMinMax.min;

            if(this.type === ParticleProps.TYPE_LINE){
                // create a line in the opposite direction of the star direction
                let a = Tools3D.negativeVector(this.directionSpeed); // get the opposite direction of the star
                let b = Tools3D.normalize(a); // normalize it
                let c = Tools3D.multVector(b,this.line.size); // find the point at the end of the line 
                let lineVert2 = Tools3D.addVectors(c,this.stars[i]); // add the line to the star

                var projectPoint = Tools.projectTo2D(this.stars[i].x, this.stars[i].y, this.stars[i].z, this.canvas.width, this.canvas.height);
                var projectPoint2 = Tools.projectTo2D(lineVert2.x, lineVert2.y, lineVert2.z, this.canvas.width, this.canvas.height);

                var col = Math.round(255*((this.stars[i].z- this.zMinMax.min)/depth));
                var color = 'rgb('+(255-col)+', '+(255-col)+', '+(255-col)+')';
                //color = 'white';
                drawLine(projectPoint.x, projectPoint.y,projectPoint2.x, projectPoint2.y, color,{lineWidth:this.line.thickness});
            }

            if(this.type === ParticleProps.TYPE_POINT){
                var projectPoint = Tools.projectTo2D(this.stars[i].x, this.stars[i].y, this.stars[i].z, this.canvas.width, this.canvas.height);
                var col = Math.round(255*(this.stars[i].z/depth));            
                var color = 'rgb('+(255-col)+', '+(255-col)+', '+(255-col)+')';
                drawCircle(projectPoint.x, projectPoint.y, this.pointSize, color);
            }

            switch(this.direction){
                case ParticleProps.DIR_RIGHT:
                    if(this.stars[i].x > this.xMinMax.max)
                        this.getNewSpawnPosition(i);
                break;
                case ParticleProps.DIR_LEFT:
                    if(this.stars[i].x < this.xMinMax.min)
                        this.getNewSpawnPosition(i);
                break;
                case ParticleProps.DIR_DOWN:
                    if(this.stars[i].y > this.yMinMax.max)
                        this.getNewSpawnPosition(i);
                break;
                case ParticleProps.DIR_UP:
                    if(this.stars[i].y < this.yMinMax.min)
                        this.getNewSpawnPosition(i);
                break;
                case ParticleProps.DIR_OUT:
                    if(this.stars[i].z > this.zMinMax.max)
                        this.getNewSpawnPosition(i);
                break;
                case ParticleProps.DIR_IN:
                    if(this.stars[i].z < this.zMinMax.min)
                        this.getNewSpawnPosition(i);
                break;
            } 

        }
    }
}