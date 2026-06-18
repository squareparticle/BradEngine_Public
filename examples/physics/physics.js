class MainLevel extends LevelInterface {
    loadResources(){this.findResources('physics',['src/sharedMedia/images/garage','src/sharedMedia/images/anim']);}
    setupHelpDialog(){
        const textParts= [`
            <span class="HelpHeader">Description</span><br>
                This application uses Box2D physics to simulate gravity and collision.<br>
                Human sprites (15 fps)<br>
                Butterfly sprite (5 fps)<br>
            `,`
            <span class="HelpHeader">Instructions</span><br>
                Use the mouse to drap the objects around the screen.<br>                
            `];
        return {textParts, pause:true}
    }
    setup(){

        let butterfly = new Sprite(this.canvas, {
            name:'butterfly', fps:5,
            image: 'butterfly-a.png',
            animations: {idle : {startFrame: 0, numFrames:4}},
            cells: {rows: 1, cols: 4}
        });

        let run = new Sprite(this.canvas, {
            name:'run', fps:15,
            image: 'run2.png',
            animations: {idle : {startFrame: 0, numFrames:4}},
            cells: {rows: 1, cols: 4}
        });

        this.physicsEngine = bradEngine.initPhysics();
        this.physicsEngine.addImages(this.images);
        this.physicsEngine.addBody({name:'ground',isVisible:false},'box', true, this.canvas.width / 2, this.canvas.height*.95,{width: this.canvas.width / 2, height: 10 / 2});

        for(var i = 0; i < 10; i++) {
            if(Math.random() > 0.5) {
                this.physicsEngine.addBody({name:'falling object '+i, image:'crate.png'}, 'box', false, Math.random() * 750, Math.random() * 300, { width: (Math.random() + 1.1)*30, height: (Math.random() + 1.1)*30});
            } else {
                this.physicsEngine.addBody({name:'falling object '+i, sprite:run}, 'circle', false, Math.random() * 750, Math.random() * 300, { radius: (Math.random() + 1.1)*30});
                //this.physicsEngine.addBody({name:'falling object '+i, image:'images/garage/tire.png'}, 'circle', false, Math.random() * 750, Math.random() * 300, { radius: (Math.random() + 1.1)*30});
            }
        }

        this.physicsEngine.addBody({name:'middlebox', sprite:butterfly},'circle', false, this.canvas.width/2 , this.canvas.height/2, {radius:50});
        //this.physicsEngine.addBody({name:'middlebox'},'box', true, this.canvas.width/2 , this.canvas.height/2, {width:50, height:50});
        this.physicsEngine.setupDebug();
        this.physicsEngine.dragNDrop();
        this.physicsEngine.click(function(body, fixture, point) {
            console.log(body.GetUserData().name);
        });

        // this.butterfly.position = {x:100,y:100};
        // this.butterfly.width = 100; this.butterfly.height = 100;
    }

    // physicsUpdate(){
    //     this.physicsEngine.calculateSimulation();
    // }

    update(delta){
        drawImageFrom00('background.jpg',0,0,this.canvas.width, this.canvas.height);

        //this.physicsEngine.drawDebug();
        this.physicsEngine.drawImmediateSimulation();
    }
}