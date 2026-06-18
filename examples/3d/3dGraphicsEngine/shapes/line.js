class Line extends Model{
    create(){
        this.faces=[
           [0,1]
        ];

        this.original.verts=[
            {x:0, y:0, z:-1},         // 0
            {x:0, y:0, z: 1}          // 1
        ];
    }
}