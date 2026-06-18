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
                var newSlot = {slot,weapon};
                this.parent.weaponSlots.push(newSlot);
                this.parent.weaponLoadout[key]=newSlot;
            }        
        }

        for(var i=0; i<this.parent.weaponSlots.length; i++)
            this.lastBulletTime[i] = (new Date()).getTime();
    }

    fireBullet(){
        var currenTime = (new Date()).getTime();
        for(var i=0; i<this.parent.weaponSlots.length; i++){
            if(currenTime > (this.lastBulletTime[i]+this.parent.weaponSlots[i].weapon.reloadTime)){
                this.lastBulletTime[i] = currenTime;
                var weapon = eval(`new ${this.parent.weaponSlots[i].weapon.classType}()`);
                weapon.setupParams({...this.parent.weaponSlots[i].weapon, level:this.parent.level, 
                    position:{
                        x:this.parent.position.x+this.parent.weaponSlots[i].slot.x, 
                        y:this.parent.position.y+this.parent.weaponSlots[i].slot.y
                    },
                    host:this.parent,
                    targets: this.parent.targets,
                    moveDirection: this.parent.weaponSlots[i].slot.moveDirection,
                    angle: this.parent.weaponSlots[i].slot.angle
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

class LaserImageComponent{
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
            fadettl:2000,
            position:{x:0,y:0},
            size:{w:0,h:0},
            angle:0,
            alpha:1,
            isDead:false,
            maxLaserLength:4000
        }
        Tools.mergeWithObject(this.parent, sharedParams);

        this.offsetHost={
            x: this.parent.host.position.x - this.parent.position.x,
            y: this.parent.host.position.y - this.parent.position.y,
        }
        this.staticOverride = {
            w:20,
            h:this.parent.maxLaserLength
        }

        this.parent.angle=0;
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
            x1: this.parent.host.position.x-this.offsetHost.x,
            y1: this.parent.host.position.y+this.offsetHost.y,
        }

        // rotatate the ray's normal to the angle required
        let rotatedNormal = Tools.rotatePointAround(0,0,0,-1,-this.parent.angle);

        // the end point is the normal * the max length
        hitRay.x2=hitRay.x1+(rotatedNormal.x*this.parent.maxLaserLength);
        hitRay.y2=hitRay.y1+(rotatedNormal.y*this.parent.maxLaserLength);

        // calculate the min length of laser from gun to closest target
        let length = Math.abs(this.calculateLength(hitRay));

        hitRay.x2=hitRay.x1+(rotatedNormal.x*length),
        hitRay.y2=hitRay.y1+(rotatedNormal.y*length)
        
        drawLine3D(
                hitRay.x1,hitRay.y1,this.parent.level.camera.z,
                hitRay.x2,hitRay.y2,this.parent.level.camera.z,
                'green',{lineWidth :10});
    }

    calculateLine(){
        this.parent.angle+=1;

        // line drawing representation of the lasers reach
        let hitRay = { // shoot the ray forward max distance
            x1: this.parent.host.position.x-this.offsetHost.x,
            y1: this.parent.host.position.y+this.offsetHost.y,
        }

        // rotatate the ray's normal to the angle required
        let rotatedNormal = Tools.rotatePointAround(0,0,0,-1,-this.parent.angle);

        // the end point is the normal * the max length
        hitRay.x2=hitRay.x1+(rotatedNormal.x*this.parent.maxLaserLength);
        hitRay.y2=hitRay.y1+(rotatedNormal.y*this.parent.maxLaserLength);

        let length = Math.abs(this.calculateLength(hitRay));
        
        this.parent.size.w=20;
        this.parent.size.h = length/2;

        this.parent.position.x = hitRay.x1+(rotatedNormal.x*length/2);
        this.parent.position.y = hitRay.y1+(rotatedNormal.y*length/2);
    }

    update(delta){

        // used if you want to detach laser from weapon slot
        // bug where the the drawComponent will resize the image to size of the png file
        // this.parent.size.w=this.staticOverride.w;
        // this.parent.size.h=this.staticOverride.h;

        this.calculateLine();
        // this.calculateDebugLine();

        // fade the laser over time
        let fadeDelta = (new Date()).getTime() - this.startTime;
        //this.parent.alpha = Tools.clampMinMax(1-(fadeDelta/this.parent.fadettl),0,1);
    }
}

class Enemy extends DanaObject {
    hit(damage){
        this.componentMap['TakeDamageOnHitComponent'].hit(damage);
    }
}

class Laser extends DanaObject {

    setupParams(params){
        this.override(params);
        this.addComponent('Image3DComponent',new Image3DComponent(this));
        this.addComponent('LaserImageComponent',new LaserImageComponent(this));
        // this.addComponent('DieAfterTTLComponent',new DieAfterTTLComponent(this));

        this.addPaintComponent('PaintImage3DComponent',new PaintImage3DComponent(this));
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
    getKeyboardInput(event){this.player.getKeyboardInput(event);}

    setup(){
        this.layerIDs=['Weapons', 'Main', 'Player', 'NetworkDebug'];

        this.scriptLevelController = new ScriptLevelController(this);
        this.entityLevelController = new EntityLevelController(this);
        this.paintLayersLevelController = new PaintLayersLevelController(this);
        this.networkLevelController = new NetworkLevelController(this);

        this.networkDebug = true;
        this.wavePtr = 0;
        this.camera = {x:0, y:0, z: 2500};
        this.starField = new StarField(this.canvas, 500, {x:{min:-700, max:700}, y:{min:-1000, max:1000}, z:{min: 500, max: 2000}}, ParticleProps.DIR_DOWN, 4);

        this.enemyTypes = this.gameScript['enemyTypes'];

        if(META.NETWORK.IS_SERVER){
            this.player = this.objectPool['Player'].createClone(this, this.objectPool['Player'].layer);
            this.prepareWave();
        }
    }

    prepareWave(){
        this.currentWave = this.gameScript['levelMap']['waves'][this.wavePtr];
        this.waveEnemies = [];

        for(var i=0; i<100; i++){
            var enemy = this.objectPool[this.currentWave['enemies'][0].type].createClone(this); 
            enemy.override({...this.currentWave['enemies'][0].initParams});
            this.addLayerEntity(enemy, enemy.layer);
            this.waveEnemies.push(enemy);
            this.entities.push(enemy);
            enemy.position={x:Tools.getNumberBetween(-1000,1000),y:Tools.getNumberBetween(-1000,1000)}
        }
        this.player.targets = this.waveEnemies;

        // for(var i=0; i<this.currentWave['enemies'].length; i++){
        //     var enemy = this.objectPool[this.currentWave['enemies'][i].type].createClone(this); 
        //     enemy.override({...this.currentWave['enemies'][i].initParams});
        //     this.addLayerEntity(enemy, enemy.layer);
        //     this.waveEnemies.push(enemy);
        //     this.entities.push(enemy);
        // }
        // this.player.targets = this.waveEnemies;
        //this.player.fireBullet(this.player);
    }

    update(delta){
        //drawImageFrom00('background.jpg',0,0,this.canvas.width, this.canvas.height);
        drawBox(0,0,this.canvas.width, this.canvas.height,'black')
        this.starField.update(delta);
        this.entityLevelController.update(delta);
        this.paintLayersLevelController.update(delta);
        //this.networkLevelController.update(delta);

        this.addScreenLog('Number of Bullets: '+this.player.firedBullets.length, 'red');  
        this.addScreenLog('Number of Entities: '+this.entities.length, 'red');  

    }
}