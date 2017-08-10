/*
var GraphicsRooster;
function ImageWrapper;
function FlyingObject;
function Spaceship
var Protagonist;
var Landscape;
var Viewport;
var HeadsUpDisplay;
var ProgramExecutor;
var MovablesEngine;
var UserInput;
*/
var objectIdCounter = 1;
var particleIdCounter = 1;


function flyingObject () {
    this.id = objectIdCounter++;
    this.name;
    this.position;
    this.velocity;
    this.moveDirection;
    this.mass;
    this.rotation;
    this.rotationSpeed;
}



var Protagonist = {
    spaceship: undefined,
    lastDirectionSetTime: 0,
    minMomentumKeepDuration: 200,
    score: 0,
    init: function ()
    {
        Protagonist.spaceship = new Spaceship("Protagonist", "spieler_0", [3000, 7000], 500),
        MovablesEngine.addObject(Protagonist.spaceship);
    },
    userInputDirection: function (direction, elapsedTime)
    {
        //console.log("userInputDirection(" + (direction * 360 / (Math.PI * 2)) + ", " + elapsedTime + " ms)");
        var baseSpeed = 5000;

        Protagonist.spaceship.velocity = baseSpeed;

        Protagonist.spaceship.moveDirection = direction;

        //Protagonist.spaceship.moveDirection = (Protagonist.spaceship.moveDirection + direction) / 2;
//console.log("Protagonist.spaceship.velocity: " + Protagonist.spaceship.velocity);
//console.log("Protagonist.spaceship.moveDirection: " + Protagonist.spaceship.moveDirection);
//console.log("newMoveDirection: " + newMoveDirection.join(","));
        Protagonist.lastDirectionSetTime = (new Date()).getTime();
    },
    update: function ()
    {
        var curTime = (new Date()).getTime();
        if ((curTime - Protagonist.lastDirectionSetTime) > Protagonist.minMomentumKeepDuration)
        {
            Protagonist.spaceship.velocity *= 0.8;
        }
    }
    
};

var WaveSettings =  {
    spawnAllSeconds: 2000, //Miliseconds
    difficulty: 4,
    loopedAmount: 0
};

var MovablesEngine = {
    arrObjects: new Array(),
    arrParticles: new Array(),
    addObject: function (newObject)
    {
        this.arrObjects.push(newObject);
        return newObject;
    },
    createParticle: function (particleTemplate, paramPosition, paramMoveDirection, paramSpeed)
    {
        var newParticle = new Particle(particleTemplate, paramPosition, paramMoveDirection, paramSpeed);
        MovablesEngine.arrParticles.push(newParticle);
        return newParticle;
    },
    removeObject: function (oldObject)
    {
        if(oldObject)
        {
            for (var i = 0; i < MovablesEngine.arrObjects.length; i++)
            {
                if (oldObject.id == MovablesEngine.arrObjects[i].id)
                {
                    var newArrObjects = new Array(MovablesEngine.arrObjects.length - 1);
                    for (var j = 0; j < newArrObjects.length; j++)
                    {
                        if (j < i)
                        {
                            newArrObjects[j] = MovablesEngine.arrObjects[j];
                        } else
                        {
                            newArrObjects[j] = MovablesEngine.arrObjects[j + 1];
                        }
                    }
                    MovablesEngine.arrObjects = newArrObjects;
                    break;
                }
            }
            //explicitly tell the garbage collector to delete this object
            delete oldObject;
        }
    },
    doHitcheck: function()
    {
        var movablesLength = MovablesEngine.arrObjects.length;
        for ( var i = 0; i < movablesLength; i++)
            for ( var j = 0; j < movablesLength; j++)
            {
                if (i != j)
                {
                    if (MovablesEngine.arrObjects[i])
                    {
                        MovablesEngine.arrObjects[i].hitcheck(MovablesEngine.arrObjects[j]);
                    }
                }
            }
    }
};

var Landscape = {
    tilesetSrc: ""
    //TODO: implement me
}



function getHexForRGB(red, green, blue)
{
    var hexValues = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
    var colorArr = [red, green, blue];
    var colorHex = "";
    for (var i = 0; i < 3; i++)
    {
        if (colorArr[i] > 255) colorArr[i] = 255;
        else if (colorArr[i] < 0) colorArr[i] = 0;
        
        colorHex += hexValues[Math.floor(colorArr[i] / 16)];
        colorHex += hexValues[colorArr[i] % 16];
    }
    return colorHex;
}

var ProgramExecuter = {
    currentRunningInterval: -1,
    init: function()
    {
        Viewport.init();
        UserInput.init();
        Protagonist.init();
        setTimeout(ProgramExecuter.startLevelLoop, 200);
    },
    startLevelLoop: function ()
    {
	ProgramExecuter.oneTickLevelLoop();
        ProgramExecuter.currentRunningInterval = setInterval(ProgramExecuter.oneTickLevelLoop, 50);
    },
    oneTickLevelLoop: function ()
    {
        Protagonist.update();
        Viewport.update();
        MovablesEngine.doHitcheck();

        var keysPressed = UserInput.getKeysSinceLastQuery();
        for (var i = 0, curKeyPress; i < keysPressed.length; i++)
        {
            curKeyPress = keysPressed[i];
  
            if (37 == curKeyPress.keyCode)
            {
                Protagonist.userInputDirection(Math.PI, curKeyPress.timeElapsed);
            }
            else if (38 == curKeyPress.keyCode)
            {
                Protagonist.userInputDirection(Math.PI / 2 * 3, curKeyPress.timeElapsed);
            }
            else if (39 == curKeyPress.keyCode)
            {
                Protagonist.userInputDirection(0, curKeyPress.timeElapsed);
            }
            else if (40 == curKeyPress.keyCode)
            {
                Protagonist.userInputDirection(Math.PI / 2, curKeyPress.timeElapsed);
            }
            else if (32 == curKeyPress.keyCode)
            {
                Protagonist.spaceship.firingIntended();
            }
            else if (69 == curKeyPress.keyCode) {
                Protagonist.spaceship.rotation = 0.5;
            }
            else if (81 == curKeyPress.keyCode) {
                Protagonist.spaceship.rotation = Math.PI * 2 - 0.5;
            }
            else if (83 == curKeyPress.keyCode) {
                spawnRandomEnemy();
            }
            else
            {
                Protagonist.spaceship.rotation = 0;
                console.log("Key " + curKeyPress.keyCode + " was pressed");
            }
        }
    }
};

function spawnEnemys()
{    
    spawnRandomEnemy();
    spawnRandomEnemy();
    spawnRandomEnemy();
    WaveSettings.loopedAmount++;
    
    if(WaveSettings.spawnAllSeconds - WaveSettings.difficulty * WaveSettings.loopedAmount > 300)
    {
        clearInterval(myInterval);
        myInterval = setInterval("spawnEnemys()", WaveSettings.spawnAllSeconds - WaveSettings.difficulty * WaveSettings.loopedAmount);
    }
}

function spawnRandomEnemy()
{
    var enemyType = Math.floor(Math.random() * 4 + 1);
    if(0 == Math.floor(Math.random() * 35))
    {
        enemyType = 5;
    }
    var newEnemy = new Spaceship("Enemy " + enemyType, "gegner_" + enemyType, [Math.floor(Viewport.viewportOffset[0] + Math.random() * Viewport.viewportSize[0]), Math.floor(Viewport.viewportOffset[1] + Viewport.viewportSize[1] )], 10000, 100);
    switch(enemyType)
    {
        case 1:
            newEnemy.velocity = 1700;
            // move from left to right
            newEnemy.engine = function ()
            {
                this.moveDirection = Math.PI * Math.round((Viewport.curTime + this.id * 5000) % 10000 / 5000);
                this.velocity = Math.sin((Viewport.curTime + 2500 ) % 5000 * Math.PI / 5000) * 4000;
            }
            break;
        case 2:
            newEnemy.velocity = 1100;
            // move in circle
            newEnemy.engine = function ()
            {
                this.moveDirection = Math.PI / 4 * ((Viewport.curTime + this.id * 4000) % 32000 / 4000);
                this.rotation = Math.PI * 2 + Math.PI / 2 * 3 - Math.PI / 4 * (Viewport.curTime % 32000 / 4000);
            }
            break;
        case 3:
            newEnemy.velocity = 2000;
            // move octagonally
            newEnemy.engine = function ()
            {
                this.moveDirection = Math.PI / 4 * Math.round(7 - ((Viewport.curTime + this.id * 1000) % 8000 / 1000));
            }
            break;
        case 4:
            newEnemy.velocity = 450;
            newEnemy.initHealth(200);
            // move up and down
            newEnemy.engine = function ()
            {
                this.moveDirection = Math.PI / 2 * (Math.round((Viewport.curTime + this.id * 5000) % 10000 / 5000) * 2 + 1);
            }
            break;
        case 5:
            newEnemy.name = "Boss";
            newEnemy.velocity = 300;
            newEnemy.timeBetweenFiring = 1000;
            newEnemy.initHealth(500);
            newEnemy.engine = function ()
            {
                this.moveDirection = 
                this.velocity
                this.firingIntended();
            }
            break;
    }
    MovablesEngine.addObject(newEnemy);
}


function KeyPressObj (keyCode)
{
    this.timeKeyDown = (new Date()).getTime();
    this.timeLastQuery = this.timeKeyDown;
    this.keyCode = keyCode;
    this.timeKeyUp = -1;
    this.isBeingPressed = true;
    this.keyReleased = function (timeKeyUp)
    {
        this.timeKeyUp = timeKeyUp;
        this.isBeingPressed = false;
    }
}
function KeyUsedObj (keyCode, timeElapsed)
{
    this.keyCode = keyCode;
    this.timeElapsed = timeElapsed;
}

var UserInput = {
    keysUsedQueue: new Array(),
    init: function ()
    {
        document.onkeydown = function (eventParam)
        {
            var keyCode = eventParam.keyCode;
            if ( ! keyCode )
            {
                keyCode = eventParam.which;
            }
            var keyAlreadyPressedDown = false;
            for (var i = 0; i < UserInput.keysUsedQueue.length; i++)
            {
                if ( UserInput.keysUsedQueue[i].keyCode == keyCode )
                {
                    keyAlreadyPressedDown = true;
                    break;
                }
            }
            if ( ! keyAlreadyPressedDown)
            {
                UserInput.keysUsedQueue.push(new KeyPressObj(keyCode));
            }
        }
        document.onkeyup = function (eventParam)
        {
            var keyCode = eventParam.keyCode;
            if ( ! keyCode )
            {
                keyCode = eventParam.which;
            }
            var timeKeyUp = (new Date()).getTime();
            for (var i = 0; i < UserInput.keysUsedQueue.length; i++)
            {
                if ( UserInput.keysUsedQueue[i].keyCode == keyCode )
                {
                    UserInput.keysUsedQueue[i].keyReleased( timeKeyUp );
                }
            }
        }
    },
    getKeysSinceLastQuery: function ()
    {
        /* Refresh keysUsedQueue (i.e. throw away all NOT isBeingPressed)
         * and determine how long keys were pressed since last invocation
         *  return the latter in the form of an array
         */
        var newKeysUsedQueue = new Array();
        var holdKeysUsedQueue = UserInput.keysUsedQueue;
        var keysUsedArr = new Array();

        var curTime = (new Date()).getTime();
        var elapsedTime = -1;

        for (var i = 0; i < holdKeysUsedQueue.length; i++)
        {
            curObj = holdKeysUsedQueue[i];
            if( curObj.isBeingPressed )
            {
                newKeysUsedQueue.push(curObj);
                elapsedTime = curTime - curObj.timeLastQuery;
                curObj.timeLastQuery = curTime;
            } else {
                elapsedTime = curObj.timeKeyUp -  curObj.timeLastQuery;
            }
            if( elapsedTime < 0)
            {
                elapsedTime = 0;
            }
            keysUsedArr.push(new KeyUsedObj(curObj.keyCode, elapsedTime));
        }
        UserInput.keysUsedQueue = newKeysUsedQueue;

	return keysUsedArr;
    }
};






GraphicsRooster.addImage("gegner_1", "gegner_1.png", 62, 56);
GraphicsRooster.addImage("gegner_2", "gegner_2.png", 60, 82);
GraphicsRooster.addImage("gegner_3", "gegner_3.png", 50, 44);
GraphicsRooster.addImage("gegner_4", "gegner_4.png", 60, 50);
GraphicsRooster.addImage("gegner_5", "gegner_5.png", 120, 76);
GraphicsRooster.addImage("spieler_0", "spieler_schiff_0.png", 70, 70);
GraphicsRooster.addImage("bullet", "bullet.png", 5, 20); 
GraphicsRooster.addImage("particle_explosion", "sample_explosion_from_vampires-dawn-2.png", 480, 288);
GraphicsRooster.addImage("particle_dot", "particle-dot.png", 96, 16);
var curTemplate = new ParticleTemplate("particle_explosion");
curTemplate.addAnimStepsPerRow([96,96],[0,0],5);
curTemplate.addAnimStepsPerRow([96,96],[0,96],5);
curTemplate.addAnimStepsPerRow([96,96],[0,192],5);
ParticlesTemplateRooster.addTemplate("explosion", curTemplate);
curTemplate = new ParticleTemplate("particle_dot");
curTemplate.addAnimStepsPerRow([16,16],[0,0],6);
ParticlesTemplateRooster.addTemplate("reddot", curTemplate);

setTimeout(ProgramExecuter.init, 150);

var myInterval = setInterval("spawnEnemys()", WaveSettings.spawnAllSeconds - WaveSettings.difficulty * WaveSettings.loopedAmount);
