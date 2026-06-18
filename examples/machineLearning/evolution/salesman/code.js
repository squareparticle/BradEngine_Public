class Salesman extends Agent_Decision_Brain{

    setup(params){
        super.setup(params);
        this.buildDNA({...params.dnaParams}); 
    }    

    buildDNA(params){ 
        super.buildDNA(params);
        this.dna.genes = Tools.getRandomNumberArray(0, this.cities.length);
    }

    customSplice(parent1, parent2){
        let orderA = parent1.dna.genes;
        let orderB = parent2.dna.genes;
        let start = Math.floor(Tools.getNumberBetween(0,orderA.length));
        let end = Math.floor(Tools.getNumberBetween(start + 1, orderA.length));
        let neworder = orderA.slice(start, end);

        for (let i = 0; i < orderB.length; i++) {
            let city = orderB[i];
            if (!neworder.includes(city)) 
                neworder.push(city);            
        }
        this.dna.genes = neworder;
        
        return this.dna.genes;
    }

    calcFitnessScore(){
        this.score = 0;
        if(!this.dna?.genes) return;
        for(let i=0; i < this.cities.length; i++){
            if((i+1) in this.dna.genes){
                let city = this.cities[this.dna.genes[i]];
                let city2 = this.cities[this.dna.genes[i+1]];
                let distance = Math.sqrt((city2.x-city.x)*(city2.x-city.x)+(city2.y-city.y)*(city2.y-city.y));
                this.score+= distance; 
            }
        }        
    }
    
    draw(bounds, color){
        if(!this.dna?.genes) return;
        for(let i=0; i < this.cities.length; i++){
            let city = this.cities[i];
            drawCircle(city.x,city.y,5,'white');
            if((i+1) in this.dna.genes){                
                drawLine(
                    this.cities[this.dna.genes[i]].x,
                    this.cities[this.dna.genes[i]].y,
                    this.cities[this.dna.genes[i+1]].x,
                    this.cities[this.dna.genes[i+1]].y,
                    color, {lineWidth:3}
                );
            }
        }
    }
}

const createRandomCities=(numCities)=>{
    let cities = [];
    for(let i=0; i<numCities; i++){
        cities.push({
            x: Tools.getNumberBetween(canvas.width*0.1,canvas.width*0.8),
            y: Tools.getNumberBetween(canvas.height*0.1,canvas.height*0.8)
        });
    }
    return cities;
}

class MainLevel extends LevelInterface {
    numCities = 20;
    populationManager = new PopulationManager({
        level: this, 
        agentType: "Salesman", 
        amount: 50, 
        agentParams: {
            dnaParams:{
                mutateChance: 0.1,
                mutateType: Genome_DNA.MUTATE_SWAP_GENOME,
                numMutateSwaps:1,
                swapType: Genome_DNA.SWAP_CUSTOM_FUNCTION,
            },
            cities: createRandomCities(this.numCities)
        },
        sortBy: "score",
        sortType: PopulationManager.SORT_LOWEST_TO_HIGHEST,
        mateType: PopulationManager.MATE_FITTEST_WITH_FITTEST,
        fittestPercent: 0.5
    });
    
    setup(){}

    update(delta){        
        drawBox(0,0,this.canvas.width, this.canvas.height,'black');
        for(let i=0; i<this.populationManager.agents.length; i++){
            this.populationManager.agents[i].draw({ x:0, y:0, width:this.canvas.width/2, height:this.canvas.height/2 },'#202020');
        }

        let fittest = this.populationManager.findFittestAgents(1); 
        fittest[0].draw({ x:0, y:0, width:this.canvas.width/2, height:this.canvas.height/2 },'#505050');

        let fittestAllTime = this.populationManager.allTimeFittest;
        if(fittestAllTime!=null){
            fittestAllTime.draw({ x:0, y:0, width:this.canvas.width/2, height:this.canvas.height/2 },'red');
        }

        drawText(20,500, fittestAllTime.score, 20, 'white');

        this.populationManager.repopulate();
    }
}