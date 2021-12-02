//displays a health bar above an entity,
//presents the current health in a visually appeasing way.
class Healthbar{
    constructor(x=0, y=0, health){
        this.healthbarBottom = new PIXI.Graphics();

        this.x = x;
        this.y = y;

        //used to call a method within another method in this
        //class
        this.reference = this;

        //width of the green portion of the health bar.
        this.healthWidth = 100;

        //draws red portion of the health bar (which is overlaid below)
        this.healthbarBottom.beginFill(0xFF0000);
        this.healthbarBottom.lineStyle(5, 0xD0D0D0, 1);
        this.healthbarBottom.drawRect(x, y, 100, 15);
        this.healthbarBottom.endFill();

        //draws green portion of the health bar     
        this.healthbarTop = null;       
        this.drawTopHealth(this.healthWidth);
        this.healthLabel = new Label(null, `${health}`,
         x + width/10, y - 5, 20)
         this.healthLabel.createDescription();

        this.originalWidth = this.healthbarTop.width;

    }  

    //adds the healthbar to a section of the game state.
    addtoSection(section){
        section.addChild(this.healthbarBottom);
        section.addChild(this.healthbarTop);
        section.addChild(this.healthLabel.label);
    }

    removeFromSection(section){
        section.removeChild(this.healthbarBottom);
        section.removeChild(this.healthbarTop);
        section.removeChild(this.healthLabel.label);
    }

    //used to change the width of the overlaid green rectangle, 
    //used to simulate a loss in health.
    drawTopHealth(width){
        this.healthbarTop = new PIXI.Graphics();
        this.healthbarTop.beginFill(0x00FF00);
        this.healthbarTop.lineStyle(1, 0xD0D0D0, 1);
        this.healthbarTop.drawRect(this.x, this.y, width, 15);
        this.healthbarTop.endFill();
    }

    //redraws entire health bar when something is attacked
    redrawEntire(health, maxHealth){
        this.removeFromSection(gameScreen);
        this.drawTopHealth(parseFloat(health/maxHealth) * 100);
        this.healthLabel.resetText(health);
        this.addtoSection(gameScreen);
    }
}