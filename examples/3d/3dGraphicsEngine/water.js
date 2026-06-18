class MainLevel extends LevelInterface {   
    loadResources(){ this.findResources('3dGraphicsEngine','images'); }

    setupHelpDialog(){
        const textParts= [`
            <span class="HelpHeader">Description</span><br>
            Polygon Collision detection on a terrain. <br>
            `,`
            <span class="HelpHeader">Instructions</span><br>
              ${drawHelpKey('w')} Move Camera Forward <br>
              ${drawHelpKey('s')} Move Camera Back <br>
              ${drawHelpKey('a')} Turn Camera Left <br>
              ${drawHelpKey('d')} Turn Camera Right <br>
              ${drawHelpKey('Up Arrow')} Rotate Camera Up <br>
              ${drawHelpKey('Down Arrow')} Rotate Camera Up <br>
              ${drawHelpKey('p')} Point Mode<br>
              ${drawHelpKey('[')} Line Mode<br>
              ${drawHelpKey(']')} Colored Mode<br>
              ${drawHelpKey('\\')} Line + Colored Mode<br>
              <br><br>
            `];
        return {textParts, pause:false}
    }    

    getKeyboardControls(event){
        if(event.type==="down"){
            if(event.key==="[") this.scene.edit({drawRawVerts:false,drawVerts:false,fillPolys:false,drawLines:true});       
            if(event.key==="\\") this.scene.edit({drawRawVerts:false,drawVerts:false,fillPolys:true,drawLines:true});
            if(event.key==="p") this.scene.edit({drawRawVerts:true,drawVerts:false,fillPolys:false,drawLines:false});
            if(event.key==="]") this.scene.edit({drawRawVerts:false,drawVerts:false,fillPolys:true,drawLines:false}); 
        }
    }

    setup(){
        this.scene = new WorldScene(this,{drawVerts:false,fillPolys:true,drawLines:false});
        this.scene.addLight({x:0,y:-300,z:-500},{r:255,g:255,b:255});

        this.scene.getCamera().pos={x: 31.9505121476643, y: 29.871250203671774, z: 33.3381157988469};
        this.scene.getCamera().rot={x: 5.510449218750001, y: -47.68018554687498, z: 0};

        // let terrain = new Terrain({numRows:64,numCols:64,maxHeight:4, useQuads:false, colors:{r:139,g:69,b:19}}, this);
        let terrain = new Terrain({useQuads:false,numRows:64,numCols:64,faceColors:{r:139,g:69,b:19},scale:{x:1,y:0.5,z:1},pos:{x:0,y:0,z:0}});        
        terrain.generateFromImage({image:this.images['128x128.png']})
        this.scene.addObject(terrain);

        let water = new Terrain({useQuads:false,numRows:64,numCols:64,faceColors:{r:0,g:0,b:255},scale:{x:1,y:0.5,z:1},pos:{x:0,y:0,z:0}});        
        water.generateFromNoise({noise:{fn:'simplex',scale:10,maxHeight:2,pos:{x:0,y:0,z:0}, animate:true}});
        water.pos.y=-20;
        this.scene.addObject(water);
    }

    getKeyboardInput(event){ 
        this.getKeyboardControls(event);
        this.scene.getCamera().defaultCameraKeyboardControls(event);
    }

    update(delta){
        this.scene.getCamera().runCameraControls(delta);
        drawBox(0,0,this.canvas.width, this.canvas.height, 'black')
        this.scene.render(delta);
    }
}