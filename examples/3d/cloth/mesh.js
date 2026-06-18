class Plane{
    constructor(level, position={x:0,y:0,z:0}, scale, width, height, mass){
        this.canvas = level.canvas;
        this.scale = scale;
        this.physicsScale = 1;
        this.camera = level.camera;
        this.pos=position;
        this.width=width;
        this.height=height;
        this.mass = mass;
        this.create();
    }

    create(){
        this.faces=[];

        this.staticVerts=[];
        for(let y=0; y<this.height; y++){
            for(let x=0; x<this.width; x++){            
                this.staticVerts.push({x:(x*this.scale),y:(y*this.scale),z:0});
                if(x+1<this.width && y+1<this.height){
                    let topLeft = (y*this.width)+x;  
                    let topRight = (y*this.width)+(x+1);
                    let botRight = ((y+1)*this.width)+(x+1);
                    let botLeft = ((y+1)*this.width)+x;
                    this.faces.push([topLeft,topRight,botRight,botLeft,topLeft]);
                }
            }
        }

        this.verts = [];
        this.staticVerts.forEach(vert=>this.verts.push({...vert}));
    }

    createSoftBody(world){
        const particleShape = new CANNON.Particle();           
        this.stitches = [];
    
        for (let i = 0; i < this.verts.length; i++) {
    
            const pos = new CANNON.Vec3(
                this.verts[i].x * this.width,
                this.verts[i].y * this.height,
                this.verts[i].z
            );
    
            const stitch = new CANNON.Body({                
                mass: ((this.verts.length-1)-i < this.width) ? 0 : this.mass / this.verts.length,
                //mass: (i < this.width) ? 0 : this.mass / this.verts.length,
                linearDamping: 0.4,
                position: pos,
                shape: particleShape,
                velocity: new CANNON.Vec3(0, 0, -300)
            });
    
            this.stitches.push(stitch);
            world.addBody(stitch);
        }

        for(let y=0; y<this.height; y++){
            for(let x=0; x<this.width; x++){            
                    let topLeft = (y*this.width)+x;  
                    let topRight = (y*this.width)+(x+1);
                    let botRight = ((y+1)*this.width)+(x+1);
                    let botLeft = ((y+1)*this.width)+x;
                    this.connect(world, topLeft, topRight);
                    this.connect(world, topLeft, botLeft);
            }
        }        
    }

    connect(world, i, j) {
        if(i>=this.verts.length || j>= this.verts.length) return;
        const c = new CANNON.DistanceConstraint(this.stitches[i], this.stitches[j]);
        world.addConstraint(c);
    }         

    updatePhyscis(){
        for (let i = 0; i < this.verts.length; i++) {
            this.verts[i].x = this.stitches[i].position.x / this.width;
            this.verts[i].y = -this.stitches[i].position.y / this.height;
            this.verts[i].z = this.stitches[i].position.z;
        }
    }    

    draw(delta){
        this.updatePhyscis();

        for(let i_face=0;i_face<this.faces.length;i_face++){
            for(let index=0;index<this.faces[i_face].length-1;index++){

                if( this.verts[this.faces[i_face][index]].z*this.scale+this.pos.z+this.camera.z < 0 ||
                    this.verts[this.faces[i_face][index+1]].z*this.scale+this.pos.z+this.camera.z < 0)
                    continue;

                let projectDot1=Tools.projectTo2D(
                    this.verts[this.faces[i_face][index]].x*this.scale+this.pos.x+this.camera.x,
                    this.verts[this.faces[i_face][index]].y*this.scale+(this.pos.y-this.camera.y),
                    this.verts[this.faces[i_face][index]].z*this.scale+this.pos.z+this.camera.z,
                    this.canvas.width,this.canvas.height)

                let projectDot2=Tools.projectTo2D(
                    this.verts[this.faces[i_face][index+1]].x*this.scale+this.pos.x+this.camera.x,
                    this.verts[this.faces[i_face][index+1]].y*this.scale+(this.pos.y-this.camera.y),
                    this.verts[this.faces[i_face][index+1]].z*this.scale+this.pos.z+this.camera.z,
                    this.canvas.width,this.canvas.height)

                drawLine(
                    projectDot1.x,projectDot1.y,
                    projectDot2.x,projectDot2.y,
                    'black')
            }
        }
    }
}

class MainLevel extends LevelInterface {
    fixedTimeStep = 1.0 / 60.0;
    maxSubSteps = 3;
    
    setup(){
        this.camera={x:0,y:5,z:20}        

        this.world = new CANNON.World();
        this.world.gravity.set(0, -1000, 0);

        this.plane = new Plane(this,{x:0,y:0,z:500},3,8,16,3);
        this.plane.createSoftBody(this.world);
    }

    update(delta){
        this.world.step(this.fixedTimeStep, delta, this.maxSubSteps)
        this.plane.draw(delta);
    }
}