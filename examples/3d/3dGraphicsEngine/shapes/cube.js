class Cube extends Model{
    create(){
        this.faces=[
           [2,3,1,0], // front
           [6,2,0,4], // Left Side
           [0,1,5,4], // Bottom
           [7,3,2,6], // Top
           [4,5,7,6], // Back
           [5,1,3,7]  // Right side
        ];

        this.original.verts=[
            //Front 
            {x:-1,y:1,z:1},          // 0
            {x:1,y:1,z:1},           // 1
            {x:-1,y:-1,z:1},         // 2
            {x:1,y:-1,z:1},          // 3

            //Back
            {x:-1,y:1,z:-1},         // 4
            {x:1,y:1,z:-1},          // 5
            {x:-1,y:-1,z:-1},        // 6
            {x:1,y:-1,z:-1},         // 7
        ];
    }
}