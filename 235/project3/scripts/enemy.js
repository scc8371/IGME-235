
//enemy object that is pitted against the player!
class Enemy extends PIXI.Sprite{
    constructor(x, y, scale, sprite){
        super(sprite);
        this.x = x;
        this.y = y;

        //levels up enemies after every 3 enemies defeated.
        this.level = Math.round(Math.max((player.enemiesKilled / 3), 1));
        
        this.scale.set(scale);
        this.anchor.set(.5, .5);

        //health scales with level!
        this.health = Math.round(Math.pow((10 * parseInt(this.level)), 1.15));
        this.maxHealth = this.health;

        this.damage = 3 * this.level;

        this.nameTitle = new Label(gameScreen, `Bottle  - LVL ${this.level}`, 500, 20, 20);
        this.nameTitle.createHeading();


        //used to animate the enemy
        this.animStep = 0;

        this.healthBar = new Healthbar(520, 70, this.health);
    }

    //bobs the enemy up and down
    bobAnim(){

        this.y += 0.1 * Math.sin(this.animStep);
        this.x += 0.5 * Math.cos(this.animStep);
        this.animStep += 0.05;

        //resets animation y step if it gets too big.
        if(this.animStep >= 100){
            this.animStep = 0;
        }
    }

    //removes the enemy from the screen, sets the active enemy to null.
    die(){
        gameScreen.removeChild(this);
        this.healthBar.removeFromSection(gameScreen);
        this.nameTitle.removeLabel(gameScreen);
        enemy = null;
    }

    //attacks the player..
    //HOWEVER, the player has a small chance to dodge the attack!
    attack(player){

        let dodgeChance = (Math.random() * 100) - (Math.random() * player.luck);

        if(dodgeChance <= 1){
            return;
        }
        else{
            //applies player resistance in taking damage.
            let totalDamage = parseInt(this.damage - (player.resistance / 2));
            if(totalDamage < 0){
                totalDamage = 0;
            }

            player.health -= totalDamage;
            player.hurt();
            player.healthBar.redrawEntire(player.health, player.maxHealth);
        }
        
    }
}