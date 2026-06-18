const wrap=(num, length)=> (num+length)%(length);

class FireEffect{
    palette = [];
    resolution = 0.1;

    colors=[
        {r:0, g:0, b:0},
        {r:0, g:0, b:0},
        {r:45, g:45, b:45},
        {r:215, g:87, b:0},
        {r:115, g:0, b:0},
        {r:215, g:87, b:0},
        // {r:115, g:0, b:0},
        {r:255, g:165, b:59},
        {r:255, g:255, b:0},
        {r:255, g:255, b:0},
        {r:255, g:255, b:0},
        {r:255, g:255, b:0},
        {r:255, g:255, b:200}
    ]

    constructor(level){
        this.level = level;
        this.grid = new Grid(this, 
            Math.floor(this.level.canvas.width*this.resolution), Math.floor(this.level.canvas.height*this.resolution), 
            {x:0, y:0, width:this.level.canvas.width, height: this.level.canvas.height}
        ); 
        this.initGrid();       
    }

    initGrid(){

        let colorGradient = [];
        let paletteCnt = 0;
        let evenSpit = Math.ceil(255/this.colors.length-1);
        this.colors.forEach((color,i)=>{
            if(i==0){
                colorGradient.push(`rgb(${this.colors[i].r}, ${this.colors[i].g}, ${this.colors[i].b})`);
                return;
            }
            let start = (i-1)*evenSpit;
            let end = start+evenSpit;
            for(let ii=0; ii< evenSpit; ii++){
                let percent =(paletteCnt - start)/(end - start);
                let newColor = `rgb(${lerp(this.colors[i-1].r, this.colors[i].r, percent)},${lerp(this.colors[i-1].g, this.colors[i].g, percent)},${lerp(this.colors[i-1].b, this.colors[i].b, percent)})`;                
                colorGradient.push(newColor);
                paletteCnt++;
            }
        });

//         colorGradient = [];
//         for(let i=0; i<256; i++){
// //            colorGradient[i] = {r:255-i,g:0,b:0};
//             colorGradient[i] = `rgb(${i},0,0)`;
//         }

        this.grid.colors = colorGradient;
    } 
    
    update(delta){

        for (let x =1; x < this.grid.numCols-1;x++) {
            this.grid.matrix[this.grid.matrix.length-1][x] = Tools.getNumberBetween(0,255);
        }          

        let height = this.grid.numRows;
        let width = this.grid.numCols;
        for(let y=0; y < height; y++)
                for(let x=0; x<width; x++) {  // every column
                        this.grid.matrix[y][x]=Math.floor((                // add the cell values:
                        this.grid.matrix[wrap(y+1, height)][wrap(x-1, width)] +     // below, left
                        this.grid.matrix[wrap(y+1, height)][wrap(x, width)] +     // immediately below
                        this.grid.matrix[wrap(y+1, height)][wrap(x+1, width)] +        // below, right
                        this.grid.matrix[wrap(y+2, height)][wrap(x, width)]        // two rows below
                        )/4.04);}          

        this.grid.update(delta);  
    }
}

class MainLevel extends LevelInterface {    
    
    getMouseInput(event){
        if(event.type === "down"){
            this.game.grid.getMouseInput(event.position);
        }
    }    

    setup(){
        this.fireEffect = new FireEffect(this);
    }

    update(delta){
        drawBox(0,0,this.canvas.width, this.canvas.height, 'black');
        this.fireEffect.update(delta);
    }
}

    // update(delta){
    //     for (let x =20; x < this.grid.numCols-20;x++) {
    //         this.grid.matrix[this.grid.matrix.length-30][x] = Tools.getNumberBetween(0,255);
    //     }          

    //     let height = this.grid.numRows;
    //     let width = this.grid.numCols;

    //     let clone = [];
    //     for(let y=0; y < height; y++){
    //         clone[y]=[];
    //             for(let x=0; x<width; x++) 
    //                 clone[y][x]=this.grid.matrix[y][x];
    //     }

    //     for(let y=0; y < height; y++)
    //             for(let x=0; x<width; x++) {  // every column

    //                 let bl = 0;
    //                 if(y+1 < height-1 && x-1 > 0) bl = clone[y+1][x-1];

    //                 let b = 0;
    //                 if(y+1 < height-1) b = clone[y+1][x];

    //                 let br = 0;
    //                 if(y+1 < height-1 && x+1 < width-1) br = clone[y+1][x+1];

    //                 let b2 = 0;
    //                 if(y+2 < height-1) b2 = clone[y+2][x];

    //                 this.grid.matrix[y][x]=Math.floor((bl+b+br+b2)/4.04);}  

    //     this.grid.update(delta);  
    // }

    // update3(delta){
    //     for (let x =20; x < this.grid.numCols-20;x++) {
    //         this.grid.matrix[this.grid.matrix.length-30][x] = Tools.getNumberBetween(0,255);
    //     }          

    //     let height = this.grid.numRows;
    //     let width = this.grid.numCols;
    //     for(let y=0; y < height; y++)
    //             for(let x=0; x<width; x++) {  // every column

    //                 let bl = 0;
    //                 if(y+1 < height-1 && x-1 > 0) bl = this.grid.matrix[y+1][x-1];

    //                 let b = 0;
    //                 if(y+1 < height-1) b = this.grid.matrix[y+1][x];

    //                 let br = 0;
    //                 if(y+1 < height-1 && x+1 < width-1) br = this.grid.matrix[y+1][x+1];

    //                 let b2 = 0;
    //                 if(y+2 < height-1) b2 = this.grid.matrix[y+2][x];

    //                 this.grid.matrix[y][x]=Math.floor((bl+b+br+b2)/4.04);}  

    //     this.grid.update(delta);  
    // }

    // update4(delta){
    //     for (let x =0; x < this.grid.numCols-0;x++) {
    //         this.grid.matrix[this.grid.matrix.length-30][x] = Tools.getNumberBetween(0,255);
    //     }          

    //     let height = this.grid.numRows;
    //     let width = this.grid.numCols;

    //     let clone = [];
    //     for(let y=0; y < height; y++){
    //         clone[y]=[];
    //             for(let x=0; x<width; x++) 
    //                 clone[y][x]=this.grid.matrix[y][x];
    //     }

    //     // for(let y=height-1; y > 0 ; y--){
    //     for(let y=0; y < height ; y++){
    //         if(y==this.grid.matrix.length-30-1){
    //                 let a = 0;
    //             }
    //             for(let x=0; x<width; x++) {  // every column

    //                 let bl = 0;
    //                 if(y+1 < height-1 && x-1 > 0) bl = clone[y+1][x-1];

    //                 let b = 0;
    //                 if(y+1 < height-1) b = clone[y+1][x];

    //                 let br = 0;
    //                 if(y+1 < height-1 && x+1 < width-1) br = clone[y+1][x+1];

    //                 let b2 = 0;
    //                 if(y+2 < height-1) b2 = clone[y+2][x];

    //                 this.grid.matrix[y][x]=Math.floor((bl+b+br+b2)/4.04);}  
    //     }
    //     this.grid.update(delta);  
    // }