//used to update and manage DOM main game functions, ex. clicking the button and getting bottlecaps from it.

//costs for upgrades
let upgradeCosts = [0, 0, 0, 0, 0];

//buttons used for generating caps and upgrading kill loot
let upgradeAction;
let generateAction;


//generates data values depicting the cost of upgrades
function generateDataValues(){  
    for(let i = 0; i < buttons.length; i++){
        buttons[i].dataset.cost = upgradeCosts[i];
        let name = buttons[i].id.replace("_upgrade", "");

        buttons[i].innerHTML = `Upgrade ${name}.<br> Cost: ${buttons[i].dataset.cost}`;
    }
}

//updates the cost of each button depending on the current level of the player
function updateCosts(){
    //sets all prices to free if the player has enough to spare.
    if(player.skillPoints > 0){
        upgradeCosts.forEach(upgrade =>{
            upgrade = 0;
        });
    } 
    else{
        for(let i=0; i<upgradeCosts.length; i++){
            upgradeCosts[i] = calculateCost(parseInt(player.overallStats[i]));
        }
    }
}

//updates the player's stats to reflect the 
//upgrades they bought
function updateStats(){
    player.levelUp(player.overallStats[0], 
        player.overallStats[1], 
        player.overallStats[2], 
        player.overallStats[3],
        player.overallStats[4]);
}

//calculates the cost of the next upgrade
function calculateCost(value){
    if(value == 0){
        return 10;
    }
    else{
        return Math.round(Math.pow(parseInt(value), 3) * Math.log10(value) + 10);
    }  
}

//checks if the player can buy this upgrade.
function canBuy(e){
    if(bottlecaps >= e.target.dataset.cost){

        //purchases the upgrade
        player.overallStats[Array.prototype.indexOf.call(buttons, e.target)]++;

        if(player.skillPoints > 0){
            player.skillPoints--;
        }
        else{
            bottlecaps -= parseInt(e.target.dataset.cost);
        }     
    }
    else{
        //WILL play a howler tone here to indicate the user cannot buy this.
        return;
    }
}