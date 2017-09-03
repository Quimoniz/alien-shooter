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
    this.rotation;
    this.mass;
    this.rotation;
    this.rotationSpeed;
}

var Protagonist = {
    spaceship: undefined,
    lastDirectionSetTime: 0,
    minMomentumKeepDuration: 200,
    score: 0,
    inputDirection: new Vector2(0, 0),
    amountOfBullets : 1,

    init: function ()
    {
        Protagonist.spaceship = new Spaceship("Protagonist", "spieler_0", new Vector2(3000, 7000), 500, 100);
        Protagonist.spaceship.speed = 5000;
        MovablesEngine.addObject(Protagonist.spaceship);
    },

    userInputDirection: function (direction, elapsedTime)
    {
        Protagonist.inputDirection.Add(direction);

        Protagonist.lastDirectionSetTime = (new Date()).getTime();
    },

    update: function ()
    {
        var curTime = (new Date()).getTime();

        this.spaceship.moveDirection.Add(this.inputDirection.Normalized);

        this.spaceship.moveDirection.Multiply(0.55);
    }
};

var EnemyWaves =  {
    spawnAllSeconds: 2000, //Miliseconds
    powerupsAllSeconds: 15000,
    difficulty: 4,
    loopedAmount: 0,
    lastWaveTime: 0,
    lastPowerupTime: 0,
    waveIntention: function() {
        var timeElapsed = Viewport.curTime - EnemyWaves.lastWaveTime;
        if(timeElapsed >= (EnemyWaves.spawnAllSeconds - EnemyWaves.difficulty * EnemyWaves.loopedAmount))
        {
            spawnEnemies();
            EnemyWaves.loopedAmount++;
            EnemyWaves.lastWaveTime = Viewport.curTime;
        }
        var powerupTimeElapsed = Viewport.curTime - EnemyWaves.lastPowerupTime;
        if(powerupTimeElapsed >= (EnemyWaves.powerupsAllSeconds + EnemyWaves.difficulty))
        {
            new Powerup(1, new Vector2(Math.floor(Viewport.viewportOffset.x + Math.random() * Viewport.viewportSize.x), Math.floor(Viewport.viewportOffset.y + Viewport.viewportSize.y )));
            EnemyWaves.lastPowerupTime = Viewport.curTime;
        }
    }
};

function spawnEnemies()
{    
    spawnRandomEnemy();
    spawnRandomEnemy();
    spawnRandomEnemy();
}

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
        var allPowerupsLength = allPowerups.length;
        for ( var i = 0; i < movablesLength; i++)
        {
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
        
        for(var i = 0; i < allPowerupsLength; i++)
        {
            if(allPowerups[i])
            {
                allPowerups[i].hitcheck(MovablesEngine.arrObjects[0]);
            }
        }        
    }
};

var Landscape = {
    tilesetSrc: ""
    //TODO: implement me
}

var ProgramExecuter = {
    currentRunningInterval: -1,
    init: function()
    {
        Viewport.init();
        UserInput.init();
        Menu.showMenu();
    },
    initGame: function ()
    {
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
        Viewport.update(); //Will also call update and paint on spaceship
        MovablesEngine.doHitcheck();
        UserInput.processInput(); 
        Protagonist.update();
        EnemyWaves.waveIntention();
    },
    gameOver: function ()
    {
        alert("Game Over"); 
        location.reload();
    }
};

//All the rotations are being converted to Vectors
function spawnRandomEnemy()
{
    var enemyType;

    if(0 == Math.floor(Math.random() * 35))
    {
        enemyType = 5;
    }
    else 
    {
        enemyType = Math.floor(Math.random() * 4 + 1);
    }
    //Spawn a enemy with Name, Type and Position as Vector, Mass and Health
    var newEnemy = new Spaceship("Enemy " + enemyType, "gegner_" + enemyType, new Vector2(Math.floor(Viewport.viewportOffset.x + Math.random() * Viewport.viewportSize.x), Math.floor(Viewport.viewportOffset.y + Viewport.viewportSize.y )), 10000, 100);
    switch(enemyType)
    {
        case 1:
            newEnemy.speed = 1700;
            // move from left to right
            newEnemy.engine = function ()
            {
                this.moveDirection = Vector2.RadToVector(Math.PI * Math.round((Viewport.curTime + this.id * 5000) % 10000 / 5000)).Normalized;
            }
            break;
        case 2:
            newEnemy.speed = 1100;
            // move in circle
            newEnemy.engine = function ()
            {
                this.moveDirection = Vector2.RadToVector((Math.PI / 4 * ((Viewport.curTime + this.id * 4000) % 32000 / 4000))).Normalized;
                this.rotation = Math.PI * 2 + Math.PI / 2 * 3 - Math.PI / 4 * (Viewport.curTime % 32000 / 4000);
            }
            break;
        case 3:
            newEnemy.speed = 2000;
            // move octagonally
            newEnemy.engine = function ()
            {
                this.moveDirection = Vector2.RadToVector(Math.PI / 4 * Math.round(7 - ((Viewport.curTime + this.id * 1000) % 8000 / 1000))).Normalized;
            }
            break;
        case 4:
            newEnemy.speed = 450;
            newEnemy.initHealth(200);
            // move up and down
            newEnemy.engine = function ()
            {
                this.moveDirection = Vector2.RadToVector(Math.PI / 2 * (Math.round((Viewport.curTime + this.id * 5000) % 10000 / 5000) * 2 + 1)).Normalized;
            }
            break;
        case 5:
            newEnemy.name = "Boss";
            newEnemy.velocity = 300;
            newEnemy.timeBetweenFiring = 1000;
            newEnemy.initHealth(500);
            newEnemy.engine = function ()
            {
                //Needs to be comented out to avoid crashes
                /*this.moveDirection = 
                this.velocity
                this.firingIntended();*/
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
    },
    processInput: function () {
        var keysPressed = UserInput.getKeysSinceLastQuery();
        Protagonist.inputDirection = new Vector2(0, 0);
        for (var i = 0, curKeyPress; i < keysPressed.length; i++)
        {
            curKeyPress = keysPressed[i];
            switch(curKeyPress.keyCode)
            {
              case 37:
                Protagonist.userInputDirection(new Vector2(-1, 0), curKeyPress.timeElapsed);
                break;
              case 38:
                Protagonist.userInputDirection(new Vector2(0, 1), curKeyPress.timeElapsed);
                break;
              case 39:
                Protagonist.userInputDirection(new Vector2(1, 0), curKeyPress.timeElapsed);
                break;
              case 40:
                Protagonist.userInputDirection(new Vector2(0, -1), curKeyPress.timeElapsed);
                break;
              case 32:
                Protagonist.spaceship.firingIntended();
                break;
              case 67:
                Credits.ShowCredits();
                break;
              case 69:
              //Takes care of pressing E
                Protagonist.spaceship.rotation = Vector2.VectorToRad(1, 1);
                break; 
              case 81:
              //Takes care of pressing Q
                Protagonist.spaceship.rotation = Vector2.VectorToRad(1, 1) * 7;
                break;
              case 83:
                spawnRandomEnemy();
                break;
              default :
              //Takes care of pressing W
                Protagonist.spaceship.rotation = Vector2.VectorToRad(0, 0);
                //console.log("Key " + curKeyPress.keyCode + " was pressed");
                break;
            }
        }
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
GraphicsRooster.addImage("powerup_1", "powerup_1.png", 36, 36);
GraphicsRooster.addImage("powerup_2", "powerup_2.png", 36, 36);
GraphicsRooster.addImage("powerup_3", "powerup_3.png", 36, 36);
var curTemplate = new ParticleTemplate("particle_explosion");
curTemplate.addAnimStepsPerRow([96,96],[0,0],5);
curTemplate.addAnimStepsPerRow([96,96],[0,96],5);
curTemplate.addAnimStepsPerRow([96,96],[0,192],5);
ParticlesTemplateRooster.addTemplate("explosion", curTemplate);
curTemplate = new ParticleTemplate("particle_dot");
curTemplate.addAnimStepsPerRow([16,16],[0,0],6);
ParticlesTemplateRooster.addTemplate("reddot", curTemplate);

setTimeout(ProgramExecuter.init, 150);

