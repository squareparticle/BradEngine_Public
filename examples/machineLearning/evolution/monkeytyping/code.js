class Sentence extends Agent_Decision_Brain{
    setup(params){
        super.setup(params);

        this.buildDNA({
            ...params.dnaParams,
            ranges:{
                randomPerGene:[
                    'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
                    'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
                    '0','1','2','3','4','5','6','7','8','9',' ','.'
                ],
                length: this.sentence.length
            }
        }); 
    }    

    calcFitnessScore(){
        let score = 0;
        this.dna.genes.forEach((c,i)=>{
            if(c===this.sentence[i])
                score++;
        });
        this.score = score/this.dna.genes.length;
        this.probability = this.score * 100;
    }

    update(delta){
        let bounds = this.getBounds();
        drawText(bounds.x, bounds.y, this.dna.genes.join(""),15,'white');
    }
}

class MainLevel extends LevelInterface {
    generations=0;
    populationManager = new PopulationManager({
        level: this, 
        agentType: "Sentence", 
        agentParams: {
            sentence: "To be or not to be.",
            dnaParams:{
                mutateChance:0.1,
                mutateType: Genome_DNA.MUTATE_RANDOM_GENE,
                swapType: Genome_DNA.SWAP_AT_RANDOM_MIDPOINT
            }
        },
        sortBy: "score",
        sortType: PopulationManager.SORT_HIGHEST_TO_LOWEST,
        mateType: PopulationManager.MATE_PROBABILITY_WITH_PROBABILITY,
        layoutType: PopulationManager.LAYOUT_GRID,
        amount: 200, 
        numRows:25,
        numCols:4,
        spawnBounds:{x:this.canvas.width*0.2, y:this.canvas.height*0.3, width:this.canvas.width*.7, height:this.canvas.height*0.7},
        fittestParents: 0.1
    });

    startTime = (new Date()).getTime();
   
    setup(){}

    update(delta){        
        drawBox(0,0,this.canvas.width, this.canvas.height,'black');
        this.populationManager.update(delta);

        let fittest = this.populationManager.findFittestAgents(1); 
        if(fittest[0].score!=1){
            this.populationManager.repopulate();
            this.generations++;
        }
        drawText(30,40,fittest[0].dna.genes.join(""),35,'white');
        drawText(30,70,'score: '+fittest[0].score,20,'white');

        drawText(30,90,'Generations: '+this.generations,20,'white');
        drawText(30,110,'Agents: '+this.populationManager.agents.length,20,'white');
    }
}