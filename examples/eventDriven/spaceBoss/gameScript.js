const getGameScript = {
    gameObjects:{
        Player:{
            classType:"Player",            
            initParams:{
                layer:'Player',
                speed:300,
                HP:1000,
                angle:0,
                position:{x:0,y:500},
                initComponents:[
                    {classType:'Image3DComponent',initParams:{image:'player.png'}},
                    {classType:'TakeDamageOnHitComponent'},
                    {classType:'KeyboardMoveComponent',initParams:{speed: 200}},
                    {classType:'WeaponComponent', initParams:{
                        initWeaponSlots:{
                            rightCannon:{x:60, y:40, moveDirection:{x:0, y:-1}, angle:0, weapon:'missile1'},
                            leftCannon:{x:-60, y:40, moveDirection:{x:0, y:-1}, angle:0, weapon:'missile1'},
                            // rightSideCannon:{x:-60, y:0, moveDirection:{x:-1, y:0}, angle:-90, weapon:'missile2'},
                            // leftSideCannon:{x:60, y:0, moveDirection:{x:1, y:0}, angle:90, weapon:'missile1'}

                            // rightSideCannon:{x:-60, y:0, moveDirection:{x:-1, y:0}, angle:-45, weapon:'laser2'},
                            // leftSideCannon:{x:60, y:0, moveDirection:{x:1, y:0}, angle:45, weapon:'laserBolt2'}
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
                layer:'Main',
                speed:400,
                HP:100,
                initComponents:[
                    {classType:'Image3DComponent',initParams:{image:'eship.png'}},
                    {classType:'TakeDamageOnHitComponent'},
                    {classType:'ScriptableAIComponent',initParams:{
                        scriptableCommands:{
                            // init:[{anim:"swirl"}],
                            hit:[{anim:"hitDamage",loop:10}]}
                        }
                    }
                ],
                initPaintComponents:[
                    {classType:'PaintImage3DComponent'}
                ],
                attachChildren:[
                    {classType:'Orbiter', initParams:{
                        image:'gbullet.png', 
                        anchor:{dist:80,angle:0},
                        attachChildren:[
                            {classType:'ChildScriptObject', 
                            initParams:{
                                image:'rbullet.png', 
                                anchor:{dist:80,angle:50},
                                scriptableCommands:{
                                    init:[{anim:"swirl"}],
                                    hit:[{anim:"hitDamage",loop:10}]
                                }                                
                            }
                        }]
                    }}
                ]
            }
        },
        RockBoss:{
            classType:"Enemy",            
            initParams:{
                layer:'Main',
                speed:400,
                HP:1000,
                initComponents:[
                    {classType:'Image3DComponent',initParams:{image:'head.png'}},
                    {classType:'TakeDamageOnHitComponent'},
                    {classType:'WeaponComponent', initParams:{
                        initWeaponSlots:{
                            centerShot:{x:0, y:115, moveDirection:{x:0, y:1}, angle:180, weapon:'bossRed'},
                            leftShot:{x:-125, y:30, moveDirection:{x:-0.25, y:1}, angle:165, weapon:'bossGreen'},
                            rightShot:{x:125, y:30, moveDirection:{x:0.25, y:1}, angle:195, weapon:'bossGreen'},
                            rageLeft:{x:-220, y:20, moveDirection:{x:-0.45, y:1}, angle:155, weapon:'bossHeavy'},
                            rageRight:{x:220, y:20, moveDirection:{x:0.45, y:1}, angle:205, weapon:'bossHeavy'}
                        }
                    }},
                    {classType:'ScriptableAIComponent',initParams:{
                        scriptableCommands:{
                            init:[
                                {start:"movement", loop:-1},
                                {start:"attacks", loop:-1}
                            ],
                            movement:[
                                {anim:"bossHead1"}
                            ],
                            attacks:[
                                {setImage:true, target:"mouth", image:"mouthOpen.png"},
                                {wait:500},
                                {fire:true, slot:"centerShot", force:true},
                                {wait:450},
                                {fire:true, slot:["leftShot","rightShot"], force:true},
                                {wait:650},
                                {setImage:true, target:"mouth", image:"mouthAngry.png"},
                                {fire:true, slot:"centerShot", force:true},
                                {wait:750},
                                {setImage:true, target:"mouth", image:"mouth.png"},
                                {wait:500}
                            ],
                            rageAttacks:[
                                {setImage:true, target:"self", image:"headfireeyes.png"},
                                {setImage:true, target:"mouth", image:"mouthAngry.png"},
                                {fire:true, slot:["leftShot","centerShot","rightShot"], force:true},
                                {wait:400},
                                {fire:true, slot:["rageLeft","rageRight"], force:true},
                                {wait:500},
                                {fire:true, slot:["leftShot","rightShot"], force:true},
                                {wait:450}
                            ],
                            hit:[{anim:"hitDamage"}],
                            phases:[
                                {hpBelow:650, commands:[
                                    {setImage:true, target:"self", image:"headfireeyes.png"},
                                    {setImage:true, target:"mouth", image:"mouthAngry.png"},
                                    {start:"rageAttacks", loop:-1}
                                ]}
                            ]}
                        }
                    }
                ],
                initPaintComponents:[
                    {classType:'PaintImage3DComponent'}
                ],        
                attachChildren:[
                    {classType:'ChildScriptBossObject', name:'crown', initParams:{
                        layer:'Layer2',
                        image:'crown.png', 
                        anchor:{dist:-250,angle:90},
                        scriptableCommands:{
                            init:[{start:"crownLoop", loop:-1}],
                            crownLoop:[
                                {wait:3600},
                                {setProps:true, props:{speed:220}},
                                {setAnchor:true, anchor:{dist:420, angle:0}},
                                {wait:1800},
                                {setProps:true, props:{speed:0}},
                                {setAnchor:true, anchor:{dist:-250, angle:90}},
                                {wait:2400}
                            ]
                        }
                        }
                    },
                    {classType:'ChildScriptBossObject', name:'mouth', initParams:{
                        layer:'Layer1',
                        image:'mouth.png', 
                        anchor:{dist:0,angle:90},
                        }
                    },
                    {classType:'ChildScriptBossObject', name:'leftHand', initParams:{
                        layer:'Layer2',
                        image:'rOpenHand.png',
                        anchor:{dist:380,angle:210},
                        localAngle:-25,
                        speed:18,
                        vulnerable:false,
                        initWeaponSlots:{
                            palmBeam:{x:0, y:35, moveDirection:{x:0, y:1}, angle:180, weapon:'handLightning'}
                        },
                        scriptableCommands:{
                            init:[{start:"handLoop", loop:-1}],
                            handLoop:[
                                {setProps:true, props:{isVisible:true, vulnerable:false, speed:18, localAngle:-25}},
                                {setImage:true, image:"rOpenHand.png"},
                                {wait:900},
                                {setImage:true, image:"rhandflat.png"},
                                {setProps:true, props:{localAngle:20}},
                                {wait:260},
                                {setImage:true, image:"rfistclosed.png"},
                                {setProps:true, props:{localAngle:-10}},
                                {wait:320},
                                {setImage:true, image:"rhandflat.png"},
                                {setProps:true, props:{localAngle:15}},
                                {wait:240},
                                {setImage:true, image:"rOpenHandEye.png"},
                                {setProps:true, props:{vulnerable:true, localAngle:-35}},
                                {fire:true, slot:"palmBeam", force:true},
                                {wait:1200},
                                {setProps:true, props:{vulnerable:false}},
                                {setImage:true, image:"rOpenHand.png"},
                                {wait:700}
                            ],
                            hit:[
                                {stop:"handLoop"},
                                {setProps:true, props:{vulnerable:false}},
                                {anim:"hitDamage", loop:6},
                                {setProps:true, props:{isVisible:false}},
                                {wait:2600},
                                {setProps:true, props:{isVisible:true}},
                                {setImage:true, image:"rOpenHand.png"},
                                {start:"handLoop", loop:-1}
                            ]
                        }
                        }
                    },
                    {classType:'ChildScriptBossObject', name:'rightHand', initParams:{
                        layer:'Layer2',
                        image:'rOpenHand.png',
                        anchor:{dist:380,angle:-30},
                        localAngle:25,
                        speed:-18,
                        vulnerable:false,
                        initWeaponSlots:{
                            palmBeam:{x:0, y:35, moveDirection:{x:0, y:1}, angle:180, weapon:'handLightning'}
                        },
                        scriptableCommands:{
                            init:[{start:"handLoop", loop:-1}],
                            handLoop:[
                                {setProps:true, props:{isVisible:true, vulnerable:false, speed:-18, localAngle:25}},
                                {setImage:true, image:"rOpenHand.png"},
                                {wait:1100},
                                {setImage:true, image:"rhandflat.png"},
                                {setProps:true, props:{localAngle:-20}},
                                {wait:260},
                                {setImage:true, image:"rfistclosed.png"},
                                {setProps:true, props:{localAngle:10}},
                                {wait:320},
                                {setImage:true, image:"rhandflat.png"},
                                {setProps:true, props:{localAngle:-15}},
                                {wait:240},
                                {setImage:true, image:"rOpenHandEye.png"},
                                {setProps:true, props:{vulnerable:true, localAngle:35}},
                                {fire:true, slot:"palmBeam", force:true},
                                {wait:1200},
                                {setProps:true, props:{vulnerable:false}},
                                {setImage:true, image:"rOpenHand.png"},
                                {wait:650}
                            ],
                            hit:[
                                {stop:"handLoop"},
                                {setProps:true, props:{vulnerable:false}},
                                {anim:"hitDamage", loop:6},
                                {setProps:true, props:{isVisible:false}},
                                {wait:2600},
                                {setProps:true, props:{isVisible:true}},
                                {setImage:true, image:"rOpenHand.png"},
                                {start:"handLoop", loop:-1}
                            ]
                        }
                        }
                    }
                ]
            }
        }
    },    
    weaponTypes:{
        missile1:{classType:'Bullet', layer:'Weapons', reloadTime:300, initParams:{image: 'bullet.png', speed: 800, damage:10}},
        missile2:{classType:'Bullet', layer:'Weapons',reloadTime:500, initParams:{image: 'enginefire.png', speed: 1000, damage:40}},
        bossRed:{classType:'Bullet', layer:'Weapons', reloadTime:250, initParams:{image: 'rbullet.png', speed: 420, damage:15}},
        bossGreen:{classType:'Bullet', layer:'Weapons', reloadTime:300, initParams:{image: 'gbullet.png', speed: 360, damage:10}},
        bossHeavy:{classType:'Bullet', layer:'Weapons', reloadTime:500, initParams:{image: 'dbbullet.png', speed: 520, damage:25}},
        handLightning:{classType:'Laser', layer:'Weapons', reloadTime:1200, initParams:{image: 'lightening.png', damage:1, fadettl:1200, growSpeed:16000, maxLaserLength:2200}},
        laser1:{classType:'Laser', layer:'Weapons', reloadTime:1000, initParams:{image: 'lightening.png', damage:1, fadettl:2000, maxLaserLength:4000}},
        laser2:{classType:'Laser', layer:'Weapons', reloadTime:2000, initParams:{image: 'bullet.png', damage:1, fadettl:2000, growSpeed:16000, maxLaserLength:4000}},
        laserBolt1:{classType:'Laser', layer:'Weapons', reloadTime:1000, initParams:{image: 'enginefire.png', damage:1, attachedHost:false, growSpeed:64000, maxLaserLength:4000, speed:800}},
        laserBolt2:{classType:'Laser', layer:'Weapons', reloadTime:500, initParams:{image: 'bullet.png', damage:1, attachedHost:false, growSpeed:800, maxLaserLength:400, speed:400, ttl:3000}}
    },
    animations:{
        swirl:{
            keyFrames:[
                {
                    position:{start:{x:0, y:0,time:0}, end:{x:-250, y:250,time:5000}},
                    angle:{start:{amount:0, time:0}, end:{amount:180, time:2500}},
                },
                {   angle:{start:{amount:0, time:0}, end:{amount:-180, time:2500}},
                    //position:{start:{x:0, y:0,time:0}, end:{x:500, y:500,time:5000}}
                    position:{absolute:true, start:{x:0, y:0,time:0}, end:{x:500, y:500,time:5000}}
                },
                {   position:{start:{x:0, y:0,time:0}, end:{x:500, y:-500,time:1000}}}
            ]
        },
        hitDamage:{
            loop:10,
            keyFrames:[
                {alpha:{start:{amount:1, time:0}, end:{amount:0, time:50}}},
                {alpha:{start:{amount:0, time:0}, end:{amount:1, time:50}}}
                // {instuct:{loop:{name:"flicker",amount:10,goto:-2}}, // can't be done because animations don't go in order
            ]
        },
        bossHead1:{
            //positionScale:200,
            positionTimeScale:5,
            keyFrames:[
                {position:{absolute:true, 
                    start:{circle:{center:{x:-500,y:0}, radius:500, angle:0},time:0},
                    end:{circle:{center:{x:-500,y:0}, radius:500, angle:360},time:1000}}},
                {position:{absolute:true, 
                    start:{circle:{center:{x:500,y:0}, radius:500, angle:180},time:0},
                    end:{circle:{center:{x:500,y:0}, radius:500, angle:-180},time:1000}}},      
            ]
        }
    },
    levelMap:{
        waves:[
            {enemies:[
                {type:'RockBoss', initParams:{position:{x:0, y:-500}}}
            ]},
            {enemies:[
                {type:'Drone', initParams:{position:{x:500, y:-500}}},
            ]}
        ]
    }
}
