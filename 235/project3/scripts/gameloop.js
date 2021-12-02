"use strict";

//gets delta time
let deltaTime;

//file used to house the main game loop of the game --> isolated
//to maintain neatness, and to allow this to be found much easier.

function gameLoop(){
    
    getDeltaTime();

    //pre-- update bottlecap count.
    generateCaps();
    bottlecapLabel.innerHTML = "Bottle caps: " + bottlecaps.toString();
    //1-- play player walking animation, handle parallax scrolling.

    if(enemy == null && !player.isRunning){

        //halts the walking animation to show the cheering animation.
        if(player.isCheering){
            if(timeElapsed >= 0.25){
                player.walk();
                player.isRunning = true; 
            }
        }
        else{
            player.walk();
            player.isRunning = true; 
        }      
    }
    else if(enemy != null){
        if(player.isRunning){
            player.isRunning = false;
            player.idle();
        }   
    
        enemy.bobAnim();
        //determines the attack chance where the player can hit the enemy.
        
        if(timeElapsed >= .5){

            let attackChance = Math.max((Math.random() * 500 - 
                ((player.speed + 1) * (player.luck + 1))), 1);
            console.log("Attack roll: " + attackChance);
            if(attackChance < 50){
                player.attack(enemy);
                console.log("attacked enemy!");
            }

            //check if enemy attacks player.
            attackChance = Math.max(Math.random() * 500, 1);
            if(attackChance < 50){             
                enemy.attack(player);
                console.log("player hurt!");
                player.hurt();
            }
        
            if(enemy.health <= 0){
        
                //dexterity and luck have an effect on loot!
                bottlecaps += parseInt(enemy.maxHealth + ((player.dexterity + 1) * (player.luck + 1)));
        
                //player regenerates health after killing an enemy, depends on dexterity and the enemy's level!
                player.health += (player.dexterity + 1) * enemy.level;
                
                 if(player.health > 100){
                    player.health = 100;
                }
        
                player.healthBar.redrawEntire(player.health, player.maxHealth);
        
                console.log("enemy slain!");
                
                //resets the time, prioritizes player anim.
                timeElapsed = 0;                
                enemy.die();
                
                player.enemiesKilled++; 
        
                if(player.enemiesKilled % 3 == 0){
                    //WILL implement level up mechanics here later....
                    //but, for now, the player will recieve a single skill point.
                    player.skillPoints++;
                }   

                player.cheer();
                player.isCheering = true;
                timeElapsed = 0;
 
            }
            
            if(player.health <=0){
                player.die();
                gameScreen.visible = false;

            }
        }
    }

    //tries to spawn a new enemy.
    if(enemy == null){
        if(timeElapsed >= .25){
            console.log("trying to spawn enemy");
            let spawnChance = Math.round(500 * Math.random()) - (player.luck);

            if(spawnChance <= 10){
                enemy = new Enemy(450, 240, 1, enemyTextureSheet[0]);
                gameScreen.addChild(enemy);
                enemy.healthBar.addtoSection(gameScreen);
            }  

            timeElapsed = 0;
            return;
        }
              
    }

    if(timeElapsed >= .5){
        timeElapsed = 0;
        player.idle();
    }

    //OR, if an enemy is already present on screen, check if the player is able to attack it
        // if the player attacks, play attack animation, sound, and reduce the enemy's health
        //if the enemy DIES, play enemy death animation and give the player the number of bottlecaps
        //earned by killing the bottle


    //2-- Check if an enemy needs to spawn, spawn it if needed.

    //3 Handle enemy attacks, check conditional if they can or can not attack

    //4 check for player level up --> rewards skill points which can be redeemed for stat bonuses.
        //play level up animation and sound for 1 second or so? (maybe implement???? depends on time.)

    //5 update buttons to show correct values (bottle caps, etc.) (almost..)

    //more to come if need be...
}

//gets the delta time of the run time.
function getDeltaTime(){
    deltaTime = 1/gameWindow.ticker.FPS;
    //caps delta time.
    deltaTime > 1/12 ? deltaTime=1/12 : deltaTime;

    timeElapsed += deltaTime;
}
