class CellularAutomata{
    static build(grid, ruleNumber){
        const pattern =[[1,1,1],[1,1,0],[1,0,1],[1,0,0],[0,1,1],[0,1,0],[0,0,1],[0,0,0]]
        const rule = Number(ruleNumber).toString(2).padStart(8, '0');

        let centerX = Math.floor(grid.numCols/2);
        grid.matrix[0][centerX] = 1; // center the first block at the top

        // fill in the rest under the first line
        for(let y=1; y<grid.numRows; y++){
            for(let x=0; x < grid.numCols; x++){
                pattern: for(let i_pattern=0; i_pattern< pattern.length; i_pattern++){
                    let matchCnt = 0; 
                    for(let i_check=-1; i_check < 2; i_check++){
                        let cellContent = 0;
                        if(x+i_check!==-1 && x+i_check < grid.numCols) // if checking block that are out of bounds then assume they are 0
                            cellContent = grid.matrix[y-1][x+i_check];                        
                        if(cellContent === pattern[i_pattern][i_check+1]) 
                            matchCnt++;                        
                    }
                    if (matchCnt === pattern[i_pattern].length){ // if the pattern matches the rule then fill in the cell
                        grid.matrix[y][x]=0; 
                        if(rule[i_pattern] === '1') {
                            grid.matrix[y][x]=1;
                        }
                        break pattern;
                    }      
                }
            }            
        }
    }
}

class MainLevel extends LevelInterface {    
    grids=[];
    gridsPerRow = 1;
    gridsPerCol = 1;

    resolution = 0.2;

    mouseDown = {x:0,y:0};
    slide = 0;

    setupHelpDialog(){
        const textParts = [`
            <span class="HelpHeader">Description</span><br>
                One dimensional cellular automata rule-number experiments.
            `,`
            <span class="HelpHeader">Instructions</span><br>
                ${drawHelpKey('Mouse')} Click to advance through the rule patterns.<br>
            `];
        return {textParts, pause:false}
    }

    getMouseInput(event){
        
        // if(event.type === "down") 
        //     this.mouseDown = event.position;
        // if(event.type === "up") {
        //     //alert("sin "+event.type)
        //     if(this.mouseDown.x > event.position.x) this.slide--;
        //     if(this.mouseDown.x < event.position.x) this.slide++;

        //     if(this.slide<0)this.slide = 0;
        //     if(this.slide>4)this.slide = 4;

        //     this.setupSlide(this.slide)
        // }

        if(event.type === "down") {
            this.slide++;            
            alert(this.slide+"");
            if(this.slide>4)this.slide = 4;
            this.setupSlide(this.slide)
        }

    }     

    setupSlide(slideNum){
        let rule = 99;
        if(slideNum === 0) {
            this.resolution = 0.6;
            rule = 99;
        }
        if(slideNum === 1) {
            this.resolution = 0.2;
            rule = 30;
        }
        if(slideNum ===2) {
            this.resolution = 0.2;
            rule = 77;
        }
        if(slideNum === 3){
            rule = 126;
            this.resolution = 0.6;
            this.gridsPerRow = 1;
            this.gridsPerCol = 1;            
        }
        if(slideNum === 4){
            rule = 100;
            this.resolution = 0.3;
            this.gridsPerRow = 10;
            this.gridsPerCol = 10;            
        }

        for(let y=0; y<this.gridsPerRow; y++){
            for(let x=0; x < this.gridsPerCol; x++){
                let grid = new Grid(this, 
                    Math.floor((this.canvas.width/this.gridsPerCol)*this.resolution), Math.floor((this.canvas.height/this.gridsPerRow)*this.resolution), 
                    {x:this.canvas.width/this.gridsPerCol*x, y:this.canvas.height/this.gridsPerRow*y, width:this.canvas.width/this.gridsPerCol, height: this.canvas.height/this.gridsPerRow}
                );
                CellularAutomata.build(grid, rule++);
                this.grids.push(grid);
            }
        }
    }

    setup(){
        this.setupSlide(0)
    }

    update(delta){
        this.grids.forEach(grid=>grid.update(delta));
    }
}
