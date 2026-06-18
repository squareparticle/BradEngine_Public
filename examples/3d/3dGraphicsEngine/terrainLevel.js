class MainLevel extends LevelInterface {   
    loadResources(){ this.findResources('3dGraphicsEngine',['images','meshes']); }

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
        this.ambientlight={r:0,g:0,b:0};
        this.scene = new WorldScene(this,{drawVerts:false,fillPolys:true,drawLines:false,ambientlight:this.ambientlight});
        this.scene.addLight({x:0,y:-300,z:-500},{r:255,g:255,b:255});

        //this.terrain= new Plane({axis:"y",useQuads:false,numRows:5,numCols:5,faceColors:{r:139,g:69,b:19},scale:{x:1,y:1,z:1},pos:{x:0,y:0,z:0}});
        this.terrain=new Terrain({useQuads:false,numRows:64,numCols:64,faceColors:{r:139,g:69,b:19},scale:{x:50,y:5,z:50},pos:{x:0,y:0,z:0}},this);
        //this.terrain.generateFromImage({image:this.images["64x64.png"]});
        this.terrain.generateFromNoise({noise:{fn:'simplex',scale:1,maxHeight:10,pos:{x:0,y:0,z:0}}});
        //this.terrain.generateFlat();
        this.scene.addObject(this.terrain);

        this.box = new Cube({scale:{x:1,y:1,z:1},pos:{x:0,y:0,z:0}});
        this.scene.addObject(this.box);
        this.scene.drawLines = true;
        this.scene.editCamera(0,{moveSpeed:400});
        this.scene.getCamera().pos={x:0,y:268,z:248} 
        this.scene.getCamera().rot={x: 45, y: 0, z: 0}
        //this.scene.getCamera().pos={x:0,y:100,z:500} 
        // this.scene.getCamera().pos={x: 235.485544464072, y: 36.53496821111064, z: -73.26562619962998}
        // this.scene.getCamera().rot={x: 12.891718749999999, y: -52.03007812499995, z: 0}
        this.degrees=0;
    }

    getKeyboardInput(event){ 
        this.getKeyboardControls(event);
        this.scene.getCamera().defaultCameraKeyboardControls(event); 
    }

    update(delta){
        this.scene.getCamera().runCameraControls(delta);
        drawBox(0,0,this.canvas.width, this.canvas.height, '#6cb1f6');

        let point = Tools.getPointOnCircle(40, this.degrees++);

        this.box.pos.z=point.y;
        this.box.pos.x=point.x;

        this.scene.render(delta);
        this.terrain.collide(this.box);
    }
}