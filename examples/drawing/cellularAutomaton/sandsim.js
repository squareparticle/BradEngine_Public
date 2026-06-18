const wrap=(num, length)=> (num+length)%(length);

class Button{
    constructor(params){ for(const [key,value] of Object.entries(params)){ this[key]=value; } }

    update(){
        drawBox(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height, this.backColor);
        drawText(this.bounds.x, this.bounds.y+20, this.text, 20, this.textColor);
    }
    getMouseInput(position){
        if(Collision.testPointOnBox(position, this.bounds)){
            this.callback(this.level, this.id);
            return true;
        }
        return false;
    }
}

class EffectGrid{
    static ELEMENT_BLANK = 0;
    static ELEMENT_SOLID = 1;
    static ELEMENT_SAND = 2;
    static ELEMENT_WATER = 3;
    static ELEMENT_OIL = 4;

    palette = [];
    resolution = 0.15;
    constructor(level){
        this.level = level;
        this.grid = new ElementGrid(this, 
            Math.floor(this.level.canvas.width*this.resolution), Math.floor(this.level.canvas.height*this.resolution), 
            {x:0, y:0, width:this.level.canvas.width, height: this.level.canvas.height}
        ); 
        this.originalGrid = new ElementGrid(this, 
            Math.floor(this.level.canvas.width*this.resolution), Math.floor(this.level.canvas.height*this.resolution), 
            {x:0, y:0, width:this.level.canvas.width, height: this.level.canvas.height}
        );         
        this.initGrid();       
    }

    initGrid(){
        //this.loadImage('poster1.jpg','poster1_mask.png','poster1_after.png');
        //this.loadImage('poster1.jpg','poster1_mask.png');
        this.loadImage('poster1.jpg');
    } 
    
    replaceBlockAtIfFallingThrow(mediums, currentBlock, checkPos){
        //if(element.locked) return;

        checkPos = Tools2D.addVectors(currentBlock.pos, checkPos);
        let switchBlock = { pos: checkPos };
        switchBlock.element = this.grid.getElementAt(checkPos.x, checkPos.y);

        let medium = mediums.reduce((acc,mediumID)=>{ if(mediumID === switchBlock.element.id) acc = mediumID; return acc;},-1);
        if(medium !==-1){ 
            //if(medium === 0) 
                switchBlock.element.color = this.originalGrid.matrix[currentBlock.pos.y][currentBlock.pos.x].color;            
            this.replaceBlockAt(currentBlock, switchBlock, medium); 
            return true;
        }
        return false;
    }

    replaceBlockAt(currentBlock, switchBlock){
        this.grid.setElementAt({...switchBlock.element, locked:true},currentBlock.pos.x,currentBlock.pos.y);
        this.grid.setElementAt(currentBlock.element, switchBlock.pos.x, switchBlock.pos.y);
        currentBlock.element.locked = true;
    }

    evalSolid(pos){
        let element = this.grid.getElementAt(pos.x,pos.y);
        if(element.id === -1) return;

        let currentBlock = {element, pos};
        if(this.replaceBlockAtIfFallingThrow([0,3,4],currentBlock, {x:0, y:2})) return;
        if(this.replaceBlockAtIfFallingThrow([0,3,4],currentBlock, {x:0, y:1})) return;
        if(this.replaceBlockAtIfFallingThrow([0,3,4],currentBlock, {x:1, y:1})) return;
        if(this.replaceBlockAtIfFallingThrow([0,3,4],currentBlock, {x:-1, y:1})) return;            
    }

    evalLiquid(pos){
        let element = this.grid.getElementAt(pos.x,pos.y);
        if(element.id === -1) return;

        let currentBlock = {element, pos};
        if(this.replaceBlockAtIfFallingThrow([0],currentBlock, {x:0, y:2})) return;
        if(this.replaceBlockAtIfFallingThrow([0],currentBlock, {x:0, y:1})) return;

        if(this.replaceBlockAtIfFallingThrow([0],currentBlock, {x:2, y:1})) return;
        if(this.replaceBlockAtIfFallingThrow([0],currentBlock, {x:1, y:1})) return;
        if(this.replaceBlockAtIfFallingThrow([0],currentBlock, {x:-2, y:1})) return;
        if(this.replaceBlockAtIfFallingThrow([0],currentBlock, {x:-1, y:1})) return;           

        if(this.replaceBlockAtIfFallingThrow([0],currentBlock, {x:2, y:0})) return;
        if(this.replaceBlockAtIfFallingThrow([0],currentBlock, {x:1, y:0})) return;
        if(this.replaceBlockAtIfFallingThrow([0],currentBlock, {x:-2, y:0})) return;
        if(this.replaceBlockAtIfFallingThrow([0],currentBlock, {x:-1, y:0})) return;              
    }

    update(delta){
        for (let y = 0; y < this.grid.numRows; y++)
            for (let x =0; x < this.grid.numCols; x++)
                this.grid.matrix[y][x].locked = false;

        // for (let y = 0; y < this.grid.numRows; y++){
        for (let y = this.grid.numRows-1; y >= 0; y--){
            for (let x =0; x < this.grid.numCols; x++) {
                //this.grid.bufferedMatrix[y][x]=this.grid.matrix[y][x];
                switch(this.grid.matrix[y][x].id){
                    case EffectGrid.ELEMENT_BLANK: break;
                    case EffectGrid.ELEMENT_SOLID: break;
                    case EffectGrid.ELEMENT_SAND: this.evalSolid({x, y}); break;
                    case EffectGrid.ELEMENT_WATER: 
                    case EffectGrid.ELEMENT_OIL: this.evalLiquid({x, y}); break;
                }
            }
        }        

        this.grid.update(delta);  
    }

    loadImage(imageName, imageNameMask, imageNameAfter){
        let mapImage = this.level.images[imageName];
        let mapData = getPixelData(mapImage);

        let mapDataMask=null;
        if(imageNameMask) mapDataMask = getPixelData(this.level.images[imageNameMask]);        

        let mapDataAfter=null;
        if(imageNameAfter) mapDataAfter = getPixelData(this.level.images[imageNameAfter]); 

        let bounds = {
            x:this.grid.numCols*0, 
            y:this.grid.numRows*0, 
            width:this.grid.numCols*1, 
            height:this.grid.numRows*1
        };

        for(let y=bounds.y; y<bounds.height; y++){
            for(let x=bounds.x; x<bounds.width; x++){
                const lookAt={
                    x: Math.floor((x/bounds.width)*mapImage.width),
                    y: Math.floor((y/bounds.height)*mapImage.height),
                }                
                let col = getPixelColorAt(mapData,lookAt.x,lookAt.y,true);
                let colMask = {b:0};
                let colAfter={r:0,g:0,b:0};
                if(mapDataMask) colMask = getPixelColorAt(mapDataMask,lookAt.x,lookAt.y,true);
                if(mapDataAfter) colAfter = getPixelColorAt(mapDataAfter,lookAt.x,lookAt.y,true);

                this.grid.matrix[y][x]={ color: rgbToHex(col.r,col.g,col.b), id: colMask.b,  locked: false }
                if(colMask.b===0)
                    this.originalGrid.matrix[y][x]={ color: rgbToHex(col.r,col.g,col.b), id:0 };
                else
                    this.originalGrid.matrix[y][x]={ color: rgbToHex(colAfter.r,colAfter.g,colAfter.b) };
            }    
        }         
    }
}

class MainLevel extends LevelInterface {
    buttons = [];
    elements = [];
    selectedElementID=1;
    elementDescriptions = [
        { id: EffectGrid.ELEMENT_BLANK, name:'Blank', color:'black', mouseDensity: 1, radius:0.05, button:{ text: 'Blank', color: 'black', textColor: 'white' }},
        { id: EffectGrid.ELEMENT_SOLID, name:'Solid', color:'white', mouseDensity: 1, radius:0.05, button:{ text: 'Solid', color: 'white', textColor: 'black' }},
        { id: EffectGrid.ELEMENT_SAND, name:'Sand', color:'yellow', mouseDensity: 0.01, radius:0.1, button:{ text: 'Sand', color: 'yellow', textColor: 'black' }},
        { id: EffectGrid.ELEMENT_WATER, name:'Water', color:'blue', mouseDensity: 0.01, radius:0.1, button:{ text: 'Water', color: 'blue', textColor: 'black' }},
        { id: EffectGrid.ELEMENT_OIL, name:'Oil', color:'brown', mouseDensity: 0.01, radius:0.1, button:{ text: 'Oil', color: 'brown', textColor: 'black' }}
    ];

    loadResources(){
        this.findResources('cellularAutomaton','images/');
    }

    switchElement(level, id){
        level.selectedElementID = id;
    }

    setupHelpDialog(){
        const textParts = [`
            <span class="HelpHeader">Description</span><br>
                Falling sand simulation with solid, sand, water, and oil particles.
            `,`
            <span class="HelpHeader">Instructions</span><br>
                ${drawHelpKey('Mouse')} Click an element button, then click and drag to paint.<br>
                ${drawHelpKey('Blank')} Restore the original image under the brush.<br>
                ${drawHelpKey('Space')} Trigger the poster sand effect.<br>
            `];
        return {textParts, pause:false}
    }

    mouseDown = false;    
    getMouseInput(event){
        this.mouseDown = false;
        if(event.type === "down"){ 
            if(this.buttons.filter(button=>button.getMouseInput(event.position)).length!==0) return;
            this.addTouchBox(event.position); 
            this.mouseDown = true; 
        }
    }    
    getMouseMoveInput(event){
        if(this.mouseDown){ this.addTouchBox(event.position);}
    }

    getKeyboardInput(event){
        if(event.type==='down' && event.key === " " )
            this.effectGrid.loadImage('poster1.jpg','poster1_mask.png','poster1_after.png');
    }

    addTouchBox(position){
        let x =  Math.floor((position.x/this.canvas.width)*this.effectGrid.grid.numCols);
        let y =  Math.floor((position.y/this.canvas.height)*this.effectGrid.grid.numRows);
        let radius = Math.floor(this.effectGrid.grid.numCols*this.elementDescriptions[this.selectedElementID].radius);
        //this.effectGrid.grid.fillBox({x:Math.round(x-width/2),y:Math.round(y-height/2)},{width,height},[1,2,3,4,5,6],0.5);
        if(this.selectedElementID===0)
            this.effectGrid.grid.fillCircleFromColorGrid(this.effectGrid.originalGrid,{x,y},radius,this.elementDescriptions[this.selectedElementID].mouseDensity);
        else
            this.effectGrid.grid.fillCircle({x,y},radius,[this.elements[this.selectedElementID]],this.elementDescriptions[this.selectedElementID].mouseDensity);
    }

    setup(){
        this.effectGrid = new EffectGrid(this);

        this.elementDescriptions.forEach((element,i)=>{
            this.elements.push({ id:element.id, color: element.color});
            this.buttons.push(new Button({level:this, 
                bounds:{
                    x:this.canvas.width*0.9, 
                    y:this.canvas.height*(i*0.1), 
                    width:this.canvas.width*0.1, 
                    height: this.canvas.height*0.1
                },
                text: element.button.text, id: element.id,
                backColor: element.button.color,
                textColor: element.button.textColor,
                callback:this.switchElement
            }));        
        });
    }

    update(delta){
        drawBox(0,0,this.canvas.width, this.canvas.height, 'black');
        this.effectGrid.update(delta);
        this.buttons.forEach(button=>button.update(delta));
    }
}
