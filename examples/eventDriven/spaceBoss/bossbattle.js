class WeaponComponent {
    constructor(parentObject, params={}){
        this.parent = parentObject;
        this.lastBulletTime=[];

        if(!this.parent.level){
            console.log('WeaponContriller requiers parent.level');
        }

        this.change(params)
    }

    change(params){
        Tools.overideObject(this.parent, params);
        if(!this.parent.level) return;

        var sharedParams={
            targets:[],
            firedBullets:[],
            weaponSlots:[],
            weaponLoadout:{},
            position:{x:0,y:0}
        }
        Tools.mergeWithObject(this.parent, sharedParams);

        if(params.initWeaponSlots){
            for (const [key, value] of Object.entries(params.initWeaponSlots)) {
                var slot = value;
                var weapon = this.parent.level.gameScript['weaponTypes'][value.weapon];
                var newSlot = {name:key,slot,weapon};
                this.parent.weaponSlots.push(newSlot);
                this.parent.weaponLoadout[key]=newSlot;
            }        
        }

        for(var i=0; i<this.parent.weaponSlots.length; i++)
            this.lastBulletTime[i] = (new Date()).getTime();
    }

    fireBullet(slotNames, params={}){
        var currenTime = (new Date()).getTime();
        if(slotNames && !Array.isArray(slotNames))
            slotNames = [slotNames];

        for(var i=0; i<this.parent.weaponSlots.length; i++){
            let weaponSlot = this.parent.weaponSlots[i];
            if(slotNames && slotNames.indexOf(weaponSlot.name) < 0)
                continue;

            if(params.force || currenTime > (this.lastBulletTime[i]+weaponSlot.weapon.reloadTime)){
                this.lastBulletTime[i] = currenTime;
                let weapon = eval(`new ${weaponSlot.weapon.classType}()`);

                // rotate this weapons move direction to the angle of the weapon slot + the host ships angle
                let moveDirection = Tools2D.normalize(Tools.rotatePointAround(
                                    0,0,
                                    weaponSlot.slot.moveDirection.x,
                                    weaponSlot.slot.moveDirection.y,
                                    -this.parent.angle));

                // rotate the host gun's slot position to the angle the host ship is pointing
                let slotPosition = Tools.rotatePointAround(
                    0,0,
                    weaponSlot.slot.x,
                    weaponSlot.slot.y,
                    -this.parent.angle);

                weapon.setupParams({...weaponSlot.weapon.initParams, level:this.parent.level, 
                    position:{
                        x:this.parent.position.x+slotPosition.x, 
                        y:this.parent.position.y+slotPosition.y
                    },
                    unrotatedPosition:{
                        x:this.parent.position.x+weaponSlot.slot.x, 
                        y:this.parent.position.y+weaponSlot.slot.y
                    },
                    host:this.parent,
                    targets: this.parent.targets,
                    moveDirection,
                    angle: weaponSlot.slot.angle+this.parent.angle,
                    slotAngle:weaponSlot.slot.angle
                });
                this.parent.firedBullets.push(weapon);
                this.parent.level.addLayerEntity(weapon, weapon.layer);
                // if the level has an enity controller then add this as a new entity
                // if(this.parent.level.entities) 
                //     this.parent.level.entities.push(weapon);
            }
        }
    }

    update(delta){
        for(var i=0; i<this.parent.firedBullets.length; i++){
            if(this.parent.firedBullets[i].isDead){
                this.parent.firedBullets.splice(i, 1);
                continue;
            }
            this.parent.firedBullets[i].update(delta);
        }
    }
}

class LaserComponent{
    constructor(parentObject, params={}){
        this.parent = parentObject;
        this.change(params);
        if(!this.parent.host){
            console.log('WeaponContriller requiers host');
        } 
    }

    change(params){
        this.startTime=(new Date()).getTime();
        Tools.overideObject(this.parent, params);
        if(!this.parent.level) return;

        let sharedParams={
            moveDirection:{x:0,y:0},
            fadettl:-1,
            position:{x:0,y:0},
            size:{w:0,h:0},
            angle:0,
            slotAngle:0,
            alpha:1,
            isDead:false,
            speed:0,
            maxLaserLength:1000,
            growSpeed:0,
            startLength:10,
            attachedHost:true
        }
        Tools.mergeWithObject(this.parent, sharedParams);
        this.growLength = this.parent.startLength;

        this.host={
            position:{
                x: this.parent.host.position.x,
                y: this.parent.host.position.y,
            },
            angle: this.parent.host.angle + this.parent.slotAngle
        };
        this.staticOffest = {
            x: this.host.position.x - this.parent.unrotatedPosition.x,
            y: this.host.position.y - this.parent.unrotatedPosition.y
        }
        this.offsetHost={
            x: this.staticOffest.x,
            y: this.staticOffest.y
        }
        this.parent.angle = this.host.angle + this.parent.slotAngle;
    }

    calculateLength(hitRay){
        let length = this.parent.maxLaserLength;
        for(let i=0; i < this.parent.targets.length; i++){
            let d = Collision.distToLineSegment(this.parent.targets[i].position, 
                {x:hitRay.x1, y:hitRay.y1}, 
                {x:hitRay.x2, y:hitRay.y2});

            if(d < 100){
                let pointClosest = Collision.closestPointOnLineSegment(this.parent.targets[i].position, 
                    {x:hitRay.x1, y:hitRay.y1}, 
                    {x:hitRay.x2, y:hitRay.y2});   
               
                //drawCircle3D(pointClosest.x,pointClosest.y,this.parent.level.camera.z,20, 'red',);                

                let tlength = Tools.distanceBetweenPoints(pointClosest,{x:hitRay.x1,y:hitRay.y1});
                
                if(tlength < length)
                    length = tlength;
            }
        }
        return length;
    }

    calculateDebugLine(){
        // line drawing representation of the lasers reach
        let hitRay = { // shoot the ray forward max distance
            x1: this.host.position.x-this.offsetHost.x,
            y1: this.host.position.y+this.offsetHost.y,
        }

        // rotatate the ray's normal to the angle required
        let rotatedNormal = Tools.rotatePointAround(0,0,0,-1,-this.parent.angle);

        // the end point is the normal * the max length
        hitRay.x2=hitRay.x1+(rotatedNormal.x*this.parent.maxLaserLength);
        hitRay.y2=hitRay.y1+(rotatedNormal.y*this.parent.maxLaserLength);

        // calculate the min length of laser from gun to closest target
        let length = Math.abs(this.calculateLength(hitRay));        
        length = this.getGrowLength(length);

        hitRay.x2=hitRay.x1+(rotatedNormal.x*length),
        hitRay.y2=hitRay.y1+(rotatedNormal.y*length)
        
        drawLine3D(
                hitRay.x1,hitRay.y1,this.parent.level.camera.z,
                hitRay.x2,hitRay.y2,this.parent.level.camera.z,
                'green',{lineWidth :10});
    }

    getGrowLength(length){
        if(this.parent.growSpeed===0) return length;
        // target has been hit so don't grow the laser
        if(length < this.parent.maxLaserLength)
            this.growLength = this.parent.maxLaserLength;

        // keep growing if not a max length yet
        if(this.growLength <= this.parent.maxLaserLength){
            let growDelta = ((new Date()).getTime() - this.startTime)*this.parent.growSpeed;
            this.growLength = (growDelta)/this.parent.maxLaserLength;
            
            if(this.growLength < length)
                length = this.growLength;
        }
        return length;
    }

    calculateLine(){

        // line drawing representation of the lasers reach
        let hitRay = { // shoot the ray forward max distance
            x1: this.host.position.x-this.offsetHost.x,
            y1: this.host.position.y+this.offsetHost.y,
        }

        // rotatate the ray's normal to the angle required
        let rotatedNormal = Tools.rotatePointAround(0,0,0,-1,-this.parent.angle);

        // the end point is the normal * the max length
        hitRay.x2=hitRay.x1+(rotatedNormal.x*this.parent.maxLaserLength);
        hitRay.y2=hitRay.y1+(rotatedNormal.y*this.parent.maxLaserLength);

        let length = Math.abs(this.calculateLength(hitRay));
        length = this.getGrowLength(length);

        this.parent.size.w=20;
        this.parent.size.h = length/2;

        this.parent.position.x = hitRay.x1+(rotatedNormal.x*length/2);
        this.parent.position.y = hitRay.y1+(rotatedNormal.y*length/2);
    }

    update(delta){
        if(this.parent.attachedHost){
            this.host={
                position:{
                    x: this.parent.host.position.x,
                    y: this.parent.host.position.y,
                },
                angle: this.parent.host.angle + this.parent.slotAngle
            };            
        }

        //console.log('laser');
        if(this.growLength >= this.parent.maxLaserLength-100){
            this.host.position.x+=this.parent.moveDirection.x*this.parent.speed*delta;
            this.host.position.y+=this.parent.moveDirection.y*this.parent.speed*delta;
        }

        // rotate the gun attached to the host ship to match the host ships angle
        this.parent.angle = this.host.angle + this.parent.slotAngle;
        this.offsetHost = Tools.rotatePointAround(0,0,this.staticOffest.x,this.staticOffest.y,this.parent.angle);

        this.calculateLine();
        //this.calculateDebugLine();

        // fade the laser over time
        let fadeDelta = (new Date()).getTime() - this.startTime;
        this.parent.alpha = Tools.clampMinMax(1-(fadeDelta/this.parent.fadettl),0,1);
    }
}

class Enemy extends DanaObject {}

class Laser extends DanaObject {
    setupParams(params){
        this.override(params);
        this.addComponent('Image3DSpriteComponent',new Image3DSpriteComponent(this));
//       this.addComponent('Image3DComponent',new Image3DComponent(this));

       // this.addComponent('LaserComponent',new LaserComponent(this,{fadettl:2000, growSpeed:16000, maxLaserLength:4000}));
        this.addComponent('LaserComponent',new LaserComponent(this));
        this.addComponent('DieAfterTTLComponent',new DieAfterTTLComponent(this));

        //this.addPaintComponent('PaintImage3DComponent',new PaintImage3DComponent(this));
        this.addPaintComponent('PaintImage3DSpriteComponent',new PaintImage3DSpriteComponent(this));
    }
}

class Bullet extends DanaObject {

    setupParams(params){
        this.override(params);
        this.addComponent('Image3DComponent',new Image3DComponent(this));
        this.addComponent('MoveForwardComponent',new MoveForwardComponent(this));
        this.addComponent('GiveCollisionDamageComponent',new GiveCollisionDamageComponent(this));
        this.addComponent('DieWhenOffScreenComponent',new DieWhenOffScreenComponent(this));

        this.addPaintComponent('PaintImage3DComponent',new PaintImage3DComponent(this));
    }
}

class Orbiter extends DanaObject{
    constructor(level, params){
        super(level, params);
        this.addComponent('Image3DComponent',new Image3DComponent(this));
        this.addComponent('ChildComponent',new ChildComponent(this));
        this.addPaintComponent('PaintImage3DComponent',new PaintImage3DComponent(this));
    }
}


class ChildScriptObject extends DanaObject{
    constructor(level, params){
        super(level, params);
        this.addComponent('Image3DComponent',new Image3DComponent(this));
        this.addComponent('TakeDamageOnHitComponent',new  TakeDamageOnHitComponent(this,{HP:25}));
        this.addComponent('ChildComponent',new ChildComponent(this));
        this.addComponent('ScriptableAIComponent',new ScriptableAIComponent(this));
        this.addPaintComponent('PaintImage3DComponent',new PaintImage3DComponent(this));
    }
}

class ChildScriptBossObject extends DanaObject{
    constructor(level, params){
        super(level, params);
        this.addComponent('Image3DComponent',new Image3DComponent(this));
        if(this.HP)
            this.addComponent('TakeDamageOnHitComponent',new  TakeDamageOnHitComponent(this,{HP:this.HP}));
        this.addComponent('ChildComponent',new ChildComponent(this));
        if(this.initWeaponSlots)
            this.addComponent('WeaponComponent',new WeaponComponent(this,{initWeaponSlots:this.initWeaponSlots}));
        this.addComponent('ScriptableAIComponent',new ScriptableAIComponent(this));
        this.addPaintComponent('PaintImage3DComponent',new PaintImage3DComponent(this));
    }
}

class Player extends DanaObject{

    fireBullet(player, keyType){
        player.componentMap['WeaponComponent'].fireBullet();
    }

    update(delta){
        super.update(delta);
        this.fireBullet(this);

        // cleanup dead targets
        for(var i=0; i<this.targets.length; i++){
            if(this.targets[i].isDead){
                this.targets.splice(i, 1);
                continue;                
            }
        }                
    }
}

class MainLevel extends LevelInterface {
    loadResources(){this.findResources('spaceBoss','images');}

    setupHelpDialog(){
        const textParts = [`
            <span class="HelpHeader">Description</span><br>
                Event-driven space boss demo with scripted enemies, weapons, and animations.
            `,`
            <span class="HelpHeader">Controls</span><br>
                ${drawHelpKey('Arrow Keys')} Move the player ship.<br>
                ${drawHelpKey(' ')} Auto Fires weapons.<br>
            `,`
            <span class="HelpHeader">Script Events</span><br>
                The boss behavior is data driven from <code>gameScript.js</code>. The script declares game objects, components, weapons, animations, and command lists. Commands such as <code>start</code>, <code>wait</code>, <code>anim</code>, <code>fire</code>, and <code>setImage</code> are read by the script controller, so changing the JSON-like data changes attack patterns without rewriting the engine loop.
            `];
        return {textParts, pause:false}
    }
    
    getMouseInput(event){
        let x = (Math.round((event.position.x/this.canvas.width)*100)/100-0.5).toFixed(2);
        let y = (Math.round((event.position.y/this.canvas.height)*100)/100-0.5).toFixed(2);

        if(event.type==="down")
            console.log(`position:{absolute:true, start:{x:${this.previousClick.x}, y:${this.previousClick.y},time:0}, end:{x:${x}, y:${y},time:100}}}`);
            // console.log(`position:{start:{x:0, y:0,time:0}, end:{x:${this.previousClick.x-x}, y:${this.previousClick.y-y},time:100}}}`);

        this.previousClick = {x,y};
    }
    getKeyboardInput(event){this.player.getKeyboardInput(event);}

    setup(){
        this.previousClick = {x:0,y:0};
        this.layerIDs=['Weapons', 'Main', 'Layer1','Layer2','Player','NetworkDebug'];

        this.scriptLevelController = new ScriptLevelController(this);
        this.entityLevelController = new EntityLevelController(this);
        this.paintLayersLevelController = new PaintLayersLevelController(this);
        this.networkLevelController = new NetworkLevelController(this);
        this.animationLevelController = new AnimationLevelController(this);

        this.networkDebug = true;
        this.wavePtr = 0;
        this.camera = {x:0, y:0, z: 2500};
        this.starField = new StarField(this.canvas, 500, {x:{min:-700, max:700}, y:{min:-1000, max:1000}, z:{min: 500, max: 2000}}, ParticleProps.DIR_DOWN, 4);

        this.enemyTypes = this.gameScript['enemyTypes'];

        if(META.NETWORK.IS_SERVER){
            this.player = this.objectPool['Player'].createClone(this, this.objectPool['Player'].layer);
            //this.addLayerEntity(this.player, this.objectPool['Player'].layer)
            this.prepareWave();
        }
    }

    prepareWave(){
        this.currentWave = this.gameScript['levelMap']['waves'][this.wavePtr];
        this.waveEnemies = [];
        for(var i=0; i<this.currentWave['enemies'].length; i++){
            var enemy = this.objectPool[this.currentWave['enemies'][i].type].createClone(this, 'Main'); 
            enemy.override({...this.currentWave['enemies'][i].initParams});
            //this.addLayerEntity(enemy, enemy.layer);
            this.waveEnemies.push(enemy);
            enemy.targets = [this.player];
            this.setEntityTargets(enemy, [this.player]);
        }
        this.player.targets = this.waveEnemies;
        //this.player.fireBullet(this.player);
    }

    setEntityTargets(entity, targets){
        entity.targets = targets;
        if(entity.childern)
            entity.childern.forEach(child=>this.setEntityTargets(child, targets));
    }

    update(delta){
        //drawImageFrom00('background.jpg',0,0,this.canvas.width, this.canvas.height);
        drawBox(0,0,this.canvas.width, this.canvas.height,'black')
        this.starField.update(delta);
        this.entityLevelController.update(delta);
        this.paintLayersLevelController.update(delta);
        // this.networkLevelController.update(delta);

        this.addScreenLog('Number of Bullets: '+this.player.firedBullets.length, 'red');  
        this.addScreenLog('Number of Entities: '+this.entities.length, 'red');  

    }
}
