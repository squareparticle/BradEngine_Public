const emptyBlock = 0;
const grassBlock = 1;
const dirtBlock  = 2;
const stoneBlock = 3;

const black = {r:0,g:0,b:0};
const saddlebrown={r:55,g:27,b:5};
const chocolate={r:63,g:0,b:15};
const brown = {r:165,g:42,b:42};
const red = {r:255,g:0,b:0};
const green={r:0,g:255,b:0};
const blue = {r:0,g:0,b:255};
const purple = {r:148,g:0,b:211};
const yellow = {r:255,g:255,b:0};
const orange = {r:255,g:165,b:0};
const grey = {r:128,g:128,b:128};
//const grassGreen = {r:134, g:202, b:93};
//const dirtBrown = {r:196, g:132, b:103};
const grassGreen = {r:92, g:132, b:70};
const dirtBrown = {r:211, g:166, b:142};

const blockColors = [
    // Back          -0
    // Left Side     -1
    // Bottom        -2
    // Top           -3
    // Front         -4
    // Right side    -5
    [black,black,black,black,black,black], // empty
    //[dirtBrown,dirtBrown,dirtBrown,grassGreen,dirtBrown,dirtBrown], // grass
    [saddlebrown,saddlebrown,saddlebrown,grassGreen,saddlebrown,saddlebrown], // grass
    [saddlebrown, saddlebrown, saddlebrown, saddlebrown, saddlebrown, saddlebrown], // dirt
    [grey,grey,grey,grey,grey,grey] // stone
]