let currentGene = 0;

const screenWidth = 1024;
const screenHeight = 768;
const boardWidth = 500;
const boardHeight = 768;
const boardThickness = 10;
let centerX = (screenWidth-boardWidth)/2;

// const obstacles = [ 
//     { x: centerX, y:0, width: boardThickness, height:boardHeight },
//     { x: centerX + boardWidth-boardThickness, y:0, width:boardThickness, height:boardHeight},
//     { x: centerX, y:0, width:boardWidth, height:boardThickness },
//     { x: centerX, y:boardHeight-boardThickness, width:boardWidth, height:boardThickness },
//     { x: centerX + (boardWidth/2)-200,  y: (boardHeight/2)-5, width: 400, height: boardThickness } 
// ];
const obstacles = [ 
    { x: centerX, y:0, width: boardThickness, height:boardHeight },
    { x: centerX + boardWidth-boardThickness, y:0, width:boardThickness, height:boardHeight},
    { x: centerX, y:0, width:boardWidth, height:boardThickness },
    { x: centerX, y:boardHeight-boardThickness, width:boardWidth, height:boardThickness },
    { x: centerX + 100,  y: 400, width: 400, height: boardThickness },
    { x: centerX + 0,  y: 600, width: 400, height: boardThickness },
    { x: centerX + 0,  y: 200, width: 400, height: boardThickness } 
];


class Rocket extends Agent_Decision_Brain{
    pos = {x:canvas.width/2, y:canvas.height*0.9};
    vel = {x:0, y:0, z:0};
    acc = {x:0, y:0, z:0};
    score=0;
    completed = false;
    crashed = false;
    
    setup(params){
        super.setup(params);
        this.buildDNA({...params.dnaParams}); 
    }   

    buildDNA(params){ 
        super.buildDNA(params);

        this.dna.genes = [];
        for(let i=0;i<this.lifeSpan; i++)
            this.dna.genes[i]=Tools3D.setMag(Tools3D.getRandomVectorXY(), this.maxforce);
    }

    customMutate(){
        if(Math.random()>this.dna.mutateChance) return this.dna.genes;

        for(let i=0; i<this.lifeSpan; i++) 
            if((Math.random()<=this.dna.mutateChance))
                this.dna.genes[i]=Tools3D.setMag(Tools3D.getRandomVectorXY(), this.maxforce);

        return this.dna.genes;
    }

    calcFitnessScore(){
        // this.score = Tools.distanceBetweenPoints(this.map.target.pos, this.pos);
        // if(this.completed) this.score = 0;
        // if(this.crashed) this.score *= 10;
    }
    
    applyForce(force) { 
        this.acc = Tools3D.addVectors(this.acc, force);
    }

    calculate(delta){
        let currentDistance = Tools.distanceBetweenPoints(this.map.target.pos, this.pos);
        if(this.crashed) this.score += (currentDistance*2);

        if(Tools.distanceBetweenPoints(this.map.target.pos, this.pos) < 20) {
            this.completed = true;            
        }

        // collision detection
        this.map.obstacles.forEach(obs=>{
            if(Collision.testPointOnBox(this.pos, obs))
                this.crashed = true;
        });

        this.applyForce(this.dna.genes[currentGene]);
        if (!this.completed && !this.crashed) {
            this.score += currentDistance;
            this.vel = Tools3D.addVectors(this.vel, this.acc);
            this.pos = Tools3D.addVectors(this.pos, this.vel);
            this.acc = Tools3D.multVector(this.acc, 0);
            this.vel = Tools3D.limit(this.vel, 4);
        }        

    }

    update(delta){
        this.calculate(delta);
        let angle = Math.atan2(this.vel.y, this.vel.x);
        drawRotatedBoxR(this.pos.x,this.pos.y,50,10,angle,'white');
    }
}

class Target{
    pos={x:500,y:50}
    update(delta){
        drawCircle(this.pos.x, this.pos.y, 10, 'white');
    }
}

class MainLevel extends LevelInterface {
    lifeSpan=1000;
    target = new Target();

    populationManager = new PopulationManager({
        level: this, 
        agentType: "Rocket", 
        agentParams: {
            lifeSpan: this.lifeSpan,            
            dnaParams:{
                mutateChance: 0.1,
                mutateType: Genome_DNA.MUTATE_CUSTOM_FUNCTION,
                swapType: Genome_DNA.SWAP_AT_RANDOM_MIDPOINT
            },
            maxforce:0.2,
            map:{
                target: new Target(),
                obstacles
            }
        },
        sortBy: "score",
        sortType: PopulationManager.SORT_LOWEST_TO_HIGHEST,
        mateType: PopulationManager.MATE_FITTEST_WITH_FITTEST,
        amount: 500, 
        //spawnBounds:{x:this.canvas.width/2, y:this.canvas.height*0.9, width:1, height:1},
        fittestParents: 0.1
    });
 
    setup(){
        let numTries = 20;
        for(let i=0; i<numTries; i++){
            console.log(i);
            while(!this.runSimulationStep(0, false));
        }
    }

    runSimulationStep(delta, showOnScreen){
        if(showOnScreen) this.populationManager.update(delta);
        if(!showOnScreen) this.populationManager.calculate(delta);

        let isFinished = false;
        // let isFinished = true;
        // this.populationManager.agents.forEach(a=>{
        //     if(!a.completed && !a.crashed) 
        //         isFinished = false; 
        // }) 
        currentGene++;
        if(currentGene == this.lifeSpan || isFinished){
            currentGene = 0;
            this.populationManager.repopulate();
            return true;
        }
        return false;
    }

    update(delta){        
        drawBox(0,0,this.canvas.width, this.canvas.height,'black');

        this.target.update(delta);
        for(let i=0; i<obstacles.length; i++)
            drawBox(obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height, 'white');

        this.runSimulationStep(delta,true);

    }
}