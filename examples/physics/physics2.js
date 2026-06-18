class MainLevel extends LevelInterface {
    loadResources(){this.findResources('physics',['src/sharedMedia/images/garage','src/sharedMedia/images/anim']);}
    setupHelpDialog(){
        const textParts= [`
            <span class="HelpHeader">Description</span><br>
                This application uses Box2D physics to simulate gravity and collision.<br>
            `,`
            <span class="HelpHeader">Instructions</span><br>
                Use the mouse to drap the objects around the screen.<br>                
            `];
        return {textParts, pause:true}
    }
    setup(){

        this.physicsEngine = bradEngine.initPhysics();
        this.physicsEngine.addImages(this.images);
        this.physicsEngine.addBody({name:'ground',isVisible:false},'box', true, this.canvas.width / 2, this.canvas.height*.95,{width: this.canvas.width / 2, height: 10 / 2});

        for(var i = 0; i < 100; i++) {
            if(Math.random() > 0.5) {
                this.physicsEngine.addBody({name:'falling object '+i, image:'crate.png'}, 'box', false, Math.random() * 750, Math.random() * 300, { width: (Math.random() + 1.1)*30, height: (Math.random() + 1.1)*30});
            } else {
                this.physicsEngine.addBody({name:'falling object '+i, image:'tire.png'}, 'circle', false, Math.random() * 750, Math.random() * 300, { radius: (Math.random() + 1.1)*30});
            }
        }

        this.physicsEngine.setupDebug();
        this.physicsEngine.dragNDrop();
        this.physicsEngine.click(function(body, fixture, point) {
            console.log(body.GetUserData().name);
        });
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