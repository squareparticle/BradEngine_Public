class Triangle extends Model{
    create(){
        this.faces=[
           [0,1,2]
        ];

        this.original.verts=[
            {x:-1,y:1,z:0},          // 0
            {x:1,y:1,z:0},           // 1
            {x:-1,y:-1,z:0},         // 2
        ];
    }
}