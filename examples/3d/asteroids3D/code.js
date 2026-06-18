/*
    Clean up 
    - all layers should only take level as the parameter
    - Asteroids and pirate ships should be processes together (remove duplicate code)
    - all function params should take objects Example: setPosition(10,5,20) should be setPosition({x:10,y:5,z:20})
*/

class SkyBox{

    setMovement(direction){}

    setRotation(direction){
        this.scene.camera3D.rotateCamera = direction;
    }

    constructor(level, canvas, loadedMeshes, numStars){
        this.canvas = canvas;
        this.stars=[];
        this.numStars=numStars;
        this.starSize = 3;
        this.level = level;
        
        for(var i=0; i<numStars; i++){
            this.stars[i] = Tools3D.getRandomPostision({min:-500, max:500}, {min:-500, max:500}, {min:-500, max:500});
        }

        this.scene = new Scene();
        this.scene.camera3D.create({pos:{x:0,y:0,z:0},norm:{x:0,y:0,z:1}, rot:{x:0,y:0,z:0}});
        this.scene.ambientlight = {r:50,g:50,b:50};
        let lightPos = {x:-97,y:30,z:-50};
        this.scene.lights.push({pos:lightPos,norm:Tools3D.normalize(lightPos),col:{r:255,g:255,b:255}});

        this.planet = new MeshObject(loadedMeshes['meshes/sphere.x']);
        this.planet.scaleModel(10,10,10);      
        this.planet.pos = { x:0, y: 20, z:100 };
        this.planet.color = {r:255, g:0, b:0};
        this.scene.meshObjects.push(this.planet);

        this.planet2 = new MeshObject(loadedMeshes['meshes/sphere.x']);
        this.planet2.scaleModel(10,10,10);      
        this.planet2.pos = { x:0, y: 20, z:-100 };
        this.planet2.color = {r:0, g:255, b:0};
        this.scene.meshObjects.push(this.planet2);        
    }

    drawNebula(){
        drawBox(0,0,this.canvas.width, this.canvas.height, 'black');
        drawBox(0,(this.canvas.height/2)-100,this.canvas.width, 200, '#00001f');
        drawBox(0,(this.canvas.height/2)-50,this.canvas.width, 100, '#00002f');
    }

    draw(delta){
        this.scene.camera3D.runCameraControls(delta, this.camera.moveSpeed, this.camera.rotateSpeed);
        this.drawNebula();

        this.planet.rotation.y+=2*delta;

        let stars = this.camera.toCameraSpaceRotationOnly(this.stars);
        for(var i=0; i< stars.length; i++){
            var projectPoint = Tools.projectTo2D(stars[i].x, stars[i].y, stars[i].z, this.canvas.width, this.canvas.height);
            if(stars[i].z > 0)
                drawCircle(projectPoint.x, projectPoint.y, this.starSize, 'white');
        }
        this.scene.render(this.canvas);
    }
}

class Particles{

    setMovement(direction){}
    setRotation(direction){}

    constructor(level, canvas, numParticles){
        this.canvas = canvas;
        this.particles=[];
        this.floating=[];
        this.numParticles=numParticles;
        this.particleSize = 2;
        this.level = level;
        this.maxDistance = 500;

        this.lastTranslate = {x:0,y:0,z:0};
        this.lastRotate = {x:0,y:0,z:0};
        
        for(var i=0; i<numParticles; i++){ this.spawnParticle(i, {x:0,y:0,z:0}); }
    }

    spawnParticle(i, atPos){
        this.particles[i] = Tools3D.getRandomPostision(
            {min:-atPos.x-500, max:-atPos.x+500}, 
            {min:atPos.y+40, max:atPos.y-40}, 
            {min:-atPos.z-500, max:-atPos.z+500}
        );
        this.floating[i] = Tools3D.getRandomPostision(
            {min:-1, max:1}, {min:-1, max:1}, {min:-1, max:1}
        );        
    }

    draw(delta){
        let particles = this.camera.toCameraSpace(this.particles);
        for(let i=0; i< particles.length; i++){
            // move the particles in a floarting pattern
            this.particles[i].x = (this.floating[i].x*delta)+this.particles[i].x;
            this.particles[i].y = (this.floating[i].y*delta)+this.particles[i].y;
            this.particles[i].z = (this.floating[i].z*delta)+this.particles[i].z;
            
            let projectPoint = Tools.projectTo2D(particles[i].x, particles[i].y, particles[i].z, this.canvas.width, this.canvas.height);
            let distance = Tools2D.distanceBetweenVerts({x:-this.camera.getCamera().pos.x,y:-this.camera.getCamera().pos.z}, {x:this.particles[i].x, y:this.particles[i].z});
            var col = Math.round(255*(distance/this.maxDistance));
            var color = 'rgb('+(255-col)+', '+(255-col)+', '+(255-col)+')';
            if(particles[i].z > 0)
                drawCircle(projectPoint.x, projectPoint.y, this.particleSize, color);
            if(distance > this.maxDistance)
                this.spawnParticle(i, this.camera.getCamera().pos);
        }
    }
}

class Laser{
    constructor(level, camera, offset){
        this.direction = {x:0,y:0,z:1};
        this.speed = 20;

        this.color = 'rgb('+(255)+', '+(0)+', '+(0)+')';
        this.level = level;
        this.camera = camera;
        let intCamera = this.camera.internal.camera;

        this.direction = Pipeline3D.rotate(intCamera.rot.x+180,intCamera.rot.y+180,intCamera.rot.z+180, [{x:0,y:0,z:1}])[0];
        this.gunPosition = Pipeline3D.rotate(intCamera.rot.x+180,intCamera.rot.y+180,intCamera.rot.z+180, [offset])[0];
        this.pos = {x:-intCamera.pos.x+this.gunPosition.x,y:-intCamera.pos.y+this.gunPosition.y,z:-intCamera.pos.z+this.gunPosition.z}

        this.size = 1;
        this.line = [
            this.pos, Tools3D.addVectors(this.pos, {x:this.direction.x*this.size,y:this.direction.y*this.size,z:this.direction.z*this.size})
        ]
    }

    draw(delta){

        this.line.forEach(line=>{
            line.x+=this.direction.x*this.speed*delta;
            line.y+=this.direction.y*this.speed*delta;
            line.z+=this.direction.z*this.speed*delta;
        })
        let laser = this.camera.toCameraSpace(this.line);
        let startPoint = Tools.projectTo2D(laser[0].x, laser[0].y, laser[0].z, this.level.canvas.width, this.level.canvas.height);
        let endPoint = Tools.projectTo2D(laser[1].x, laser[1].y, laser[1].z, this.level.canvas.width, this.level.canvas.height);
        if(laser[0].z > 0 && laser[1].z > 0)
            drawLine(startPoint.x, startPoint.y, endPoint.x, endPoint.y, this.color, {lineWidth:4});
    }
}

class OuterSpace{
    setMovement(direction){
        this.scene.camera3D.moveCameraType = direction;
    }

    setRotation(direction){
        this.scene.camera3D.rotateCamera = direction;
    }

    constructor(level, scene){
        this.canvas = canvas;
        this.scene = scene;
        this.level = level;

        this.weaponsFire=[];
    }

    createScene(){
        this.scene = new Scene();
        this.scene.renderType="Solid";
        this.scene.camera3D.create({pos:{x:0,y:0,z:0},norm:{x:0,y:0,z:1}, rot:{x:0,y:0,z:0}});
        this.scene.ambientlight = {r:150,g:150,b:150};
        let lightPos = {x:-97,y:30,z:-50};
        this.scene.lights.push({pos:lightPos,norm:Tools3D.normalize(lightPos),col:{r:255,g:255,b:255}});        
        return this.scene;
    }

    fireLaser(){
        this.weaponsFire.push(new Laser(this.level,this.camera,{x:0.5,y:.5,z:1}));
        this.weaponsFire.push(new Laser(this.level,this.camera,{x:-0.5,y:.5,z:1}));
    }

    draw(delta){
        this.level.gameController.asteroids.forEach(asteroid=>asteroid.update(delta))
        this.level.gameController.enemies.forEach(enemy=>enemy.update(delta))
        this.scene.camera3D.runCameraControls(delta, this.camera.moveSpeed, this.camera.rotateSpeed);
        this.scene.render(this.canvas);
        this.weaponsFire.forEach(w=>w.draw(delta));
    }
}

class Cockpit{
    constructor(level){
        this.level = level;
        this.canvas = level.canvas;
        this.images = level.images;
        this.sweepAngle=0;
        this.fireAlpha = 0;
        this.lights=['lights_0.png','lights_1.png','lights_2.png']
        this.currentLight = 0;
        this.lightsDelay = 1000;
        this.currentTime =  Tools.getMilliseconds();
        this.lastTime = Tools.getMilliseconds();
        this.sheildEffectStrength = .2;
        this.isTakingDamaged = false;
    }

    draw(delta){
        if(this.isTakingDamaged){
            this.fireAlpha +=3*delta;
            this.canvas.ctx.globalAlpha = (Math.sin(this.fireAlpha) + 1)*this.sheildEffectStrength; 
            drawImageFrom00('onfire.png',0,0,this.canvas.width, this.canvas.height);
            this.canvas.ctx.globalAlpha = 1;
        }

        this.currentTime =  Tools.getMilliseconds();
        if(this.currentTime > this.lastTime+this.lightsDelay){
            this.lastTime = Tools.getMilliseconds();
            this.currentLight++;
            if(this.currentLight > 2)
                this.currentLight=0;
        }

        drawImageFrom00('console.png',0,this.canvas.height-this.images['console.png'].height,this.images['console.png'].width, this.images['console.png'].height);
        drawImageFrom00(
            this.lights[this.currentLight],
            this.canvas.width/2-this.images[this.lights[this.currentLight]].width/2,0,
            this.images[this.lights[this.currentLight]].width, 
            this.images[this.lights[this.currentLight]].height);
        drawImage('reticle.png',this.canvas.width/2,this.canvas.height/2,this.images['reticle.png'].width/2, this.images['reticle.png'].height/2);
        drawImage('shipicon.png',150,200,this.images['shipicon.png'].width/2, this.images['shipicon.png'].height/2);
        drawImage('radar.png',this.canvas.width-150,200,this.images['radar.png'].width/2, this.images['radar.png'].height/2);
        this.sweepAngle+=40*delta;
        drawImage('sweep.png',this.canvas.width-150,200,this.images['radar.png'].width/2, this.images['radar.png'].height/2, this.sweepAngle);
    }
}

class Computer{
    constructor(level, canvas){
        this.canvas = canvas;
        this.level = level;
        this.rotateSpeed = 5;

        let canvasDoc = createBufferedImage(400,175);
        this.bufferedImage = new Canvas(canvasDoc);
        this.bufferedImage.canvas = canvasDoc;

        this.scene = new Scene();
        this.scene.camera3D.create({pos:{x:0,y:0,z:0},norm:{x:0,y:0,z:1}, rot:{x:0,y:0,z:0}});
        this.scene.ambientlight = {r:50,g:50,b:50};
        let lightPos = {x:-97,y:30,z:-50};
        this.scene.lights.push({pos:lightPos,norm:Tools3D.normalize(lightPos),col:{r:255,g:255,b:255}});

        this.enemy = new Enemy(this.level, this.scene);
        this.enemy.setColor({r:0,g:255,b:0});
        this.scene.renderType="Wire";
        this.currentTime =  Tools.getMilliseconds();
        this.lastTime = Tools.getMilliseconds();    
        this.flashDelay =500;
        this.flashOn = false;
        this.isDamaged = false;
    }

    draw(delta){
        this.enemy.setRotation(0,this.rotateSpeed*delta,0);

        if(this.isDamaged){ // flash when damaged
            this.currentTime =  Tools.getMilliseconds();
            if(this.currentTime > this.lastTime+this.flashDelay){
                this.lastTime = Tools.getMilliseconds();
                this.flashOn = !this.flashOn;
                if(this.flashOn) 
                    this.enemy.setColorPart('meshes/wings.obj',{r:255,g:0,b:0});
                else
                    this.enemy.setColorPart('meshes/wings.obj',{r:0,g:255,b:0});
            }        
        }

        // double buffer
        let cachedCanvas = this.level.canvas;
        canvas = this.bufferedImage;
        canvas.ctx.clearRect(0,0,canvas.width, canvas.height);
        this.scene.render(this.bufferedImage);
        canvas = cachedCanvas; // return to screen rendering

        this.level.images['computer'] = this.bufferedImage.canvas;
        drawImageFrom00('computer',300,575,400,175);
    }
}

class MiniMap{
    constructor(level){
        this.level = level;
        this.center = {x:level.canvas.width-150, y:200};
    }

    draw(delta){
        let camera = this.level.camera.internal.camera;
        //let direction = Pipeline3D.rotate(intCamera.rot.x+180,intCamera.rot.y+180,intCamera.rot.z+180, [{x:0,y:0,z:1}])[0];

        this.level.gameController.asteroids.forEach(asteroid=>{
            let pos = {
                x: -asteroid.mesh.pos.x - this.level.camera.getCamera().pos.x,
                y: 0,
                z: -asteroid.mesh.pos.z - this.level.camera.getCamera().pos.z,
            }
            pos = Pipeline3D.rotate(camera.rot.x,camera.rot.y,camera.rot.z, [pos])[0];
            let length = Math.sqrt( Math.abs((pos.x*pos.x) + (pos.z*pos.z)));
            if(length < 120)
                drawCircle(this.center.x-pos.x, this.center.y+pos.z, 5, 'cyan');
        });
        this.level.gameController.enemies.forEach(enemy=>{
            let pos = {
                x: -enemy.pos.x - this.level.camera.getCamera().pos.x,
                y:0,
                z: -enemy.pos.z - this.level.camera.getCamera().pos.z,
            }
            pos = Pipeline3D.rotate(camera.rot.x,camera.rot.y,camera.rot.z, [pos])[0];
            let length = Math.sqrt( Math.abs((pos.x*pos.x) + (pos.z*pos.z)));
            if(length < 120)
                drawCircle(this.center.x-pos.x, this.center.y+pos.z, 5, 'red');
        });

    }
}

class Camera {
    constructor(layers, moveSpeed, rotateSpeed){
        this.internal = new Camera3D();
        this.internal.create({pos:{x:0,y:0,z:0},norm:{x:0,y:0,z:1}, rot:{x:0,y:0,z:0}});
        this.moveSpeed = moveSpeed;
        this.rotateSpeed = rotateSpeed;
        this.layers = layers;
        this.layers.forEach(l=>l.camera=this);
    }

    setMovement(direction){
        for(let i=0; i<this.layers.length; i++){
            this.layers[i].setMovement(direction);
            this.internal.setMovement(direction);
        }
    }

    setRotation(direction){
        for(let i=0; i<this.layers.length; i++){
            this.layers[i].setRotation(direction);
            this.internal.setRotation(direction);
        }
    }

    controls(event){
        if(event.type=="down"){
            if(event.key==="w") this.setMovement(MoveCamera.FORWARD);           
            if(event.key==="s") this.setMovement(MoveCamera.BACK);            
            if(event.key==="a") this.setRotation(MoveCamera.YAXIS_LEFT);            
            if(event.key==="d") this.setRotation(MoveCamera.YAXIS_RIGHT);            
            if(event.key==="ArrowDown") this.setRotation(MoveCamera.XAXIS_DOWN);
            if(event.key==="ArrowUp") this.setRotation(MoveCamera.XAXIS_UP);
        }
        if(event.type=="up"){
            if(event.key==="w" || event.key==="s")
                this.setMovement(MoveCamera.NONE);
            
            if(event.key==="a" || event.key==="d" || event.key==="ArrowDown" || event.key==="ArrowUp")
                this.setRotation(MoveCamera.NONE);
        }
    }

    update(delta){
        this.internal.runCameraControls(delta, this.moveSpeed, this.rotateSpeed);
    }

    getCamera(){ return this.internal.camera; }

    toCameraSpaceRotationOnly(verts){
        let cloneVerts = [];
        verts.forEach(vert=>{
            cloneVerts.push({
                x: vert.x,
                y: vert.y,
                z: vert.z
            });
        });
        Pipeline3D.rotate(0, this.internal.camera.rot.y, 0, cloneVerts);
        Pipeline3D.rotate(this.internal.camera.rot.x, 0, 0, cloneVerts);
        return cloneVerts;
    }

    toCameraSpace(verts){
        let cloneVerts = [];
        verts.forEach(vert=>{
            cloneVerts.push({
                x: vert.x + this.internal.camera.pos.x,
                y: vert.y + this.internal.camera.pos.y,
                z: vert.z + this.internal.camera.pos.z
            });
        });
        Pipeline3D.rotate(0, this.internal.camera.rot.y, 0, cloneVerts);
        Pipeline3D.rotate(this.internal.camera.rot.x, 0, 0, cloneVerts);
        return cloneVerts;
    }
}

class Asteroid{
    constructor(level, scene){
        this.mesh = new MeshObject(level.loadedMeshes['meshes/asteroid.obj']);
        this.mesh.color = {r:255,g:255,b:255};
        this.mesh.pos={x:0,y:0,z:0};
        this.mesh.rotation ={x:0,y:0,z: 0};
        this.rotateSpeed = Tools.getNumberBetween(5,20);
        this.rotateAxis = Tools.getRandomObject(['x','y','z']);
        scene.meshObjects.push(this.mesh);

        this.floating = Tools3D.getRandomPostision(
            {min:-1, max:1}, {min:0, max:0}, {min:-1, max:1}
        );   
    }

    setPosition(pos){
        this.mesh.pos.x = pos.x;
        this.mesh.pos.y = pos.y;
        this.mesh.pos.z = pos.z;
    }

    setRotation(rot){
        this.mesh.rotation.x+=rot.x;
        this.mesh.rotation.y+=rot.y;
        this.mesh.rotation.z+=rot.z;
    }
    setColor(col){
        this.mesh.color=col;
    }

    update(delta){
        this.mesh.rotation[this.rotateAxis]+=this.rotateSpeed*delta;
        // float the asteroid
        this.mesh.pos.x = (this.floating.x*delta)+this.mesh.pos.x;
        this.mesh.pos.y = (this.floating.y*delta)+this.mesh.pos.y;
        this.mesh.pos.z = (this.floating.z*delta)+this.mesh.pos.z;
    }
}

class Enemy{
    constructor(level, scene){
        this.pos = {x:0,y:0,z:25};
        this.rotation = {x:0,y:0,z: 0};
        this.model = Pipeline3D.buildMeshObject(level, scene, this.pos, this.rotation, 
            [
                {path:'meshes/cone.obj', color:{r:20,g:20,b:20}},
                {path:'meshes/window.obj', color:{r:20,g:20,b:20}},
                {path:'meshes/hull.obj', color:{r:200,g:200,b:200}},
                {path:'meshes/wings.obj', color:{r:155,g:0,b:0}},
                {path:'meshes/engines.obj', color:{r:100,g:100,b:100}},
                {path:'meshes/fire.obj', color:{r:255,g:255,b:0}}
            ]            
        )
    }
    setRotation(x,y,z){
        this.model.forEach(part=>{
            part.rotation.x+=x;
            part.rotation.y+=y;
            part.rotation.z+=z;
        });
    }
    setColorPart(partName, col){
        let index = this.model.findIndex(part=>part.path===partName);
        this.model[index].color = col;
    }
    setColor(col){
        this.model.forEach(part=>{
            part.color=col;
        });
    }
    setPosition(x,y,z){
        this.model.forEach(part=>{
            part.pos.x=x;
            part.pos.y=y;
            part.pos.z=z;
        });
    }
    update(delta){}
}

class GameController{
    constructor(level){
        this.level = level;
        this.enemies = [];
        this.asteroids = [];
        this.collisionDistance = 4;
    }

    createOuterSpaceScene(outerSpace){
        this.outerSpaceScene = outerSpace.createScene();

        this.enemy = new Enemy(this.level, this.outerSpaceScene);
        this.enemy.setPosition(-10,0,100);
        this.enemies.push(this.enemy);

        for(let i=0; i<20; i++){
            this.asteroid = new Asteroid(this.level, this.outerSpaceScene);

            let randGrey = Tools.getNumberBetween(0,127);
            this.asteroid.setColor({r:randGrey,g:randGrey,b:randGrey});
            if(i%3==0) // make every third one brown
                this.asteroid.setColor({r:150,g:75,b:0});

            let location = Tools.getPointOnCircle(Tools.getNumberBetween(40,60),Tools.getNumberBetween(0,360));

            this.asteroid.setPosition({x:location.x,y: Tools.getNumberBetween(-2,2) ,z:location.y});
            this.asteroids.push(this.asteroid);
        }
    }

    update(delta){
        // check for collisions with enemy
        this.enemies.forEach(enemy=>{
            let camera = this.level.camera.internal.camera;
            let distance = Tools2D.distanceBetweenVerts({x:-camera.pos.x,y:-camera.pos.z}, {x:enemy.pos.x, y:enemy.pos.z});
            if(distance < this.collisionDistance){
                this.level.computer.isDamaged = true;
                this.level.cockpit.isTakingDamaged = true;
            }
        });
    }
}

class MainLevel extends LevelInterface {
    setupHelpDialog(){
        const textParts= [`
            <span class="HelpHeader">Description</span><br>
            3D astroids game. Fly into the enemy ship to see hit damage <br>
            `,`
            <span class="HelpHeader">Instructions</span><br>
              ${drawHelpKey('w')} Move Camera Forward <br>
              ${drawHelpKey('s')} Move Camera Back <br>
              ${drawHelpKey('a')} Turn Camera Left <br>
              ${drawHelpKey('d')} Turn Camera Right <br>
              ${drawHelpKey('Up Arrow')} Rotate Camera Up (Don't use)<br>
              ${drawHelpKey('Down Arrow')} Rotate Camera Down (Don't use)<br>
              ${drawHelpKey('Space')} Fire weapons <br>
              <br><br>
            `];
        return {textParts, pause:false}
    } 

    loadResources(){ this.findResources('asteroids3D',['meshes','images']); }

    setup(){
        this.gameController=new GameController(this);
        this.skyBox = new SkyBox(this,canvas, this.loadedMeshes, 500);
        this.particles = new Particles(this,canvas, 500);
        this.outerSpace = new OuterSpace(this,canvas, this.gameController.outerSpaceScene);
        this.cockpit = new Cockpit(this);
        this.computer = new Computer(this, canvas);
        this.miniMap = new MiniMap(this);
        this.camera = new Camera([this.skyBox, this.particles,this.outerSpace], 40, 40);

        this.gameController.createOuterSpaceScene(this.outerSpace);
    }

    getKeyboardInput(event){ 
        this.camera.controls(event);
        if(event.type==='down' && event.key ===' '){
            this.outerSpace.fireLaser();
        }
    }

    update(delta){
        this.gameController.update(delta);
        this.camera.update(delta);
        this.skyBox.draw(delta);
        this.particles.draw(delta);
        this.outerSpace.draw(delta);
        this.cockpit.draw(delta);        
        this.computer.draw(delta);
        this.miniMap.draw(delta);
    }
}

// let msg = `${this.scene.camera3D.camera.pos.x},${this.scene.camera3D.camera.pos.y},${this.scene.camera3D.camera.pos.z}`
// this.level.addScreenLog(msg, 'green');
