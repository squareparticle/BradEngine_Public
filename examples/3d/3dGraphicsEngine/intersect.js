class MainLevel extends LevelInterface {   

    setup(){
        this.ambientlight={r:100,g:100,b:100};
        this.scene = new WorldScene(this,{drawVerts:false,fillPolys:true,drawLines:false,ambientlight:this.ambientlight});
        this.scene.addLight({x:0,y:-300,z:-500},{r:250,g:250,b:250});
        this.gameController = new GameController(this);

        // let quad = new Quad({isTwoSided:true});
        // this.scene.addObject(quad);

        // var tri = [[5,5,5],[10,15,4],[15,5,3]];
        // var pt = [9,5,-5];
        // var dir = [0.1,0.1,0.8];

        this.polyToTest = new Triangle({isTwoSided:true});
        this.polyToTest.original.verts=[{x:5,y:5,z:100},{x:10,y:15,z:4},{x:15,y:5,z:3}];
        this.scene.addObject(this.polyToTest);

        this.vertToCollideWith = {x:9,y:5,z:-5};
        this.vertDirection = {x:0.1,y:0.1,z:0.8};
        this.length = 10;
        this.line = new Line();
        this.line.original.verts=[this.vertToCollideWith,
            {
                x: this.vertToCollideWith.x+(this.vertDirection.x*this.length),
                y: this.vertToCollideWith.y+(this.vertDirection.y*this.length),
                z: this.vertToCollideWith.z+(this.vertDirection.z*this.length)
            }
        ];
        this.scene.addObject(this.line);

        this.collision = new PolyCollsion();
        let hitVert = this.collision.getCollisionLoc(this.polyToTest.original.verts,this.vertToCollideWith,this.vertDirection,this.length);

        this.point = new Point();
        this.point.original.verts=[hitVert];
        //point.original.verts=[{x:10.121951219512194, y:6.121951219512195, z:3.97560975609756 }];
        this.scene.addObject(this.point);
        this.angle = 0;
    }

    getKeyboardInput(event){ 
        this.scene.getKeyboardControls(event);
        this.scene.getCamera().defaultCameraKeyboardControls(event); 
    }

    update(delta){
        this.scene.getCamera().runCameraControls(delta);
        drawBox(0,0,this.canvas.width, this.canvas.height, '#6cb1f6')

        let cicleEdge = Tools.getPointOnCircle(2,this.angle++);
        this.vertToCollideWith.x=cicleEdge.x+9;
        this.vertToCollideWith.y=cicleEdge.y+5;
        let hitVert = this.collision.getCollisionLoc(this.polyToTest.original.verts,this.vertToCollideWith,this.vertDirection,this.length);
        this.point.original.verts=[hitVert];
        this.line.original.verts=[this.vertToCollideWith,
            {
                x: this.vertToCollideWith.x+(this.vertDirection.x*this.length),
                y: this.vertToCollideWith.y+(this.vertDirection.y*this.length),
                z: this.vertToCollideWith.z+(this.vertDirection.z*this.length)
            }
        ];


        this.scene.render(delta);
    }
}