"use strict";

//button text style
const buttonStyle = new PIXI.TextStyle({
    fill: [
        "#787878",
        "red"
    ],
    fontFamily: "Balthazar",
    fontSize: 35,
    letterSpacing: 5,
    lineJoin: "round",
    miterLimit: 200,
    strokeThickness: 8
});

//creates a clickable button to be used in the PIXI application window
class Button{
    constructor(area, x, y, text){
        this.width = width;
        this.height = height;
        
        this.button = new PIXI.Text(text);
        this.button.x = x;
        this.button.y = y;
        this.button.style = buttonStyle;

        //mouse over effects
        this.button.on("pointerover", e => e.target.alpha = 0.8);
        this.button.on("pointerout", e => e.currentTarget.alpha = 1.0);
        this.button.interactive = true;
        this.button.buttonMode = true;

        //adds button to the scene
        area.addChild(this.button);
    }

    //assigns an event to this button.
    assignEvent(eventType) {
        this.button.on("pointerup", eventType);        
    }
}

