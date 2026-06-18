/******************************** Genetic Algorithm ****************************** */
class Genome_DNA {
    static SWAP_RANDOM_GENES=0;
    static SWAP_MIDPOINT=1;
    static SWAP_AT_RANDOM_MIDPOINT=2;
    static SWAP_CUSTOM_FUNCTION=3;

    static MUTATE_RANDOM_GENE=0;
    static MUTATE_ENTIRE_GENOME=1;
    static MUTATE_SWAP_GENOME=2;
    static MUTATE_CUSTOM_FUNCTION=3;
    
    genes = [];
    ranges = {
        // numberPerGene
        // decimalPerGene 
        // randomObjectPerGene
    };
    
    mutateChance = 0.1;
    mutateType = Genome_DNA.MUTATE_RANDOM_GENE;
    swapType = Genome_DNA.SWAP_AT_RANDOM_MIDPOINT;

    constructor(params){
        this.override(params);
        Genome_DNA.createGenome(this);
    }

    override(params){  for (const [key, value] of Object.entries(params)) this[key] = value; }

    static createGenome(dna){
        if(dna.ranges.numberPerGene)
            dna.genes = dna.ranges.numberPerGene.map((e,i)=>Tools.getNumberBetween(dna.ranges.numberPerGene[i][Tools.MIN],dna.ranges.numberPerGene[i][Tools.MAX]));
        if(dna.ranges.decimalPerGene)
            dna.genes = dna.ranges.decimalPerGene.map((e,i)=>Tools.getDecimalBetween(dna.ranges.decimalPerGene[i][Tools.MIN],dna.ranges.decimalPerGene[i][Tools.MAX]));
        if(dna.ranges.randomPerGene){
            dna.genes = [];
            for(let i=0; i<dna.ranges.length; i++) 
                dna.genes.push(Tools.getRandomObject(dna.ranges.randomPerGene));
        }
    }

    static splice(childAgent, parent1, parent2){
        let dna = childAgent.dna;
        switch(dna.swapType){
            case Genome_DNA.SWAP_MIDPOINT: {
                const midPoint = Math.floor(dna.genes.length/2);
                dna.genes = parent1.dna.genes.map((e,i)=>(i>=midPoint)?parent1.dna.genes[i]:parent2.dna.genes[i]);
            }
            case Genome_DNA.SWAP_AT_RANDOM_MIDPOINT: {
                const midPoint = Tools.getNumberBetween(0,parent1.dna.genes.length-1);
                dna.genes = parent1.dna.genes.map((e,i)=>(i>=midPoint)?parent1.dna.genes[i]:parent2.dna.genes[i]);
            }
            break;
            case Genome_DNA.SWAP_RANDOM_GENES: 
                dna.genes = parent1.dna.genes.map((e,i)=>Math.random()>=0.5?parent1.dna.genes[i]:parent2.dna.genes[i]);
            break;
            case Genome_DNA.SWAP_CUSTOM_FUNCTION: 
                dna.genes = childAgent.customSplice(parent1, parent2);
            break;
        }
    }

    static mutate(childAgent){
        let dna = childAgent.dna;
        if(Math.random()>dna.mutateChance) return;

        switch(dna.mutateType){
            case Genome_DNA.MUTATE_RANDOM_GENE: 
                if(dna.ranges.numberPerGene)
                    dna.genes = dna.genes.map((e,i)=>(Math.random()<=dna.mutateChance)?Tools.getNumberBetween(dna.ranges.numberPerGene[i][Tools.MIN],dna.ranges.numberPerGene[i][Tools.MAX]):e);
                if(dna.ranges.decimalPerGene)
                    dna.genes = dna.genes.map((e,i)=>(Math.random()<=dna.mutateChance)?Tools.getDecimalBetween(dna.ranges.decimalPerGene[i][Tools.MIN],dna.ranges.decimalPerGene[i][Tools.MAX]):e);
                if(dna.ranges.randomPerGene){
                    for(let i=0; i<dna.ranges.length; i++) 
                        if((Math.random()<=dna.mutateChance))
                            dna.genes[i] = Tools.getRandomObject(dna.ranges.randomPerGene);
                }
            break;

            case Genome_DNA.MUTATE_ENTIRE_GENOME: 
                Genome_DNA.createGenome(dna);
            break;

            case Genome_DNA.MUTATE_SWAP_GENOME: 
                Tools.randomSwap(dna.genes, this.numMutateSwaps);
            break;

            case Genome_DNA.MUTATE_CUSTOM_FUNCTION: 
                dna.genes = childAgent.customMutate();
            break;
        }
    }
}

class Agent_Decision_Brain{
    isDead = false;
    dna = null;   
    timeLived = 0;
    position = {x:0, y:0};
    size = {width:10, height:10}
    score = 0;
    
    getMouseInput(pos){
        if(this.isDead) return false;
        if (Collision.testPointOnBox(pos,this.getBounds())){
            this.mouseClicked();
            return true;
        }
        return false;
    }

    setup(params){ this.override(params); }

    getBounds(){ return {x:this.position.x, y:this.position.y, width: this.size.width, height: this.size.height}}
    
    centerImage(x, y, width, height){
        this.position.x = x + (width/2)-(this.size.width/2);
        this.position.y = y + (height/2)-(this.size.height/2);
    }

    override(params){ 
        for (const [key, value] of Object.entries(params)) 
            this[key] = value; 
    }
    
    buildDNA(params){ 
        this.dna = new Genome_DNA(params); 
    }

    update(delta){}

    calcFitnessScore(){}

    mouseClicked(){}
}

class PopulationManager{
    static MATE_FITTEST_WITH_FITTEST=0;
    static MATE_FITTEST_WITH_FITTEST_ORDEREDLY=1;
    static MATE_FITTEST_WITH_ANY=2;
    static MATE_FITTEST_WITH_ANY_ORDEREDLY=3;
    static MATE_PROBABILITY_WITH_PROBABILITY=4;
    static MATE_PROBABILITY_WITH_ANY = 5;

    static LAYOUT_RANDOM=0;
    static LAYOUT_GRID=1;
    static LAYOUT_DYNAMIC_GRID=2;

    static SORT_LOWEST_TO_HIGHEST=0;
    static SORT_HIGHEST_TO_LOWEST=1;

    static sortType = PopulationManager.SORT_HIGHEST_TO_LOWEST;

    layoutType = PopulationManager.LAYOUT_RANDOM;
    spawnBounds={x:0,y:0,width:0,height:0}

    mateType=PopulationManager.MATE_FITTEST_WITH_FITTEST;

    fittestParents = 0.5;

    agents = [];
    startTime = -1;    

    allTimeFittest = null;

    getMouseInput(event){
        if(event.type === "down")
            for(let i=0; i<this.agents.length; i++)
                if(this.agents[i].getMouseInput(event.position)) break;        
    }

    constructor(params){
        this.override(params);
        this.createAgents();
        this.setStartTime();
    }

    calcRandomLayout(agent, index){ agent.position = Tools.getRandomPointInBox(this.spawnBounds.x,this.spawnBounds.y,this.spawnBounds.width, this.spawnBounds.height); }

    calcDynamicGridLayout(agent, index){
        let numRows = Math.floor(Math.sqrt(this.amount));
        let numCols = Math.ceil(this.amount/numRows);
        let cellWidth=this.spawnBounds.width/numCols;
        let cellHeight=this.spawnBounds.height/numRows;
        let row = Math.floor(index/numCols);
        let col = index % numCols;

        agent.centerImage(this.spawnBounds.x+(col*cellWidth), this.spawnBounds.y+(row*cellHeight), cellWidth, cellHeight);
    }

    calcGridLayout(agent, index){     
        if(!this.numCols) console.log('PopulationManager Missing numCols');
        if(!this.numRows) console.log('PopulationManager Missing numRows');

        let cellWidth=this.spawnBounds.width/this.numCols;
        let cellHeight=this.spawnBounds.height/this.numRows;
        let row = Math.floor(index/this.numCols);
        let col = index % this.numCols;

        agent.centerImage(this.spawnBounds.x+(col*cellWidth), this.spawnBounds.y+(row*cellHeight), cellWidth, cellHeight);
    }

    createAgent(index){
        let agent = eval(`new ${this.agentType}()`);
        if(!this.agentParams) 
            this.agentParams = {};
        agent.level = this.level;
        agent.setup(this.agentParams);

        switch(this.layoutType){
            case PopulationManager.LAYOUT_RANDOM:
                this.calcRandomLayout(agent, index);
            break;
            case PopulationManager.LAYOUT_DYNAMIC_GRID:
                this.calcDynamicGridLayout(agent, index);
            break;
            case PopulationManager.LAYOUT_GRID:
                this.calcGridLayout(agent, index);
            break;
        }
        
        return agent;
    }

    createAgents(){
        this.agents = [];
        for(let i=0; i<this.amount; i++){
            this.agents.push(this.createAgent(i));
        }
    }
    
    override(params){ for (const [key, value] of Object.entries(params)) this[key] = value; }

    setStartTime(){ this.startTime = (new Date()).getTime()}

    update(delta){for(let i=this.agents.length-1; i>=0; i--){ this.agents[i].update(delta) }}
    calculate(delta){for(let i=this.agents.length-1; i>=0; i--){ this.agents[i].calculate(delta) }}

    // findFittestAgents(numAgents){
    //     this.agents.forEach(a=>a.calcFitnessScore());
    //     this.agents = this.sort();
    //     return [...this.agents].splice(0,numAgents);
    // }

    findFittestAgents(numAgents){
        this.agents.forEach(a=>a.calcFitnessScore());
        this.agents = this.sort(this.agents);

        if(this.allTimeFittest === null)
            this.allTimeFittest = this.agents[0];

        let topAgents = [this.allTimeFittest,this.agents[0]];
        topAgents = this.sort(topAgents);
        this.allTimeFittest = topAgents[0];

        return [...this.agents].splice(0,numAgents);
    }    

    repopulate(){

        switch(this.mateType){
            case PopulationManager.MATE_FITTEST_WITH_FITTEST:{
                let numParnets = Math.round(this.agents.length*this.fittestParents);
                let parents = this.findFittestAgents(numParnets);
                let children = [];
                for(let i=0; i<this.amount; i++){
                    let child = this.createAgent(i);                    
                    let parent1 = Tools.getRandomObject(parents);
                    let parent2 = Tools.getRandomObject(parents);
                    Genome_DNA.splice(child,parent1,parent2);
                    Genome_DNA.mutate(child);
                    children.push(child);
                }
                this.agents = children;
            }
            break;
            case PopulationManager.MATE_FITTEST_WITH_ANY:{
                let numParnets = Math.round(this.agents.length*this.fittestParents);
                let parents = this.findFittestAgents(numParnets);
                let children = [];
                for(let i=0; i<this.amount; i++){
                    let child = this.createAgent(i);
                    let parent1 = Tools.getRandomObject(parents);
                    let parent2 = Tools.getRandomObject(this.agents);
                    Genome_DNA.splice(child,parent1,parent2);
                    Genome_DNA.mutate(child);
                    children.push(child);
                }
                this.agents = children;
            }
            break;    
            case PopulationManager.MATE_PROBABILITY_WITH_PROBABILITY:{
                let numParnets = Math.round(this.agents.length*this.fittestParents);
                let parents = this.findFittestAgents(numParnets);
                let children = [];
                for(let i=0; i<this.amount; i++){
                    let child = this.createAgent(i);
                    let parent1 = Tools.getRandomObjectByProbability(parents);
                    let parent2 = Tools.getRandomObjectByProbability(parents);
                    Genome_DNA.splice(child,parent1,parent2);
                    Genome_DNA.mutate(child);
                    children.push(child);
                }
                this.agents = children;
            }
            break;            
            case PopulationManager.MATE_PROBABILITY_WITH_ANY:{
                let numParnets = Math.round(this.agents.length*this.fittestParents);
                let parents = this.findFittestAgents(numParnets);
                let children = [];
                for(let i=0; i<this.amount; i++){
                    let child = this.createAgent(i);
                    let parent1 = Tools.getRandomObjectByProbability(parents);
                    let parent2 = Tools.getRandomObjectByProbability(this.agents);
                    Genome_DNA.splice(child,parent1,parent2);
                    Genome_DNA.mutate(child);
                    children.push(child);
                }
                this.agents = children;
            }
            break;                        
        }

        this.setStartTime();
    }

    // sort(){
    //     if(this.sortBy && this.sortType === PopulationManager.SORT_HIGHEST_TO_LOWEST)
    //         return this.agents.sort((b,a) => (a[this.sortBy] > b[this.sortBy]) ? 1 : ((b[this.sortBy] > a[this.sortBy]) ? -1 : 0))
    //     if(this.sortBy && this.sortType === PopulationManager.SORT_LOWEST_TO_HIGHEST)
    //         return this.agents.sort((a,b) => (a[this.sortBy] > b[this.sortBy]) ? 1 : ((b[this.sortBy] > a[this.sortBy]) ? -1 : 0))
    //     return this.agents;
    // }

    sort(agents){
        if(this.sortBy && this.sortType === PopulationManager.SORT_HIGHEST_TO_LOWEST)
            return agents.sort((b,a) => (a[this.sortBy] > b[this.sortBy]) ? 1 : ((b[this.sortBy] > a[this.sortBy]) ? -1 : 0))
        if(this.sortBy && this.sortType === PopulationManager.SORT_LOWEST_TO_HIGHEST)
            return agents.sort((a,b) => (a[this.sortBy] > b[this.sortBy]) ? 1 : ((b[this.sortBy] > a[this.sortBy]) ? -1 : 0))
        return agents;
    }

}

/******************************** Neuro Network Algorithm ****************************** */
const lineFunction=(slope, base, x) => slope * x + base // y = mx+b
const lineFunctionCurry=(slope, base) => x => slope * x + base // y = mx+b
const random = (min, max) => Math.random() * (max - min) + min;
const map =(val, inMin,inMax, outMin, outMax)=>{
    let inVal = (val-inMin)/(inMax-inMin);
    return inVal * (outMax-outMin)+outMin;
}

class Perceptron {
    static GRAPHTYPE_ERROR=0;
    static GRAPHTYPE_INPUT_GT_ZERO=1;
    static GRAPHTYPE_ANSWER=2;

    static ACTIVATE_SIGN=0;
    static ACTIVATE_BINARY=1;

    activeType = Perceptron.ACTIVATE_SIGN;

    learningRate = 0.001;
    weights = [];
    trainingData;
    graphSchema={
        //drawType: Perceptron.GRAPHTYPE_ERROR,
        //drawType: Perceptron.GRAPHTYPE_INPUT_GT_ZERO,
        drawType: Perceptron.GRAPHTYPE_ANSWER,
        xmin: -1, ymin: -1, xmax: 1, ymax: 1,
        // lineFunction: lineFunction3(0.3,0.4)
    }

    constructor(params){ // numInputs, learningRate, trainingData
        this.override(params);
        
        // initialize the wieghts
        for (let i = 0; i < this.numInputs; i++) this.weights[i] = random(-1, 1);    
    }

    override(params){  for (const [key, value] of Object.entries(params)) this[key] = value; }

    train(epochs=1){
        for (let i_epoch = 0; i_epoch < epochs; i_epoch++) 
            this.trainingData.forEach(set=>this.trainSet(set));        
    }
    
    trainSet(set) {
        set.output = this.calcOutput(set.inputs);
        set.error = set.answer - set.output;
        
        // Adjust weights based on weightChange * input
        for (let i = 0; i < this.weights.length; i++) {
            this.weights[i] += this.learningRate * set.error * set.inputs[i];
        }
    }    

    calcOutput(inputs) {
        // Sum all values
        let sum = 0;
        for (let i = 0; i < this.weights.length; i++)
            sum += inputs[i] * this.weights[i];

        switch(this.activeType){
            case Perceptron.ACTIVATE_BINARY: // Result is sign of the sum, 0 or 1
                return clamp(this.activate(sum),0,1);
            case Perceptron.ACTIVATE_SIGN: // Result is sign of the sum, -1 or 1
                return this.activate(sum);
        }
        return 0;
    }

    activate(sum) {return sign(sum)} 
      
    showTable(){
        for(let i = 0; i < this.trainingData.length; i++)
            console.log(this.trainingData[i].name, this.trainingData[i].answer, this.calcOutput(this.trainingData[i]))        
    }

    drawGraph(){
        // let bounds ={x: canvas.width * 0.1, y: canvas.height * 0.1,
        //              w: canvas.width * 0.8, h: canvas.height * 0.8}
        let bounds ={x: 0, y:0,
            w: canvas.width, h: canvas.height}
   
        let width = canvas.width;
        let height = canvas.height;

        for(let i = 0; i < this.trainingData.length; i++){ 
            let x = map(this.trainingData[i].inputs[0], this.graphSchema.xmin,this.graphSchema.xmax,0,1);
            let y = map(-this.trainingData[i].inputs[1],this.graphSchema.ymin,this.graphSchema.ymax,0,1);

            let isGreen = false;
            switch(this.graphSchema.drawType){
                case Perceptron.GRAPHTYPE_ERROR:
                    isGreen = (this.trainingData[i].error === 0)
                break;
                case Perceptron.GRAPHTYPE_INPUT_GT_ZERO:
                    isGreen = (this.calcOutput(this.trainingData[i].inputs)>0)
                break;
                case Perceptron.GRAPHTYPE_ANSWER:
                    isGreen = (this.trainingData[i].answer>0)
                break;                
            }
            
            if(isGreen)
                drawCircle((x * bounds.w) + bounds.x, (y * bounds.h) + bounds.y, 5, 'green');
            else
                drawCircle((x * bounds.w) + bounds.x, (y * bounds.h) + bounds.y, 5, 'red');

            if(!this.trainingData[i].output && this.trainingData[i].output!==0)            
                drawCircle((x * bounds.w) + bounds.x, (y * bounds.h) + bounds.y, 5, '#111111');     
        }

        let xmin = this.graphSchema.xmin, ymin = this.graphSchema.ymin, 
            xmax = this.graphSchema.xmax, ymax = this.graphSchema.ymax;
        
        // Draw the answer line
        if(this.graphSchema?.lineFunction){        
            let x1 = map(xmin, xmin, xmax, 0, width);
            let y1 = map(this.graphSchema.lineFunction(xmin), ymin, ymax, height, 0);
            let x2 = map(xmax, xmin, xmax, 0, width);
            let y2 = map(this.graphSchema.lineFunction(xmax), ymin, ymax, height, 0);
            drawLine(x1, y1, x2, y2, 'blue',{lineWidth:10});
        }

        // Draw the line based on the current weights
        // Formula is weights[0]*x + weights[1]*y + weights[2] = 0
        let weights = this.weights;
        let x1 = xmin;
        let y1 = (-weights[2] - weights[0] * x1) / weights[1];
        let x2 = xmax;
        let y2 = (-weights[2] - weights[0] * x2) / weights[1];

        x1 = map(x1, xmin, xmax, 0, width);
        y1 = map(y1, ymin, ymax, height, 0);
        x2 = map(x2, xmin, xmax, 0, width);
        y2 = map(y2, ymin, ymax, height, 0);
        drawLine(x1, y1, x2, y2, 'green',{lineWidth:10});
    }      
}

class PerceptronUdemy{
    trainingSets = [];
	weights = [];
	bias = 0;
	totalError = 0;

    constructor(trainingSets){
        if(trainingSets){
            this.trainingSets = trainingSets;
            this.initialiseWeights(this.trainingSets[0]);
        }
    }

    initialiseWeights(assignWeights){
        // weights need to be the same size as the input fields
        this.weights = new Array(assignWeights.inputs.length).fill(0)
                     .map(w=>Tools.getDecimalBetween(-1,1)); // make all the weights random
        this.bias = Tools.getDecimalBetween(-1,1);
    }

    setTrainingSets(trainingSets){
        this.trainingSets = trainingSets;
    }

    addTrainingSet(trainingSet){
        this.trainingSets.push(trainingSet);
    }

    clearTrainingSet(){
		this.initialiseWeights();
        this.trainingSets = [];
    }

    saveWeights(){
        localStorage.setItem("weights", JSON.stringify({weights:this.weights,bias:this.bias}));
    }

    loadWeights(){
        let model = JSON.parse(localStorage.getItem("weights"));
        this.weights = model.weights;
        this.bias = model.bias;
    }

    // epoch number is the numnber of times to train
	train(epochs=1)
	{
        if(this.trainingSets.length===0){
            console.log('Nothing to train...');
            return;
        }
		
		for(let e = 0; e < epochs; e++){ // loop training
			this.totalError = 0;
			for(let t = 0; t < this.trainingSets.length; t++){ // loop each training set
				this.updateWeights(this.trainingSets[t]);
				//console.log("W1: " + (this.weights[0]) + " W2: " + (this.weights[1]) + " B: " + this.bias);
			}
		    //console.log("TOTAL ERROR: " + this.totalError);
		}
    }
    
    updateWeights(trainingSet){
		let error = trainingSet.output - this.calcOutput(trainingSet);
		this.totalError += Math.abs(error);

        // update weights based on Error
		for(let i_weight = 0; i_weight < this.weights.length; i_weight++)
			this.weights[i_weight] = this.weights[i_weight] + error*trainingSet.inputs[i_weight]; 
		this.bias += error;
	}
    
	calcOutput(inputSet){
		let dp = this.fire(this.weights,inputSet.inputs);
		if(dp > 0) return 1;
		return 0;
	}    

	calcTrainingOutput(inputSet){
        this.trainingSets = [inputSet];
        this.train();
        this.trainingSets = [];
        return this.calcOutput(inputSet);
	}    

    fire(weights, inputs) { // uses a dot product calculation
		if (weights == null || inputs == null) return -1;
		if (weights.length != inputs.length) return -1;
	 
		let output = 0;
		for (let x = 0; x < weights.length; x++)
			output += weights[x] * inputs[x];

		output += this.bias;
	 
		return output;
	}

    showTable(){
        for(let i = 0; i < this.trainingSets.length; i++){ 
            console.log(this.trainingSets[i].name, this.trainingSets[i].output, this.calcOutput(this.trainingSets[i]))
        }
    }

    drawGraph(){
        for(let i = 0; i < this.trainingSets.length; i++){ 
            if(this.trainingSets[i].output===0)
                drawCircle(this.trainingSets[i].inputs[0]*canvas.width,
                           this.trainingSets[i].inputs[1]*canvas.height,
                           15, 'red');
            else
                drawCircle(this.trainingSets[i].inputs[0]*canvas.width,
                           this.trainingSets[i].inputs[1]*canvas.height,
                           15, 'blue');
        }
        let slope = (-(this.bias/this.weights[1])/(this.bias/this.weights[0]));
        let intercept= (-this.bias/this.weights[1]);
        drawRay(slope, intercept, 1, {x:0, y:0});  
        return {slope, intercept};
    }
}


// UDEMY 

class Neuron {
	numInputs;
	bias;
	output;
	errorGradient;
	weights = [];
	inputs = [];

	constructor(nInputs){
		this.bias = Tools.getDecimalBetween(-1,1);
		this.numInputs = nInputs;
		for(let i = 0; i < nInputs; i++)
            this.weights.push(Tools.getDecimalBetween(-1,1));
	}
}

/*
Rule of Thumb
	Each layer creates a line on the graph (2 layers are required to solve XOR)
	Most problems are solved with only a couple of hidden layers
*/
class Layer {
	numNeurons;
	neurons = [];

	constructor(nNeurons, numNeuronInputs){
		this.numNeurons = nNeurons;
		for(let i = 0; i < nNeurons; i++)
			this.neurons.push(new Neuron(numNeuronInputs));
	}
}

class ANN{
	numInputs;
	numOutputs;
	numHidden;
	numNPerHidden;
	learningRate;
	layers = [];
    hiddenActivationFunction=this.sigmoid;
    outputActivationFunction=this.sigmoid;

	constructor(nI, nO, nH, nPH, alpha){
		this.numInputs = nI;
		this.numOutputs = nO;
		this.numHidden = nH;
		this.numNPerHidden = nPH;
		this.learningRate = alpha;

		if(this.numHidden > 0){
			this.layers.push(new Layer(this.numNPerHidden, this.numInputs));

			for(let i = 0; i < this.numHidden-1; i++)
				this.layers.push(new Layer(this.numNPerHidden, this.numNPerHidden));

			this.layers.push(new Layer(this.numOutputs, this.numNPerHidden));
		}
		else
			this.layers.push(new Layer(this.numOutputs, this.numInputs));
	}

    train(inputValues, desiredOutput){
        let outputs = this.feedForward(inputValues, desiredOutput);
        this.backPropagateError(outputs, desiredOutput);
        return outputs;
    }

    getResult(inputValues) { return this.feedForward(inputValues);}

	feedForward(inputValues){
		let inputs = [];
		let outputs = [];

		if(inputValues.length != this.numInputs){
			console.log("ERROR: Number of Inputs must be " + this.numInputs);
			return outputs;
		}

		inputs = [...inputValues];
		for(let i = 0; i < this.numHidden + 1; i++){
            if(i > 0) inputs = [...outputs];
            outputs=[];

            for(let j = 0; j < this.layers[i].numNeurons; j++){
                let N = 0;
                this.layers[i].neurons[j].inputs=[];

                for(let k = 0; k < this.layers[i].neurons[j].numInputs; k++){
                    this.layers[i].neurons[j].inputs.push(inputs[k]);
                    N += this.layers[i].neurons[j].weights[k] * inputs[k];
                }

                N -= this.layers[i].neurons[j].bias;
                this.layers[i].neurons[j].output = this.activationFunction(N,(i===this.numHidden)?'output':'hidden');
                outputs.push(this.layers[i].neurons[j].output);
            }
		}

		return outputs;
	}
	
	backPropagateError(outputs, desiredOutput){
		let error;
		for(let i = this.numHidden; i >= 0; i--){
			for(let j = 0; j < this.layers[i].numNeurons; j++){
				if(i == this.numHidden){
					error = desiredOutput[j] - outputs[j];
					this.layers[i].neurons[j].errorGradient = outputs[j] * (1-outputs[j]) * error;
					//errorGradient calculated with Delta Rule: en.wikipedia.org/wiki/Delta_rule
				}
				else{
					this.layers[i].neurons[j].errorGradient = this.layers[i].neurons[j].output * (1-this.layers[i].neurons[j].output);
					let errorGradSum = 0;
					for(let p = 0; p < this.layers[i+1].numNeurons; p++)
						errorGradSum += this.layers[i+1].neurons[p].errorGradient * this.layers[i+1].neurons[p].weights[j];
					this.layers[i].neurons[j].errorGradient *= errorGradSum;
				}	
				for(let k = 0; k < this.layers[i].neurons[j].numInputs; k++){
					if(i == this.numHidden){
						error = desiredOutput[j] - outputs[j];
						this.layers[i].neurons[j].weights[k] += this.learningRate * this.layers[i].neurons[j].inputs[k] * error;
					}
					else
						this.layers[i].neurons[j].weights[k] += this.learningRate * this.layers[i].neurons[j].inputs[k] * this.layers[i].neurons[j].errorGradient;
				}
				this.layers[i].neurons[j].bias += this.learningRate * -1 * this.layers[i].neurons[j].errorGradient;
			}
		}
	}

    /*
	
	en.wikipedia.org/wiki/Activation_function
    https://himanshuxd.medium.com/activation-functions-sigmoid-relu-leaky-relu-and-softmax-basics-for-neural-networks-and-deep-8d9c70eed91e
    https://github.com/howion/activation-functions/blob/master/lib/index.js

    Rule of thumb 
        Hidden Layers (ReLU or Leaky ReLU)
        Output Layer (Sigmoid or TanH)    
    */
	activationFunction(value, type){ 
        if(type === 'hidden')
            //return this.sigmoid(value);
            //return this.tanH(value);
            //return this.reLU(value);
            return this.hiddenActivationFunction(value);
        if(type === 'output')
            //return this.sigmoid(value);
            //return this.tanH(value);
            return this.outputActivationFunction(value);
    }

	sigmoid(value){
    	let k = Math.exp(value);
    	return k / (1.0 + k);
	}
    /*
    Rule of thumb 
        Hidden Layers (ReLU or Leaky ReLU)
        Output Layer (Sigmoid or TanH)
    */
	step(value) { if(value < 0) return 0; else return 1;}
	sinusoid(value) { return Math.sin(value);}
	arcTan(value){ return Math.atan(value);}
	softSign(value){return value/(1+Math.abs(value));}    

    //tanh(x) {return Math.tanh(x);}
    hardTanh(x) { return Math.max(-1, Math.min(1, x));}

	tanH(value){
		let k = Math.exp(-2*value);
    	return 2 / (1.0 + k) - 1;
	}    

    reLU(x) {return Math.max(0, x);};
}


