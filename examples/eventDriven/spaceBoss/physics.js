class GroundObject extends DanaObject{
    constructor(level, params){
        super(level,params);

        this.name = 'ground';
        this.isStatic = true;
        this.x = this.level.canvas.width / 2;
        this.y = this.level.canvas.height*.95;
        this.width = this.level.canvas.width / 2;
        this.height = 10 / 2;
        this.pSize = {width: this.width, height: this.height};
        this.shape = 'box';

        this.addComponent('PhysicsComponent',new PhysicsComponent(this));
    }
}

class PhysicsObject extends DanaObject{
    constructor(level, params){
        super(level,params);

        this.name = 'falling object '+this.id;
        this.isStatic = false;
        this.x = Math.random() * 750;
        this.y = Math.random() * 300;
        this.width = (Math.random() + 1.1)*30;
        this.height = (Math.random() + 1.1)*30;
        this.pSize = {width: this.width, height: this.height};
        this.shape = (Math.random() > 0.5) ?'box':'circle';
        //this.shape = 'box';
        this.image = 'crate.png';
        if(this.shape === 'circle'){
            this.image = 'tire.png';
            this.pSize = {radius: this.width};
        }

        this.addComponent('Image3DComponent',new ImageComponent(this));
        this.addComponent('PhysicsComponent',new PhysicsComponent(this));
        this.addPaintComponent('PaintImage3DComponent',new PaintImageComponent(this));
    }
}

class MainLevel extends LevelInterface {
    loadResources(){this.findResources('spaceBoss','garage');}

    setupScript(){
        this.gameScript = Tools.cloneObject(getGameScript);
        this.objectPool = {};
        for (const [name, obj] of Object.entries(this.gameScript['gameObjects'])) {
            var gameObject = eval(`new ${obj.classType}()`);
            gameObject.buildFromScript(obj.initParams);
            this.objectPool[name]=gameObject;            
        }
    }

    setup(){                
        this.camera = {x:0, y:0, z: 2000};
        this.entityLevelController = new EntityLevelController(this);
        this.physicsLevelController = new PhysicsLevelController(this);
        this.paintEntitiesLevelController = new PaintEntitiesLevelController(this);
        this.networkLevelController = new NetworkLevelController(this);

        this.networkDebug = true;

        this.entities.push(new GroundObject(this));
        for(let i=0; i<100; i++){
            let entity = new PhysicsObject(this, {id:i});
            this.addEntity(entity);
        }
        this.physicsEngine.setupDebug();
        this.physicsEngine.dragNDrop();
    }

    update(delta){
        drawImageFrom00('background.jpg',0,0,this.canvas.width, this.canvas.height);
        //drawBox(0,0,this.canvas.width, this.canvas.height,'black')

        this.physicsLevelController.update(delta);
        //this.physicsEngine.drawDebug();
        this.entityLevelController.update(delta);
        this.paintEntitiesLevelController.update(delta);
        this.networkLevelController.update(delta);
    }
}