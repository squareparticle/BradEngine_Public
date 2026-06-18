class Shape extends Agent_Decision_Brain{
    mouseClicked(){
        this.isDead = true;
    }

    setup(params){
        super.setup({
            ...params,            
            size: {width: 50, height: 50}
        });

        this.buildDNA({
            ...params.dnaParams,
            ranges:{
                numberPerGene:[
                    [0,255], // 0: red
                    [0,255], // 1: green
                    [0,255], // 2: blue
                    [0,1],   // 3: shape
                    [25,75], // 4: size
                ]
            }
        }); 
    }    

    update(delta){
        if(this.isDead || this.dna.genes.length===0) return;

        this.timeLived = (new Date()).getTime() - this.level.populationManager.startTime;
        
        this.size.width = this.dna.genes[4];
        this.size.height = this.dna.genes[4];
        let bounds = this.getBounds();
        
        if(this.dna.genes[3]===0)
            drawBox(bounds.x, bounds.y, bounds.width, bounds.height, `rgb(${this.dna.genes[0]},${this.dna.genes[1]},${this.dna.genes[2]})`)
        if(this.dna.genes[3]===1)
            drawCircle(bounds.x+(bounds.width/2), bounds.y+(bounds.height/2), bounds.width/2, `rgb(${this.dna.genes[0]},${this.dna.genes[1]},${this.dna.genes[2]})`)
    }
}

class MainLevel extends LevelInterface {
    populationManager = new PopulationManager({
        level: this, 
        agentType: "Shape", 
        amount: 10, 
        agentParams: {
            dnaParams:{
                mutateChance: 0.1,
                mutateType: Genome_DNA.MUTATE_ENTIRE_GENOME,
                swapType: Genome_DNA.SWAP_AT_RANDOM_MIDPOINT
            }
        },
        sortBy: "timeLived",
        sortType: PopulationManager.SORT_LOWEST_TO_HIGHEST,
        mateType: PopulationManager.MATE_FITTEST_WITH_FITTEST,
        layoutType: PopulationManager.LAYOUT_DYNAMIC_GRID,
        spawnBounds:{x:0, y:0, width:this.canvas.width, height:this.canvas.height},
        fittestPercent: 0.5
    });

    startTime = (new Date()).getTime();

    getMouseInput(event){ this.populationManager.getMouseInput(event); }
    
    setup(){}

    update(delta){        
        drawBox(0,0,this.canvas.width, this.canvas.height,'black');
        this.populationManager.update(delta);

        let timer = Math.floor(((new Date()).getTime() - this.startTime)/1000);
        drawText(50,50,timer,40,'white');

        if(timer === 15){            
            this.populationManager.repopulate();
            this.startTime = (new Date()).getTime();
        }
    }
}