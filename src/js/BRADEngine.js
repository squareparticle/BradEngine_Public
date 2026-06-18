// BRADEngine.js
// (Basic Reusable Application Designer)Engine.js

const clamp=(val, min, max)=> Math.min(Math.max(val, min), max);
const isObjectEmpty=obj=> Object.entries(obj).length === 0;
const getObjectSize=obj=> Object.entries(obj).length;
const isObject=obj=>typeof obj === 'object' && obj !== null;
const isFunction=func=>typeof func === 'function';
const isDefined=obj=>typeof obj !== "undefined";
const isArray=obj=>Array.isArray(obj);
const lerp = (x, y, a) => x * (1 - a) + y * a;
const sign =(n) => (n < 0)?-1:1;
const rgbToHex=(r, g, b)=> "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
const bradResolveAsset=path=>isFunction(window.bradAsset) ? window.bradAsset(path) : path;
  
/*
creates a UUID (Universally Unique ID)

34,028,236,692,093,846,346,337,460,743,177,000,000. Combinations

Thirty four undecillion 
twenty eight decillion 
two hundred thirty six nonillion 
six hundred ninety two octillion 
ninety three septillion 
eight hundred forty six sextillion 
three hundred forty six quintillion 
three hundred thirty seven quadrillion 
four hundred sixty trillion 
seven hundred forty three billion 
one hundred seventy seven million  

https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
*/

const HALF_PI = Math.PI / 2;
const QUARTER_PI = Math.PI / 4;
const TWO_PI = Math.PI * 2;

let url_string = window.location.href
var url = new URL(url_string);
var DISPLAY_SIZE = url.searchParams.get("DISPLAY_SIZE");
if(DISPLAY_SIZE)
    META.DISPLAY_SIZE = DISPLAY_SIZE;
    // console.log(DISPLAY_SIZE);

window.mobileCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
    // return true;
  };

const createUUIDv4=()=> { 
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

const EventTypes = {
    KEYBOARD: 'keyboard',
    MOUSE: 'mouse',
    MOUSEMOVE: 'mouseMove'
}

let canvas={};

class Canvas {
    ratioDirection(type){
        if (type==="full")
            return window.innerWidth>window.innerHeight;
        else
            return window.innerWidth<window.innerHeight;
    }    
    buildFullAspectRatio(viewport, type){
        viewport.windowCanvas.width  = window.innerWidth;
        viewport.windowCanvas.height = window.innerHeight;
        let width = viewport.windowCanvas.width;
        let height = viewport.windowCanvas.height;

        let ratio = 1;
        if(this.ratioDirection(type)){
            ratio = viewport.windowCanvas.width/viewport.compareWidth;
            height = viewport.compareHeight * ratio;     
        }           
        else{
            ratio = viewport.windowCanvas.height/viewport.compareHeight;
            width = viewport.compareWidth * ratio;     
        }              

        viewport.windowCanvas.width = width;
        viewport.windowCanvas.height = height;
        document.getElementById("content").style.width = width+"px";
        document.getElementById("content").style.height = height+"px";
    }

    constructor(doubleBuffer, windowCanvas) {
        this.element = doubleBuffer;
        this.width = doubleBuffer.width;
        this.height = doubleBuffer.height;
        this.ctx = doubleBuffer.getContext('2d');

        if(windowCanvas){
            this.windowCanvas = windowCanvas;
            this.windowCtx = windowCanvas.getContext('2d');
            this.compareHeight = this.windowCanvas.height = 768;
            this.compareWidth = this.windowCanvas.width = 1024;

            if(META.DISPLAY_SIZE==='stretched'){
                this.windowCanvas.width  = window.innerWidth;
                this.windowCanvas.height = window.innerHeight;
                // remove center for fullscreen
                const el = document.querySelector('#content');
                if (el.classList.contains("center")) {
                    el.classList.remove("center");
                }
            }   
            if(META.DISPLAY_SIZE==='full' || META.DISPLAY_SIZE==='fullHeight')
                this.buildFullAspectRatio(this,META.DISPLAY_SIZE);           
        }
    }
}
window.onresize=function(){
    if (canvas.windowCanvas){
        if(META.DISPLAY_SIZE==='stretched'){
            canvas.windowCanvas.width  = window.innerWidth;
            canvas.windowCanvas.height = window.innerHeight;
        }
        if(META.DISPLAY_SIZE==='full' || META.DISPLAY_SIZE==='fullHeight')
            canvas.buildFullAspectRatio(canvas,META.DISPLAY_SIZE);
    }
};
class Collision {
    static buildBounds(center, size){
        return {
            x: center.x - size.width/2,
            y: center.y - size.height/2,
            width: size.width,
            height: size.height
        }
    }

    //https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
    static testBoxOnBox(rect1, rect2){
        if (rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y) {
                return true;
         }
         return false;
    }

    static testPointOnCircle(point, position, radius){
        return (Math.sqrt((point.x-position.x)*(point.x-position.x) + (point.y-position.y)*(point.y-position.y)) < radius)
    }

    static testCircleOnCircle(circlePostision1, radius1, circlePostision2, radius2){
        let dist = Math.sqrt((circlePostision1.x-circlePostision2.x)*(circlePostision1.x-circlePostision2.x) + (circlePostision1.y-circlePostision2.y)*(circlePostision1.y-circlePostision2.y))
        return (dist <= radius1+radius2);
    }    

    static testPointOnBox(point, bounds){        
        if( point.x >= bounds.x && 
            point.y >= bounds.y &&
            point.x <= bounds.x + bounds.width && 
            point.y <= bounds.y + bounds.height)
        {
            return true;
        }
        return false;
    }

    static testCircleOnBox(circle, rect){
        let cx = circle.x; 
        let cy = circle.y; 
        let radius = circle.r; 
        let rx = rect.x; 
        let ry = rect.y;
        let rw = rect.width;
        let rh = rect.height;

        // temporary variables to set edges for testing
        let testX = cx;
        let testY = cy;
        
        // which edge is closest?
        if (cx < rx)         testX = rx;      // test left edge
        else if (cx > rx+rw) testX = rx+rw;   // right edge
        if (cy < ry)         testY = ry;      // top edge
        else if (cy > ry+rh) testY = ry+rh;   // bottom edge
        
        // get distance from closest edges
        let distX = cx-testX;
        let distY = cy-testY;
        let distance = Math.sqrt((distX*distX) + (distY*distY));
        
        // if the distance is less than the radius, collision!
        if (distance <= radius) 
            return true;
        
        return false;
    }        

    static distToLineSegment(point, lineStartPoint, lineEndPoint) {
        return Tools.distToLineSegment(point, lineStartPoint, lineEndPoint);
    }
      
    static closestPointOnLineSegment(point, lineStartPoint, lineEndPoint) {
        return Tools.closestPointOnLineSegment(point, lineStartPoint, lineEndPoint);
    }
  
    static testLineIntersect(line1, line2) {
        let x1 = line1.x1;
        let y1 = line1.y1;
        let x2 = line1.x2;
        let y2 = line1.y2;
        let x3 = line2.x1;
        let y3 = line2.y1;
        let x4 = line2.x2;
        let y4 = line2.y2;

        // Check if none of the lines are of length 0
        if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) return false;
                
        let denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
      
        // Lines are parallel
        if (denominator === 0) return false;
      
        let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
        let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator
      
        // is the intersection along the segments
        if (ua < 0 || ua > 1 || ub < 0 || ub > 1)  return false
                
        // Return a object with the x and y coordinates of the intersection
        let x = x1 + ua * (x2 - x1)
        let y = y1 + ua * (y2 - y1)
      
        return {x, y}
    }
}

class Tools {
    static MIN=0;
    static MAX=1;

    static randomSwap(arr, numberOfSwaps=1){
        for(let i=0; i<numberOfSwaps; i++){
            let i1 = Tools.getNumberBetween(0, arr.length-1);
            let i2 = Tools.getNumberBetween(0, arr.length-1);
            Tools.swap(arr, i1, i2);
        }
    }

    static swap(arr, i1, i2){
        let temp = arr[i1];
        arr[i1]=arr[i2];
        arr[i2]=temp;
    }

    static shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    static getRandomNumberArray(start, end){
        let length = end-start;
        let array = [];
        for(let i=start; i<length; i++) array.push(i);        
        return Tools.shuffle(array);
    }

    static getRandomObjectByProbability = arr =>{
        let sumOfProbabilities = arr.reduce((acc,e)=>acc+=e.probability,0);
        const randomSelection = Tools.getNumberBetween(0,sumOfProbabilities);    
        let result = arr[0];
        let found = false;
        arr.reduce((acc,e)=>{
            if(found) return acc;
    
            acc+=e.probability;
            if (randomSelection <= acc){
                result = e;
                found = true;
            }
            return acc;
        },0);
        return result;
    }

    static getRandomPointInBox(x,y,width,height){
        return {x: Tools.getNumberBetween(x, x+width), y: Tools.getNumberBetween(y, y+height)};
    }

    static sortObjectArray(list, property){
        return list.sort((a, b) => (a[property] > b[property]) ? -1 : 1)
    }
    static sortObjectArrayDsc(list, property){
        return list.sort((a, b) => (a[property] > b[property]) ? 1 : -1)
    }
    static toRadians(degrees){
        return degrees * (Math.PI/180);
    }

    static distanceBetweenPoints(pointA, pointB){
        let a = pointA.x - pointB.x;
        let b = pointA.y - pointB.y;
        return Math.sqrt( a*a + b*b );
    }

    static rotatePointAroundR(cx, cy, x, y, radians) {
        var cos = Math.cos(radians),
            sin = Math.sin(radians),
            nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
            ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
        return {x:nx, y:ny};
    }
    static rotatePointAround(cx, cy, x, y, angle) {
        var radians = (Math.PI / 180) * angle,
            cos = Math.cos(radians),
            sin = Math.sin(radians),
            nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
            ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
        return {x:nx, y:ny};
    }
    static getPointOnCircle(radius, degrees){
        var angle = Tools.toRadians(degrees);
        return {x:(radius * Math.cos(angle)),y:(radius * Math.sin(angle))}
    }
    static getPointOnCircleR(radius, radians){
        return {x:(radius * Math.cos(radians)),y:(radius * Math.sin(radians))}
    }
    static getPointOnOval(radiusX, radiusY, degrees){
        var angle = Tools.toRadians(degrees);
        return {x:(radiusX * Math.cos(angle)),y:(radiusY * Math.sin(angle))}
    }

    static projectTo2D(x,y,z, width, height){
        if(z===0)return{x: width/2,y: height/2, z}
        
        return{
            x: ((width/2) + (1024*(x/z))),
            y: ((height/2) + (1024*(y/z))),
            z
        }
    }
    
    static revertProjectTo2D(x,y,z, width, height){
        if(z===0)return{x: width/2,y: height/2}
     
        x -=(width/2);
        y-=(height/2);
        return{
            x: (((x*z)/1024)),
            y: (((y*z)/1024)),
            z
        }
    }    

    static clampMin(number, min){
        if(number < min) return min;
        return number;
    }
    static clampMax(number, max){
        if(number > max) return max;
        return number;
    }
    static clampMinMax(number, min, max){
        if(number < min) return min;
        if(number > max) return max;
        return number;
    } 
    static getMilliseconds(){
        let d = new Date();
        return d.getTime();
    }

    static intToHex(rgb) { 
        let hex = Math.round(rgb).toString(16);
        if (hex.length < 2) hex = "0" + hex;        
        return hex;
    }  
    
    static rgbToHex(rgb) {   
        return '#'+Tools.intToHex(rgb.r)+Tools.intToHex(rgb.g)+Tools.intToHex(rgb.b);
    }

    static getRandomObject(arr){
        return arr[Math.floor(Math.random() * arr.length)];
    }
    
    static cloneObject(obj){
        return JSON.parse(JSON.stringify(obj));
    }

    static getNumberBetween(min, max){
        max++;
        return Math.floor(Math.random() * (max - min)) + min;
    }

    static getDecimalBetween(min, max){
        max++;
        return Math.random() * (max - min) + min;
    }    

    static mergeWithObject(obj, params){
        if(!params) return;
        
        for (const [key, value] of Object.entries(params)) {
            if(!(key in obj))
                obj[key] = value;
        }
    }

    static overideObject(obj, params){
        if(!params) return;
        
        for (const [key, value] of Object.entries(params)) {
            obj[key] = value;
        }
    }
    
    static sqr(x) { 
        return x * x 
    }
    
    static dist2(v, w) { 
        return Tools.sqr(v.x - w.x) + Tools.sqr(v.y - w.y) 
    }
    
    static distToSegmentSquared(p, v, w) {
      var l2 = Tools.dist2(v, w);
        
      if (l2 == 0) return Tools.dist2(p, v);
        
      var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
        
      if (t < 0) return Tools.dist2(p, v);
      if (t > 1) return Tools.dist2(p, w);
        
      return Tools.dist2(p, { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) });
    }
    
    static closestPointOnLineSegment(p, v, w) {
        var l2 = Tools.dist2(v, w);
          
        if (l2 == 0) return Tools.dist2(p, v);
          
        var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
          
        if (t < 0) return Tools.dist2(p, v);
        if (t > 1) return Tools.dist2(p, w);
          
        return { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) };
    }
    
    static rayCast(pos, dir, segment) {
        const {x1, y1, x2, y2} = segment;
    
        const x3 = pos.x;
        const y3 = pos.y;
        const x4 = pos.x + dir.x;
        const y4 = pos.y + dir.y;
    
        const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (den == 0) { return; }
    
        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
        if (t > 0 && t < 1 && u > 0) 
            return { x: x1 + t * (x2 - x1), y: y1 + t * (y2 - y1) };
    }

    static vecToAngle(vec){
        return Math.atan2(vec.y, vec.x);
    }      
    static distToLineSegment(p, v, w) { 
        return Math.sqrt(Tools.distToSegmentSquared(p, v, w));
    }
        
}

// Physics - Box2D
var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;
var b2MassData = Box2D.Collision.Shapes.b2MassData;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

// TODO: Physics should not draw the images. It should be have more like Physics3D
class Physics{
    constructor(canvas, scale=30, gravity={x:0,y:9.8}, allowSleep=true){
        this.canvas = canvas;
        this.scale = scale;
        this.world = new b2World(new b2Vec2(gravity.x, gravity.y) ,allowSleep);
        this.images={};
        this.fps = (typeof META !== 'undefined' && META.PHYSICS_FPS) ? META.PHYSICS_FPS : 60;
        this.simulationState = {};
        this.entityMap ={};
        this.bodies={};
    }

    addImages(images){
        this.images = images;
    }

    addEntity(danaObject){
        //this.entityMap[danaObject.name] = danaObject;
        let attach = {name: danaObject.name};
        this.addBody(attach, danaObject.shape, danaObject.isStatic, danaObject.x, danaObject.y, danaObject.pSize);
    }

    addBody(attach,shape,isStatic,x,y,size,params={}){
        let fixDef = new b2FixtureDef;
        fixDef.density = params.density || 1.0;
        fixDef.friction = params.friction || 0.5;
        fixDef.restitution = params.restitution || 0.2;
        let points = params.points || [];

        let bodyDef = new b2BodyDef;
        attach['shape']=shape;
        if (!('isVisible' in attach))
            attach['isVisible'] = true;
        bodyDef.userData = attach;
        bodyDef.type = (isStatic) ? b2Body.b2_staticBody : b2Body.b2_dynamicBody;

        switch(shape) {
            case "circle":
                fixDef.shape = new b2CircleShape(size.radius/this.scale);
                attach['radius'] = size.radius/this.scale;
            break;
            case "polygon": 
                fixDef.shape = new b2PolygonShape();
                fixDef.shape.SetAsArray(points, points.length);
            break;
            case "box":
                fixDef.shape = new b2PolygonShape;
                attach['width'] = size.width/this.scale;
                attach['height'] = size.height/this.scale;
                fixDef.shape.SetAsBox(size.width/this.scale, size.height/this.scale);
            break;                
        }

        // bodyDef.angle = 1; // starting angle
        bodyDef.position.x = x/this.scale; bodyDef.position.y = y/this.scale;
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);
    }

    setupDebug(alpha=0.3, thickness=1.0){
        var debugDraw = new b2DebugDraw();
        debugDraw.SetSprite(this.canvas.ctx);
        debugDraw.SetDrawScale(this.scale);
        debugDraw.SetFillAlpha(alpha);
        debugDraw.SetLineThickness(thickness);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        this.world.SetDebugDraw(debugDraw);        
    }

    drawDebug(){
        this.world.Step(1/this.fps, 10, 10);
        this.world.DrawDebugData();
        this.world.ClearForces();
    }

    calculateSimulation(){
        this.world.Step(1/this.fps, 10, 10);
    }

    nextState(){
        let bodies = this.world.GetBodyList();
        this.simulationState=[];
        while(bodies) {
            if(!bodies.GetUserData() || !bodies.GetUserData().isVisible){
                bodies = bodies.GetNext();
                continue;
            }
            
            let bodyData = {
                shape: bodies.GetUserData().shape,
                image: bodies.GetUserData().image,
                pos: {x: bodies.GetPosition().x, y: bodies.GetPosition().y},
                ang: bodies.GetAngle(),
            }

            if(bodies.GetUserData().shape==="circle")
                bodyData.rad = bodies.GetUserData().radius;
            else
                bodyData.size = {w:bodies.GetUserData().width, h:bodies.GetUserData().height}
            
            this.simulationState.push(bodyData);
            bodies = bodies.GetNext();
        }
        this.world.ClearForces();
    }

    drawSimulationState(calcNextStep){
        if(calcNextStep) this.nextState();
        
        this.simulationState.forEach(body=>{
            switch(body.shape) {
                case "circle":
                    if(body.image)
                        this.drawImage(this.images[body.image], body.pos.x, body.pos.y, body.rad, body.rad,body.ang);
                    else if(body.sprite)
                        this.drawSprite(body.sprite, body.pos.x, body.pos.y, body.rad, body.rad,body.ang);
                    else
                        this.drawCircle(body.pos.x, body.pos.y, body.rad, body.ang,body.col);
                break;
                case "polygon": 
                break;
                case "box":
                    if(body.image)
                        this.drawImage(this.images[body.image], body.pos.x, body.pos.y, body.size.w, body.size.h, body.ang);
                    else if(body.sprite)
                        this.drawImage(body.sprite, body.pos.x, body.pos.y, body.size.w, body.size.h,body.ang);
                    else
                        this.drawBox(body.pos.x, body.pos.y, body.size.w, body.size.h, body.ang, body.col);
                break;                
            }
        });
    }

    drawImmediateSimulation(){
        this.world.Step(1/this.fps, 10, 10);
        let bodies = this.world.GetBodyList();
        while(bodies) {
            if(!bodies.GetUserData() || !bodies.GetUserData().isVisible){
                bodies = bodies.GetNext();
                continue;
            }
            this.bodies[bodies.GetUserData().name]=bodies.GetPosition();
            switch(bodies.GetUserData().shape) {
                case "circle":
                    if(bodies.GetUserData().image)
                        this.drawImage( this.images[bodies.GetUserData().image], bodies.GetPosition().x , bodies.GetPosition().y, bodies.GetUserData().radius, bodies.GetUserData().radius,bodies.GetAngle(),"red");
                    else if(bodies.GetUserData().sprite)
                        this.drawSprite( bodies.GetUserData().sprite, bodies.GetPosition().x , bodies.GetPosition().y, bodies.GetUserData().radius, bodies.GetUserData().radius,bodies.GetAngle(),"red");
                    else
                        this.drawCircle(bodies.GetPosition().x , bodies.GetPosition().y, bodies.GetUserData().radius, bodies.GetAngle(),"red");
                break;
                case "polygon": 
                break;
                case "box":
                    // console.log(bodies.GetFixtureList().GetShape());
                    if(bodies.GetUserData().image)
                        this.drawImage( this.images[bodies.GetUserData().image], bodies.GetPosition().x , bodies.GetPosition().y, bodies.GetUserData().width, bodies.GetUserData().height,bodies.GetAngle(),"red");
                    else if(bodies.GetUserData().sprite)
                        this.drawImage( bodies.GetUserData().sprite, bodies.GetPosition().x , bodies.GetPosition().y, bodies.GetUserData().width, bodies.GetUserData().height,bodies.GetAngle(),"red");
                    else
                        this.drawBox(bodies.GetPosition().x , bodies.GetPosition().y, bodies.GetUserData().width, bodies.GetUserData().height,bodies.GetAngle(),"red");
                break;                
            }            

            // if(body) { bodies.draw(this.context); }
            bodies = bodies.GetNext();
        }
        this.world.ClearForces();
    }

    calcEntitySimulation(){
        this.world.Step(1/this.fps, 10, 10);
        let bodies = this.world.GetBodyList();
        while(bodies) {
            if(!bodies.GetUserData() || !bodies.GetUserData().isVisible){
                bodies = bodies.GetNext();
                continue;
            }
            this.entityMap[bodies.GetUserData().name]={};
            this.entityMap[bodies.GetUserData().name].position={x:bodies.GetPosition().x*this.scale, y:bodies.GetPosition().y*this.scale};
            switch(bodies.GetUserData().shape) {
                case "box":
                    this.entityMap[bodies.GetUserData().name].size={w:bodies.GetUserData().width*this.scale, h:bodies.GetUserData().height*this.scale};
                break;
                case "circle":
                    this.entityMap[bodies.GetUserData().name].size={w:bodies.GetUserData().radius*this.scale, h:bodies.GetUserData().radius*this.scale};
                break;
            }
            this.entityMap[bodies.GetUserData().name].angle = bodies.GetAngle() * (180/Math.PI);
            bodies = bodies.GetNext();
        }
        this.world.ClearForces();
    }   
    
    getEntityData(danaObject){
        if(this.entityMap[danaObject.parent.name]===null) return {};
        return(this.entityMap[danaObject.parent.name]);
    }

    drawSprite=(sprite,x,y,width,height,radians)=>{
        sprite.drawRigidBody(x,y,width,height,radians, this.scale);
    }

    drawImage=(image,x,y,width,height,radians,col,params)=>{
        canvas.ctx.save();
        canvas.ctx.beginPath();
        canvas.ctx.translate( x*this.scale, y *this.scale);
        canvas.ctx.rotate(radians);
        canvas.ctx.drawImage(image, -width*this.scale, -height*this.scale, (width*2)*this.scale, (height*2)*this.scale);
        canvas.ctx.fillStyle=col;
        canvas.ctx.fill();
        canvas.ctx.restore();
    }

    drawBox=(x,y,width,height,radians,col,params)=>{
        canvas.ctx.save();
        canvas.ctx.beginPath();
        canvas.ctx.translate( x*this.scale, y *this.scale);
        canvas.ctx.rotate(radians);
        canvas.ctx.rect( -width*this.scale, -height*this.scale, (width*2)*this.scale, (height*2)*this.scale);
        canvas.ctx.fillStyle=col;
        canvas.ctx.fill();
        canvas.ctx.restore();
    }

    drawCircle=(x,y,r,radians,col,params={})=>{
        canvas.ctx.save();
        canvas.ctx.translate(x*this.scale, y *this.scale);
        canvas.ctx.rotate(radians);

        canvas.ctx.beginPath();
        canvas.ctx.arc(0, 0, r*this.scale, 0, 1.5 * Math.PI);    
        canvas.ctx.fillStyle = col;
        canvas.ctx.fill();

        canvas.ctx.restore();
    }

    click(callback) {
        let self = this;

        function handleClick(e) {
            e.preventDefault();
            var point = {
                x: (e.offsetX || e.layerX) / self.scale,
                y: (e.offsetY || e.layerY) / self.scale
            };

            self.world.QueryPoint(function(fixture) { callback(fixture.GetBody(), fixture, point);},point);
        }

        this.canvas.windowCanvas.addEventListener("mousedown",handleClick);
        this.canvas.windowCanvas.addEventListener("touchstart",handleClick);
    };

    dragNDrop = (canvas)=> {
        let self = this;
        let bodySelected = null;
        let joint = null;

        function calculateWorldPosition(e) {
            let x = ((e.offsetX || e.layerX)/self.canvas.windowCanvas.width)*self.canvas.width;
            let y = ((e.offsetY || e.layerY)/self.canvas.windowCanvas.height)*self.canvas.height;            
            return {
                x: x / self.scale,
                y: y / self.scale
            };
        }

        this.canvas.windowCanvas.addEventListener("mousedown",function(e) {
            e.preventDefault();
            let point = calculateWorldPosition(e);
            self.world.QueryPoint(function(fixture) {
                bodySelected = fixture.GetBody();
            },point);
        });

        this.canvas.windowCanvas.addEventListener("mousemove",function(e) {
            if(!bodySelected) { return; }
            let point = calculateWorldPosition(e);

            if(!joint) {
                let jointDefinition = new Box2D.Dynamics.Joints.b2MouseJointDef();
                jointDefinition.bodyA = self.world.GetGroundBody();
                jointDefinition.bodyB = bodySelected;
                jointDefinition.target.Set(point.x,point.y);
                jointDefinition.maxForce = 100000;
                jointDefinition.timeStep = self.stepAmount;
                joint = self.world.CreateJoint(jointDefinition);
            }

            joint.SetTarget(new b2Vec2(point.x,point.y));
        });

        this.canvas.windowCanvas.addEventListener("mouseup",function(e) {
            bodySelected = null;
            if(joint) {
                self.world.DestroyJoint(joint);
                joint = null;
            }
        });    
    };    
}

class Physics3D{

    constructor(scale=1, gravity={x:0,y:-9.82,z:0}){
        this.scale = scale;
        this.world = new CANNON.World();
        this.world.gravity.set(gravity.x, gravity.y, gravity.z);
        this.fps = (typeof META !== 'undefined' && META.PHYSICS_FPS) ? META.PHYSICS_FPS : 60;
        this.fixedTimeStep = 1.0 / this.fps;
        this.maxSubSteps = 3;
        this.bodies=[];
    }

    addBody(body){
        this.bodies.push(body);
        this.world.addBody(body);
    }

    calculateSimulation(delta){
        this.world.step(this.fixedTimeStep, delta, this.maxSubSteps)
    }   

    createGroundPlane(position={x:0, y:-1, z:0}, qRotAxis={x:1, y:0, z:0}, qAngle=(-Math.PI / 2)){
        const groundProps = {
            mass: 0,
            position: new CANNON.Vec3(position.x, position.y, position.z),
            shape: new CANNON.Plane(),
        }
        const groundBody = new CANNON.Body(groundProps);
        groundBody.quaternion.setFromAxisAngle(qRotAxis, qAngle);
        this.addBody(groundBody);
        return groundBody;
    }    
    
}

class Sprite{
    constructor(canvas, params) {
        this.canvas = canvas; 
        this.position = {x: 0, y: 0};
        this.width = 0; this.height = 0;
        // this.scale = {x: 1, y: 1};
        this.frameSize = {width: 0, height: 0};
        this.cells = {rows: 1, cols: 1};
        this.animations = {};
        
        this.fps = 30;
        this.interval = 1000/this.fps;
        this.lastTime = (new Date()).getTime();
        this.currentTime = 0;

        this.currentAnimation={
            currentFrame:0,
            startFrame:0,
            numFrames:1
        }

        this.override(params);
    }

    override(params){
        if(!params) return;
        

        for (const [key, value] of Object.entries(params)) {
            this[key] = value;
            if(key === 'fps')
                this.interval = 1000/this.fps;
        }

        if(this.image){
            this.image = bradEngine.currentLevel.images[this.image];
            this.frameSize = {
                width: this.image.width/this.cells.cols,
                height: this.image.height/this.cells.rows
            }
            if(this.animations.idle){
                this.currentAnimation = this.animations.idle;
                this.currentAnimation.currentFrame=this.currentAnimation.startFrame;
            }
        }
    }    

    drawRigidBody(x,y,width,height,radians, box2dScale){
        if(!this.image) return;

        this.canvas.ctx.save();
        this.canvas.ctx.beginPath();
        this.canvas.ctx.translate( x*box2dScale, y *box2dScale);
        this.canvas.ctx.rotate(radians);
        this.canvas.ctx.drawImage(this.image, 
            (this.currentAnimation.currentFrame * this.frameSize.width), 0, this.frameSize.width, this.frameSize.height,
            -width*box2dScale, -height*box2dScale, (width*2)*box2dScale, (height*2)*box2dScale);
        this.canvas.ctx.fill();
        this.canvas.ctx.restore();

        this.calcNextFrame();
    }

    draw(){
        if(!this.image) return;

        drawSprite(this.image, 
            (this.currentAnimation.currentFrame * this.frameSize.width), 0, this.frameSize.width, this.frameSize.height,
            this.position.x-this.width/2,this.position.y-this.height/2, this.width, this.height);

        this.calcNextFrame();
    }

    calcNextFrame(){
        this.currentTime = (new Date()).getTime();
        this.delta = (this.currentTime-this.lastTime);

        if(this.delta > this.interval) {            
            this.currentAnimation.currentFrame++
            if(this.currentAnimation.currentFrame === this.currentAnimation.numFrames+this.currentAnimation.startFrame)
                this.currentAnimation.currentFrame = this.currentAnimation.startFrame;
            this.lastTime = this.currentTime - (this.delta % this.interval);
        }                 
    }
}

class BRADObject{
    constructor(params) {
        //this.canvas = canvas; 
        this.position = {x:0, y:0};
        this.width = 0; this.height = 0;
        this.sprites = {}; this.images=[]; this.sounds = [];
        this.childern = [];        
        this.name = ""; this.tags = [];
        this.isEnabled = true; this.isVisible = true;
        this.centerObject = true;

        if(isFunction(this.setupDefaultParams))
            this.setupDefaultParams();
        this.override(params);
        if (isFunction(this.setup))
            this.setup();
    }

    override(params){
        if(!params) return;
        
        for (const [key, value] of Object.entries(params)) {
            this[key] = value;

            if(key==="createSprites"){
                value.forEach((spriteData)=>{
                    if(!spriteData.name) {console.log('sprite Data requires a name'); return;}
                    if(!spriteData.width && spriteData.width!==0){
                        if(this.width) spriteData.width = this.width;
                        if(params.width) spriteData.width = params.width;
                    }
                    if(!spriteData.height && spriteData.height!==0){
                        if(this.height) spriteData.height = this.height;
                        if(params.height) spriteData.height = params.height;
                    }
                    this.sprites[spriteData.name] = new Sprite(this.canvas, spriteData);
                });
            }
        }
    }

    getBounds(){return {x:position.x, y:position.y, width:this.width, height:this.height}}

    detectBroadcastEvent(){
        let event = {};
        this.getGameEvent(event);
    }

    detectKeyboardInputEvent(event){
        this.getKeyboardInput(event);
    }

    detectMouseInputEvent(event){  
        if(event.type==='up')
        alert(detectMouseInputEvent, event.type);      
        this.getMouseInput(event);
    }
    
    detectMouseMoveInputEvent(event){        
        this.getMouseMoveInput(event);
    }

    detectCollisionEvent(){
        let event = {};
        this.getCollision(event);
    }

    gameLoop(delta){
        if(this.isEnabled){
            this.update(delta);
            if(this.isVisible) 
                this.draw();
        }
    }

    draw(){
        if(this.sprites.main){
            this.sprites.main.position = this.position;
            this.sprites.main.draw();
        }
    }
}

class LevelInterface{
    constructor(canvas) {
        this.canvas = canvas; 
        this.fps = (typeof META !== 'undefined' && META.FPS) ? META.FPS : 60;
        this.physicsfps = (typeof META !== 'undefined' && META.PHYSICS_FPS) ? META.PHYSICS_FPS : 60;
        this.networkfps = (typeof META !== 'undefined' && META.NETWORK_FPS) ? META.NETWORK_FPS : 60;
        this.showDebug = (typeof META !== 'undefined' && META.SHOW_DEBUG) ? META.SHOW_DEBUG : false;
        this.downloadDirList = (typeof META !== 'undefined' && META.CREATE_DIR) ? META.CREATE_DIR : false;
        this.deltas = {
            "Update":{
                delta: 0,
                interval: 1000/this.fps,
                lastTime: (new Date()).getTime()
            }
        }
        // this.delta = 0;
        // this.interval = 1000/this.fps;
        this.currentTime = 0;
        this.images={};
        this.loadedMeshes={};
        this.loadedFiles={};
        this.imageResourcesTotal = 0;
        this.soundResourcesTotal = 0;
        this.resourcesNeeded = 0;
        this.soundResourcesNeeded = 0;
        this.BRADObjects=[];
        this.BRADObjMap={};
        this.subscriptions={};
        this.frameCnt=0;
        this.staticFrameCnt=0;
        this.lastTime = Tools.getMilliseconds();
        this.screenLogs=[];
        this.initialized = false;
        this.mobileImageParts = {};
        this.numImagesLoading = 0;
    }

    drawBackgroundCard(ctx, type){
       
        let width={
            'rightTop': this.mobileImageParts[`rightTop_${type}`].width,
            'rightBot': this.mobileImageParts[`rightBot_${type}`].width,
            'leftTop': this.mobileImageParts[`leftTop_${type}`].width,
            'leftBot': this.mobileImageParts[`leftBot_${type}`].width,
            'top': this.mobileImageParts[`top_${type}`].width,
            'bot': this.mobileImageParts[`bot_${type}`].width,
            'left': this.mobileImageParts[`left_${type}`].width,
            'right': this.mobileImageParts[`right_${type}`].width            
        }
        let height={
            'rightTop': this.mobileImageParts[`rightTop_${type}`].height,
            'rightBot': this.mobileImageParts[`rightBot_${type}`].height,
            'leftTop': this.mobileImageParts[`leftTop_${type}`].height,
            'leftBot': this.mobileImageParts[`leftBot_${type}`].height,
            'top': this.mobileImageParts[`top_${type}`].height,
            'bot': this.mobileImageParts[`bot_${type}`].height,
            'left': this.mobileImageParts[`left_${type}`].height,
            'right': this.mobileImageParts[`right_${type}`].height              
        }
        let corner={
            'rightTop': {x: ctx.canvas.width,y:0},
            'rightBot': {x: ctx.canvas.width ,y:ctx.canvas.height},
            'leftTop': {x:0,y:0},
            'leftBot': {x:0,y:ctx.canvas.height}
        }
        let innerCorner={
            'rightTop': {x: corner['rightTop'].x-width['rightTop'],y: height['rightTop']},
            'rightBot': {x: corner['rightBot'].x-width['rightBot'],y: corner['rightBot'].y-height['rightBot']},
            'leftTop': {x:width['leftTop'],y:height['leftTop']},
            'leftBot': {x:width['leftBot'],y:corner['leftBot'].y-height['leftBot']}
        }
        let stretch={
            'top': innerCorner['rightTop'].x-innerCorner['leftTop'].x,
            'bot': innerCorner['rightBot'].x-innerCorner['leftBot'].x,
            'left': innerCorner['leftTop'].y-innerCorner['leftBot'].y,
            'right': innerCorner['rightTop'].y-innerCorner['rightBot'].y,
        }
        let widthBuffer = 21;
        let heightBuffer = 10;
        if(type==='wood'){
            widthBuffer = 10;
            heightBuffer = 10;    
        }

        ctx.drawImage(this.mobileImageParts[`inner_${type}`],
        /* center */ corner['leftTop'].x+widthBuffer, corner['leftTop'].y+heightBuffer, corner['rightBot'].x-(widthBuffer*2), corner['rightBot'].y-(heightBuffer*2));

        ctx.drawImage(this.mobileImageParts[`rightBot_${type}`],
        /* rightBot */ innerCorner['rightBot'].x, innerCorner['rightBot'].y, width['rightBot'], height['rightBot']);

        ctx.drawImage(this.mobileImageParts[`rightTop_${type}`], 
        /* rightTop */ innerCorner['rightTop'].x, corner['rightTop'].y, width['rightTop'], height['rightTop']);

        ctx.drawImage(this.mobileImageParts[`leftBot_${type}`],
        /* leftBot */ corner['leftBot'].x, innerCorner['leftBot'].y, width['leftBot'], height['leftBot']);

        ctx.drawImage(this.mobileImageParts[`leftTop_${type}`],
        /* leftTop */ corner['leftTop'].x, corner['leftTop'].y, width['leftTop'], height['leftTop']);

        ctx.drawImage(this.mobileImageParts[`top_${type}`],
        /* top */ innerCorner['leftTop'].x, corner['leftTop'].y, stretch['top'], height['top']); 
        
        ctx.drawImage(this.mobileImageParts[`bot_${type}`],
        /* bot */ innerCorner['leftBot'].x, corner['leftBot'].y-height['bot'], stretch['bot'], height['bot']);
        
        ctx.drawImage(this.mobileImageParts[`left_${type}`],
        /* left */ corner['leftTop'].x, innerCorner['leftBot'].y, width['left'], stretch['left']); 
        
        ctx.drawImage(this.mobileImageParts[`right_${type}`],
        /* right */ corner['rightTop'].x-width['right'], innerCorner['rightBot'].y, width['right'], stretch['right']);

    }

    loadBackgroundImages(file){
        this.numImagesLoading--;
        if(this.numImagesLoading > 0) return;

        helpOverlayOn();
        const helpSettings = this.setupHelpDialog();
        helpSettings.text = '';
        helpSettings.textParts.forEach((textPart, index) => {
            let canvas = document.createElement("canvas");
            let body = document.getElementsByTagName("body")[0];
            canvas.style.display = "none";                    

            body.appendChild(canvas);
            let div = document.getElementById(`card_${index}`);
            canvas.width = div.offsetWidth;
            canvas.height = div.offsetHeight;

            this.drawBackgroundCard(canvas.getContext('2d'),(index%2===0)?'wood':'stone');
            let dataUrl = canvas.toDataURL();
            div.style.background=`url(${dataUrl})`;
            div.style.backgroundRepeat='no-repeat';
        });
    }

    addBackgroundImage(img){
        this.numImagesLoading++;
        this.mobileImageParts[img] = new Image();
        this.mobileImageParts[img].src = bradResolveAsset('src/sharedMedia/images/'+img+'.png');
        this.mobileImageParts[img].onload = ()=>{ this.loadBackgroundImages(img); }
    }

    initHelp(){
        if (isFunction(this.setupHelpDialog)){
            helpOverlayOn();
            const helpSettings = this.setupHelpDialog();
            if(window.mobileCheck()){
                let images=['rightBot','rightTop','leftBot','leftTop','right','left','top','bot','inner']
                helpSettings.pause = true;  // modile can't run with help on
                images.forEach(img=>this.addBackgroundImage(img+"_stone"));
                images.forEach(img=>this.addBackgroundImage(img+"_wood"));
                
                helpSettings.text = '';
                helpSettings.textParts.forEach((textPart, index) => {
                    if(index!=0) helpSettings.text +='<br>';
                    helpSettings.text += `<div style='min-height: 150px; margin:5px;padding-top:20px; padding-left:50px; color:white' id="card_${index}">`;
                    helpSettings.text += textPart;
                    helpSettings.text += '</div>';   
                });
                document.getElementById("helpTextMobile").innerHTML = helpSettings.text;
            }else{
                helpSettings.text = '';
                helpSettings.textParts.forEach((textPart, index) => {
                    if(index!=0) helpSettings.text +='<br>';
                    helpSettings.text += textPart;
                });
                document.getElementById("helpText").innerHTML = helpSettings.text;
            }
            return {hasHelp:true, pause: helpSettings.pause};
        }
        return {hasHelp:false};
    }

    initLevel(){
        if(this.initialized) return;

        this.initialized = true;

        if (isFunction(this.loadResources))
            this.loadResources();
        else
            this.setup();

        this.gameLoop();        
    }

    addScreenLog(msg, color){
        if(!color) color = 'black';
        // if(this.screenLogPtr++ > 20 ){
        //     this.screenLogs.shift()
        //     this.screenLogPtr = 20;
        // }
        // this.screenLogs[this.screenLogPtr] = {msg,color};
        this.screenLogs.push({msg, color});
        if(this.screenLogs.length>20)
            this.screenLogs.shift();
    }

    insertScreenLog(ind, msg, color){
        if(!color) color = 'black';
        this.screenLogs.splice(ind, 0, {msg,color});

        if(this.screenLogs.length > 20 ){
            this.screenLogs.pop()
        }
    }    

    drawScreenLogs(){
        for(var i=0; i < this.screenLogs.length; i++){
            drawText(25, (25*i)+25, this.screenLogs[i].msg, 21, this.screenLogs[i].color);
        }
    }

    clearScreenLogs(){
        this.screenLogs = [];
        //this.screenLogPtr = 0;
    }

    addImages(pathArray){
        this.imageResourcesTotal = this.resourcesNeeded = pathArray.length;
        
        pathArray.map((path)=>{
            let image = new Image();
            image.src = path;
            image.addEventListener("load", this.loadedResource.bind(this), false);  
            this.images[path] = image;
        });
    }

    findResources(homeFolder, pathArray){
        if(!isArray(pathArray)) pathArray=[pathArray];
        homeFolder += '/';
        const isSharedPath = path=>path.includes('sharedMedia');
        const normalizeSharedPath = path=>path.replace(/\\/g, '/').replace(/^\.?\//, '').replace(/^(dist|src)\//, '');

        // console.log('bradEngine.resourceList',bradEngine.resourceList);
        let filteredResourceList = bradEngine.resourceList
            .filter(resourcePath=>
                pathArray.reduce((acc, userPath)=>{
                    if(isSharedPath(userPath) && resourcePath.includes(normalizeSharedPath(userPath)))
                        acc=true;
                    if(!isSharedPath(userPath) && resourcePath.includes(homeFolder+userPath))
                        acc=true; 
                    return acc
                },false)
            )
            .map(filePath=>{ // only include the path after the project folder if not in sharedMedia
                let hasPath = pathArray.filter(userPath=>{
                    //console.log(userPath);
                    if(filePath.includes('sharedMedia')) 
                        return false;
                    if(filePath.includes(homeFolder+userPath))
                        return true;
                    return false;
                });
                if(hasPath.length>0){
                    let pathParts = filePath.split(hasPath[0]);
                    return hasPath[0]+pathParts[1]; 
                }
                return filePath; 
            })
            .map(filePath=>{
                let pathParts = filePath.split('/')
                let filename = pathParts[pathParts.length-1];
                let ext = filename.substring(filename.lastIndexOf('.')+1, filename.length) || filename;
                let type = 'unknown';
                if(ext === 'jpg' || ext === 'png' || ext === 'bmp') type = 'img';
                if(ext === 'mp3' || ext === 'ogg' || ext === 'mpa') type = 'snd';
                if(ext === 'x' || ext === '3ds' || ext === 'obj') type = '3d'; 
                if(ext === 'txt') type = 'txt'; 
                // let path = bradEngine.rootFolder+filePath;
                let path = filePath;
                pathParts = filePath.split('sharedMedia');
                if(pathParts.length>1)
                    path = bradResolveAsset('src/sharedMedia'+pathParts[1]);
                return {path, name:filename, type}
            }).reduce((acc2, resourceObj)=>{
                acc2[resourceObj.name] = resourceObj;
                return acc2;
            },{}); 

        // console.log('filteredResourceList',filteredResourceList);
        if(isObjectEmpty(filteredResourceList)){
            console.log('>>>>>>>>>>>>>>>>> No media found');
            this.setup();
            return;
        }
        
        if(this.downloadDirList){
            let dirContent = "dirlist=`'";
            for (var key in filteredResourceList) 
                dirContent += filteredResourceList[key].path+'\n';
            dirContent += '`';        

            downloadFile('dirlist.js',dirContent);
        }

        this.imageResourcesTotal = this.resourcesNeeded = Object.keys(filteredResourceList).length;

        for (var key in filteredResourceList) {
            if(filteredResourceList[key].type==='img'){
                // console.log('loading image: '+filteredResourceList[key].path);
                let image = new Image();
                image.src = filteredResourceList[key].path;
                image.addEventListener("load", this.loadedResource.bind(this), false);  
                this.images[filteredResourceList[key].name] = image;            
            }

            if(filteredResourceList[key].type==='txt'){
                let loadPath = filteredResourceList[key].path;
                axios.get(loadPath).then(resp => {
                    this.loadedFiles[loadPath]=resp.data;
                    // console.log('loaded:'+loadPath,this.loadedMeshes[loadPath]);
                    this.loadedResource();
                })
            }

            if(filteredResourceList[key].type==='3d'){
                // console.log('loading 3D:'+filteredResourceList[key].path);
                let loadPath = filteredResourceList[key].path;
                let ext = loadPath.substring(loadPath.lastIndexOf('.')+1, loadPath.length) || loadPath;
                if(ext === 'x'){
                    axios.get(loadPath).then(resp => {
                        this.loadedMeshes[loadPath]=new MeshObject(Pipeline3D.parseDirectXFile(resp.data));
                        // console.log('loaded:'+loadPath,this.loadedMeshes[loadPath]);
                        this.loadedResource();
                    })
                }
                if(ext === 'obj'){
                    K3D.load(loadPath, data=>{
                        var k3dMesh = K3D.parse.fromOBJ(data);
                        this.loadedMeshes[loadPath]=new MeshObject(Pipeline3D.K3DtoModel(k3dMesh));  
                        this.loadedResource();
                    });
                }
            }
        }
    }    

    loadedResource() {
        this.resourcesNeeded--;
        if(this.resourcesNeeded <=0){
            this.resourcesNeeded = 0;
            this.setup();
            console.log("All Resources loaded ");
        }
    }    

    addObject(name, obj){
        if(!this.BRADObjMap.hasOwnProperty(name)){
            this.BRADObjMap[name] = obj;
            this.BRADObjects.push(obj);
            return obj;
        }
        else{
            console.log(`Can't add obj to level because the name is already taken: ${name}`);
        }
    }

    getObject(name){
        if(!this.BRADObjMap.hasOwnProperty(name)){
            console.log(`Object ${name} not found`);
            return{};
        }
        return this.BRADObjMap[name];
    }

    detectKeyboardInputEvent(event){
        if(isFunction(this.getKeyboardInput))
            this.getKeyboardInput(event);

        // iterate subscritptions
        if(EventTypes.KEYBOARD in this.subscriptions){            
            Object.keys(this.subscriptions[EventTypes.KEYBOARD]).forEach(key=>{
                this.subscriptions[EventTypes.KEYBOARD][key].func(event);
            });
        }
    }

    detectMouseInputEvent(event){        
        if(isFunction(this.getMouseInput)) 
            // clone the event so that nobody changes it by accedent
            this.getMouseInput({type:event.type,position:{x:event.position.x,y:event.position.y}});

        // iterate subscritptions
        if(EventTypes.MOUSE in this.subscriptions){            
            Object.keys(this.subscriptions[EventTypes.MOUSE]).forEach(key=>{

                let target = this.subscriptions[EventTypes.MOUSE][key].target;
                let offWidth1 = 0, offHeight1 = 0, offWidth2 = target.width, offHeight2 = target.height;
                if(target.centerObject){ // used for sprites in BRADObjects
                    offWidth1 = target.width/2, 
                    offWidth2 = target.width/2, 
                    offHeight1 = target.height/2;
                    offHeight2 = target.height/2;
                }                
                if(target.position && target.width && target.height){
                    if( // only give the component mouse events that are over it
                        (event.position.x >= target.position.x-offWidth1) &&
                        (event.position.x <= target.position.x+offWidth2) &&
                        (event.position.y >= target.position.y-offHeight1) &&
                        (event.position.y <= target.position.y+offHeight2) 
                    )
                        this.subscriptions[EventTypes.MOUSE][key].func({type:event.type,position:{x:event.position.x,y:event.position.y},target:this.subscriptions[EventTypes.MOUSE][key].target}); 
                }
                else{ // there are no bounds so just give the asker all mouse events
                    this.subscriptions[EventTypes.MOUSE][key].func({type:event.type,position:{x:event.position.x,y:event.position.y}});
                }
            });
        }            
    }

    detectMouseMoveInputEvent(event){    
        if(isFunction(this.getMouseMoveInput))
            this.getMouseMoveInput(event);

        // iterate subscritptions
        if(EventTypes.MOUSEMOVE in this.subscriptions){            
            Object.keys(this.subscriptions[EventTypes.MOUSEMOVE]).forEach(key=>{

                let target = this.subscriptions[EventTypes.MOUSEMOVE][key].target;
                let offWidth1 = 0, offHeight1 = 0, offWidth2 = target.width, offHeight2 = target.height;
                if(target.centerObject){ // used for sprites in BRADObjects
                    offWidth1 = target.width/2, 
                    offWidth2 = target.width/2, 
                    offHeight1 = target.height/2;
                    offHeight2 = target.height/2;
                }   
                if(target.position && target.width && target.height){
                    if(!isDefined(target.hasMouse)) target.hasMouse = false;

                    if( // only give the component mouse events that are over it
                        (event.position.x >= target.position.x-offWidth1) &&
                        (event.position.x <= target.position.x+offWidth2) &&
                        (event.position.y >= target.position.y-offHeight1) &&
                        (event.position.y <= target.position.y+offHeight2) 
                    ){ 
                        if(!target.hasMouse) 
                            event.type='enter';
                        event.target = target;
                        target.hasMouse = true;
                        this.subscriptions[EventTypes.MOUSEMOVE][key].func(event);
                    }
                    else{
                        if(target.hasMouse){
                            event.type='exit';
                            event.target = target;
                            this.subscriptions[EventTypes.MOUSEMOVE][key].func(event);
                            target.hasMouse = false;
                        }
                    }
                }
                else{ // there are no bounds so just give the asker all mouse events
                    this.subscriptions[EventTypes.MOUSEMOVE][key].func(event);
                }
            });
        }            
    }
    
    subscribe(type, objOrFunction){
        let func = {};
        if(isFunction(objOrFunction)){
            func = objOrFunction;
        }
        else{
            switch(type) {
                case EventTypes.KEYBOARD:
                    if(isFunction(objOrFunction.getKeyboardInput))
                        func = objOrFunction.getKeyboardInput;
                    else
                        console.log('There is no getKeyboardInput to subscribe too');
                    break;
                case EventTypes.MOUSE:
                    if(isFunction(objOrFunction.getMouseInput))
                        func = objOrFunction.getMouseInput;
                    else
                        console.log('There is no getMouseInput to subscribe too');
                    break;    
                case EventTypes.MOUSEMOVE:
                    if(isFunction(objOrFunction.getMouseMoveInput))
                        func = objOrFunction.getMouseMoveInput;
                    else
                        console.log('There is no getMouseMoveInput to subscribe too');
                    break;                    
                default:
                    console.log(`There is no function to subscribe too: ${type}`);
            }
        }

        if(!isFunction(func)){ return {error:'function required'} }

        if(!(type in this.subscriptions)) 
            this.subscriptions[type] = {};
        let uuid = createUUIDv4();
        let target = isObject(objOrFunction)?objOrFunction:{};
        this.subscriptions[type][uuid] = {func:func,target:target};
        return {type:type, subscription:uuid}
    }

    unsubscribe(tag){
        if(this.subscriptions[tag.type])
            delete this.subscriptions[tag.type][tag.subscription];
        if(isObjectEmpty(this.subscriptions[tag.type]))
            delete this.subscriptions[tag.type];
    }

    setup(){}
    gameLoop(){
        const innerFunc = () => {
            // don't auto repaint without a level update function
            if(!isFunction(this.update)) {
                if(isFunction(this.draw)) {
                    this.draw();
                    this.canvas.windowCtx.drawImage(this.canvas.element,0,0,this.canvas.windowCanvas.width,this.canvas.windowCanvas.height);
                }
                return; 
            }

            window.requestAnimationFrame(innerFunc);

            this.currentTime = (new Date()).getTime();
            
            for (let deltaKey in this.deltas) {
                this.deltas[deltaKey].delta = (this.currentTime-this.deltas[deltaKey].lastTime);

                if(this.deltas[deltaKey].delta > this.deltas[deltaKey].interval) {
                    if(deltaKey === 'Update'){        
                        //this.canvas.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
                        drawBox(0,0,this.canvas.width,this.canvas.height,'white')
                        // don't render components until all resources have been loaded
                        if((this.resourcesNeeded + this.soundResourcesNeeded) === 0){
                            this.update(this.deltas[deltaKey].delta/1000);
                            this.BRADObjects.forEach(obj => {if(isFunction(obj.gameLoop)) obj.gameLoop(this.deltas[deltaKey].delta/1000)});
                            //drawText(50,50,'FPS:'+Math.round(1/(this.deltas[deltaKey].delta/1000)),21,'black');
                            if(this.showDebug){
                                this.frameCnt++;
                                if(this.lastTime+1000 < Tools.getMilliseconds()){
                                    this.lastTime = Tools.getMilliseconds();
                                    this.staticFrameCnt = this.frameCnt;
                                    this.frameCnt=0;
                                }
                                this.insertScreenLog(0,'FPS:'+this.staticFrameCnt);                                
                            }
                            this.drawScreenLogs();
                            this.clearScreenLogs();
                        }
                        else{
                            this.updateLoading(this.deltas[deltaKey].delta/1000, 
                                (this.resourcesNeeded + this.soundResourcesNeeded), 
                                (this.imageResourcesTotal+this.soundResourcesTotal));
                        }
                    }
                    if(deltaKey === 'Physics') {
                        bradEngine.physics.calculateSimulation(this.deltas[deltaKey].delta/1000);
                    }
                    if(deltaKey === 'Network') {
                        if(isFunction(this.networkUpdate)) 
                            this.networkUpdate(this.deltas[deltaKey].delta/1000);
                    }
                    this.deltas[deltaKey].lastTime = this.currentTime - (this.deltas[deltaKey].delta % this.deltas[deltaKey].interval);
                }
            }
            this.canvas.windowCtx.drawImage(this.canvas.element,0,0,this.canvas.windowCanvas.width,this.canvas.windowCanvas.height);
        }
        innerFunc();
    }

    updateLoading(delta, leftToLoad, total){
        this.canvas.windowCtx.clearRect(0,0,this.canvas.windowCanvas.width,this.canvas.windowCanvas.height);
        drawText(this.canvas.width/2, this.canvas.height/2, `Loading (${leftToLoad} / ${total})`,50);
    }

    reDrawClear(){
        this.canvas.windowCtx.clearRect(0,0,this.canvas.windowCanvas.width,this.canvas.windowCanvas.height);
        this.draw();        
        this.canvas.windowCtx.drawImage(this.canvas.element,0,0,this.canvas.windowCanvas.width,this.canvas.windowCanvas.height);
    }

    reDraw(){
        this.draw();        
        this.canvas.windowCtx.drawImage(this.canvas.element,0,0,this.canvas.windowCanvas.width,this.canvas.windowCanvas.height);
    }    
}

function downloadFile(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }

const drawRoundBox = (x, y, width, height, col, params) => {
    if(!params) params={};

    let cornerRadius = { upperLeft: 0, upperRight: 0, lowerLeft: 0, lowerRight: 0 };    
    if (isObject(params.radius)) {
        for (let side in params.radius) {
            cornerRadius[side] = params.radius[side];
        }
    }

    // https://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-on-html-canvas
    canvas.ctx.beginPath();
    canvas.ctx.moveTo(x + cornerRadius.upperLeft, y);
    canvas.ctx.lineTo(x + width - cornerRadius.upperRight, y);
    canvas.ctx.quadraticCurveTo(x + width, y, x + width, y + cornerRadius.upperRight);
    canvas.ctx.lineTo(x + width, y + height - cornerRadius.lowerRight);
    canvas.ctx.quadraticCurveTo(x + width, y + height, x + width - cornerRadius.lowerRight, y + height);
    canvas.ctx.lineTo(x + cornerRadius.lowerLeft, y + height);
    canvas.ctx.quadraticCurveTo(x, y + height, x, y + height - cornerRadius.lowerLeft);
    canvas.ctx.lineTo(x, y + cornerRadius.upperLeft);
    canvas.ctx.quadraticCurveTo(x, y, x + cornerRadius.upperLeft, y);
    canvas.ctx.closePath();

    canvas.ctx.fillStyle = col;
    canvas.ctx.strokeStyle = col;

    if(params.canvasProps)
        for (const [key, value] of Object.entries(params.canvasProps)) 
            canvas.ctx[key] = value;

    if (params.fill) canvas.ctx.fill();        
    if (params.stroke) canvas.ctx.stroke();
} 

const drawBox2=(bounds, col, params)=>drawBox(bounds.position.x, bounds.position.y,bounds.width,bounds.height,col,params);
const drawBox=(x,y,w,h,col,params)=>{
    if(!params) params = {};
    canvas.ctx.beginPath();
    let outline = (params && params.outline) ? params.outline : false;
    canvas.ctx.rect(x, y, w, h);

    if(outline){
        let thickness = 15;
        if(params.thickness)
            thickness = params.thickness;
        canvas.ctx.lineWidth = thickness;
        canvas.ctx.strokeStyle = col;
        canvas.ctx.stroke();    
    }
    else{
        canvas.ctx.fillStyle = col;
        canvas.ctx.fill();
    }
}

const drawRotatedBoxR=(x,y,width,height,radians,col,params)=>{
    x += -width/2;
    y += -height/2;    
    canvas.ctx.save();
    canvas.ctx.beginPath();
    canvas.ctx.translate( x+width/2, y+height/2 );
    canvas.ctx.rotate(radians);
    canvas.ctx.rect( -width/2, -height/2, width,height);
    canvas.ctx.fillStyle=col;
    canvas.ctx.fill();
    canvas.ctx.restore();
}

const drawRotatedBox=(x,y,width,height,degrees,col,params)=>{
    canvas.ctx.save();
    canvas.ctx.beginPath();
    canvas.ctx.translate( x+width/2, y+height/2 );
    canvas.ctx.rotate(degrees*Math.PI/180);
    canvas.ctx.rect( -width/2, -height/2, width,height);
    canvas.ctx.fillStyle=col;
    canvas.ctx.fill();
    canvas.ctx.restore();
}

const drawRotatedOffsetBox=(x,y,width,height,degrees,col, pivit,params)=>{
    canvas.ctx.save();
    canvas.ctx.beginPath();
    canvas.ctx.translate( pivit.x, pivit.y);
    canvas.ctx.rotate(degrees*Math.PI/180);
    canvas.ctx.rect( x, y, width,height);
    canvas.ctx.fillStyle=col;
    canvas.ctx.fill();
    canvas.ctx.restore();
}

const drawCircle2=(position, r, col, params)=>drawCircle(position.x, position.y,r,col,params);
const drawCircle=(x,y,r,col,params)=>{
    if(!params) params = {};
    canvas.ctx.beginPath();
    let outline = (params && params.outline) ? params.outline : false;
    let startAngle = (params && params.startAngle) ? Math.PI * params.startAngle : 0;
    let endAngle = (params && params.endAngle) ? Math.PI * params.endAngle : Math.PI * 360;
    canvas.ctx.arc(x, y, r, startAngle, endAngle);

    if(outline){
        canvas.ctx.lineWidth = 15;
        canvas.ctx.strokeStyle = col;
        canvas.ctx.stroke();    
    }
    else{
        canvas.ctx.fillStyle = col;
        canvas.ctx.fill();
    }
}

const drawLine2=(position1, position2, col, params)=> drawLine(position1.x,position1.y,position2.x,position2.y,col,params)
const drawLine=(x1,y1,x2,y2,col,params)=>{
    if(!params) params = {};
    canvas.ctx.beginPath();
    canvas.ctx.strokeStyle = col;
    canvas.ctx.lineWidth = (params.lineWidth)?params.lineWidth:1;
    canvas.ctx.moveTo(x1,y1);
    canvas.ctx.lineTo(x2,y2);
    canvas.ctx.stroke();
    canvas.ctx.closePath();
}

function drawRay(slope, intercept, scale, offset){
    scale = canvas.height;
    const x1 = 0 + offset.x;
    const y1 = (intercept * scale) + offset.y;
    const x2 = canvas.width + offset.x;
    const y2 = slope * x2 + (intercept * scale) + offset.y;
    drawLine(x1, y1,x2, y2,'green',{lineWidth:10});
}

const drawLine3D=(x1, y1, z1, x2, y2, z2,col, params)=>{   
    var project2D1=Tools.projectTo2D(x1, y1, z1, canvas.width, canvas.height);
    var project2D2=Tools.projectTo2D(x2, y2, z2, canvas.width, canvas.height);
    drawLine(project2D1.x,project2D1.y,project2D2.x,project2D2.y,col, params);
}

const drawCircle3D=(x, y, z, r, col, params)=>{   
    var project2D=Tools.projectTo2D(x, y, z, canvas.width, canvas.height);
    var project2DEdge=Tools.projectTo2D(x+r, y, z, canvas.width, canvas.height);
    var size = Math.abs(project2D.x - project2DEdge.x);
    drawCircle(project2D.x,project2D.y, size, col, params);
}

const drawFill=(path,col, params)=>{
    canvas.ctx.fillStyle = col;
    canvas.ctx.beginPath();
    for(let i=0; i<path.length; i++){
        if(i===0)
            canvas.ctx.moveTo(path[i].x, path[i].y);
        else
            canvas.ctx.lineTo(path[i].x,path[i].y);
    }
    canvas.ctx.closePath();
    canvas.ctx.fill();  
    
    // canvas.ctx.strokeStyle = col;
    // canvas.ctx.stroke();  
}

const drawLines=(path,col, params)=>{
    canvas.ctx.fillStyle = col;
    canvas.ctx.beginPath();
    canvas.ctx.lineWidth = (params.lineWidth)?params.lineWidth:1;
    for(let i=0; i<path.length; i++){
        if(i===0)
            canvas.ctx.moveTo(path[i].x, path[i].y);
        else
            canvas.ctx.lineTo(path[i].x,path[i].y);
    }
    if(!params.openPath) canvas.ctx.closePath();
    canvas.ctx.strokeStyle = col;
    canvas.ctx.stroke();  
}


const drawText2=(position, text, size, col, params)=>drawText(position.x, position.y, text, size, col, params);
const drawText=(x,y,text,size,col,params)=>{
    if(!params) params = {};
    canvas.ctx.font = size+"px Arial";
    canvas.ctx.fillStyle = col;
    if(params.canvasProps)
        for (const [key, value] of Object.entries(params.canvasProps)) 
            canvas.ctx[key] = value;    
    canvas.ctx.fillText(text, x, y);
}

const createBufferedImage=(width, height)=>{
    var canvas2 = document.createElement('canvas');
    canvas2.width = width;
    canvas2.height = height;
    return canvas2;
}

const createFlippedImage=(image, width, height)=>{
    let canvas2 = document.createElement('canvas');
    canvas2.width = width;
    canvas2.height = height;
    let context2 = canvas2.getContext('2d');
    context2.translate(width, 0);
    context2.scale(-1, 1);
    context2.drawImage(bradEngine.currentLevel.images[image], 0, 0, width, height);
    return canvas2;
}

const createMonoDataImage=(colors, alpha, width, height)=>{
    let image = canvas.ctx.createImageData(width, height);
    let data = image.data;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let cell = (x + y * width) * 4;
            data[cell] = data[cell + 1] = data[cell + 2] = colors[y][x];
            data[cell + 3] = alpha;
        }
    }
    return image;
}
const drawDataImage=(dataImage, x1, y1, w1, h1)=>{
    canvas.ctx.putImageData(dataImage, x1, y1);
    return {x:x1, y: y1, w:w1, h:h1};
}

const getImageData=(image)=>{
    let canvas2 = document.createElement('canvas');
    canvas2.width = image.width;
    canvas2.height = image.height;
    let context2 = canvas2.getContext('2d');
    context2.drawImage(image, 0, 0, image.width, image.height);    
    return context2;
}

const drawSpritePixel=(img, x1, y1, w1, h1, x2, y2, w2, h2, brightness)=>{
    canvas.ctx.imageSmoothingEnabled = false;
    canvas.ctx.filter = `brightness(${brightness})`;
    canvas.ctx.drawImage(img, x1, y1, w1, h1, x2, y2, w2, h2);
    canvas.ctx.imageSmoothingEnabled = true;
    canvas.ctx.filter = `brightness(1)`;
}

const getPixelData=(image)=>{
    let canvas2 = document.createElement('canvas');
    canvas2.width = image.width;
    canvas2.height = image.height;
    let context2 = canvas2.getContext('2d');
    context2.drawImage(image, 0, 0, image.width, image.height);    
    return context2.getImageData(0,0,image.width, image.height);
}

const getPixelColorAt=(pixelData,x,y, hasAlpha)=>{
    var index = (y*pixelData.width + x) * 4;
    if(hasAlpha)
        return {r: pixelData.data[index], g: pixelData.data[index+1],  b: pixelData.data[index+2], a: pixelData.data[index+3]};
    return {r: pixelData.data[index], g: pixelData.data[index+1],  b: pixelData.data[index+2]};
}

const drawSprite2=(img, bounds1, bounds2)=> drawSprite(img, bounds1.position.x, bounds1.position.y, bounds1.width, bounds1.height,bounds2.position.x, bounds2.position.y, bounds2.width, bounds2.height);  
const drawSprite=(img, x1, y1, w1, h1, x2, y2, w2, h2)=>
    canvas.ctx.drawImage(img, x1, y1, w1, h1, x2, y2, w2, h2);

const drawImage2=(img, bounds)=>drawImage(img, bounds.position.x, bounds.position.y, bounds.width, bounds.height);  
const drawImageR=(imgString, x1, y1, w1, h1, radians)=>{
    drawRotatedImageR(imgString, x1, y1, w1, h1, radians); 
    return {x:x1, y: y1, w:w1, h:h1};
}
const drawImage=(imgString, x1, y1, w1, h1, degrees)=>{
    if(degrees && degrees!==0){ 
        drawRotatedImage(imgString, x1, y1, w1, h1, degrees); 
        return {x:x1, y: y1, w:w1, h:h1};
    }
    canvas.ctx.drawImage(bradEngine.currentLevel.images[imgString], x1-w1, y1-h1, w1*2, h1*2);
    return {x:x1, y: y1, w:w1, h:h1};
}
const drawImageSprite=(imgString, x1, y1, w1, h1, x2, y2, w2, h2, degrees)=>{
    if(degrees && degrees!==0){ 
        drawRotatedSprite(imgString, x1, y1, w1, h1, x2, y2, w2, h2, degrees); 
        return {x:x2, y: y2, w:w2, h:h2};
    }
    canvas.ctx.drawImage(bradEngine.currentLevel.images[imgString], x1, y1, w1, h1, x2-w2, y2-h2, w2*2, h2*2);
    return {x:x2, y: y2, w:w2, h:h2};
}

const drawImageSpriteFrom00=(imgString, x1, y1, w1, h1, x2, y2, w2, h2, ctx=canvas.ctx)=>{
    ctx.drawImage(bradEngine.currentLevel.images[imgString], x1, y1, w1, h1, x2, y2, w2, h2);
    return {x:x2, y: y2, w:w2, h:h2};
}

const drawImageFrom00=(imgString, x1, y1, w1, h1)=>{
    canvas.ctx.drawImage(bradEngine.currentLevel.images[imgString], x1, y1, w1, h1);
    return {x:x1, y: y1, w:w1, h:h1};
}
const drawImage3D=(imgString, x1, y1, z1, w1, h1, degrees)=>{
    if(degrees && degrees!==0){ 
        var projectEdge1=Tools.projectTo2D(x1, y1, z1, canvas.width, canvas.height);
        var projectEdge2=Tools.projectTo2D(x1 + w1, y1 + h1, z1, canvas.width, canvas.height)
        
        let w2 = Tools.clampMin(projectEdge2.x - projectEdge1.x,0); 
        let h2 = Tools.clampMin(projectEdge2.y - projectEdge1.y,0); 
    
        drawRotatedImage(imgString, projectEdge1.x, projectEdge1.y, w2, h2, degrees); 
        return {x:projectEdge1.x, y: projectEdge1.y, w:w2, h:h2};
    }

    var projectEdge1=Tools.projectTo2D(x1, y1, z1, canvas.width, canvas.height);
    var projectEdge2=Tools.projectTo2D(x1 + w1, y1 + h1, z1, canvas.width, canvas.height)
    
    let w2 = Tools.clampMin(projectEdge2.x - projectEdge1.x,0); 
    let h2 = Tools.clampMin(projectEdge2.y - projectEdge1.y,0); 

    drawImage(imgString, projectEdge1.x, projectEdge1.y, w2, h2); 
    return {x:projectEdge1.x, y: projectEdge1.y, w:w2, h:h2};    
}

const drawSprite3D=(imgString, x1, y1, w1, h1, x2, y2, z1, w2, h2, degrees)=>{
    if(degrees && degrees!==0){ 
        var projectEdge1=Tools.projectTo2D(x2, y2, z1, canvas.width, canvas.height);
        var projectEdge2=Tools.projectTo2D(x2 + w2, y2 + h2, z1, canvas.width, canvas.height)
        
        let w3D = Tools.clampMin(projectEdge2.x - projectEdge1.x,0); 
        let h3D = Tools.clampMin(projectEdge2.y - projectEdge1.y,0); 
    
        drawRotatedSprite(imgString, x1, y1, w1, h1, projectEdge1.x, projectEdge1.y, w3D, h3D, degrees); 
        return {x:projectEdge1.x, y: projectEdge1.y, w:w3D, h:h3D};
    }

    var projectEdge1=Tools.projectTo2D(x2, y2, z1, canvas.width, canvas.height);
    var projectEdge2=Tools.projectTo2D(x2 + w2, y2 + h2, z1, canvas.width, canvas.height)
    
    let w3D = Tools.clampMin(projectEdge2.x - projectEdge1.x,0); 
    let h3D = Tools.clampMin(projectEdge2.y - projectEdge1.y,0); 

    drawImageSprite(imgString, x1, y1, w1, h1, projectEdge1.x, projectEdge1.y, w3D, h3D); 
    return {x:projectEdge1.x, y: projectEdge1.y, w:w3D, h:h3D};    
}

const drawRotatedImageR=(image,x,y,width,height,radians,params)=>{
    canvas.ctx.save();
    canvas.ctx.beginPath();
    canvas.ctx.translate( x, y);
    canvas.ctx.rotate(radians);
    canvas.ctx.drawImage(bradEngine.currentLevel.images[image], -width, -height, (width*2), (height*2));
    canvas.ctx.fill();
    canvas.ctx.restore();
}

const drawRotatedSpriteR=(image,x1,y1,width1,height1,x2,y2,width2,height2,radians,params)=>{
    canvas.ctx.save();
    canvas.ctx.beginPath();
    canvas.ctx.translate( x2, y2);
    canvas.ctx.rotate(radians);
    canvas.ctx.drawImage(bradEngine.currentLevel.images[image], x1, y1, width1, height1,-width2, -height2, (width2*2), (height2*2));
    canvas.ctx.fill();
    canvas.ctx.restore();
}

const drawRotatedImage=(image,x,y,width,height,degrees,params)=>{
    canvas.ctx.save();
    canvas.ctx.beginPath();
    canvas.ctx.translate( x, y);
    canvas.ctx.rotate(Tools.toRadians(degrees));
    canvas.ctx.drawImage(bradEngine.currentLevel.images[image], -width, -height, (width*2), (height*2));
    canvas.ctx.fill();
    canvas.ctx.restore();
}

const drawRotatedSprite=(image,x1, y1, w1, h1, x,y,width,height,degrees,params)=>{
    canvas.ctx.save();
    canvas.ctx.beginPath();
    canvas.ctx.translate( x, y);
    canvas.ctx.rotate(Tools.toRadians(degrees));
    canvas.ctx.drawImage(bradEngine.currentLevel.images[image],x1, y1, w1, h1, -width, -height, (width*2), (height*2));
    canvas.ctx.fill();
    canvas.ctx.restore();
}

const drawRotatedFlippableImage=(image,x,y,width,height,degrees,params)=>{
    canvas.ctx.save();
    canvas.ctx.beginPath();
    canvas.ctx.translate(x, y);
    canvas.ctx.rotate(Tools.toRadians(degrees));

    let flipScale = 1;
    let flopScale = 1;
    // Flip/flop the canvas
    if(params && params.flip) flipScale=-1;
    if(params && params.flop) flopScale=-1;

    canvas.ctx.scale(flipScale, flopScale);        

    canvas.ctx.drawImage(image, -width, -height, (width*2), (height*2));
    canvas.ctx.fill();
    canvas.ctx.restore();
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        if(!(this.sound.duration > 0 && ! this.sound.paused))
            this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }    
}

class BradEngine{

    constructor(){        
        this.currentLevel = {};
        this.network = {};
        this.physics = {};

        const rawDirList = (typeof dirlist !== 'undefined') ? dirlist : '';
        this.resourceList=rawDirList.split('\n').filter(rawLine=>rawLine.trim()!=='').map(line=>{
            let path = line.trim().replace(/\\/g, '/');
            path = path.replace(/^.*\/BradEngine(?:_Public)?\//i, '');
            return path.replace(/^\.?\//, '');
        })
        this.rootFolder=(typeof META !== 'undefined' && META.ROOT_FOLDER) ? META.ROOT_FOLDER : '';
        console.log(this.rootFolder);
        
        this.loadEngine();
    }

    initPhysics(fps){
        if(fps){
            this.currentLevel.physicsfps = fps;
            if(typeof META !== 'undefined'){ META.PHYSICS_FPS = fps;}
        }
        if(isObjectEmpty(this.physics)) this.physics = new Physics(canvas);
        if (!('Physics' in this.currentLevel.deltas)){
            this.currentLevel.deltas['Physics']={
                delta: 0,
                interval: 1000/this.currentLevel.physicsfps,
                lastTime: (new Date()).getTime()                
            }
        }
        return this.physics;
    }

    initPhysics3D(scale=1, gravity={x:0,y:-9.82,z:0}, fps){
        if(fps){
            this.currentLevel.physicsfps = fps;
            if(typeof META !== 'undefined'){ META.PHYSICS_FPS = fps;}
        }
        if(isObjectEmpty(this.physics)) this.physics = new Physics3D(scale, gravity);
        if (!('Physics' in this.currentLevel.deltas)){
            this.currentLevel.deltas['Physics']={
                delta: 0,
                interval: 1000/this.currentLevel.physicsfps,
                lastTime: (new Date()).getTime()                
            }
        }
        return this.physics;
    }

    initNetwork(callback, fps){
        if(fps){
            this.currentLevel.networkfps = fps;
            if(typeof META !== 'undefined'){ META.NETWORK_FPS = fps;}
        }
        if(isObjectEmpty(this.network)) this.network = new Network(callback);
        if (!('Network' in this.currentLevel.deltas)){
            this.currentLevel.deltas['Network']={
                delta: 0,
                interval: 1000/this.currentLevel.networkfps,
                lastTime: (new Date()).getTime()                
            }
        }
        return this.network;
    }

    loadEngine(){
        var vendors = ['webkit', 'moz'];
        for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
            window.cancelAnimationFrame =
            window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
        }

        const canvasDoc = document.getElementById('canvas');
        canvas = new Canvas(createBufferedImage(1024,768), canvasDoc);// new Canvas(canvasDoc);
        this.currentLevel = new MainLevel(canvas);

        document.addEventListener('keydown', e => {
            const keyName = e.key;
            if (e.repeat) return;

            let combined = [];

            if (e.ctrlKey) combined.push('ctrl');
            if (e.altKey) combined.push('alt');
            if (e.shiftKey) combined.push('shift');

            this.currentLevel.detectKeyboardInputEvent({type:'down',key:keyName, combined:combined});
        });

        document.addEventListener('keyup', e => {
            const keyName = e.key;
            this.currentLevel.detectKeyboardInputEvent({type:'up',key:keyName, combined:[]});       
        });

        // Add the event listeners for mousedown, mousemove, and mouseup
        const runClickEvent=e=>{
            if(e.touches) e = e.touches[0];
            const rect = canvasDoc.getBoundingClientRect();    
            let x = ((e.clientX - rect.left)/canvas.windowCanvas.width)*canvas.width;
            let y = ((e.clientY - rect.top)/canvas.windowCanvas.height)*canvas.height;
            this.currentLevel.detectMouseInputEvent({type:'down',position:{x,y}}); 
        };
        const runMouseMoveEvent=e=>{
            if(e.touches) e = e.touches[0];
            const rect = canvasDoc.getBoundingClientRect();
            let x = ((e.clientX - rect.left)/canvas.windowCanvas.width)*canvas.width;
            let y = ((e.clientY - rect.top)/canvas.windowCanvas.height)*canvas.height;
            this.currentLevel.detectMouseMoveInputEvent({type:'moving',position:{x,y}});
        };
        const runMouseUpEvent=e=>{
            try{
                if(e.touches) e = e.touches[0];
                const rect = canvasDoc.getBoundingClientRect();    
                let x = ((e.clientX - rect.left)/canvas.windowCanvas.width)*canvas.width;
                let y = ((e.clientY - rect.top)/canvas.windowCanvas.height)*canvas.height;
                this.currentLevel.detectMouseInputEvent({type:'up',position:{x,y}});  
            }
            catch(err){ // android drag/drop will have e.clientX and e.clientY are undefined
                this.currentLevel.detectMouseInputEvent({type:'up',position:{x:0,y:0}});  
            }
        };
        canvasDoc.addEventListener('mousedown', e => {runClickEvent(e)});
        canvasDoc.addEventListener('mousemove', e => {runMouseMoveEvent(e)});
        canvasDoc.addEventListener('mouseup', e => {runMouseUpEvent(e)});          

        canvasDoc.addEventListener('touchstart',e => {runClickEvent(e)});
        canvasDoc.addEventListener('touchmove',e => {e.preventDefault();runMouseMoveEvent(e);});
        canvasDoc.addEventListener('touchend', e => {runMouseUpEvent(e);}); 
        canvasDoc.addEventListener('touchcancel', e => {runMouseUpEvent(e);}); 
    }
}

let bradEngine = {};
// start BRADEngine
window.onload = (event) => {
    bradEngine = new BradEngine();
    const helpSettings = bradEngine.currentLevel.initHelp();
    if(!helpSettings.hasHelp || !helpSettings.pause){
        bradEngine.currentLevel.initLevel();
        document.getElementById("content").style.display = "block"; 
    }
};

function helpOverlayOn() { 
    if(!window.mobileCheck())
        document.getElementById("overlayHelpDialog").style.display = "block"; 
    else
        document.getElementById("overlayHelpDialogMobile").style.display = "block"; 
}
function helpOverlayOff() { 
    if(!window.mobileCheck())
        document.getElementById("overlayHelpDialog").style.display = "none"; 
    else
        document.getElementById("overlayHelpDialogMobile").style.display = "none";  
    document.getElementById("content").style.display = "block";                
    bradEngine.currentLevel.initLevel();
}
function drawHelpKey(keyNames){
    let keys = '';
    if (isArray(keyNames))
        keyNames.forEach(key=>{keys += `[ ${key} ] `;});    
    else keys = `[ ${keyNames} ]`;
    return `<span class="helpKey">${keys}</span>`
}
