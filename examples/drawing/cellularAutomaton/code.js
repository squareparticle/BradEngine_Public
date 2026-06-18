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

    setup(){
        let rule = 99;
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

    update(delta){
        this.grids.forEach(grid=>grid.update(delta));
    }
}