class MainLevel extends LevelInterface {   
    loadResources(){ this.findResources('3dGraphicsEngine',['images','meshes']); }

    setupHelpDialog(){
        const textParts= [`
            <span class="HelpHeader">Description</span><br>
                Voxel world demo used to teach my kids how to program
            `,`
            <span class="HelpHeader">Instructions</span><br>
              ${drawHelpKey('w')} Move Camera Forward <br>
              ${drawHelpKey('s')} Move Camera Back <br>
              ${drawHelpKey('a')} Turn Camera Left <br>
              ${drawHelpKey('d')} Turn Camera Right <br>
              ${drawHelpKey('Up Arrow')} Rotate Camera Up <br>
              ${drawHelpKey('Down Arrow')} Rotate Camera Up <br>
              ${drawHelpKey('5')} Change camera (Free, Top, Free 2, Third Person)<br>
              ${drawHelpKey(['4','8','6','2'])} Move left, up, right, down<br>
              ${drawHelpKey('p')} Point Mode<br>
              ${drawHelpKey('[')} Line Mode<br>
              ${drawHelpKey(']')} Colored Mode<br>
              ${drawHelpKey('\\')} Line + Colored Mode<br>
              <br><br>
            `];
        return {textParts, pause:false}
    }

    createMobs(){
        this.mobs = [];
        let mob = new Mob(this,
            new MorphingMesh({meshData:[
                this.loadedFiles['meshes/caveCritterWalk1.txt'],
                this.loadedFiles['meshes/caveCritterWalk2.txt']
            ]})
        );

        mob.voxelLoc = {x:20,y:0,z:20};
        this.mobs.push(mob);
        this.scene.addObject(mob.model);
        // this.addVoxelY = 2;

        this.mobs.forEach(mob=>mob.alignWithGound());
    }

    setup(){
        //localStorage.clear();
        this.ambientlight={r:100,g:100,b:100};
        this.scene = new WorldScene(this,{drawVerts:false,fillPolys:true,drawLines:false,ambientlight:this.ambientlight});
        this.scene.addLight({x:0,y:-300,z:-500},{r:250,g:250,b:250});

        this.scene.getCamera().pos={ x: -143.22536162781697, y: 146.33905633093167, z: 102.0508344527108};
        this.scene.getCamera().rot={ x: 33.39978515624998, y: 48.35400390624999, z: 0};

        this.scene.cameras.push(new Camera({
            pos:{x: 7.558175721798378, y: 200.11420462497546, z: -1.8879557687155781},
            norm:{x:0,y:0,z:1},
            rot:{x: 90.624775390625, y: -0.6890039062500106, z: 0}
        }));

        this.scene.cameras.push(new KBCamera({
            pos:{x: 43.35537518298458, y: 26.623204329308994, z: 52.35164606540376},
            norm:{x:0,y:0,z:1},
            rot:{x: 13.034033203124999, y: -40.24080078124999, z: 0}
        }));

        //this.scene.switchCamera(1);

        this.player = new Player(
            this,
            // new Cube()
            new MorphingMesh({meshData:[
                this.loadedFiles['meshes/caveCritterWalk1.txt'],
                this.loadedFiles['meshes/caveCritterWalk2.txt']
            ]})
        );
        this.player.voxelLoc = {x:0,y:0,z:0};

        this.scene.cameras.push(new FollowCamera({
            follow: this.player.model,
            pos:{x: 0, y: 0, z: 0},
            dist:{x: 0, y: -20, z: 20},
            norm:{x:0,y:0,z:1},
            rot:{x: 40, y: 0, z: 0}
        }));        


        this.cluster = new Cluster(this,this.player.voxelLoc);
        this.scene.addObjects(this.cluster.getObjects());
        this.gameController = new GameController(this);

        this.scene.addObject(this.player.model);
        this.createMobs();
        //this.player.model.pos.y=-0.5;
    }

    getKeyboardInput(event){ 
        this.gameController.getKeyboardControls(event);        
        //this.cluster.getKeyboardControls(event);
        //this.mobs[0].getKeyboardControls(event);
        this.player.getKeyboardControls(event);
        this.scene.getCamera().defaultCameraKeyboardControls(event); 
        this.scene.getKeyboardControls(event);
    }

    update(delta){
        this.scene.getCamera().runCameraControls(delta);
        drawBox(0,0,this.canvas.width, this.canvas.height, '#6cb1f6')
        this.scene.render(delta);
    }
}
