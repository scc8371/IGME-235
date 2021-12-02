class Player extends PIXI.AnimatedSprite{

    constructor(x=0, y=0, scale=1, sprites){
        super(sprites);
   
        this.width = width; 
        this.height = height;

        this.health = 100;
        this.maxHealth = this.health;
        //player health will always be 100, 
        //but shields can be purchased to increase
        //survivability.
        this.shield = 0;
        //weapon damage
        this.damage = 1;  
        
        
        //determines the effectiveness of gear
        this.dexterity = 0;
        //determines the rate of the player's attack
        this.speed = 0;
        //determines the cost-effectiveness of gear
        this.luck = 0;
        //determines the effectiveness of weapons
        this.strength = 0;
        //determines how much the player resists attacks
        this.resistance = 0;

        this.overallStats = [this.strength, this.dexterity, this.luck, this.speed, this.resistance];

        //Skill points and level --> when the player levels up, they
        //recieve more skill points!
        this.level = 1;
        this.skillPoints = 15;
        this.startingSkillPoints = this.skillPoints;

        this.name = "";

        this.healthBar = new Healthbar(20, 70, this.health);

        //anchors the sprite
        this.anchor.set(.5, .5);
        this.scale.set(scale);
        this.x = x;
        this.y = y;    
        
        super.play();
        super.loop = true;
        super.animationSpeed = 0.1;

        //effective stats using the skills listed above

        //formula for calculating effective strength
        this.eStrength = Math.round(this.damage + (Math.random() * this.strength));

        //effective luck will be done later when kill loot is updated

        //enemy stats
        this.enemiesKilled = 0;

        //animation
        this.isRunning = false;

    }

    //stops current animation.
    stopAnimation(){
        super.loop = false;
        super.stop();
    }

    startAnimation(){
        super.loop = true;
        super.play();
    }

    //updates list of stats
    updateStats(strength = 0, dexterity = 0, luck = 0, speed = 0, resistance = 0){
        this.strength = strength;
        this.dexterity = dexterity;
        this.luck = luck;
        this.speed = speed;
        this.resistance = resistance;
        
        this.overallStats  = [this.strength, this.dexterity, this.luck, this.speed, this.resistance];

        this.isCheering = false;
        this.isDamaged = false;
    }

    //plays hurt animation
    hurt(){
        this.textures = createSprites(213, 9, 9, 28, 25.1, 1);
        this.play();
    }
    
    
    //plays death animation.
    die(){
        let numFrames = 1;
    }

    //plays when the character defeats an enemy.
    cheer(){
        let numFrames = 1;
        //cheer sprite.
        this.textures = createSprites(92, 8, 9, 28, 25.1, 1);
        this.play();
    }

    //performs an idle animation
    idle(){
        this.textures = createSprites(9, 5, 9, 28, 25.1, 4);
        this.play();
        let numFrames = 4;
    }

    //attacks an enemy, reducing it's health.
    attack(enemy){
        let damageDealt = Math.max(parseInt(Math.random() * ((this.damage + 1) * (this.strength + 1))), 1);
        enemy.health -= parseInt(damageDealt);
        
        //updates health bar.
        enemy.healthBar.redrawEntire(enemy.health, enemy.maxHealth);

        let numFrames = 2;
    }

    //plays walking animation
    walk(){
        this.textures = createSprites(50, 5, 9, 25, 25, 6);
        this.play();      
        let numFrames = 6;
    }

    //increases the stats of the player
    levelUp(strength, dexterity, luck, speed, resistance){
        let numFrames = 1;

        //increases stats!
        player.strength = parseInt(strength);
        player.dexterity = parseInt(dexterity);
        player.luck = parseInt(luck);
        player.speed = parseInt(speed);
        player.resistance = parseInt(resistance);
    }
}