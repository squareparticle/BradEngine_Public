class MainLevel extends LevelInterface {
    //loadResources(){this.findResources('examples/3d/3dGraphicsEngine','images');}    
    
    setupHelpDialog(){
        const textParts= [`
            <span class="HelpHeader">Description</span><br>
            Procedurally generated planets using 3D Perlin noise, shadows and filtered cut off<br>
            ${drawHelpKey('Planet 1')} Earth like <br>
            ${drawHelpKey('Planet 2')} Added Shadows <br>
            ${drawHelpKey('Planet 3')} Interpolate colors <br>
            ${drawHelpKey('Planet 4')} Milk <br>
            ${drawHelpKey('Planet 5')} Plazma <br>
            ${drawHelpKey('Planet 6')} Alien like <br>
            ${drawHelpKey('Planet 7')} Shadow cross section <br><br><br>
            `,`
            <span class="HelpHeader">Instructions</span><br>
              ${drawHelpKey(']')} Next Planet <br>
              ${drawHelpKey('[')} Pevious Planet <br>
              ${drawHelpKey('+')} Zoom in <br>
              ${drawHelpKey('-')} Zoom out <br>
              ${drawHelpKey('9')} Move cross section up <br>
              ${drawHelpKey('0')} Move cross section down <br><br><br>
              `,`
              <span class="HelpHeader">JSON</span>
              <pre><code class="javascript" style="font-size: 22px;padding:0;">
renderer:[
    {method:addNoise,params:{fn:'perlin',scale:200}},
    {method:filterCutoff,params:{cutoff :150/255, cutoffTween : 100/255}},
    {method:addNoise,params:{fn:'perlin',scale:50}},
    {method:generateLightMap,params:{lightPos:0,softness : 0.008, minBrightness : 0.4, maxBrightness : 1.0}},
    {method:colorDataImage,params:{alpha:255}}
]
                </code></pre>
                <br><br>
              `];
        return {textParts, pause:false}
    }

    getKeyboardInput(event){
        if(event.type==="down"){
            if(event.key==="[") {
                this.currentWorld--; 
                if(this.currentWorld<1)
                    this.currentWorld=this.planets.length-1; 
            }      
            if(event.key==="]") {
                this.currentWorld++; 
                if(this.currentWorld>this.planets.length-1)
                    this.currentWorld=1;                 
            }      

            if(event.key==="+") {
                this.multScale+=0.1;
            }      
            if(event.key==="-") {
                this.multScale-=0.1;
            }  
            
            if(event.key==="9") {
                this.shadowLoc+=0.1;
            }      
            if(event.key==="0") {
                this.shadowLoc-=0.1;
            }              
        }
    }

    setup(){
        this.depth = 0;
        this.currentWorld = 1;
        this.multScale = 1;
        this.shadowLoc = 0;

        this.planets=[
            {
                name:'Default',                                                
                grad:true,
                lightMap:[],
                switchShadow:0.6,
                switchShadowSoft:5,
                renderer:[
                    {method:this.addNoise,params:{fn:'perlin',scale:200}},
                    {method:this.filterCutoff,params:{cutoff :150/255, cutoffTween : 100/255}},
                    {method:this.addNoise,params:{fn:'perlin',scale:50}},
                    {method:this.generateLightMap,params:{lightPos:0,softness : 0.008, minBrightness : 0.4, maxBrightness : 1.0}},
                    {method:this.colorDataImage,params:{alpha:255}}
                ]
            },
            {
                name:'Earth Like Flat',
                cutoff :150,
                cutoffTween : 100,
                lightSoftness : 0.008,// 0.18;
                minBrightness : 0.4,
                maxBrightness : 1.0,
                grad:false,
                renderer:[
                    {method:this.removeLightMap,params:{}},
                    {method:this.addNoise,params:{fn:'perlin',scale:200}},
                    {method:this.filterCutoff,params:{cutoff :150/255, cutoffTween : 100/255}},
                    {method:this.addNoise,params:{fn:'perlin',scale:50}},
                    {method:this.colorDataImage,params:{alpha:255}}
                ],
                colors:[
                    //water
                    {i:0,r:59, g:49, b:139,start:0,end:255,grad:true},
                    // {i:1,r:59, g:49, b:139,start:0,end:255,grad:true},
                    {i:2,r:30, g:143, b:184,start:0,end:255,grad:true},
                    //sand
                    {i:3,r:206, g:162, b:75,start:0,end:255,grad:true},
                    {i:4,r:121, g:95, b:24,start:0,end:255,grad:true},
                    // grass
                    {i:5,r:36, g:101, b:24,start:0,end:255,grad:true},
                    // snow
                    {i:6,r:36, g:101, b:24,start:0,end:255,grad:true},
                    {i:7,r:36, g:101, b:24,start:0,end:255,grad:true},
                    {i:8,r:128, g:128, b:128,start:0,end:255,grad:true},
                    {i:9,r:128, g:128, b:128,start:0,end:255,grad:true},
                    {i:10,r:255, g:255, b:255,start:0,end:255,grad:true}     
                ]
            },
            {
                name:'Earth Like Shadow',
                cutoff :150,
                cutoffTween : 100,
                lightSoftness : 0.008,// 0.18;
                minBrightness : 0.4,
                maxBrightness : 1.0,
                grad:false,
                colors:[
                    //water
                    {i:0,r:59, g:49, b:139,start:0,end:255,grad:true},
                    // {i:1,r:59, g:49, b:139,start:0,end:255,grad:true},
                    {i:2,r:30, g:143, b:184,start:0,end:255,grad:true},
                    //sand
                    {i:3,r:206, g:162, b:75,start:0,end:255,grad:true},
                    {i:4,r:121, g:95, b:24,start:0,end:255,grad:true},
                    // grass
                    {i:5,r:36, g:101, b:24,start:0,end:255,grad:true},
                    // snow
                    {i:6,r:36, g:101, b:24,start:0,end:255,grad:true},
                    {i:7,r:36, g:101, b:24,start:0,end:255,grad:true},
                    {i:8,r:128, g:128, b:128,start:0,end:255,grad:true},
                    {i:9,r:128, g:128, b:128,start:0,end:255,grad:true},
                    {i:10,r:255, g:255, b:255,start:0,end:255,grad:true}     
                ]
            },                        
            {
                name:'Earth Like Gradient',
                cutoff :150,
                cutoffTween : 100,
                lightSoftness : 0.008,// 0.18;
                minBrightness : 0.4,
                maxBrightness : 1.0,
                grad:true,
                colors:[
                    //water
                    {i:0,r:59, g:49, b:139,start:0,end:255,grad:true},
                    // {i:1,r:59, g:49, b:139,start:0,end:255,grad:true},
                    {i:2,r:30, g:143, b:184,start:0,end:255,grad:true},
                    //sand
                    {i:3,r:206, g:162, b:75,start:0,end:255,grad:true},
                    {i:4,r:121, g:95, b:24,start:0,end:255,grad:true},
                    // grass
                    {i:5,r:36, g:101, b:24,start:0,end:255,grad:true},
                    // snow
                    {i:6,r:36, g:101, b:24,start:0,end:255,grad:true},
                    {i:7,r:36, g:101, b:24,start:0,end:255,grad:true},
                    {i:8,r:128, g:128, b:128,start:0,end:255,grad:true},
                    {i:9,r:128, g:128, b:128,start:0,end:255,grad:true},
                    {i:10,r:255, g:255, b:255,start:0,end:255,grad:true}     
                ]
            },
            {
                name:'Milk',
                cutoff :150,
                cutoffTween : 100,
                lightSoftness : 0.008,// 0.18;
                minBrightness : 0.4,
                maxBrightness : 1.0,
                grad:false,
                renderer:[
                    {method:this.addNoise,params:{fn:'perlin',scale:200}},
                    {method:this.generateLightMap,params:{lightPos:0,softness : 0.008, minBrightness : 0.4, maxBrightness : 1.0}},
                    {method:this.colorDataImage,params:{alpha:255}}
                ],                
                colors:[
                    {i:0,r:59, g:49, b:139,start:0,end:255,grad:false},
                    {i:2,r:255, g:255, b:255,start:0,end:255,grad:false}
                ]
            },            
            {
                name:'Earth Like Gradient',
                cutoff :150,
                cutoffTween : 100,
                lightSoftness : 0.008,// 0.18;
                minBrightness : 0.4,
                maxBrightness : 1.0,
                grad:true,
                renderer:[
                    {method:this.addNoise,params:{fn:'perlin',scale:200}},
                    {method:this.generateLightMap,params:{lightPos:0,softness : 0.008, minBrightness : 0.4, maxBrightness : 1.0}},
                    {method:this.colorDataImage,params:{alpha:255}}
                ],                 
                colors:[
                    {i:0,r:0,g:0,b:100,start:0,end:50,grad:true}, // dark blue
                    {i:1,r:0,g:0,b:255,start:50,end:100,grad:true}, // blue
                    {i:1,r:100,g:90,b:79,start:100,end:105,grad:true}, // sand
                    {i:2,r:42,g:62,b:42,start:105,end:110,grad:true}, // green
                    {i:3,r:0,g:255,b:0,start:110,end:260,grad:true} // green2
                ]
            },              
            {
                name:'Earth Like Gradient',
                cutoff :150,
                cutoffTween : 100,
                lightSoftness : 0.008,// 0.18;
                minBrightness : 0.4,
                maxBrightness : 1.0,
                grad:true,
                colors:[
                    {i:0,r:0,g:0,b:100,start:0,end:50,grad:true}, // dark blue
                    {i:1,r:0,g:0,b:255,start:50,end:100,grad:true}, // blue
                    {i:1,r:100,g:90,b:79,start:100,end:105,grad:true}, // sand
                    {i:2,r:42,g:62,b:42,start:105,end:110,grad:true}, // green
                    {i:3,r:0,g:255,b:0,start:110,end:260,grad:true} // green2
                ]
            },            
            {
                name:'Alien 1',
                cutoff :150,
                cutoffTween : 100,
                lightSoftness : 0.008,// 0.18;
                minBrightness : 0.4,
                maxBrightness : 1.0,
                switchShadow:0.8,
                switchShadowSoft:-1, // -1 removes top shadow
                grad:true,
                colors: [
                    {i:0,r:0,g:0,b:100,start:0,end:50,grad:true}, // dark blue
                    {i:1,r:0,g:0,b:255,start:50,end:100,grad:true}, // blue
                    {i:1,r:100,g:90,b:79,start:100,end:105,grad:true}, // sand
                    {i:2,r:42,g:62,b:42,start:105,end:110,grad:true}, // green
                    {i:3,r:0,g:255,b:0,start:110,end:260,grad:true} // green2
                ]
            }
        ];
        this.planets.forEach(planet=>{
            this.setupColor(this.planets[0],planet);
            if(typeof planet.switchShadow === 'undefined') planet.switchShadow = this.planets[0].switchShadow;
            if(typeof planet.switchShadowSoft === 'undefined') planet.switchShadowSoft= this.planets[0].switchShadowSoft;
        });
    }

    createNoiseImage(defaults, planet, width, height, depth){
        let renderer = defaults.renderer;
        if(planet.renderer)
            renderer = planet.renderer;
        let noiseMap = [];
        let noiseImage = canvas.ctx.createImageData(width, height);
        for(let r=0; r<renderer.length; r++){
            renderer[r].method(this, noiseImage, noiseMap, defaults, planet, width, height, depth, renderer[r].params);
        }
        return noiseImage;
    }

    setupColor(_default, planet){
        if(!planet.colors) return;
        let evenSpit = Math.ceil((255-planet.cutoff)/(planet.colors.length-1));
        planet.colors.forEach((color,i)=>{
            color.start=((i-1)*evenSpit)+planet.cutoff;
            color.end=color.start+evenSpit;
            if(typeof planet.grad !=='undefined')
                color.grad = planet.grad;
        });
        planet.colors[0].start=0;
        planet.colors[0].end=planet.cutoff;        
    }

    getHightValuesFromImageData(imageData, height, width){
        let heightMap=[];
        for(let y=0; y<height; y++){
            heightMap[y]=[];
            for(let x=0; x<width; x++){
                heightMap[y][x] = imageData.getImageData(x, y, 1, 1).data[0];
            }
        }
        return heightMap;
    }

    removeLightMap(level, noiseImage, noiseMap, defaults, planet, width, height, depth, params){
        defaults.lightMap=[];
    }

    addNoise(level, noiseImage, noiseMap, defaults, planet, width, height, depth, params){
        let {fn, scale} = params;
        scale *= level.multScale;
        let noisefn = fn === 'simplex' ? noise.simplex3 : noise.perlin3;        
        for (let y = 0; y < height; y++) {
            if(!noiseMap[y]) noiseMap[y]=[];
            for (let x = 0; x < width; x++) {
                let value = noisefn(x / scale, y / scale, depth);
                let newNoise = ((1 + value) * 1.1 * 128)/255;
                if(typeof noiseMap[y][x]==='undefined'){
                    noiseMap[y][x] = newNoise;
                }
                else{
                    noiseMap[y][x] *=newNoise;
                    noiseMap[y][x] += 0.55;
                }
            }
        }
        return noiseMap;
    }

    colorDataImage=(level, noiseImage, noiseMap, defaults, planet, width, height, depth, params)=>{
        let heightMap = noiseMap;
        let {colors} = planet;
        let {lightMap} = defaults; 
        let {alpha} = params;

        let data = noiseImage.data;
    
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let cell = (x + y * width) * 4;
                let height = heightMap[y][x]*255;
                let shade = 1;
                if(typeof lightMap[y] !=='undefined') shade = lightMap[y][x];

                let color ={r:colors[colors.length-1].r,g:colors[colors.length-1].g,b:colors[colors.length-1].b};
                for(let c=0; c<colors.length; c++){
                    if(height >=colors[c].start && height <= colors[c].end){
                        if(!colors[c].grad || colors[c].i===0){
                            color = {r:colors[c].r,g:colors[c].g,b:colors[c].b};
                        }
                        else{
                            let percent =(height - colors[c].start)/(colors[c].end - colors[c].start);
                            color = {
                                r:lerp(colors[c-1].r, colors[c].r, percent),
                                g:lerp(colors[c-1].g, colors[c].g, percent),
                                b:lerp(colors[c-1].b, colors[c].b, percent)
                            }
                        }
                    }
                }
                data[cell] = (color.r)*shade;
                data[cell + 1] = (color.g)*shade;
                data[cell + 2] = (color.b)*shade;
                data[cell + 3] = alpha;
            }
        }
    }
    
    filterCutoff(level, noiseImage, heightMap, defaults, planet, width, height, depth, params) {
        let {cutoff, cutoffTween} = params;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (heightMap[y][x] <= cutoff) {
                    if (heightMap[y][x] <= cutoff - cutoffTween) {
                        heightMap[y][x] = 0;
                    } else {
                        let percent = cutoff - heightMap[y][x];
                        percent = Math.abs(percent / cutoffTween);
                        heightMap[y][x] = lerp(heightMap[y][x], 0, percent);
                    }
                }
            }
        }
    }

    generateLightMap(level, noiseImage, noiseMap, defaults, planet, width, height, depth, params) {
        let lightRot = [[-1, 1], [1, 1], [1, -1], [-1, -1]];
        let {lightPos, softness, minBrightness, maxBrightness}=params; 
        let heightMap=noiseMap;
        let fShade = 1;
        let directionX = lightRot[lightPos][0];
        let directionZ = lightRot[lightPos][1];

        let lightMap = [];
        for (let z = 0; z < height; z++) {
            lightMap[z]=[];
            for (let x = 0; x < width; x++) {                
                if ((z - directionZ < height) && (x - directionX < width) && (z - directionZ >= 0) && (x - directionX >= 0)) {                    
                    fShade = 1 - ((heightMap[z - directionZ][x - directionX] ) - (heightMap[z][x] )) / softness;
                    if(heightMap[z][x]>planet.switchShadow+level.shadowLoc)
                        if(planet.switchShadowSoft === -1)
                            fShade = 1;
                        else
                            fShade = 1 - ((heightMap[z - directionZ][x - directionX] ) - (heightMap[z][x] )) / softness/planet.switchShadowSoft;
                }

                if (fShade < minBrightness) {
                    fShade = minBrightness;
                }
                if (fShade > maxBrightness) {
                    fShade = maxBrightness;
                }
                lightMap[z][x] = fShade;
            }
        }
        defaults.lightMap = lightMap;
    }

    update(delta){
        this.depth += 0.5*delta;
        this.noiseImage = this.createNoiseImage(this.planets[0],this.planets[this.currentWorld],this.canvas.width, this.canvas.height,this.depth);
        drawDataImage(this.noiseImage,0,0, this.canvas.width, this.canvas.height);
    }
}    