class MainLevel extends LevelInterface {
	ann;
	sumSquareError = 0;

    setup(){
		this.ann = new ANN(2, 1, 1, 4, 0.8);
		
        this.train(1);

		let result;
		result = this.ann.getResult([1, 1]);
		console.log(" 1 1 " + result[0]);
		result = this.ann.getResult([1, 0]);
		console.log(" 1 0 " + result[0]);
		result = this.ann.getResult([0, 1]);
		console.log(" 0 1 " + result[0]);
		result = this.ann.getResult([0, 0]);
		console.log(" 0 0 " + result[0]);
	}

    train(epochs){
		let result;
		for(let i = 0; i < epochs; i++){
			this.sumSquareError = 0;
			result = this.ann.train([1, 1], [0]);
			this.sumSquareError += Math.pow(result[0] - 0,2);
			result = this.ann.train([1, 0], [1]);
			this.sumSquareError += Math.pow(result[0] - 1,2);
			result = this.ann.train([0, 1], [1]);
			this.sumSquareError += Math.pow(result[0] - 1,2);
			result = this.ann.train([0, 0], [0]);
			this.sumSquareError += Math.pow(result[0] - 0,2);

            result = this.ann.train([0.5, 0.5], [0]);
			this.sumSquareError += Math.pow(result[0] - 0,2);
            result = this.ann.train([0.25, 0.25], [1]);
			this.sumSquareError += Math.pow(result[0] - 0,2);
            result = this.ann.train([0.75, 0.75], [0]);
			this.sumSquareError += Math.pow(result[0] - 0,2);
		}
		console.log("SSE: " + this.sumSquareError);
    }

    update(delta){
        this.train(100);
        let resolution = 10;
        let cols = this.canvas.width / resolution;
        let rows = this.canvas.height / resolution;
        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            let x1 = i / cols;
            let x2 = j / rows;
            let inputs = [x1, x2];
            let y = this.ann.getResult(inputs);
            drawBox(i * resolution, j * resolution, resolution, resolution, `rgb(${y * 255},${y * 255},${y * 255})`)
          }
        }        
    }
}