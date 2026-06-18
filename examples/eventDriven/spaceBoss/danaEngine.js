function getAngle(vector){
    let angle = Math.atan2(vector.y, vector.x);   //radians
    // you need to devide by PI, and MULTIPLY by 180:
    let degrees = 180*angle/Math.PI;  //degrees
    return (360+Math.round(degrees))%360; //round number, avoid decimal fragments
}

class DanaObject {
    constructor(level, params){
        this.id='';
        this.streamables = [
            {var:'bounds2D',as:'b'},
            {var:'angle',as:'a'},
            {var:'image',as:'i'},
            {var:'alpha',as:'t'}
            // {objects:'firedBullets', streamables:[
            //     {var:'bounds2D',as:'b'},
            //     {var:'angle',as:'a'},    
            //     {var:'image',as:'i'},
            //     {var:'alpha',as:'t'}
            // ]}
        ];
        this.childern = []; 
        this.childMap = {};       
        this.name = ""; this.tags = [];
        this.isEnabled = true; this.isVisible = true;
        this.isDead = false;
        this.collidable = false;
        if(level) this.level = level;
        if(params) this.override(params)
    }

    override(params){
        Tools.overideObject(this,params);
    }

    addChild(name, child){
        if(!this.childern) this.childern = [];
        if(!this.childMap) this.childMap = {};

        this.childern.push(child);
        this.childMap[name]=child;

        let layer = 'Main';
        if(child.layer) layer = child.layer;
        if(isFunction(this.level.addLayerEntity))
            this.level.addLayerEntity(child,layer)
        else
            if(isFunction(level.addEntity))
                this.level.addEntity(child)
    }

    addComponent(name, component){
        if(!this.components) this.components = [];
        if(!this.componentMap) this.componentMap = {};

        this.components.push(component);
        this.componentMap[name]=component;
    }

    addPaintComponent(name, component){
        if(!this.paintComponents) this.paintComponents = [];
        if(!this.paintComponentMap) this.paintComponentMap = {};

        this.paintComponents.push(component);
        this.paintComponentMap[name]=component;
    }    

    buildFromScript(params){
        this.override(params);
    }

    killAll(){
        this.isDead = true;
        for(let i=0; i<this.childern.length; i++){
            this.childern[i].isDead = true;
            this.childern[i].killAll();
        }
    }

    initChildren(parent,level,layer,loadChildren){
        for(let i=0; i<loadChildren.length; i++){
            let params = {};
            if(loadChildren[i].initParams)
                params = loadChildren[i].initParams;
            params.root = parent;
            let child = eval(`new ${loadChildren[i].classType}(level,params)`);
            parent.addChild(loadChildren[i].name || params.name || `${loadChildren[i].classType}${i}`,child);
            if('attachChildren' in child){
                this.initChildren(child, level, layer, child['attachChildren']);
            }
        }
    }

    createClone(level, layer){
        let cloneParams = Tools.cloneObject(this);
        let clone = eval(`new ${this.constructor.name}(level, cloneParams)`);

        if('initComponents' in clone){
            let loadComponents = clone['initComponents'];
            for(let i=0; i<loadComponents.length; i++){
                let component = eval(`new ${loadComponents[i].classType}(clone)`);
                if(loadComponents[i].initParams)
                    component.change(loadComponents[i].initParams);
                clone.addComponent([loadComponents[i].classType], component);
            }
        }
        if('initPaintComponents' in clone){
            let loadComponents = clone['initPaintComponents'];
            for(let i=0; i<loadComponents.length; i++){
                let component = eval(`new ${loadComponents[i].classType}(clone)`);
                if(loadComponents[i].initParams)
                    component.change(loadComponents[i].initParams);
                clone.addPaintComponent([loadComponents[i].classType], component);
            }
        }

        if('attachChildren' in clone){
            this.initChildren(clone, level, layer, clone['attachChildren']);
        }
       
        if(isFunction(level.addLayerEntity) && layer)
            level.addLayerEntity(clone,layer)
        else
            if(isFunction(level.addEntity))
                level.addEntity(clone)

        return clone;
    }

    getKeyboardInput(event){
        this.components.forEach(component=>{
            if(isFunction(component.getKeyboardInput)) 
                component.getKeyboardInput(event);
        })
    }

    update(delta){
        this.components.forEach(component=>{
            if(isFunction(component.update)) 
                component.update(delta);
        })
        this.childern.forEach(child=>{
            this.uodateChildren(child,delta)
        })
    }

    uodateChildren(parent, delta){
        parent.components.forEach(component=>{
            if(isFunction(component.update)) 
                component.update(delta);
        })
        this.childern.forEach(child=>{
            parent.uodateChildren(child,delta)
        })
    }    

    paint(delta){
        this.paintComponents.forEach(component=>{
            if(isFunction(component.update)) 
                component.update(delta);
        })
    }   
    /*
    hitChildren(parent, damage){
        parent.components.forEach(comp => {
            if(isFunction(comp.hit))
                comp.hit(damage);            
        });
        for(let c=0; c < parent.childern.length; c++){
            this.hitChildren(parent.childern[i], damage);
        }
    }

    hit(damage){
        this.hitChildren(this,damage);
        // this.components.forEach(comp => {
        //     if(isFunction(comp.hit))
        //         comp.hit(damage);            
        // });
    }       
    */
    hit(damage){
        if(!this.collidable) return;
        if(this.isEnabled === false || this.isVisible === false || this.vulnerable === false) return;
        this.components.forEach(comp => {
            if(isFunction(comp.hit))
                comp.hit(damage);            
        });
    }    
}

class ChildComponent{
    constructor(parentObject, params={}){
        this.parent = parentObject;
        this.change(params)
    }

    change(params){
        Tools.overideObject(this.parent, params);

        let sharedParams={
            root:null,
            speed:0,
            localAngle:0,
            // parentAnchor:{dist:0,angle:0,x:0,y:0},
            anchor:{dist:0,angle:0,x:0,y:0}
        }
        Tools.mergeWithObject(this.parent, sharedParams);
    }

    update(delta){
        if(this.parent.root){
            //this.parent.localAngle++;
            var orbit = Tools.getPointOnCircle(this.parent.anchor.dist, (this.parent.anchor.angle+=this.parent.speed*delta));
//            drawCircle(this.center.x+orbitPoint.x, this.center.y+orbitPoint.y, planet.size, planet.color);

            this.parent.position.x = this.parent.root.position.x + orbit.x;
            this.parent.position.y = this.parent.root.position.y + orbit.y;
            this.parent.angle = this.parent.localAngle+this.parent.root.angle;

    
            // this.parent.position.x = this.parent.root.position.x + this.parent.anchor.x;
            // this.parent.position.y = this.parent.root.position.y + this.parent.anchor.x;
        }
    }
}

class MoveForwardComponent{
    constructor(parentObject, params={}){
        this.parent = parentObject;
        this.change(params)
    }

    change(params){
        Tools.overideObject(this.parent, params);
        if(!this.parent.level) return;

        let sharedParams={
            position:{x:0,y:0},
            moveDirection:{x:0,y:0},
            speed:0
        }
        Tools.mergeWithObject(this.parent, sharedParams);
    }

    update(delta){
        this.parent.position.x += this.parent.moveDirection.x * this.parent.speed * delta;
        this.parent.position.y += this.parent.moveDirection.y * this.parent.speed * delta;
    }
}

class ImageComponent{
    constructor(parentObject, params={}){
        this.parent = parentObject;
        this.change(params);
    }

    change(params){
        Tools.overideObject(this.parent, params);
        if(!this.parent.level) return;

        let sharedParams={
            image:'missing',
            position:{x:0, y:0},
            size:{w:0, h:0},
            angle:0,
            alpha:1
        }        
        Tools.mergeWithObject(this.parent, sharedParams);

        if(this.parent.image!=="missing")
            this.parent.size = { w: this.parent.level.images[this.parent.image].width/2, h: this.parent.level.images[this.parent.image].height/2}
    }
}

class Image3DComponent extends ImageComponent{
    constructor(parentObject, params={}){
        super(parentObject, params);
    }

    change(params){
        super.change(params);
        if(!this.parent.level) return;

        let sharedParams={
            camera:{x:0, y:0, z:1000}
        }
        Tools.mergeWithObject(this.parent, sharedParams);
    }
}

class Image3DSpriteComponent extends Image3DComponent{
    constructor(parentObject, params={}){
        super(parentObject, params);
    }

    change(params){
        super.change(params);
        if(!this.parent.level) return;

        let sharedParams={
            name:'sprite',
            fps:20,
            animationMap: {idle : {startFrame: 0, numFrames:6}},
            cells: {rows: 1, cols: 6}
        }
        Tools.mergeWithObject(this.parent, sharedParams);

        let sprite = new Sprite(this.parent.level.canvas, {
            name:this.parent.image, 
            fps:this.parent.fps,
            image: this.parent.image,
            animations: this.parent.animationMap,
            cells: this.parent.cells
        });
        this.parent.sprite = sprite;
    }
}

class PaintImageComponent{
    constructor(parentObject, params={}){
        this.parent = parentObject;
        this.change(params);
    }

    change(params){}

    update(delta){
        if(this.parent.isVisible === false) return;

        if(this.parent.alpha <1)
            this.parent.level.canvas.ctx.globalAlpha = this.parent.alpha;

        this.parent.bounds2D = drawImage(this.parent.image, this.parent.position.x, this.parent.position.y, this.parent.size.w, this.parent.size.h,this.parent.angle);
        
        this.parent.level.canvas.ctx.globalAlpha = 1;
    }
}

class PaintImage3DComponent extends PaintImageComponent{
    constructor(parentObject, params={}){
        super(parentObject,params);
    }

    change(params){}

    update(delta){
        if(this.parent.isVisible === false) return;

        if(this.parent.alpha <1)
            this.parent.level.canvas.ctx.globalAlpha = this.parent.alpha;
        this.parent.bounds2D = drawImage3D(this.parent.image, this.parent.position.x, this.parent.position.y, this.parent.level.camera.z, this.parent.size.w, this.parent.size.h,this.parent.angle);
        this.parent.level.canvas.ctx.globalAlpha = 1;
    }
}

class PaintImage3DSpriteComponent extends PaintImageComponent{
    constructor(parentObject, params={}){
        super(parentObject,params);
    }

    change(params){}

    update(delta){
        if(this.parent.isVisible === false) return;

        if(this.parent.alpha <1)
            this.parent.level.canvas.ctx.globalAlpha = this.parent.alpha;

        this.parent.bounds2D = drawSprite3D(this.parent.sprite.name, 
            (this.parent.sprite.currentAnimation.currentFrame * this.parent.sprite.frameSize.width), 0, this.parent.sprite.frameSize.width, this.parent.sprite.frameSize.height,
            this.parent.position.x,this.parent.position.y, this.parent.level.camera.z, this.parent.size.w, this.parent.size.h,this.parent.angle);

        // this.parent.bounds2D = drawImage3D(this.parent.image, this.parent.position.x, this.parent.position.y, this.parent.level.camera.z, this.parent.size.w, this.parent.size.h,this.parent.angle);
        this.parent.level.canvas.ctx.globalAlpha = 1;

        this.parent.sprite.calcNextFrame();
    }
}

class KeyboardMoveComponent {
    constructor(parentObject, params={}){
        this.parent = parentObject;

        if(!this.parent.level){
            console.log('WeaponContriller requiers level');
        }        
        if(!this.parent.size){
            console.log('WeaponContriller requiers size');
        }        
        if(!this.parent.speed){
            console.log('WeaponContriller requiers speed');
        }   
        if(!isFunction(this.parent.fireBullet)){
            console.log('WeaponContriller requiers function fireBullet');
        }               

        this.change(params);
    }

    change(params){
        Tools.overideObject(this.parent, params);
        if(!this.parent.level) return;

        let sharedParams={
            moveDirection:{x:0,y:0},
            kbControls: [
                {moveKey:"ArrowRight", axis:'x', speed: this.parent.speed},
                {moveKey:"ArrowLeft", axis:'x', speed: -this.parent.speed},
                {moveKey:"ArrowUp", axis:'y', speed: -this.parent.speed},
                {moveKey:"ArrowDown", axis:'y', speed: this.parent.speed},
                {actionKey:" ", method:this.fireBullet}
            ],
            kbRules: [
                {axis:'x', dir: 1, bounds: this.parent.level.canvas.width-this.parent.size.w/2},
                {axis:'x', dir:-1, bounds: this.parent.size.w/2},
                {axis:'y', dir: 1, bounds: this.parent.level.canvas.height-this.parent.size.h/2},
                {axis:'y', dir:-1, bounds: this.parent.size.h/2},
            ]
        }        
        Tools.mergeWithObject(this.parent, sharedParams);
    }        

    getKeyboardInput(event){
        for(let i=0; i< this.parent.kbControls.length; i++){
            if(this.parent.kbControls[i].moveKey && this.parent.kbControls[i].moveKey === event.key)  // check if the key pressed is a move key
                this.parent.moveDirection[this.parent.kbControls[i].axis] = (event.type==="down") ? this.parent.kbControls[i].speed : 0; // change the speed of the moveDirection[axis] or set it to 0 on key up
            if(this.parent.kbControls[i].actionKey && this.parent.kbControls[i].actionKey === event.key) // check if the key pressed is a action key the run its method
                this.parent.kbControls[i].method(this.parent, event.type);
        }
    }
    
    update(delta){
        // move the player but keep them within bounds.
        for(let i=0; i< this.parent.kbRules.length; i++){
            if( this.parent.moveDirection[this.parent.kbRules[i].axis] !== 0 && // make sure the input axis for the moveRules is actually moving 
                Math.sign(this.parent.moveDirection[this.parent.kbRules[i].axis]) === Math.sign(this.parent.kbRules[i].dir) && // input axis is moving in the same direction as the rule axis
                (this.parent.kbRules[i].dir > 0 && (this.parent.moveDirection[this.parent.kbRules[i].axis] * delta) + this.parent.bounds2D[this.parent.kbRules[i].axis] < (this.parent.kbRules[i].bounds) || // check positive direction bounds rule
                (this.parent.kbRules[i].dir < 0 && (this.parent.moveDirection[this.parent.kbRules[i].axis] * delta) + this.parent.bounds2D[this.parent.kbRules[i].axis] > (this.parent.kbRules[i].bounds))) // check negative direction bounds rule
            )
                this.parent.position[this.parent.kbRules[i].axis] += this.parent.moveDirection[this.parent.kbRules[i].axis] * delta; // add the axis's move position 
        }
    }    
}

class KeyboardMoveForwardComponent {
    constructor(parentObject, params={}){
        this.parent = parentObject;

        if(!this.parent.level){
            console.log('WeaponContriller requiers level');
        }        
        if(!this.parent.size){
            console.log('WeaponContriller requiers size');
        }        
        if(!this.parent.speed){
            console.log('WeaponContriller requiers speed');
        }   
        if(!isFunction(this.parent.fireBullet)){
            console.log('WeaponContriller requiers function fireBullet');
        }               

        this.change(params);
    }

    change(params){
        Tools.overideObject(this.parent, params);
        if(!this.parent.level) return;

        this.startDir={x:0,y:1};
        let sharedParams={
            moveDirection:{x:0,y:-1},
            moveSpeed:0,
            moveAngle:0,
            bounds2D:{x:0,y:0,w:0,h:0},
            position:{x:0,y:0},
            angle:0,
            kbControls: [
                {moveKey:"ArrowUp", angle:0, moveDir:1},
                {moveKey:"ArrowDown", angle:0, moveDir:-1},
                {moveKey:"ArrowRight", angle:90, moveDir:0},
                {moveKey:"ArrowLeft", angle:-90, moveDir:0}
            ],
            kbRules: [
                {axis:'x', dir: 1, bounds: this.parent.level.canvas.width-this.parent.size.w/2},
                {axis:'x', dir:-1, bounds: this.parent.size.w/2},
                {axis:'y', dir: 1, bounds: this.parent.level.canvas.height-this.parent.size.h/2},
                {axis:'y', dir:-1, bounds: this.parent.size.h/2},
            ]
        }        
        Tools.mergeWithObject(this.parent, sharedParams);
    }        

    getKeyboardInput(event){
        for(let i=0; i< this.parent.kbControls.length; i++){
            if(this.parent.kbControls[i].moveKey && this.parent.kbControls[i].moveKey === event.key) {
                this.parent.moveSpeed = (event.type==="down") ? (this.parent.speed * this.parent.kbControls[i].moveDir) : 0;
                this.parent.moveAngle = (event.type==="down") ? (this.parent.kbControls[i].angle) : 0;
            }
        }
    }
    
    update(delta){
        // move the player but keep them within bounds.
        // for(let i=0; i< this.parent.kbRules.length; i++){
        //     if( this.parent.moveDirection[this.parent.kbRules[i].axis] !== 0 && // make sure the input axis for the moveRules is actually moving 
        //         Math.sign(this.parent.moveDirection[this.parent.kbRules[i].axis]) === Math.sign(this.parent.kbRules[i].dir) && // input axis is moving in the same direction as the rule axis
        //         (this.parent.kbRules[i].dir > 0 && (this.parent.moveDirection[this.parent.kbRules[i].axis] * delta) + this.parent.bounds2D[this.parent.kbRules[i].axis] < (this.parent.kbRules[i].bounds) || // check positive direction bounds rule
        //         (this.parent.kbRules[i].dir < 0 && (this.parent.moveDirection[this.parent.kbRules[i].axis] * delta) + this.parent.bounds2D[this.parent.kbRules[i].axis] > (this.parent.kbRules[i].bounds))) // check negative direction bounds rule
        //     ){
                //console.log('kb',this.cnt++);
                let speed = this.parent.moveSpeed * delta
                this.parent.position.x += this.parent.moveDirection.x * speed;
                this.parent.position.y += this.parent.moveDirection.y * speed;

                this.parent.angle += this.parent.moveAngle * delta;

                // rotatate the ray's normal to the angle required
                this.parent.moveDirection = Tools.rotatePointAround(0,0,0,-1,-this.parent.angle);
                // this.parent.moveDirection={x:0.5,y:-0.5};
                //console.log(this.parent.moveDirection, speed, this.parent.position);
                //console.log(speed, delta);
        //     }
        // }
    }    
}

class DieAfterTTLComponent{
    constructor(parentObject, params={}){
        this.parent = parentObject;
        this.change(params);
    }

    change(params){
        this.startTime=(new Date()).getTime();
        Tools.overideObject(this.parent, params);
        if(!this.parent.level) return;

        var sharedParams={
            ttl:900,
            isDead:false,
        }
        Tools.mergeWithObject(this.parent, sharedParams);
    }


    update(delta){
        if(this.startTime+this.parent.ttl<(new Date()).getTime())
            this.parent.killAll();
    }
}

class DieWhenOffScreenComponent{
    constructor(parentObject, params={}){
        this.parent = parentObject;
        this.change(params);

    }

    change(params){
        Tools.overideObject(this.parent, params);
        if(!this.parent.level) return;

        var sharedParams={
            bounds2D:{x:0,y:0,w:0,h:0},
            isDead:false,
        }
        Tools.mergeWithObject(this.parent, sharedParams);
    }


    update(delta){
        if(this.parent.bounds2D.x < 0 ||
            this.parent.bounds2D.x > this.parent.level.canvas.width ||
            this.parent.bounds2D.y < 0 ||
            this.parent.bounds2D.y > this.parent.level.canvas.height){
                this.parent.killAll();
         }
    }
}

class TakeDamageOnHitComponent{
    constructor(parentObject, params={}){
        this.parent = parentObject;  
        this.parent.collidable = true; // requires hit method     
        this.change(params)
    }

    change(params){
        Tools.overideObject(this.parent, params);
        if(!this.parent.level) return;

        var sharedParams={
            HP:0,
            isDead:false
        }
        Tools.mergeWithObject(this.parent, sharedParams);
    }

    hit(damage){
        this.parent.HP-=damage;
        if(this.parent.HP < 0){
            this.parent.killAll();
        }
    }
}

class GiveCollisionDamageComponent{
    constructor(parentObject, params={}){
        this.parent = parentObject;
        this.change(params)
    }

    change(params){
        Tools.overideObject(this.parent, params);
        if(!this.parent.level) return;

        var sharedParams={
            targets:[],
            position:{x:0,y:0},
            damage:0,
            isDead:false,
            dieOnImpact: true
        }
        Tools.mergeWithObject(this.parent, sharedParams);
    }

    checkForHit(bullet, target){
        if(!target.isDead && target.collidable && Collision.testCircleOnCircle(bullet.position, 25, target.position, 25)){            
            if(bullet.dieOnImpact)
                bullet.killAll();
            if(isFunction(target.hit)) 
                target.hit(this.parent.damage);
        }
        for(let c=0; c < target.childern.length; c++){
            if(isFunction(target.childern[c].hit)) //need collision detection
                this.checkForHit(bullet,target.childern[c]);
        }
    }

    update(delta){
        // bullet targets
        for(let i=0; i < this.parent.targets.length; i++){
            this.checkForHit(this.parent, this.parent.targets[i])
        }
    }    
}

class PhysicsComponent{
    constructor(parentObject, params={}){
        this.parent = parentObject;
        this.change(params)
        this.parent.level.physicsEngine.addEntity(this.parent);
    }

    change(params){
        Tools.overideObject(this.parent, params);
        if(!this.parent.level) return;

        let sharedParams={
            position:{x:0,y:0},
            size:{w:0,h:0},
            angle:0,

            name: 'physics object',
            isStatic: false,
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            shape: 'box'
        }
        Tools.mergeWithObject(this.parent, sharedParams);
    }

    update(delta){
        Tools.overideObject(this.parent, this.parent.level.physicsEngine.getEntityData(this));
    }
}

class AnimationComponent{
    constructor(parentObject, name, params={}){
        this.parent = parentObject;
        this.name = name;
        this.loop = 0;
        this.from={
            position:{x:0,y:0, isStart:true},
            angle:{amount:0, isStart:true},
            scale:{x:0,y:0, isStart:true}
            //alpha:{amount:0, isStart:true}
        }
        this.isFinished = false;
        this.change(params)
    }

    change(params){
        Tools.overideObject(this, params);
//        Tools.overideObject(this.parent, params);
        var sharedParams={
            animations:[]
        }
        Tools.mergeWithObject(this.parent, sharedParams);

        this.parent.animations[this.name] = this.parent.level.animationLevelController.cloneAnimation(this.name);
        if(!this.loop && this.parent.animations[this.name].loop)
            this.loop = this.parent.animations[this.name].loop

        if(!this.positionTimeScale && this.parent.animations[this.name].positionTimeScale){
            this.positionTimeScale = this.parent.animations[this.name].positionTimeScale;
        }    
        if(this.positionTimeScale){
            this.parent.animations[this.name].anim.position.frames.forEach(frame=>{
                if(frame.start && "time" in frame.start) frame.start.time*=this.positionTimeScale;
                if(frame.end && "time" in frame.end) frame.end.time*=this.positionTimeScale;
            })
        }    

        if(!this.positionScale && this.parent.animations[this.name].positionScale){
            this.positionScale = this.parent.animations[this.name].positionScale;
        }
        if(this.positionScale){            
            this.parent.animations[this.name].anim.position.frames.forEach(frame=>{
                if(frame.start && "x" in frame.start) frame.start.x*=this.positionScale;
                if(frame.start && "y" in frame.start) frame.start.y*=this.positionScale;
                if(frame.end && "x" in frame.end) frame.end.x*=this.positionScale;
                if(frame.end && "y" in frame.end) frame.end.y*=this.positionScale;
            })
        }
    }

    updateScriptablePosition(isChild, keyFrame, tween, absolute){
        if(this.from.position.isStart && !absolute){
            this.from.position.x = this.parent.position.x;
            this.from.position.y = this.parent.position.y;
            if(!isChild) this.from.position.isStart = false;
        }

        // tween from keyframe to keyframe over time
        if(keyFrame.end.x && keyFrame.start.x){
            this.parent.position.x = this.from.position.x+keyFrame.start.x+((keyFrame.end.x - keyFrame.start.x)*tween);
            this.parent.position.y = this.from.position.y+keyFrame.start.y+((keyFrame.end.y - keyFrame.start.y)*tween);
        }
        if(keyFrame.end.circle && keyFrame.start.circle){
            let angle = keyFrame.start.circle.angle+((keyFrame.end.circle.angle - keyFrame.start.circle.angle)*tween);
            let radius = keyFrame.start.circle.radius+((keyFrame.end.circle.radius - keyFrame.start.circle.radius)*tween);
            let origin={
                x:keyFrame.start.circle.center.x+((keyFrame.end.circle.center.x - keyFrame.start.circle.center.x)*tween),
                y:keyFrame.start.circle.center.y+((keyFrame.end.circle.center.y - keyFrame.start.circle.center.y)*tween)
            };
            let point = Tools.getPointOnCircle(radius, angle);
            this.parent.position.x = this.from.position.x+origin.x+point.x;
            this.parent.position.y = this.from.position.y+origin.y+point.y;
        }

        if(tween === 1){
            this.from.position.x = 0;
            this.from.position.y = 0;
            if(!isChild) this.from.position.isStart = true;            
        }
    }

    update(delta){
        //console.log(this.parent.animations[this.name]);
        let currentTime = (new Date()).getTime();
        let anim = this.parent.animations[this.name].anim;
        let finished = true;
        for (const [type, value] of Object.entries(anim)) {
            if(anim[type].framePtr < anim[type].frames.length){
                finished = false;
                let keyFrame = value.frames[value.framePtr];
                let absolute = ('absolute' in keyFrame);
                if(!value.lastTime){
                    value.lastTime = currentTime;
                }
                let tween = 0;
                if(keyFrame.end && keyFrame.end.time){
                    tween = (currentTime-value.lastTime)/keyFrame.end.time;
                    if(tween >=1){
                        tween = 1;
    //                    if(!value.framePtr) value.framePtr=0;
                        value.framePtr++;
                        value.lastTime = currentTime;
                    }                
                }
                switch(type){
                    case "angle":
                        if(this.from.angle.isStart && !absolute){
                            this.from.angle.amount = this.parent.angle;
                            this.from.angle.isStart = false;
                        }                        
                        this.parent.angle = this.from.angle.amount+keyFrame.start.amount+((keyFrame.end.amount - keyFrame.start.amount)*tween);
                        if(tween === 1){
                            this.from.angle.amount = 0;
                            this.from.angle.isStart = true;
                        }
                    break
                    case "alpha":
                        this.parent.alpha = keyFrame.start.amount+((keyFrame.end.amount - keyFrame.start.amount)*tween);
                        if(tween === 1){
                            this.from.alpha = 1;
                        }
                    break                    
                    case "position":
                        this.updateScriptablePosition(this.parent.root, keyFrame, tween, absolute);
                    break
                }
            }            
        }        
        if(finished){
            this.loop--;
            for (const [type, value] of Object.entries(anim))
                anim[type].framePtr =0;

            if(this.loop <= 0)
                this.isFinished = finished; // finished the entire animation
        }
    }
}

class WaitScriptCommand{
    constructor(parentObject, params={}){
        this.parent = parentObject;
        this.ms = params.ms || params.wait || 0;
        this.startTime = (new Date()).getTime();
        this.isFinished = this.ms <= 0;
    }

    update(delta){
        this.isFinished = ((new Date()).getTime() - this.startTime) >= this.ms;
    }
}

class FireWeaponScriptCommand{
    constructor(parentObject, params={}){
        this.parent = parentObject;
        this.slot = params.slot || params.slots;
        this.force = params.force || false;
        this.isFinished = true;

        if(this.parent.componentMap && this.parent.componentMap['WeaponComponent'])
            this.parent.componentMap['WeaponComponent'].fireBullet(this.slot, {force:this.force});
    }

    update(delta){}
}

class SetImageScriptCommand{
    constructor(parentObject, params={}){
        this.parent = parentObject;
        this.target = params.target || 'self';
        this.image = params.image;
        this.isFinished = true;

        this.applyImage();
    }

    getTargetObject(){
        if(this.target === 'self')
            return this.parent;

        if(this.parent.childMap && this.parent.childMap[this.target])
            return this.parent.childMap[this.target];

        return this.parent;
    }

    applyImage(){
        let targetObject = this.getTargetObject();
        if(!this.image || !targetObject)
            return;

        targetObject.image = this.image;
        if(targetObject.level && targetObject.level.images && targetObject.level.images[this.image])
            targetObject.size = {
                w: targetObject.level.images[this.image].width/2,
                h: targetObject.level.images[this.image].height/2
            };
    }

    update(delta){}
}

class SetPropsScriptCommand{
    constructor(parentObject, params={}){
        this.parent = parentObject;
        this.target = params.target || 'self';
        this.props = params.props || {};
        this.isFinished = true;

        let targetObject = this.getTargetObject();
        if(targetObject)
            Tools.overideObject(targetObject, this.props);
    }

    getTargetObject(){
        if(this.target === 'self')
            return this.parent;

        if(this.parent.childMap && this.parent.childMap[this.target])
            return this.parent.childMap[this.target];

        return this.parent;
    }

    update(delta){}
}

class SetAnchorScriptCommand{
    constructor(parentObject, params={}){
        this.parent = parentObject;
        this.target = params.target || 'self';
        this.anchor = params.anchor || {};
        this.isFinished = true;

        let targetObject = this.getTargetObject();
        if(targetObject){
            if(!targetObject.anchor)
                targetObject.anchor = {};
            Tools.overideObject(targetObject.anchor, this.anchor);
        }
    }

    getTargetObject(){
        if(this.target === 'self')
            return this.parent;

        if(this.parent.childMap && this.parent.childMap[this.target])
            return this.parent.childMap[this.target];

        return this.parent;
    }

    update(delta){}
}

class StartCommandSetScriptCommand{
    constructor(parentObject, params={}, controller){
        this.parent = parentObject;
        this.controller = controller;
        this.name = params.start || params.commandSet;
        this.loop = params.loop || 0;
        this.isFinished = true;

        if(this.controller && this.name && this.parent.scriptableCommands[this.name])
            this.controller.executeCommandSet(this.name, this.parent.scriptableCommands[this.name], {loop:this.loop});
    }

    update(delta){}
}

class StopCommandSetScriptCommand{
    constructor(parentObject, params={}, controller){
        this.parent = parentObject;
        this.controller = controller;
        this.name = params.stop || params.commandSet;
        this.isFinished = true;

        if(this.controller && this.name)
            this.controller.stopCommandSet(this.name);
    }

    update(delta){}
}

class ScriptableAIComponent{
    constructor(parentObject, params={}){
        this.parent = parentObject;
        this.parent.collidable = true; // requires hit method
        this.change(params)
    }

    executeCommandSet(name, commandSet, params={}){
        if(!Array.isArray(commandSet))
            commandSet = [];

        let command={
            name,
            ptr:0,
            isDead:false,
            list: commandSet,
            current: null,
            loop: params.loop || 0
        }

        this.listOfRunningCommands.push(command);
        this.setupNextCommand(command);
    }

    stopCommandSet(name){
        this.listOfRunningCommands=this.listOfRunningCommands.filter(commandSet=>commandSet.name!==name);
    }

    change(params){
        Tools.overideObject(this.parent, params);

        var sharedParams={
            scriptableCommands:{
                init:[],
                hit:[],
                phases:[]
            }
        }

        Tools.mergeWithObject(this.parent, sharedParams);
        Tools.mergeWithObject(this.parent.scriptableCommands, sharedParams.scriptableCommands);

        this.listOfRunningCommands=[];
        this.triggeredPhases=[];
        this.initStarted=false;
    }

    createScriptCommand(commandParams){
        if(commandParams.anim)
            return new AnimationComponent(this.parent,commandParams.anim,commandParams);

        if(commandParams.wait || commandParams.ms)
            return new WaitScriptCommand(this.parent,commandParams);

        if(commandParams.fire)
            return new FireWeaponScriptCommand(this.parent,commandParams);

        if(commandParams.setImage)
            return new SetImageScriptCommand(this.parent,commandParams);

        if(commandParams.setProps)
            return new SetPropsScriptCommand(this.parent,commandParams);

        if(commandParams.setAnchor)
            return new SetAnchorScriptCommand(this.parent,commandParams);

        if(commandParams.start || commandParams.commandSet)
            return new StartCommandSetScriptCommand(this.parent,commandParams,this);

        if(commandParams.stop)
            return new StopCommandSetScriptCommand(this.parent,commandParams,this);

        return {isFinished:true, update:function(delta){}};
    }

    setupNextCommand(command){
        if(command.list.length===0){
            command.current = null;
            command.isDead = true;
            return;
        }

        while(command.ptr >= command.list.length){
            if(command.loop !== 0){
                if(command.loop > 0)
                    command.loop--;
                command.ptr = 0;
            } else {
                command.current = null;
                command.isDead = true;
                return;
            }
        }

        command.current = command.list[command.ptr];
        if(command.current)
            command.current = this.createScriptCommand(command.current);
        command.ptr++;

        if(command.current && command.current.isFinished)
            this.setupNextCommand(command);
    }

    updatePhases(){
        if(!this.parent.scriptableCommands.phases || this.parent.scriptableCommands.phases.length===0)
            return;

        this.parent.scriptableCommands.phases.forEach((phase,i) => {
            if(this.triggeredPhases.indexOf(i) >= 0)
                return;

            if(phase.hpBelow !== undefined && this.parent.HP <= phase.hpBelow){
                this.triggeredPhases.push(i);
                this.executeCommandSet(`phase${i}`,phase.commands || [], {loop:phase.loop || 0});
            }
        });
    }

    update(delta){
        if(!this.initStarted && !isObjectEmpty(this.parent.scriptableCommands.init)){
            this.initStarted = true;
            this.executeCommandSet('init',this.parent.scriptableCommands.init);
        }

        // purge dead commands
        this.listOfRunningCommands=this.listOfRunningCommands.filter(commandSet=>!commandSet.isDead);
        this.updatePhases();

        if(this.listOfRunningCommands.length>0){            
            //console.log(this.listOfRunningCommands.length);
            this.listOfRunningCommands.forEach(commandSet => {
                if(commandSet.current){
                    commandSet.current.update(delta);
                    if(commandSet.current.isFinished)
                        this.setupNextCommand(commandSet);
                }                
            });
        }
    }

    hit(damage){        
        if(!isObjectEmpty(this.parent.scriptableCommands.hit)){
            // don't fun the hit command if hit is already running
            if(this.listOfRunningCommands.filter(command=>command.name==="hit").length===0)
                this.executeCommandSet('hit',this.parent.scriptableCommands.hit);
        }        
    }
}

class NetworkLevelController{
    constructor(level){
        this.level = level;
        this.networkFrame = {};

        this.level.imageIDsToNames={};
        this.level.imageNamesToIDs={};
        let i_image=0;
        for (const [img, value] of Object.entries(this.level.images)) {
            this.level.imageIDsToNames[i_image+""]=img;
            this.level.imageNamesToIDs[img]=i_image+"";
            i_image++;
        }
    }

    getPacketContent(entities){
        entities.forEach(e=>{
            if(!e.streamables) return;
            let eContent = {};            
            e.streamables.forEach(s=>{
                if(s.var){
                    if(e[s.var]){
                        if(s.var==="image")
                            eContent[s.as]=this.level.imageNamesToIDs[e[s.var]];
                        else if(s.as==='b'){
                            eContent['x']=Math.round(e[s.var].x);
                            eContent['y']=Math.round(e[s.var].y);
                            eContent['w']=Math.round(e[s.var].w);
                            eContent['h']=Math.round(e[s.var].h);
                        }
                        else if(s.as==='a'){
                            let angle = Math.round(e[s.var]%360);
                            if(angle !==0)
                                eContent['a']=angle;
                        }
                        else if(s.as==='t'){
                            if(e[s.var]!==1)
                                eContent[s.as]=e[s.var];
                        }
                        else
                            eContent[s.as]=e[s.var];
                    }
                }
                if(s.objects){
                    if(e[s.objects])
                        this.getPacketContent(e[s.objects])
                }
            })
            this.packet.push(eContent);
        });
    }

    drawPacket(frameData){
        // console.log(this.packet);
        frameData = JSON.parse(frameData);
        for(let i=0; i<frameData.length; i++){
            let rebuild=frameData[i];
            if(rebuild['i']){
                let angle = 0;
                if(rebuild['a'])
                    angle = rebuild['a'];
                if(rebuild['x']){
                    if(rebuild['t'])
                        this.level.canvas.ctx.globalAlpha = rebuild['t'];                
                    drawImage(
                        this.level.imageIDsToNames[rebuild['i']],
                        rebuild['x'],
                        rebuild['y'],
                        rebuild['w'],
                        rebuild['h'],
                        angle
                    );
                    this.level.canvas.ctx.globalAlpha = 1;                    
                }
            }
        }
    }

    debug(){
        this.packet = [];
        this.getPacketContent(this.level.entities);

        this.level.canvas.ctx.globalAlpha = 0.8;
        drawBox(0,0,this.level.canvas.width, this.level.canvas.height,'purple')
        this.level.canvas.ctx.globalAlpha = 1;

        this.drawPacket(JSON.stringify(this.packet));
    }

    update(){
        
        if(this.level.networkDebug){
            this.debug();
            return;
        }

        this.packet = [];
        if(META.NETWORK.IS_SERVER)
            this.getPacketContent(this.level.entities);
        else
            this.drawPacket();
    }
}

class EntityLevelController{
    constructor(level){
        this.level = level;
        this.level.entities = [];
        this.level.addEntity = this.addEntity;
    }

    addEntity(entity){
        this.entities.push(entity);
    }

    update(delta){
        if(META.NETWORK.IS_SERVER){
            for(var i=0; i<this.level.entities.length; i++){
                if(this.level.entities[i].isDead){
                    this.level.entities.splice(i, 1);
                    continue;                
                }
                // don't update children as the parents already update them
                if(!this.level.entities[i].root) 
                    this.level.entities[i].update(delta);
            }
        }        
    }   
}

class PhysicsLevelController{
    constructor(level){
        this.level = level;
        level.physicsEngine = bradEngine.initPhysics();
    }

    update(delta){
        this.level.physicsEngine.calcEntitySimulation();
    }
}

class ScriptLevelController{
    constructor(level){
        this.level = level;
        this.level.gameScript = Tools.cloneObject(getGameScript);

        this.level.objectPool = {};
        for (const [name, obj] of Object.entries(this.level.gameScript['gameObjects'])) {
            let gameObject = eval(`new ${obj.classType}()`);
            gameObject.buildFromScript(obj.initParams);
            this.level.objectPool[name]=gameObject;            
        }        
    }
}

class PaintLayersLevelController{
    constructor(level){
        this.level = level;
        if(!this.level.layerIDs || this.level.layerIDs.length===0)
            this.level.layerIDs = ['Main'];
        this.level.layerIDs.forEach(layerID => {
            this.createLayer(layerID)
        });
        this.level.addLayerEntity = this.addLayerEntity;
    }

    createLayer(name){
        if(!this.level.layers) this.level.layers = [];
        if(!this.level.layerMap) this.level.layerMap = {};

        let layer = {entities:[]};
        this.level.layers.push(layer);
        this.level.layerMap[name] = layer;
    }

    addLayerEntity(entity,layer){
        if(!layer) layer = 'Main';
        entity.layerName=layer;
        this.layerMap[layer].entities.push(entity);
        if(isFunction(this.addEntity))
            this.addEntity(entity);
    }

    update(delta){
        this.level.layers.forEach(layer => {
            layer.entities.forEach((entity,i)=>{

                if(entity.isDead){
                    layer.entities.splice(i, 1);
                    return;
                }
    
                if(entity.paintComponents)
                    entity.paintComponents.forEach(paint=>paint.update(delta));
            });
        });
    }
}

class PaintEntitiesLevelController{
    constructor(level){
        this.level = level;
        // this.level.addLayerEntity = this.addLayerEntity;
    }

    update(delta){
        this.level.entities.forEach(entity => {
            if(entity.paintComponents)
                entity.paintComponents.forEach(paint=>paint.update(delta));
        });
    }
}

class AnimationData{
    getFormatedFrames(type, keyFrames){
        let frames = [];
        keyFrames.forEach(frame => {
            if(type in frame){
                frames.push(frame[type]);
            }            
        });
        return frames;
    }

    constructor(keyFrames){
        this.anim = {
            isVisible:{},
            alpha:{},
            position:{},
            cameraZ:{},
            angle:{},
            image:{}
        };
        Tools.overideObject(this,keyFrames);
        
        Object.keys(this.anim).forEach(type=> {
            this.anim[type].frames = this.getFormatedFrames(type,keyFrames.keyFrames);
            this.anim[type].framePtr=0;
        });
    }
}

class AnimationLevelController{

    constructor(level){
        this.level = level;
        this.level.animations=[];

        Object.keys( this.level.gameScript["animations"]).forEach(name=> {
            this.level.animations[name] = new AnimationData(this.level.gameScript["animations"][name]);
        });
    }

    cloneAnimation(name){
        return Tools.cloneObject(this.level.animations[name]);
    }
}
