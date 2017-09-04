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
    tilesetSrc: "", //TODO: implement me
    tilesetImg: undefined,
    tileSize: new Vector2(50, 50),
    map: new Array(),
    init: function ()
    {
        Landscape.tilesetImg = GraphicsRooster.getImgByName("grass_0");
    },
    paint: function ()
    {
        var startX = Math.floor(Viewport.viewportOffset.x * Viewport.pixelsPerThousand / 1000 / Landscape.tileSize.x);
        var endX =  Math.ceil((Viewport.viewportOffset.x + Viewport.viewportSize.x) * Viewport.pixelsPerThousand / 1000 / Landscape.tileSize.x);
        var startY = Math.floor(Viewport.viewportOffset.y * Viewport.pixelsPerThousand / 1000 / Landscape.tileSize.y);
        var endY = Math.ceil((Viewport.viewportOffset.y + Viewport.viewportSize.y) * Viewport.pixelsPerThousand / 1000 / Landscape.tileSize.y);
        var offsetX = startX * Landscape.tileSize.x - Viewport.viewportOffset.x * Viewport.pixelsPerThousand / 1000;
        var offsetY = startY * Landscape.tileSize.y - Viewport.viewportOffset.y * Viewport.pixelsPerThousand / 1000;
//console.log("X range:" + startX + " to " + endX);
//console.log("Y range:" + startY + " to " + endY);
        var destX = 0, destY = 0;
        var srcX = 0, srcY;

        
        for(var curY = startY; curY <= endY; curY++)
        {
            Landscape.provideMapLine(curY, startX, endX);
            for(var curX = startX; curX <= endX; curX++)
            {
                Viewport.ctx.fillStyle= "#" + getHexForRGB(Math.floor((255/endX*curX) % 255),225,225);
                destX = Math.round(offsetX + (curX - startX) * Landscape.tileSize.x);
                destY = Math.round(Viewport.pxHeight - (curY - startY) * Landscape.tileSize.y - Landscape.tileSize.y + (offsetY * -1));
                //this is supposed to be read out from array Landscape.map
                //TODO: implement a generator function to generate new tiles on-the-fly
                //srcX=curX%3*Landscape.tileSize.x;
                //srcY=(2-curY%3)*Landscape.tileSize.y;
                srcX = Landscape.map[curY][curX][0] * Landscape.tileSize.x;
                srcY = Landscape.map[curY][curX][1] * Landscape.tileSize.x;
                //Viewport.ctx.fillRect(destX,
                //                        destY,
                //                        50,50);
//console.log("Destination: " + destX + "|" + destY );
                Viewport.ctx.drawImage(
                  Landscape.tilesetImg.src,
                  srcX,
                  srcY,
                  Landscape.tileSize.x,
                  Landscape.tileSize.y,
                  destX,
                  destY,
                  Landscape.tileSize.x,
                  Landscape.tileSize.y
                );
            }
        }
    },
  provideMapLine: function(lineNumber, startX, endX) {
    var belowTile;
    var newTile;
    for (var i=Landscape.map.length; i<=lineNumber; i++)
    {
      Landscape.map.push(new Array(endX+1));
      for(var j=0; j<=endX; j++)
      {
        if(0 == i)
        {
          newTile= [4,1];
        } else
        {
          belowTile=Landscape.map[i-1][j];
          if((belowTile[0] == 4 && belowTile[1] == 1)
            || belowTile[1] == 0)
          {
            //newTile = Landscape.oneElementOf([[0,2],[1,2],[2,2],[4,1]]);
            if(0 == j)
            {
               newTile = Landscape.oneElementOf([[0,2],[4,1],[4,1]]);
            } else
            {
              if(Landscape.map[i][j-1][0] < 2)
              {
                if(Landscape.map[i][j-1][1] == 0)
                {
                  newTile = [2,0];
                } else if (Landscape.map[i][j-1][1] == 1)
                {
                  newTile = [2,1];
                } else
                {
                  newTile = [2,2];
                }
                //newTile = Landscape.oneElementOf([[1,2],[2,2]]);
              } else
              {
                newTile = Landscape.oneElementOf([[0,2],[1,2],[4,1],[4,1]]);
              }
            }
          } else if(belowTile[0] == 0 && belowTile[1] == 1)
          {
            if(0 == j)
            {
              newTile = Landscape.oneElementOf([[0,0],[0,1]]);
            } else
            {
              if(Landscape.map[i][j-1][0] < 2)
              {
                newTile = [1,1];
              }
            }
          } else if(belowTile[0] == 1 && belowTile[1] == 1)
          {
            if(0 == j)
            {
              newTile = Landscape.oneElementOf([[1,0],[1,1]]);
            } else
            {
              if(Landscape.map[i][j-1][0] == 0)
              {
                newTile = [1,1];
              } else if(Landscape.map[i][j-1][1] == 0)
              {
                newTile = [1,0];
              } else
              {
                newTile = [1,1];
              }
            }
          } else if(belowTile[0] == 2 && belowTile[1] == 1)
          {
            if(0 == j)
            {
              newTile = Landscape.oneElementOf([[2,0],[2,1]]);
            } else
            {
              if(Landscape.map[i][j-1][1] == 0)
              {
                newTile = [2,0];
              } else
              {
                newTile = [2,1];
              }
            }

            newTile = Landscape.oneElementOf([[2,0],[2,1]]);
          } else if(belowTile[0] == 0 && belowTile[1] == 2)
          {
            newTile = Landscape.oneElementOf([[0,0],[0,1]]);
          } else if(belowTile[0] == 1 && belowTile[1] == 2)
          {
             if(0 == j)
             {
               newTile = Landscape.oneElementOf([[1,0],[1,1]]);
             } else
             {
               if(Landscape.map[i][j-1][0] == 0
                  || (Landscape.map[i][j-1][0] == 1 && Landscape.map[i][j-1][1] == 1))
               {
                 newTile = [1,1];
               } else
               {
                 newTile = [1,0];
               }
             }


          } else if(belowTile[0] == 2 && belowTile[1] == 2)
          {
            if(0 == j)
            {
              newTile = Landscape.oneElementOf([[2,0],[2,1]]);
            } else
            {
              if(Landscape.map[i][j-1][1] == 0)
              {
                newTile = [2,0];
              } else
              {
                newTile = [2,1];
              }
            }
          }
        }
        Landscape.map[i][j] = newTile;
      }
    }
    //TODO here: check if currentLine also contains startX and endX, generate them if necessary
  },
  oneElementOf: function(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}

var ProgramExecuter = {
    currentRunningInterval: -1,
    init: function()
    {
        Landscape.init();
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
		Landscape.paint();
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
                this.moveDirection = Vector2.RadToVector((Math.PI / 4 * ((Viewport.curTime + this.id * 2000) % 16000 / 2000))).Normalized;
                this.rotation = Math.PI * 2 + Math.PI / 2 * 2.5  - Math.PI / 4 * ((Viewport.curTime + this.id * 2000) % 16000 / 2000);
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
GraphicsRooster.addImage("grass_0","landscape-grass.png", 50, 50);
var curTemplate = new ParticleTemplate("particle_explosion");
curTemplate.addAnimStepsPerRow([96,96],[0,0],5);
curTemplate.addAnimStepsPerRow([96,96],[0,96],5);
curTemplate.addAnimStepsPerRow([96,96],[0,192],5);
ParticlesTemplateRooster.addTemplate("explosion", curTemplate);
curTemplate = new ParticleTemplate("particle_dot");
curTemplate.addAnimStepsPerRow([16,16],[0,0],6);
ParticlesTemplateRooster.addTemplate("reddot", curTemplate);

setTimeout(ProgramExecuter.init, 150);

