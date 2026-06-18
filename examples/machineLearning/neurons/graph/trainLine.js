class MainLevel extends LevelInterface {
    neuron = null;
    trainingData = [];
    count = 0;

    createRandomPoint(){
        let xmin = -1, ymin = -1, xmax = 1, ymax = 1;
        let x = random(xmin, xmax);
        let y = random(ymin, ymax);
        let answer = (y < lineFunction(0.3,0.4,x)) ? -1 : 1;
        return { inputs: [x, y, 1], answer };
    }

    setup(){
    
        // Create a random set of training points and calculate the "known" answer
        for (let i = 0; i < 2000; i++) {
            this.trainingData[i] = this.createRandomPoint();
        }

        this.neuron = new Perceptron({
            numInputs:3, learningRate:0.001, trainingData: this.trainingData,
            graphSchema:{
                //drawType: Perceptron.GRAPHTYPE_ERROR,
                drawType: Perceptron.GRAPHTYPE_INPUT_GT_ZERO,
                //drawType: Perceptron.GRAPHTYPE_ANSWER,
                xmin: -1, ymin: -1, xmax: 1, ymax: 1,
                lineFunction: lineFunctionCurry(0.3,0.4)
            }
        }); 
    }

    update(delta){  
        drawBox(0,0,this.canvas.width, this.canvas.height,'black');

        // this.neuron.train();
        // this.neuron.drawGraph();

        //this.trainingData.push(this.createRandomPoint());
        //this.neuron.trainSet(this.trainingData[this.trainingData.length-1]);       
        
        // this.neuron.trainSet(this.createRandomPoint());
        // this.neuron.drawGraph();   
        
        this.neuron.trainSet(this.trainingData[this.count]);
        this.count = (this.count + 1) % this.trainingData.length;

        this.neuron.drawGraph();
    }
}