class GameOfLife{
    grid = null;
    resolution = 0.3;

    isPaused = false;

    constructor(level){
        this.level = level;

        this.grid = new Grid(this, 
            Math.floor(this.level.canvas.width*this.resolution), Math.floor(this.level.canvas.height*this.resolution), 
            {x:0, y:0, width:this.level.canvas.width, height: this.level.canvas.height}
        );
        this.grid.showBorders=false;
        this.initGrid();
    }

    initGrid(){
        for (let y = 1; y < this.grid.numRows-1; y++) {
            for (let x =1; x < this.grid.numCols-1;x++) {
                this.grid.matrix[y][x] = Tools.getNumberBetween(0,1);
            }
        } 
    }

    update(delta){
        if(!this.isPaused){
            let currentState = this.grid.clone();

            for (let y = 1; y < this.grid.numRows-1; y++) {
                for (let x =1; x < this.grid.numCols-1;x++) {

                    // Add up all the states in a 3x3 surrounding grid
                    let population = 0;
                    for (let i = -1; i <= 1; i++) {
                        for (let j = -1; j <= 1; j++) {
                            if(i===0 && j ===0) continue;
                            population += currentState.matrix[y+i][x+j];
                        }
                    }

                    // Rules of Life
                    if      ((currentState.matrix[y][x] == 1) && (population <  2)) this.grid.matrix[y][x] = 0;           // Loneliness
                    else if ((currentState.matrix[y][x] == 1) && (population >  3)) this.grid.matrix[y][x] = 0;           // Overpopulation
                    else if ((currentState.matrix[y][x] == 0) && (population == 3)) this.grid.matrix[y][x] = 1;           // Reproduction
                }
            } 
        }                
        this.grid.update(delta);
    }
}

class Button{
    constructor(level, bounds, text, color, callback){
        this.level = level;
        this.bounds = bounds;
        this.callback = callback;
        this.color = color;
        this.text = text;
    }
    update(){
        drawBox(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height, this.color);
        drawText(this.bounds.x, this.bounds.y+20, this.text, 20, 'red');
    }
    getMouseInput(position){
        if(Collision.testPointOnBox(position, this.bounds)){
            this.callback(this.level);
        }
    }
}

class MainLevel extends LevelInterface {    
    game = null;

    setupHelpDialog(){
        const textParts = [`
            <span class="HelpHeader">Description</span><br>
                Conway's Game of Life cellular automaton.
            `,`
            <span class="HelpHeader">Instructions</span><br>
                ${drawHelpKey('Mouse')} Click cells to turn them on or off.<br>
                ${drawHelpKey('Pause')} Stop the simulation.<br>
                ${drawHelpKey('Start')} Resume the simulation.<br>
            `];
        return {textParts, pause:false}
    }

    pauseButton = new Button(this, 
        {
            x:this.canvas.width*0.9, 
            y:this.canvas.height*0.8, 
            width:this.canvas.width*0.1, 
            height: this.canvas.height*0.1
        },
        "pause",
        'lightblue',
        this.pauseGame
    )
    startButton = new Button(this, 
        {
            x:this.canvas.width*0.9, 
            y:this.canvas.height*0.9, 
            width:this.canvas.width*0.1, 
            height: this.canvas.height*0.1
        },
        "Start",
        'lightgreen',
        this.unPauseGame
    )
    pauseGame(level){
        level.game.isPaused = true;
    }
    unPauseGame(level){
        level.game.isPaused = false;
    }

    getMouseInput(event){
        if(event.type === "down"){
            this.pauseButton.getMouseInput(event.position);
            this.startButton.getMouseInput(event.position);
            let cellPosition = this.game.grid.getMouseInput(event.position);
            if(cellPosition != null)
                if(this.game.grid.matrix[cellPosition.y][cellPosition.x] === 0)
                    this.game.grid.matrix[cellPosition.y][cellPosition.x] = 1;
                else
                    this.game.grid.matrix[cellPosition.y][cellPosition.x] = 0;
        }
    }    

    setup(){
        this.game = new GameOfLife(this);
    }

    update(delta){
        this.game.update(delta);
        this.pauseButton.update(delta);
        this.startButton.update(delta);
    }
}
