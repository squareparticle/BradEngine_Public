class Grid{
    colors=['black','blue']
    bounds = {x:0,y:0,width:canvas.width,height:canvas.height}
    matrix = [];
    cellWidth = 0; 
    cellHeight= 0;
    showBorders = false;

    fillBox(pos, size, colors, density=1){
        for(let i_row=pos.y; i_row < pos.y+size.height; i_row++){
            if(i_row < 0 || i_row >= this.numRows-1) continue;
            for(let i_col=pos.x; i_col<pos.x+size.width; i_col++){
                if(i_col < 0 || i_col >= this.numCol-1) continue;
                if(Math.random() <= density)
                    this.matrix[i_row][i_col] = colors[Tools.getNumberBetween(0,colors.length-1)];
            }
        }
    }

    fillCircle(pos, radius, colors, density=1){
        let center = {...pos};
        pos = Tools2D.subVector(pos, radius);
        let size = { width: radius *2, height: radius *2};

        for(let i_row=pos.y; i_row < pos.y+size.height; i_row++){
            if(i_row < 0 || i_row >= this.numRows-1) continue;
            for(let i_col=pos.x; i_col<pos.x+size.width; i_col++){
                if(i_col < 0 || i_col >= this.numCol-1) continue;
                if(Tools.distanceBetweenPoints(center, {x:i_col, y:i_row}) <= radius)
                    if(Math.random() <= density)
                        this.matrix[i_row][i_col] = colors[Tools.getNumberBetween(0,colors.length-1)];
            }
        }
    }

    getMouseInput(position){
        if(position.x < this.bounds.x || position.x > this.bounds.x+this.bounds.width ||
           position.y < this.bounds.y || position.y > this.bounds.y+this.bounds.height)
          return null; // mouse not on the grid

        let mouseX = position.x - this.bounds.x;
        let mouseY = position.y - this.bounds.y;

        let xPercent = mouseX/this.bounds.width;
        let yPercent = mouseY/this.bounds.height;

        return {x: Math.floor(xPercent*this.numCols), y: Math.floor(yPercent*this.numRows)};
    }

    constructor(level, numRows=20, numCols=10, bounds, colors=['black','blue']){
        this.level = level;
        this.numRows = numRows;
        this.numCols = numCols;
        this.colors = colors;
        if(bounds) this.bounds = bounds;
        this.build();
    }

    build(){ this.clear(); }

    clone(){
        let clone = new Grid(this.level, this.numRows, this.numCols);
        for(let i_row=0; i_row<this.numRows; i_row++){
            for(let i_col=0; i_col<this.numCols; i_col++){
                clone.matrix[i_row][i_col] = this.matrix[i_row][i_col];
            }
        }
        clone.colors = [...this.colors];
        return clone;
    }

    clear(){
        this.cellWidth = this.bounds.width/this.numCols;
        this.cellHeight = this.bounds.height/this.numRows;
        this.matrix = [];
        for(let i_row=0; i_row<this.numRows; i_row++){
            this.matrix[i_row] = [];
            for(let i_col=0; i_col<this.numCols; i_col++){
                this.matrix[i_row][i_col] = 0;
            }
        }
    }

    update(delta){
        for(let i_row=0; i_row<this.numRows; i_row++){
            for(let i_col=0; i_col<this.numCols; i_col++){
                drawBox(
                    Math.floor(this.bounds.x+(i_col*this.cellWidth)), 
                    Math.floor(this.bounds.y+(i_row*this.cellHeight)), 
                    Math.ceil(this.cellWidth), 
                    Math.ceil(this.cellHeight), 
                    this.colors[this.matrix[i_row][i_col]]);
                if(this.showBorders)
                    drawBox(this.bounds.x+(i_col*this.cellWidth), this.bounds.y+i_row*this.cellHeight, this.cellWidth, this.cellHeight, 'grey',{outline:true, thickness:1});
            }
        }
    }
}