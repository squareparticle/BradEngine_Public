class GameOfLife{
    grid = null;
    resolution = 0.2;

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
                this.grid.matrix[y][x] = 0; //Tools.getNumberBetween(0,1);
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

class MainLevel extends LevelInterface {    
    game = null;

    mouseDown = false;

    setupHelpDialog(){
        const textParts = [`
            <span class="HelpHeader">Description</span><br>
                Conway's Game of Life with a larger mouse brush.
            `,`
            <span class="HelpHeader">Instructions</span><br>
                ${drawHelpKey('Mouse')} Click and drag to draw living cells.<br>
            `];
        return {textParts, pause:false}
    }

    getMouseInput(event){
        this.mouseDown = false;
        if(event.type === "down") this.mouseDown = true;
    }    
    getMouseMoveInput(event){
        if(this.mouseDown){
            let fingerX =  Math.floor((event.position.x/this.canvas.width)*this.game.grid.numCols);
            let fingerY =  Math.floor((event.position.y/this.canvas.height)*this.game.grid.numRows);

            let width = Math.floor(this.game.grid.numCols*0.25);
            let height = Math.floor(this.game.grid.numRows*0.15);
            for (let y = fingerX-Math.floor(height/2); y < fingerX+Math.floor(height/2);y++) {
                if(y>=this.game.grid.numCols-1) continue;
                for (let x = fingerY-Math.floor(width/2); x < fingerY+Math.floor(width/2);x++) {
                    if(x>=this.game.grid.numRows-1) continue;
                    this.game.grid.matrix[x][y] = Tools.getNumberBetween(0,1);
                }  
            }
        }
    }  

    setup(){
        this.game = new GameOfLife(this);
    }

    update(delta){
        this.game.update(delta);
    }
}
