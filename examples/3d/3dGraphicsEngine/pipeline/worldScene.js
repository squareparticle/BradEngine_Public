class WorldScene{
    constructor(level, params){
        this.level = level;
        this.cameras=[]; 
        this.currentCamera=0;
        this.cameras[this.currentCamera] = new KBCamera({pos:{x:0,y:5,z:20},norm:{x:0,y:0,z:1},rot:{x:0,y:0,z:0}});
        this.models = [];
        this.drawVerts = false;
        this.drawRawVerts = false;
        this.fillPolys = true;
        this.drawLines = false;
        this.pointSize = 3;

        this.lights=[];
        this.ambientlight={r:50,g:50,b:50};
        this.edit(params);
        this.worldPolys = 0;
    }

    edit(params){Tools.overideObject(this,params);}
    editCamera(index,params){this.cameras[index].edit(params);}

    getKeyboardControls(event){
        if(event.type==="down"){
            // console.log(event.key);
            if(event.key==="[") this.edit({drawRawVerts:false,drawVerts:false,fillPolys:false,drawLines:true});       
            if(event.key==="\\") this.edit({drawRawVerts:false,drawVerts:false,fillPolys:true,drawLines:true});
            if(event.key==="p") this.edit({drawRawVerts:true,drawVerts:false,fillPolys:false,drawLines:false});
            if(event.key==="]") this.edit({drawRawVerts:false,drawVerts:false,fillPolys:true,drawLines:false});
        }
    }
    addLight(pos, col){
        let light = {pos, norm:Tools3D.normalize(pos), col, ambientColor:this.ambientlight}; // always points to (0,0,0)
        this.lights.push(light); 
        return light;
    }

    addObject(model){
        this.models.push(model);
    }

    addObjects(models){
        models.forEach(model=>this.models.push(model));
        // this.models.concat(models); // doesnt work???
    }

    getCamera(){return this.cameras[this.currentCamera];}
    switchCamera(index){this.currentCamera = index;}

    render(delta){
        let screenFaces = [] // 2D faces used to paint to the screen
        for(let i = 0; i<this.models.length; i++){
            if(this.models[i].body) this.models[i].updatePhyscis();
            this.models[i].update(delta);

            if(!this.models[i].isVisible) continue;

            this.models[i].toWorldSpace();
            let worldFaces = this.models[i].getFaces(); // 3D faces used for lighting
            this.models[i].toCameraSpace(this.cameras[this.currentCamera]);

            if(this.drawRawVerts){
                let screenVerts = this.models[i].getScreenVerts(this.level.canvas);
                for(let i_vert=0;i_vert < screenVerts.length;i_vert++){
                    drawCircle(screenVerts[i_vert].x, screenVerts[i_vert].y,this.pointSize,'white');
                }
            }

            screenFaces = screenFaces.concat(this.models[i].getScreenFaces(this.level.canvas, worldFaces, this.lights));
        }

        let numPolys = 0;
        this.models.forEach(model=>numPolys+=model.faces.length);
        if(this.worldPolys!=numPolys){
            console.log('World Polys:' + numPolys + ' showing:'+screenFaces.length);
            this.worldPolys = numPolys;
        }

        // Z-Buffer
        screenFaces = Tools.sortObjectArray(screenFaces, 'z');

        // Fill Polygons
        if(this.fillPolys){
            for(let i_face=0;i_face < screenFaces.length;i_face++){  
                if(screenFaces[i_face].verts.length>2){
                    drawFill(screenFaces[i_face].verts, Tools.rgbToHex(screenFaces[i_face].color));
                }
                else if(screenFaces[i_face].verts.length===2){
                    drawLine(
                        screenFaces[i_face].verts[0].x, screenFaces[i_face].verts[0].y,
                        screenFaces[i_face].verts[1].x, screenFaces[i_face].verts[1].y,
                    'white')
                }
                else{
                    drawCircle(screenFaces[i_face].verts[0].x, screenFaces[i_face].verts[0].y,this.pointSize,'white');
                }
            }
        }

        // Draw Lines
        if(this.drawLines){
            for(let i_face=0;i_face < screenFaces.length;i_face++){
                for(let i_vert=0;i_vert < screenFaces[i_face].verts.length;i_vert++){
                    let nextVert = (i_vert === screenFaces[i_face].verts.length-1)?0:i_vert+1;
                    drawLine(
                        screenFaces[i_face].verts[i_vert].x, screenFaces[i_face].verts[i_vert].y,
                        screenFaces[i_face].verts[nextVert].x, screenFaces[i_face].verts[nextVert].y,
                    'white')
                }
            }        
        }

        // Draw verts
        if(this.drawVerts){
            for(let i_face=0;i_face < screenFaces.length;i_face++){
                for(let i_vert=0;i_vert < screenFaces[i_face].verts.length;i_vert++){
                    drawCircle(screenFaces[i_face].verts[i_vert].x, screenFaces[i_face].verts[i_vert].y,this.pointSize,'white');
                }
            }        
        }
    }
}