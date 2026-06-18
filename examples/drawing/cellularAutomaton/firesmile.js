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

        // let canvasDoc = createBufferedImage(100,30);
        // this.bufferedImage = new Canvas(canvasDoc);
        // this.bufferedImage.canvas = canvasDoc;   
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

        this.grid.colors = colorGradient;
    } 

    cnt = 0;
    frameCnt=0;
    update(delta){
        let height = this.grid.numRows;
        let width = this.grid.numCols;

        let frames = [[
                [0,0,0,0,0,1,1,1,1,0,0,0,0,0],
                [0,0,0,1,1,0,0,0,0,1,1,0,0,0],
                [0,1,1,0,0,0,0,0,0,0,0,1,1,0],
                [1,0,0,0,1,0,0,0,0,1,0,0,0,1],
                [1,0,0,0,1,0,0,0,0,1,0,0,0,1],
                [1,0,1,0,0,0,0,0,0,0,0,1,0,1],
                [1,0,1,0,0,0,0,0,0,0,0,1,0,1],
                [1,0,0,1,0,0,0,0,0,0,1,0,0,1],
                [0,1,1,0,1,1,1,1,1,1,0,1,1,0],
                [0,0,0,1,1,0,0,0,0,1,1,0,0,0],
                [0,0,0,0,0,1,1,1,1,0,0,0,0,0]
            ],[
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,1,0,0,0,0,1,0,0,0,0],
                [0,0,0,0,1,0,0,0,0,1,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,1,1,1,1,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            ],
            [
                [0,0,0,0,0,1,1,1,1,0,0,0,0,0],
                [0,0,0,1,1,0,0,0,0,1,1,0,0,0],
                [0,1,1,0,0,0,0,0,0,0,0,1,1,0],
                [1,0,0,0,1,0,0,0,0,1,0,0,0,1],
                [1,0,0,0,1,0,0,0,0,1,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,1,1,1,1,0,0,0,0,1],
                [1,0,0,0,1,0,0,0,0,1,0,0,0,1],
                [0,1,1,1,0,0,0,0,0,0,1,1,1,0],
                [0,0,0,1,1,0,0,0,0,1,1,0,0,0],
                [0,0,0,0,0,1,1,1,1,0,0,0,0,0]
            ],
            [
                [0,0,0,0,0,1,1,1,1,0,0,0,0,0],
                [0,0,0,1,1,0,0,0,0,1,1,0,0,0],
                [0,1,1,0,0,0,0,0,0,0,0,1,1,0],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [0,1,1,0,0,0,0,0,0,0,0,1,1,0],
                [0,0,0,1,1,0,0,0,0,1,1,0,0,0],
                [0,0,0,0,0,1,1,1,1,0,0,0,0,0]
            ]
        ];        

        let face = frames[this.frameCnt];
        if(this.cnt++%60==0){
            if(++this.frameCnt >= frames.length)
                this.frameCnt=0;
        }

        for(let y=0; y < height; y++)
            for(let x=0; x<width; x++) {
                let percentageX = x/width;
                let percentageY = y/height;
                let sX = Math.floor(percentageX*face[0].length);
                let sY = Math.floor(percentageY*face.length);
                if(face[sY][sX]===1)
                    this.grid.matrix[y][x] = Tools.getNumberBetween(0,255);
            }

        // for (let x =1; x < this.grid.numCols-1;x++) {
        //     this.grid.matrix[this.grid.matrix.length-1][x] = Tools.getNumberBetween(0,255);
        // }          

        for(let y=0; y < height; y++)
                for(let x=0; x<width; x++) {  // every column

                    let bl = 0;
                    if(y+1 < height-1 && x-1 > 0) bl = this.grid.matrix[y+1][x-1];

                    let b = 0;
                    if(y+1 < height-1) b = this.grid.matrix[y+1][x];

                    let br = 0;
                    if(y+1 < height-1 && x+1 < width-1) br = this.grid.matrix[y+1][x+1];

                    let b2 = 0;
                    if(y+2 < height-1) b2 = this.grid.matrix[y+2][x];

                    this.grid.matrix[y][x]=Math.floor((bl+b+br+b2)/4.04);}                     

                        // this.grid.matrix[y][x]=Math.floor((                // add the cell values:
                        // this.grid.matrix[wrap(y+1, height)][wrap(x-1, width)] +     // below, left
                        // this.grid.matrix[wrap(y+1, height)][wrap(x, width)] +     // immediately below
                        // this.grid.matrix[wrap(y+1, height)][wrap(x+1, width)] +        // below, right
                        // this.grid.matrix[wrap(y+2, height)][wrap(x, width)]        // two rows below
                        // )/4.04);}          

        this.grid.update(delta);  
    }
}

class MainLevel extends LevelInterface {    

    setupHelpDialog(){
        const textParts = [`
            <span class="HelpHeader">Description</span><br>
                Animated smiley face rendered through the fire cellular automaton.
            `,`
            <span class="HelpHeader">Instructions</span><br>
                Watch the pattern feed the flame simulation.<br>
            `];
        return {textParts, pause:false}
    }
    
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
