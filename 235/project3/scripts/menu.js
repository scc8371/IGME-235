//Handles menu functionalities in the main game.
//Moved to a separate script to make main look a bit
//cleaner.

let buttons = [];
let costs = [];

let activeModule;

"use strict";

//initializes the menu options so all arent shown at once.
function initializeMenu(){
    try{
        resetDisplay(upgradeArea);
        upgradeArea.appendChild(tabs);
        upgradeArea.appendChild(generator);

        activeModule = generator;
    }
    catch{
        alert("An error occured loading the menu!");
        return;
    }
}

//switches DOM UI to upgrades
function switchModule(e){

    upgradeArea.removeChild(activeModule);

    switch(e.target.id){
        case "bGenerate":
            activeModule = generator;
            break;
        case "bUpgrade":
            activeModule = upgrades;
            break;
        case "bPlrStats":
            activeModule = playerStats;
            break;
        case "bShop":
            activeModule = shop;
            break;
    }
    
    
    upgradeArea.appendChild(activeModule);

    if(activeModule == upgrades){
        
        instantiateButtons();
    }
}

//Updates list of button refs.
function instantiateButtons(){
    buttons = upgradeArea.querySelectorAll("button[class='button_stats']");

    updateAllButtons();
    generateDataValues();

    buttons.forEach(button=>{
        button.addEventListener("click", canBuy);
        button.addEventListener("click", updateAllButtons);
        button.addEventListener("click", generateDataValues);
        button.addEventListener("click", updateMenus);
        button.addEventListener("click", updateStats);
    });
    
    costs = upgradeArea.querySelectorAll("p[class='stats']");
    updateMenus();
}

//updates skill levels when the menu is accessed.
function updateMenus(){
    for(let i=0; i<costs.length; i++){
        costs[i].innerHTML = `Current level: ${player.overallStats[i]}`;
    }
}

//updates the cost of all buttons to be visibly seen.
function updateAllButtons(){
    updateCosts();
}