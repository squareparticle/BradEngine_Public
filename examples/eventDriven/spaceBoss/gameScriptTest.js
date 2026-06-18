const getGameScript = {
    gameObjects:{
        Player:{
            classType:"Player",
            initParams:{
                layer:'Player',
                speed:600,
                HP:1000,
                initComponents:[
                    {classType:'Image3DComponent',initParams:{image:'player.png'}},
                    {classType:'KeyboardMoveComponent',initParams:{speed: 200}},
                    {classType:'WeaponComponent', initParams:{
                        initWeaponSlots:{
                            rightCannon:{x:60, y:-40, moveDirection:{x:0, y:-1}, angle:0, weapon:'laser1'},
                            leftCannon:{x:-60, y:-40, moveDirection:{x:0, y:-1}, angle:0, weapon:'laser2'},
                            // rightSideCannon:{x:-60, y:0, moveDirection:{x:-1, y:0}, angle:-90, weapon:'missile2'},
                            // leftSideCannon:{x:60, y:0, moveDirection:{x:1, y:0}, angle:90, weapon:'missile2'}
                    }}}
                ],
                initPaintComponents:[
                    {classType:'PaintImage3DComponent'}
                ]
            }                
        },
        Drone:{
            classType:"Enemy",
            initParams:{
                speed:400,
                HP:100,
                initComponents:[
                    {classType:'Image3DComponent',initParams:{image:'eship.png'}},
                    {classType:'TakeDamageOnHitComponent'}
                ],
                initPaintComponents:[
                    {classType:'PaintImage3DComponent'}
                ]
            }
        }
    },
    weaponTypes:{
        missile1:{classType:'Bullet', image: 'bullet.png', speed: 800, reloadTime:300, damage:10},
        missile2:{classType:'Bullet', image: 'enginefire.png', speed: 1000, reloadTime:500, damage:40},
        laser1:{classType:'Laser', image: 'enginefire.png', reloadTime:1000, damage:1},
        laser2:{classType:'Laser', image: 'bullet.png', reloadTime:1000, damage:1}
    },
    levelMap:{
        waves:[
            {enemies:[
                {type:'Drone', initParams:{position:{x:500, y:-500}}}
            ]}
        ]
    }
}