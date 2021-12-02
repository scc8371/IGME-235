"use strict";


class Label{
    //creates a new PIXI JS label.
    constructor(area, text, x, y, fontSize = 50){

        if(area != null){
            this.area = area;
        }    

        this.text = text;
        this.label = new PIXI.Text(text);
        this.label.x = x;
        this.label.y = y;

        this.headingStyle = new PIXI.TextStyle({
            fill: 0xDDDDDD,
            fontSize: fontSize, 
            fontFamily: "MedievalSharp",
            stroke: 0x000000,
            strokeThickness: 10,
            dropShadow: true,
            dropShadowColor: 0xD00000
        });
        
        this.descStyle = new PIXI.TextStyle({
            fill: 0xDDDDDD,
            fontSize: fontSize,
            fontFamily: "Balthazar",
            strokeThickness: 5,
            dropShadow: false
        })
    }

    //creates heading text to be used for introducing the game
    //and for various important points
    createHeading(){
       this.label.style = this.headingStyle;
       if(this.area != null){
            this.area.addChild(this.label);
       }     
    }

    //creates description text used for describing a feature of the
    //game.
    createDescription(){
        this.label.style = this.descStyle;
        if(this.area != null){
            this.area.addChild(this.label);
        }     
    }

    //removes the label from a given section in the game
    removeLabel(section){
        section.removeChild(this.label);
    }

    //resets the text on the label.
    resetText(text){
        this.label.text = text;
    }
}