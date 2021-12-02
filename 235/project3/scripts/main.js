"use strict";

let game;

//width and height values
let width;
let height;

//FSM game states
let gameScreen;
let nameScreen;
let startScreen;
let endScreen;

//ground sprite
let ground;

//PIXI window
let gameWindow;

//texture sheet for player animationns
let playerTextureSheet;

//texture sheet for enemies
let enemyTextureSheet;

//buttons area (used to assign new controls as the game progresses)
let buttonArea;

//game stats, tracks the player, the active enemy,
//and the number of bottle caps the player has (currency).
let player;
let enemy = null;

//name input area for the player's name.
let nameArea;

//prompt div to obtain user information/stats!
let promptArea;

//upgrade area-- DOM elements present in the main game!
let upgradeArea;

//skill point selectors 
let strengthSelector;
let dexteritySelector;
let luckSelector;
let speedSelector;
let resistanceSelector;

//specific elements that are switched on and off
let upgradeButton;
let generateButton;
let plrStatsButton;
let shopButton;

let tabs;
let generator;
let upgrades;
let playerStats;
let shop;

//displays available skill points
let pointPrompt;
let statSelectors = [];
let bottlecaps = 0;

let bottlecapLabel;

//describes how many bottle caps the user gets per click
let clickInfo;

//rate of change to determine if the number of caps per click label needs to be changed.
let capROC = 1;

//bottle caps per frame (used when generating caps)
let bpf = 0;

//button that increases bottle caps.
let bottlecapButton;

//tracks time elapsed;
let timeElapsed = 0;

window.addEventListener("load", init);

//initializes many of the critical properties of the game.
function init(){

    buttonArea = document.querySelector("div[class='buttons']");
    //initializes the game window
    gameWindow = new PIXI.Application({
        width: 650,
        height: 300,
    });

    //retrieves upgrade DOM elements, and main to temporarily
    //remove this section.
    upgradeArea = document.querySelector("div[id='main_controls']");

    //removes the upgrade area TEMPORARILY.
    buttonArea.removeChild(upgradeArea);

    //tracks loading times 
    gameWindow.loader.onProgress.add(e => {console.log(`progress=${e.progress}`)});
    gameWindow.loader.onComplete.add(startGame);
    gameWindow.loader.baseUrl = "textures";
    gameWindow.loader
        .add("background", "bg.png")
        .add("hero", "Esquire.png")
        .add("farBuildings", "farBuildings.png")
        .add("foreground", "foreground.png")
        .add("nearBuildings", "nearBuildings.png")
        .add("enemies", "recycle_items.png");
    gameWindow.loader.load();       
}

//initializes mechanics present in the main portion of the game,
//such as the player information, DOM elements, and various logic pieces.
function mainInitialization(){
    if(gameScreen.visible){
        //pre -- remove unneccesary function execution
        gameWindow.ticker.remove(checkForStatIncreases);

        //pre -- give the player values selected from skill points.
        player.updateStats(strengthSelector.value, dexteritySelector.value, luckSelector.value,
            speedSelector.value, resistanceSelector.value);

        //pre -- add ground and player.
        gameScreen.addChild(ground);
        gameScreen.addChild(player);
        player.x = 200;
        player.y = 250;

        //0 -- Instantiate UI elements in PIXI
        let plrName = new Label(gameScreen, `${player.name}`,
                                    10, 15, 25);
        plrName.createHeading();
        player.healthBar.addtoSection(gameScreen);                         

        //1 -- Instantiate DOM elements
        buttonArea.appendChild(upgradeArea);

         //assigns values to the dynamic elements
    
        //tab buttons
        upgradeButton = buttonArea.querySelector("button[id='bUpgrade']");
        generateButton = buttonArea.querySelector("button[id='bGenerate']");
        plrStatsButton = buttonArea.querySelector("button[id='bPlrStats']");
        shopButton = buttonArea.querySelector("button[id='bShop']");
        bottlecapLabel = document.querySelector("p[id='caps']");


        //generator elements
        bottlecapButton = document.querySelector("button[id='generator']");
        bottlecapButton.addEventListener("click", changeCapCount);

        clickInfo = document.querySelector("p[id='click_num']");

        //generator section that houses controls for the "generate" tab.
        generator = document.querySelector("div[id='generator_section']");
        upgrades = document.querySelector("div[id='character_upgrade']");    
        playerStats = document.querySelector("div[id='plrStats']");
        shop = document.querySelector("div[id='shop']");

        tabs = document.querySelector("div[id='tabs']");

        upgradeButton.addEventListener("click", switchModule);
        generateButton.addEventListener("click", switchModule);
        plrStatsButton.addEventListener("click", switchModule);
        shopButton.addEventListener("click", switchModule);
        initializeMenu();

        //enemy texture
        enemyTextureSheet = createSprites(2, 17, 0, 15, 60, 1, "textures/recycle_items.png");

        //end -- go to game loop!
        gameWindow.ticker.add(gameLoop);
    }
}

//runs code that initiates the
//game window
function startGame(e){

    width = gameWindow.view.width/2;
    height = gameWindow.view.height;

    game = gameWindow.stage;

    let gameArea = document.querySelector("div[id='game-place']");

    gameArea.appendChild(gameWindow.view);

    //initializes start screen
    startScreen = new PIXI.Container();
    game.addChild(startScreen);

    nameScreen = new PIXI.Container();
    nameScreen.visible = false;
    game.addChild(nameScreen);

    //initializes game screen
    gameScreen = new PIXI.Container();
    gameScreen.visible = false;
    game.addChild(gameScreen);

    //initializes game over scene
    endScreen = new PIXI.Container();
    endScreen.visible = false;
    game.addChild(endScreen);

    //loads web fonts
    WebFont.load({
        google: {
            families: ['Balthazar', 'MedievalSharp']
        }
    });
        
    createMainMenu();    
    createNameSelection();   
}

//creates visuals present on the name selection
function createNameSelection(){
    let namePrompt = new Label(nameScreen, 
        "Customize your hero!", width/2 - 35, 50);
    namePrompt.createDescription();
    
    pointPrompt = new Label(nameScreen,
        `Available Skill Points: ${player.skillPoints}`, width/2 + 50, 200, 25);
    pointPrompt.createDescription();
}

//creates visuals present on the main menu.
function createMainMenu(){

    //creates the ground where the player stands on
    ground = new PIXI.Graphics();
 
    ground.beginFill(0xA9A9A9);
    ground.lineStyle(5, 0xD0D0D0, 1);
    ground.drawRect(0, 0, 1000, 200);
    ground.endFill();
    ground.x = 0;
    ground.y = 245;
   
    startScreen.addChild(ground);

    //creates player object
    player = new Player(100, 250, 2,
        createSprites(50, 5
            , 9, 25, 25, 6));
        startScreen.addChild(player);
    
    let gameLogo = new Label(startScreen, "Bottle Knights!", width/2, 50);
    gameLogo.createHeading();

    let startbutton = 
    new Button(startScreen, 
        width/2 + 40, 150, "Press to start!");
    
    startbutton.assignEvent(checkName);
}  

//checks if the user's name is accurate (will not take away
//unused skill points, which can be used later...)
function checkName(){

    //DOM elements created to allow the user to enter their character's name!
    promptArea = document.querySelector("div[id='confirm']");
    promptArea.style.visibility = "visible";
    //adds the player to this screen
    nameScreen.addChild(player);

    //repositions the player
    player.x = width + 13;
    player.y = height / 2;

    //creates a new animation for the player.
    player.idle();
    startScreen.visible = false;
    nameScreen.visible = true;

    let submitButton = document.querySelector("button[id='confirm_button']");
    nameArea = document.querySelector("input[id='name_area']");

    //establishes information for skill selectors,
    //adds themm to an array so they can be modified easily
    strengthSelector = document.querySelector("input[id='strength']");
    statSelectors.push(strengthSelector);

    dexteritySelector = document.querySelector("input[id='dexterity']");
    statSelectors.push(dexteritySelector);

    luckSelector = document.querySelector("input[id='luck']");
    statSelectors.push(luckSelector);

    speedSelector = document.querySelector("input[id='speed']");
    statSelectors.push(speedSelector);

    resistanceSelector = document.querySelector("input[id='resistance']");
    statSelectors.push(resistanceSelector);

    submitButton.addEventListener("click", submitName);

    gameWindow.ticker.add(checkForStatIncreases);
}

//runs every frame (on the player creation screen)
//to ensure the player only uses the skill points they have.
function checkForStatIncreases(){
    let total = 0;
    statSelectors.forEach(stat => {  
        total += parseInt(stat.value);   
    })

    //if total is reached, do not allow the user
    //to go over.
    if(total == player.startingSkillPoints){
        statSelectors.forEach(stat =>{
            stat.setAttribute("max", stat.value);
        })
    }
    else{
        statSelectors.forEach(stat =>
            stat.setAttribute("max", player.startingSkillPoints));
    }
        
    player.skillPoints = parseInt(player.startingSkillPoints-total);

    pointPrompt.resetText(`Available Skill Points: ${player.skillPoints}`); 
}

//checks if the user submitted a correct name!
function submitName(e){
    let name = `${nameArea.value}`;
    if(name.length > 0){
        player.name = nameArea.value;
        nameScreen.visible = false;
        gameScreen.visible = true;

        //removes prompts from the button area
        resetDisplay(buttonArea);
        mainInitialization();
    }
    //something was wrong with the user's name!
    else{
        let warning = promptArea.querySelector("h2");

        warning.innerHTML = "Invalid name!";
        warning.style.color = "red";
    }
}

//creates the idle sprites, which are passed into 
//the player as the base animateion
function createSprites(x, y, yStep = 9, texWidth, texHeight,
    numFrames, spriteLocation = "textures/Esquire.png"){
      
    let baseTexture = PIXI.BaseTexture.from(spriteLocation);
    let sprites = [];   

    //loads textures (stored in columns)
    for(let i=0; i < numFrames; i++){
        let frame = new PIXI.Texture(baseTexture, 
            new PIXI.Rectangle(x, i * ((y + texHeight)), texWidth, texHeight));
        sprites.push(frame);
    }

    return sprites;
} 
    
//removes ALL children of an element
function resetDisplay(display){
    //resets the display.
    while(display.firstChild != undefined){
        display.removeChild(display.firstChild)
    } 
}

//generates bottle caps for the player to use.
function generateCaps(){
    if(player.enemiesKilled % 2 == 0){
        let newROC = 1 + 2*player.enemiesKilled;
        capROC = newROC;
        clickInfo.innerHTML = "Number of caps per click: " + capROC;
    }
    
}

//changes the number of caps in the user's possession
//after they click the generate caps button
function changeCapCount(){
    bottlecaps += capROC;
}