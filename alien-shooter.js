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

// object prototype (Spaceship or Projectile)
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
        Protagonist.spaceship.maxSteeringSpeed = 14000;
        Protagonist.spaceship.speed = 5000;
        MovablesEngine.addObject(Protagonist.spaceship);
        if(-1 < location.href.indexOf("invincible"))
        {
          Protagonist.spaceship.invincible = true;
        }
    },

    userInputDirection: function (direction, speed, elapsedTime)
    {
        //Protagonist.inputDirection.Add(direction);
        if(direction.length <= 1)
        {
          Protagonist.inputDirection = direction.MultiplyNoChanges(speed);
        } else
        {
          Protagonist.inputDirection = direction;
        }

        Protagonist.lastDirectionSetTime = (new Date()).getTime();
    },

    update: function ()
    {
        this.spaceship.steerTowardsDirection(this.inputDirection);
    }
};

var MovablesEngine = {
    arrObjects: new Array(),
    arrParticles: new Array(),
    collisionList: new Array(),
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
    discardDeadObjects: function()
    {
      var newObjectList = new Array();
      for(var i = MovablesEngine.arrObjects.length - 1; i >= 0; i--)
      {
        if(MovablesEngine.arrObjects[i].isAlive)
        {
          newObjectList.push(MovablesEngine.arrObjects[i]);
        } else
        {
          // tell Garbage Collector to remove said object
          //delete MovablesEngine.arrObjects[i];
        }
      }
      MovablesEngine.arrObjects = newObjectList;
    },
    doHitcheck: function()
    {
        var movablesLength = MovablesEngine.arrObjects.length;
        for ( var i = 0; i < movablesLength; i++)
        {
            for ( var j = 0; j < movablesLength; j++)
            {
                if (i != j)
                {
                    if (MovablesEngine.arrObjects[i])
                    {
                        var curReturnVal = MovablesEngine.arrObjects[i].hitcheck(MovablesEngine.arrObjects[j]);
                        if(curReturnVal)
                        {
                          var collision = {
                            "subjectA": MovablesEngine.arrObjects[i],
                            "subjectB": MovablesEngine.arrObjects[j],
                            "hitbox":   curReturnVal
                          };
                          if(j < i)
                          {
                            collision.subjectA = MovablesEngine.arrObjects[j];
                            collision.subjectB = MovablesEngine.arrObjects[i];
                          }
                          // INSERT ORDERLY
                          var k;
                          for(k = 0; k < MovablesEngine.collisionList.length; ++k)
                          {
                            if(collision.subjectA <= MovablesEngine.collisionList[k].subjectA)
                            {
                              if(collision.subjectA == MovablesEngine.collisionList[k].subjectA)
                              {
                                if(collision.subjectB < MovablesEngine.collisionList[k].subjectB)
                                {
                                  MovablesEngine.collisionList.splice(k, 0, collision);
                                  break;
                                } else if (collision.subjectB == MovablesEngine.collisionList[k].subjectB)
                                {
                                  // Duplicate, throw away the collision object
                                  collision.subjectA = undefined;
                                  collision.subjectB = undefined;
                                  delete collision;
                                  break;
                                }
                              } else
                              {
                                MovablesEngine.collisionList.splice(k, 0, collision);
                                break;
                              }
                            }
                          }
                          if(k == MovablesEngine.collisionList.length)
                          {
                            MovablesEngine.collisionList.push(collision);
                          }
                        }
                    }
                }
            }
        }
        
        for(var i = 0; i < MovablesEngine.collisionList.length; ++i)
        {
            var curCollision = MovablesEngine.collisionList[i];
            if(!curCollision.subjectA.collidedRecently(curCollision.subjectB))
            {
              MovablesEngine.performCollision(curCollision);
            }
            curCollision.subjectA = undefined;
            curCollision.subjectB = undefined;
            delete curCollision;
            
        }
        MovablesEngine.collisionList = new Array();
    },
    performCollision: function(collision)
    {
        var appliedSpeedA = collision.subjectA.moveDirection.MultiplyNoChanges(collision.subjectA.speed);
        var appliedSpeedB = collision.subjectB.moveDirection.MultiplyNoChanges(collision.subjectB.speed);

        var newSpeedA = appliedSpeedA.clone();
        newSpeedA.Multiply(collision.subjectA.mass).Add(appliedSpeedB.MultiplyNoChanges(collision.subjectB.mass)).Divide(collision.subjectA.mass + collision.subjectB.mass).Multiply(2).Subtract(appliedSpeedA);
        var newSpeedB = appliedSpeedB.clone();
        newSpeedB.Multiply(collision.subjectB.mass).Add(appliedSpeedA.MultiplyNoChanges(collision.subjectA.mass)).Divide(collision.subjectA.mass + collision.subjectB.mass).Multiply(2).Subtract(appliedSpeedB);

        //apply the speed calculations we found out
        collision.subjectA.speed = newSpeedA.length;
        collision.subjectA.moveDirection = newSpeedA.Normalized;
        collision.subjectB.speed = newSpeedB.length;
        collision.subjectB.moveDirection = newSpeedB.Normalized;

        var deltaPosA = collision.subjectA.position.clone().Subtract(collision.subjectA.previousPosition);
        var deltaPosB = collision.subjectB.position.clone().Subtract(collision.subjectB.previousPosition);
        var fictionalPosACur, fictionalPosBCur;
        var fictionalPosAOld = collision.subjectA.previousPosition, fictionalPosBOld = collision.subjectB.previousPosition;
        var collisionHappenedAtFraction = 0;
        for(var i = 0; i < 10; ++i)
        {
          deltaPosA.Multiply(0.5);
          deltaPosB.Multiply(0.5);
          fictionalPosACur = fictionalPosAOld.AddVectorNoChanges(deltaPosA);
          fictionalPosBCur = fictionalPosBOld.AddVectorNoChanges(deltaPosB);
          collision.subjectA.position = fictionalPosACur;
          collision.subjectB.position = fictionalPosBCur;
          collision.subjectA.updateHitbox();
          collision.subjectB.updateHitbox();
          var hitcheckResult = collision.subjectA.hitcheck(collision.subjectB);
          if(!hitcheckResult)
          {
            collisionHappenedAtFraction += 1.00 / Math.pow(2, i + 1);
            fictionalPosAOld = fictionalPosACur;
            fictionalPosBOld = fictionalPosBCur;
          }
        }
        // Apply what we found out, calculate position and updateHitbox
        fictionalPosACur = fictionalPosAOld.AddVectorNoChanges(newSpeedA.MultiplyNoChanges(Viewport.deltaTimePreviousFrame * (1 - collisionHappenedAtFraction) / 1000));
        fictionalPosBCur = fictionalPosBOld.AddVectorNoChanges(newSpeedB.MultiplyNoChanges(Viewport.deltaTimePreviousFrame * (1 - collisionHappenedAtFraction) / 1000));
        collision.subjectA.position = fictionalPosACur;
        collision.subjectB.position = fictionalPosBCur;
        collision.subjectA.updateHitbox();
        collision.subjectB.updateHitbox();

        collision.subjectA.collided(collision.subjectB);
        collision.subjectB.collided(collision.subjectA);
    }
};



var ProgramExecuter = {
    currentRunningInterval: -1,
    keepTicking: true,
    fadeOutMax: 30,
    fadeOutCounter: 0,
    fadeOutEle: undefined,
    init: function()
    {
        Landscape.init();
        Viewport.init();
        UserInput.init();
        Menu.showMenu("new");
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
    stopLevelLoop: function ()
    {
        clearInterval(ProgramExecuter.currentRunningInterval);
    },
    oneTickLevelLoop: function ()
    {
        if(ProgramExecuter.keepTicking)
        {
          ProgramExecuter.doPerTickPainting();
          MovablesEngine.doHitcheck();
          UserInput.processInput(); 
          Protagonist.update();
          EnemyWaves.waveIntention();
        }
    },
    doPerTickPainting: function()
    {
        Viewport.ctx.save();
        Viewport.ctx.beginPath(); // this single line saves
                                  // a ton of ressources
        Viewport.ctx.rect(Viewport.paintOffset[0], Viewport.paintOffset[1],
                          Viewport.paintSize[0],   Viewport.paintSize[1]);
        Viewport.ctx.clip();
        Landscape.paint();
        Viewport.update(); //Will also call update and paint on spaceship
        Viewport.ctx.restore();
        Viewport.paintHud();
        MovablesEngine.discardDeadObjects();
    },
    gameOver: function ()
    {
        Viewport.movePerSecond = 0;
        ProgramExecuter.keepTicking = false;
        ProgramExecuter.stopLevelLoop();
        var veil = document.createElement("div");
        veil.style.position = "absolute";
        veil.style.left = 0;
        veil.style.top = 0;
        veil.style.backgroundColor = "#000000";
        veil.style.opacity = 0;
        veil.style.zIndex = 900;
        veil.style.width = window.innerWidth + "px";
        veil.style.height = window.innerHeight + "px";
        veil.appendChild(document.createTextNode(" "));
        ProgramExecuter.fadeOutEle = document.getElementsByTagName("body")[0].appendChild(veil);
        ProgramExecuter.fadeOut();
    },
    fadeOut: function ()
    {
        ProgramExecuter.doPerTickPainting();
        ProgramExecuter.fadeOutEle.style.opacity = 1.00/ProgramExecuter.fadeOutMax * ProgramExecuter.fadeOutCounter;
        ProgramExecuter.fadeOutCounter++;
        if(ProgramExecuter.fadeOutMax > ProgramExecuter.fadeOutCounter)
        {
          setTimeout(ProgramExecuter.fadeOut, 50);
        } else
        {
          ProgramExecuter.fadeOutEle.style.opacity = 1;
          Menu.showMenu("end");
          //ProgramExecuter.fadeOutEle.parentNode.removeChild(ProgramExecuter.fadeOutEle);
        }
    },
};




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
    keyPressCallbacks: new Array(),
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
            for(var i = 0; i < UserInput.keyPressCallbacks.length; ++i)
            {
                if(keyCode == UserInput.keyPressCallbacks[i][0])
                {
                  UserInput.keyPressCallbacks[i][1](eventParam); 
                }
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
    registerKeyPressCallback: function(keyCode, callback)
    {
      UserInput.keyPressCallbacks.push([keyCode, callback]);
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
              case 32: // pressing SPACE BAR
                Protagonist.spaceship.firingIntended();
                break;
              case 67: // pressing C
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
              case 83: // pressing S
                spawnRandomEnemy();
                break;
              default :
              //Takes care of pressing W
                Protagonist.spaceship.rotation = Vector2.VectorToRad(0, 0);
                //console.log("Key " + curKeyPress.keyCode + " was pressed");
                break;
            }
            if(!Viewport.mouse)
            {
              var maxSpeed = Protagonist.spaceship.maxSteeringSpeed;
              switch(curKeyPress.keyCode)
              {
                case 37:  // LEFT ARROW
                  Protagonist.userInputDirection(new Vector2(-1, 0), maxSpeed, curKeyPress.timeElapsed);
                  break;
                case 38:  // UP ARROW
                  Protagonist.userInputDirection(new Vector2(0, 1), maxSpeed, curKeyPress.timeElapsed);
                  break;
                case 39:  // RIGHT ARROW
                  Protagonist.userInputDirection(new Vector2(1, 0), maxSpeed, curKeyPress.timeElapsed);
                  break;
                case 40:  // DOWN ARROW
                  Protagonist.userInputDirection(new Vector2(0, -1), maxSpeed, curKeyPress.timeElapsed);
                  break;
              }
            }
        }
        if(Viewport.mouse)
        {
          var calculatedPos = [Viewport.mouse.x, Viewport.mouse.y];
          calculatedPos[0] = ((calculatedPos[0] - Viewport.paintOffset[0]) * 1000 / Viewport.pixelsPerThousand) + Viewport.viewportOffset.x;
          calculatedPos[1] = (((Viewport.paintSize[1] + Viewport.paintOffset[1]) - calculatedPos[1]) * 1000 / Viewport.pixelsPerThousand) + Viewport.viewportOffset.y;
          var offsetDirection = new Vector2(calculatedPos[0] - Protagonist.spaceship.position.x, calculatedPos[1] - Protagonist.spaceship.position.y);
//          Protagonist.spaceship.steerTowardsDirection(offsetDirection);
          //speed it up a little
          var areaToTarget = offsetDirection.x * offsetDirection.y * 0.5;
          var desiredDirection = undefined;
          //FLAWED, FIX ME
          var timeUntilReaching = (offsetDirection.clone().Divide(Protagonist.spaceship.speed)).length;
          var timeUntilZeroSpeed = Protagonist.spaceship.speed / Protagonist.spaceship.maxSteeringSpeed;
          if(timeUntilReaching <= timeUntilZeroSpeed)
          {
            desiredDirection = offsetDirection.MultiplyNoChanges(-1);
          } else
          {

            var mulFactor = timeUntilReaching/timeUntilZeroSpeed;
            if(isNaN(mulFactor))
            {
              mulFactor = 3;
            } else {
              mulFactor *= 2;
            }
            desiredDirection = offsetDirection.MultiplyNoChanges(mulFactor);
          }
          Protagonist.userInputDirection(desiredDirection, desiredDirection.length, 500);
          if(DistanceTracking.running)
          {
            DistanceTracking.recordDistance([Protagonist.spaceship.position.Distance(new Vector2(calculatedPos[0], calculatedPos[1])),
                                            desiredDirection.length,
                                            areaToTarget,
                                            timeUntilReaching,
                                            timeUntilZeroSpeed]);
          }
        }
        if(Viewport.mousedown)
        {
          Protagonist.spaceship.firingIntended();
        }
    }
};

var DistanceTracking = {
  startTime: undefined,
  running: false,
  record: new Array(),
  recordDistance: function(trackingArr) {
    var curArr = new Array(trackingArr.length + 1);
    curArr[0] = Viewport.curTime - DistanceTracking.startTime;
    for(var i = 1; i <= trackingArr.length; ++i)
    {
      curArr[i] = trackingArr[i - 1];
    }
    DistanceTracking.record.push(curArr);
  },
  startTracking: function()
  {
    DistanceTracking.startTime = Viewport.curTime;
    DistanceTracking.running = true;
  },
  resetTracking: function()
  {
    DistanceTracking.startTime = undefined;
    DistanceTracking.record = new Array(),
    DistanceTracking.running = false;
  },
  getCSV: function()
  {
    var outCSV = "";
    for(var i = 0; i < DistanceTracking.record.length; ++i)
    {
      outCSV += DistanceTracking.record[i][0];
      for(var j = 1; j < DistanceTracking.record[i].length; ++j)
      {
        outCSV += "," + (parseFloat(DistanceTracking.record[i][j])).toFixed(3);
      }
      outCSV += "\n";
    }
    return outCSV;
  }
};

UserInput.registerKeyPressCallback("R".charCodeAt(0), function(evtObj) {
    if(!DistanceTracking.running)
    {
      DistanceTracking.startTracking();
    } else
    {
      downloadString("alien-shooter-distances.csv",
                     DistanceTracking.getCSV(),
                     "text/csv;charset: utf-8;");
      DistanceTracking.resetTracking();
    }
});
function downloadString(nameStr, outStr, typeStr)
{
  var linkEle = document.createElement("a");
  var dataUrl = URL.createObjectURL( new Blob([outStr], { "type": typeStr }));
  linkEle.setAttribute("href", dataUrl);
  linkEle.setAttribute("download", nameStr);
  linkEle.setAttribute("onclick", "this.parentNode.removeChild(this);");
  document.body.appendChild(document.createTextNode(nameStr));
  linkEle = document.body.appendChild(linkEle);
  linkEle.click();
  //NOT CALLING URL.revokeObjectURL(dataUrl)
  //'CAUSE THIS IS NOT A PRODUCTION FEATURE
}

GraphicsRooster.addImage("gegner_1", "gfx/gegner_1.png", 62, 56);
GraphicsRooster.addImage("gegner_2", "gfx/gegner_2.png", 60, 82);
GraphicsRooster.addImage("gegner_3", "gfx/gegner_3.png", 50, 44);
GraphicsRooster.addImage("gegner_4", "gfx/gegner_4.png", 60, 50);
GraphicsRooster.addImage("gegner_5", "gfx/gegner_5.png", 120, 76);
GraphicsRooster.addImage("spieler_0", "gfx/spieler_schiff_0.png", 70, 70);
GraphicsRooster.addImage("bullet_1", "gfx/geschoss_1.png", 7, 7); 
GraphicsRooster.addImage("bullet_2", "gfx/geschoss_2.png", 14, 14); 
GraphicsRooster.addImage("bullet_3", "gfx/geschoss_3.png", 28, 28); 
GraphicsRooster.addImage("laser_1", "gfx/laser-1.png", 3, 10); 
GraphicsRooster.addImage("laser_2", "gfx/laser-2.png", 3, 10); 
GraphicsRooster.addImage("shield", "gfx/shield.png", 90, 105); 
GraphicsRooster.addImage("particle_explosion", "gfx/explosion-whole.png", 480, 288);
GraphicsRooster.addImage("particle_dot_red", "gfx/particle-dot-red.png", 96, 16);
GraphicsRooster.addImage("particle_dot_yellow", "gfx/particle-dot-yellow.png", 96, 16);
GraphicsRooster.addImage("particle_dot_orange", "gfx/particle-dot-orange.png", 96, 16);
GraphicsRooster.addImage("powerup_1", "gfx/powerup_1.png", 36, 36);
GraphicsRooster.addImage("powerup_2", "gfx/powerup_2.png", 36, 36);
GraphicsRooster.addImage("powerup_3", "gfx/powerup_3.png", 36, 36);
GraphicsRooster.addImage("01_tiles","gfx/01%20tiles.png", 50, 50);
GraphicsRooster.addImage("alien_tileset", "gfx/alien%20tileset.png", 192, 416);
var curTemplate = new ParticleTemplate("particle_explosion");
curTemplate.addAnimStepsPerRow([80,80],[0,0],5);
ParticlesTemplateRooster.addTemplate("explosion", curTemplate);
curTemplate = new ParticleTemplate("particle_dot_red");
curTemplate.addAnimStepsPerRow([16,16],[0,0],6);
ParticlesTemplateRooster.addTemplate("reddot", curTemplate);
curTemplate = new ParticleTemplate("particle_dot_yellow");
curTemplate.addAnimStepsPerRow([16,16],[0,0],6);
ParticlesTemplateRooster.addTemplate("yellowdot", curTemplate);
curTemplate = new ParticleTemplate("particle_dot_orange");
curTemplate.addAnimStepsPerRow([16,16],[0,0],6);
ParticlesTemplateRooster.addTemplate("orangedot", curTemplate);

setTimeout(ProgramExecuter.init, 150);

