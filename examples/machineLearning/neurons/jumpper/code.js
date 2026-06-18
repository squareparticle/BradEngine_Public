class GameObject{
    isDead = false;
    position = {x:0, y:0}
    constructor(params) {  for (const [key, value] of Object.entries(params)) this[key] = value; }
}

class Brain{
    neuron = null;    

    constructor(){
        this.neuron = new Perceptron({
            numInputs:3, 
            learningRate:0.1,
            activeType: Perceptron.ACTIVATE_BINARY
        });
    }

    processThought(food){
        this.neuron.trainSet(food);
        return this.neuron.calcOutput(food.inputs);
    }
}

class CPUPlayer extends GameObject{
    static DECISION_UNKNOWN = -1;
    static DECISION_EAT = 0;
    static DECISION_JUMP = 1;

    decision = CPUPlayer.DECISION_UNKNOWN;
    
    brain = new Brain();
    isSick = false;

    detectFood(food){
        this.isSick = false;
        let input = {
            inputs:[food.color, food.shape, 1],
            answer:food.heathly
        }        
        this.decision = this.brain.processThought(input);

        this.decision = input.output;

        console.log(input, 'new Decision', this.decision)

        if(food.heathly === Food.POISON && this.decision === CPUPlayer.DECISION_EAT)
            this.isSick = true;

        if(food.heathly === Food.SAFE_TO_EAT && this.decision === CPUPlayer.DECISION_JUMP)
            this.isSick = true;            
    }

    update(delta){
        let color = 'white';
        
        if(this.isSick) color = 'blue';

        if(this.decision == CPUPlayer.DECISION_JUMP)
            drawBox(this.position.x-25, this.position.y-25-100, 50, 50, 'white');

        if(this.decision == CPUPlayer.DECISION_EAT)
            drawBox(this.position.x-25, this.position.y-25, 50, 50, color);

        if(this.decision == CPUPlayer.DECISION_UNKNOWN)
            drawBox(this.position.x-25, this.position.y-25, 50, 50, color);

    }
}

class Food extends GameObject{
    static SAFE_TO_EAT = 0;
    static POISON = 1;

    static COLOR_GREEN=0;
    static COLOR_RED=1;
    static SHAPE_SQUARE=9;
    static SHAPE_CIRCLE=1;

    direction = -1;
    speed = 10;
    update(delta){
        this.position.x += this.direction * this.speed;// * delta;

        let color = (this.color===Food.COLOR_GREEN)?'green':'red';

        if(this.shape===Food.SHAPE_SQUARE)
            drawBox(this.position.x-25, this.position.y-25, 50, 50, color );
        else
            drawCircle(this.position.x, this.position.y, 25, color );
    }
}

class MainLevel extends LevelInterface {

    foodTypes = [
        { color: Food.COLOR_GREEN, shape: Food.SHAPE_SQUARE, heathly: Food.SAFE_TO_EAT},
        { color: Food.COLOR_RED, shape: Food.SHAPE_SQUARE, heathly: Food.SAFE_TO_EAT},
        { color: Food.COLOR_GREEN, shape: Food.SHAPE_CIRCLE, heathly: Food.SAFE_TO_EAT},
        { color: Food.COLOR_RED, shape: Food.SHAPE_CIRCLE, heathly: Food.POISON}
    ];
    foodArray = [];
    cpuPlayer = new CPUPlayer({position:{x:50, y:500} });

    setup(){
        for(let i=0; i<1000; i++)
            this.foodArray.push(new Food({
                ...Tools.getRandomObject(this.foodTypes), position:{x: 200+(i*100), y:500}
            }))
    }
    
    update(delta){        
        drawBox(0,0,this.canvas.width, this.canvas.height,'black');

        for(let i=0; i<this.foodArray.length; i++){
            this.foodArray[i].update(delta);
            if(this.foodArray[i].position.x === 100)
                this.cpuPlayer.detectFood(this.foodArray[i]);
        }
        this.cpuPlayer.update(delta);
    }
}