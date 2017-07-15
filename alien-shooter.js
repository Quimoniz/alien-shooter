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
var GraphicsRooster = {
    arrNames : new Array(),
    arrImages : new Array(),
    countImages: 0,
    addImage: function(nameStr, imageSrc, imgWidth, imgHeight)
    {
        var imageObj = new ImageWrapper(nameStr, imageSrc, imgWidth, imgHeight);
        GraphicsRooster.arrNames.push(nameStr);
        GraphicsRooster.arrImages.push(imageObj);
        GraphicsRooster.countImages ++;
    },
    getImgByName: function(nameStr)
    {
        nameStr = nameStr.toLowerCase();
        for(var i = 0; i < GraphicsRooster.countImages; i ++)
        {
            if (nameStr == GraphicsRooster.arrNames[i].toLowerCase())
            {
                return GraphicsRooster.arrImages[i];
            }
        }
    }
}

function ImageWrapper(nameStr, imageSrc, imgWidth, imgHeight)
{
    this.name = nameStr
    this.src = new Image()
    this.src.src = imageSrc;
    this.width = imgWidth;
    this.height = imgHeight;
}

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
function Projectile (paramOriginSpaceship, imgName, paramPosition, paramPower, paramMoveDirection, paramVelocity) {
    this.id = objectIdCounter++;
    this.type = "projectile";
    this.originSpaceship = paramOriginSpaceship;
    this.img = GraphicsRooster.getImgByName(imgName);
    this.position = paramPosition;
    this.power = paramPower;
    this.moveDirection = paramMoveDirection;
    this.velocity = paramVelocity;
    this.rotation = Math.PI / 2;
    this.rotationSpeed = 0;
    this.hitbox = [0,0,0,0];
    this.update = function(timeSinceLastFrame)
    { /* same as for spaceship */
        this.position[0] += Math.cos(this.moveDirection) * this.velocity * timeSinceLastFrame / 1000;
        this.position[1] += Math.sin(this.moveDirection) * this.velocity * timeSinceLastFrame / 1000 * -1;
        this.hitbox = [this.position[0] - this.img.width * 1000 / 2 / Viewport.pixelsPerThousand,
                       this.position[1] - this.img.height* 1000 / 2 / Viewport.pixelsPerThousand,
                       this.img.width * 1000 / Viewport.pixelsPerThousand,
                       this.img.height * 1000/ Viewport.pixelsPerThousand];
    } 
    this.paint = function (ctx, viewportOffset, timeSinceLastFrame)
    { /* same as for spaceship */
        this.update(timeSinceLastFrame);
        var tileSource = [0,0,this.img.width,this.img.height];
        var tileDest = [(this.position[0] - viewportOffset[0]) * Viewport.pixelsPerThousand / 1000, (this.position[1] - viewportOffset[1]) * Viewport.pixelsPerThousand / 1000, tileSource[2], tileSource[3]];
        var origPoints = [tileDest[0], tileDest[1]]; // DEBUG
        tileDest[0] = Math.round(tileDest[0] - this.img.width / 2);
        tileDest[1] = Math.round(tileDest[1] - this.img.height/ 2);
        ctx.drawImage(this.img.src, tileSource[0], tileSource[1], tileSource[2], tileSource[3], tileDest[0], tileDest[1], tileDest[2], tileDest[3]);
    }
    this.hitcheck = function (otherSpaceship)
    {
        if ( otherSpaceship.type == "spaceship" && otherSpaceship != this.originSpaceship)
        {
            if (this.hitbox[0] <= (otherSpaceship.hitbox[0] + otherSpaceship.hitbox[2]) &&
                (this.hitbox[0] + this.hitbox[2]) >= otherSpaceship.hitbox[0] &&
                this.hitbox[1] <= (otherSpaceship.hitbox[1] + otherSpaceship.hitbox[3]) &&
                (this.hitbox[1] + this.hitbox[3] >= otherSpaceship.hitbox[1]))
            {
    /*NEW code */
                var hitRect = [0, 0, 0, 0];
                hitRect[0] = this.hitbox[0];
                if (this.hitbox[0] < otherSpaceship.hitbox[0])
                {
                    hitRect[0] = otherSpaceship.hitbox[0];
                }
                 
                hitRect[1] = this.hitbox[1];
                if (this.hitbox[1] < otherSpaceship.hitbox[1])
                {
                    hitRect[1] = otherSpaceship.hitbox[1];
                }
                
                hitRect[2] = this.hitbox[0] + this.hitbox[2];
                if (hitRect[2] > (otherSpaceship.hitbox[0] + otherSpaceship.hitbox[2]))
                {
                    hitRect[2] = otherSpaceship.hitbox[0] + otherSpaceship.hitbox[2];
                }
    
                
                hitRect[3] = this.hitbox[1] + this.hitbox[3];
                if (hitRect[3] > (otherSpaceship.hitbox[1] + otherSpaceship.hitbox[3]))
                {
                    hitRect[3] = otherSpaceship.hitbox[1] + otherSpaceship.hitbox[3];
                }
                var markerPosition = [ hitRect[2], hitRect[3] ];
    
                hitRect[2] = hitRect[2] - hitRect[0];
                hitRect[3] = hitRect[3] - hitRect[1];
    
                if (hitRect[2] > 0 && hitRect[3] > 0)
                {
                    otherSpaceship.projectileHit(this.power);
                    this.destroy();
                }
            }
        }
    }
    this.destroy = function ()
    {
        MovablesEngine.removeObject(this);
    }
}
function Spaceship (paramName, imgName, paramPosition, paramMass) {
    this.id = objectIdCounter++;
    this.type = "spaceship";
    this.name = paramName;
    this.img = GraphicsRooster.getImgByName(imgName);
    this.position = paramPosition;
    this.velocity = 0;
    this.moveDirection = Math.PI / 2;
    this.health = 100;
    this.mass = paramMass;
    this.rotation = Math.PI / 2;
    this.rotationSpeed = 0;
    this.hitbox = [0,0,0,0];
    this.lastFired = 0;
    this.timeBetweenFiring = 250;
    this.engine = function()
    {
    }
    this.update = function(timeSinceLastFrame)
    {
        this.engine();

        this.position[0] += Math.cos(this.moveDirection) * this.velocity * timeSinceLastFrame / 1000;
        this.position[1] += Math.sin(this.moveDirection) * this.velocity * timeSinceLastFrame / 1000 * -1;
        this.hitbox = [this.position[0] - this.img.width * 1000 / 2 / Viewport.pixelsPerThousand,
                       this.position[1] - this.img.height* 1000 / 2 / Viewport.pixelsPerThousand,
                       this.img.width * 1000 / Viewport.pixelsPerThousand,
                       this.img.height * 1000/ Viewport.pixelsPerThousand];

    }

    this.paint = function (ctx, viewportOffset, timeSinceLastFrame)
    {
        this.update(timeSinceLastFrame);
        var tileSource = [0,0,this.img.width,this.img.height];
        var tileDest = [(this.position[0] - viewportOffset[0]) * Viewport.pixelsPerThousand / 1000, (this.position[1] - viewportOffset[1]) * Viewport.pixelsPerThousand / 1000, tileSource[2], tileSource[3]];
        var origPoints = [tileDest[0], tileDest[1]]; // DEBUG
        tileDest[0] = Math.round(tileDest[0] - this.img.width / 2);
        tileDest[1] = Math.round(tileDest[1] - this.img.height/ 2);
        ctx.drawImage(this.img.src, tileSource[0], tileSource[1], tileSource[2], tileSource[3], tileDest[0], tileDest[1], tileDest[2], tileDest[3]);

//DEBUG
        if (false)
        {
            ctx.fillStyle = "#D00000";
            ctx.fillRect(origPoints[0] - 2, origPoints[1] - 10, 4, 20);
            ctx.fillRect(origPoints[0] - 10, origPoints[1] - 2, 20, 4);
            ctx.strokeStyle = "#0000FF";
            ctx.strokeRect(Math.round((this.hitbox[0] - viewportOffset[0]) * Viewport.pixelsPerThousand / 1000), Math.round((this.hitbox[1] - viewportOffset[0]) * Viewport.pixelsPerThousand / 1000), this.img.width, this.img.height);
        }
        
    }
    this.hitcheck = function (otherSpaceship)
    {
        if ("spaceship" == otherSpaceship.type)
        {
            if (this.hitbox[0] <= (otherSpaceship.hitbox[0] + otherSpaceship.hitbox[2]) &&
                (this.hitbox[0] + this.hitbox[2]) >= otherSpaceship.hitbox[0] &&
                this.hitbox[1] <= (otherSpaceship.hitbox[1] + otherSpaceship.hitbox[3]) &&
                (this.hitbox[1] + this.hitbox[3] >= otherSpaceship.hitbox[1]))
            {
    /*NEW code */
                var hitRect = [0, 0, 0, 0];
                hitRect[0] = this.hitbox[0];
                if (this.hitbox[0] < otherSpaceship.hitbox[0])
                {
                    hitRect[0] = otherSpaceship.hitbox[0];
                }
                 
                hitRect[1] = this.hitbox[1];
                if (this.hitbox[1] < otherSpaceship.hitbox[1])
                {
                    hitRect[1] = otherSpaceship.hitbox[1];
                }
                
                hitRect[2] = this.hitbox[0] + this.hitbox[2];
                if (hitRect[2] > (otherSpaceship.hitbox[0] + otherSpaceship.hitbox[2]))
                {
                    hitRect[2] = otherSpaceship.hitbox[0] + otherSpaceship.hitbox[2];
                }
    
                
                hitRect[3] = this.hitbox[1] + this.hitbox[3];
                if (hitRect[3] > (otherSpaceship.hitbox[1] + otherSpaceship.hitbox[3]))
                {
                    hitRect[3] = otherSpaceship.hitbox[1] + otherSpaceship.hitbox[3];
                }
                var markerPosition = [ hitRect[2], hitRect[3] ];
    
                hitRect[2] = hitRect[2] - hitRect[0];
                hitRect[3] = hitRect[3] - hitRect[1];
    
                if (hitRect[2] > 0 && hitRect[3] > 0)
                {
    //DEBUG
                    if (false) //DEBUG draw rectangle
                    {
                        if(false)  //DEBUG OUTPUT
                        {
                            var nicified = "[ ";
                            for (var i = 0; i < 4; i ++)
                            {
                                if ( i > 0 ) nicified += ", ";
                                nicified += "" + Math.round(hitRect[i]);
                            }
                            nicified += " ]";
                            console.log("hitRect:" + nicified);
                        }
                        switch ( this.id % 6) {
                            case 0:
                                Viewport.ctx.fillStyle = "#00FF00";
                                break;
                            case 1:
                                Viewport.ctx.fillStyle = "#0000FF";
                                break;
                            case 2:
                                Viewport.ctx.fillStyle = "#00A0A0";
                                break;
                            case 3:
                                Viewport.ctx.fillStyle = "#A0A000";
                                break;
                            case 4:
                                Viewport.ctx.fillStyle = "#A000A0";
                                break;
                            case 5:
                                Viewport.ctx.fillStyle = "#00D0D0";
                                break;
                        }
                        if(((Math.round(Viewport.lastFrameTime / 1000) + this.id) % 3) == 0) {
                            Viewport.ctx.fillRect(Math.round((hitRect[0] - Viewport.viewportOffset[0]) * Viewport.pixelsPerThousand / 1000),
                                              Math.round((hitRect[1] - Viewport.viewportOffset[1]) * Viewport.pixelsPerThousand / 1000),
                                              Math.round(hitRect[2] * Viewport.pixelsPerThousand / 1000),
                                              Math.round(hitRect[3] * Viewport.pixelsPerThousand / 1000) );
                        }
                    }
                    if (true) {  //DEBUG draw cross-hair
                        markerPosition[0] = Math.round(hitRect[0] + hitRect[2] / 2);
                        markerPosition[1] = Math.round(hitRect[1] + hitRect[3] / 2);
                        Viewport.ctx.fillStyle = "#000080";
                        Viewport.ctx.fillRect( Math.round((markerPosition[0] - Viewport.viewportOffset[0]) * Viewport.pixelsPerThousand / 1000)- 2, Math.round((markerPosition[1] - Viewport.viewportOffset[1]) * Viewport.pixelsPerThousand / 1000) - 10, 4, 20);
                        Viewport.ctx.fillRect( Math.round((markerPosition[0] - Viewport.viewportOffset[0]) * Viewport.pixelsPerThousand / 1000) - 10, Math.round((markerPosition[1] - Viewport.viewportOffset[1]) * Viewport.pixelsPerThousand / 1000) - 2, 20, 4);
                    }
                }
            }

        }
    }
    this.destroy = function ()
    {
        MovablesEngine.removeObject(this);
    }
    this.projectileHit = function (powerOfImpact)
    {
        this.health = this.health - powerOfImpact;
        if ( this.health <= 0)
        {
            this.destroy();
        }
    }
    this.fireProjectile = function ()
    {
        var bullet = new Projectile(this, "bullet", [this.position[0], this.position[1]], 25, this.rotation, 2200);
        MovablesEngine.addObject(bullet);
    }
    this.firingIntended = function ()
    {
        var curTime = (new Date()).getTime();
        if(this.timeBetweenFiring <= (curTime - this.lastFired))
        {
            this.lastFired = curTime;
            this.fireProjectile();
        }
    }
}


var Protagonist = {
    spaceship: undefined,
    lastDirectionSetTime: 0,
    minMomentumKeepDuration: 200,
    init: function ()
    {
        Protagonist.spaceship = new Spaceship("Protagonist", "spieler_0", [3000, 7000], 500),
        MovablesEngine.addObject(Protagonist.spaceship);
    },
    userInputDirection: function (direction, elapsedTime)
    {
        //console.log("userInputDirection(" + (direction * 360 / (Math.PI * 2)) + ", " + elapsedTime + " ms)");
        var baseSpeed = 2500;

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

var MovablesEngine = {
    arrObjects: new Array(),
    addObject: function (newObject)
    {
        this.arrObjects.push(newObject);
    },
    removeObject: function (oldObject)
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

var Viewport = {
    viewportCanvas: undefined,
    viewportOffset: new Array(0,0),
    curTime: 0,
    ctx: undefined,
    pxWidth: 0,
    pxHeight: 0,
    lastFrameTime: 0,
    pixelsPerThousand: 50,
    init: function()
    {
        Viewport.initCanvas();
    },
    initCanvas: function()
    {
        Viewport.viewportCanvas = document.getElementById("mainCanvas");
        Viewport.setPxSize(window.innerWidth, window.innerHeight);
        Viewport.ctx = Viewport.viewportCanvas.getContext("2d");
        Viewport.ctx.font = "16px Sans, Sans-Serif";
    },
    adjustIfResizedWindow: function()
    {
        var newWidth = window.innerWidth,
            newHeight = window.innerHeight;
        if ( newWidth != Viewport.pxWidth || newHeight != Viewport.pxHeight)
        {
            Viewport.setPxSize(newWidth, newHeight);
        }
    },
    setPxSize: function(newWidth, newHeight)
    {
        Viewport.pxWidth  = newWidth;
        Viewport.pxHeight = newHeight; 
        Viewport.viewportCanvas.setAttribute("width" , Viewport.pxWidth);
        Viewport.viewportCanvas.setAttribute("height", Viewport.pxHeight);
    },
    debugTestingBackgroundPaint: function (curTime)
    {
        var referenceMaximum = 15000;
        var currentPoints = curTime % referenceMaximum;
        colors = new Array(255,255,Math.floor(255 * Math.cos(currentPoints * Math.PI * 2/ referenceMaximum)));
        switch (Math.floor(curTime % (referenceMaximum * 3) / referenceMaximum))
        {
            case 0:
                colors[0] = colors[2];
                colors[2] = 255;
                break;
            case 1:
                colors[1] = colors[2];
                colors[2] = 255;
                break;
        }
        Viewport.ctx.fillStyle = "#" + getHexForRGB(colors[0], colors[1], colors[2]);
        Viewport.ctx.fillRect(0,0,Viewport.pxWidth, Viewport.pxHeight);
    },
    update: function()
    {
        Viewport.adjustIfResizedWindow();
        var curTime = (new Date()).getTime();
        Viewport.curTime = curTime;

//TESTING CODE, to be REMOVED in alpha stage
        Viewport.debugTestingBackgroundPaint(curTime);


        var timeSinceLastFrame = 0;
        if ( Viewport.wasRunning  )
        {
            timeSinceLastFrame = curTime - Viewport.lastFrameTime;
        }
        Viewport.paintMovables(timeSinceLastFrame);

        Viewport.finishUpdating(curTime);
        
    },
    finishUpdating: function(curTime)
    {
        Viewport.lastFrameTime = curTime;
        Viewport.wasRunning = true;
    },
    paintMovables: function (timeSinceLastFrame)
    {
        var movablesLength = MovablesEngine.arrObjects.length;
        var curObj;
        for( var i = 0; i < movablesLength; i++)
        {
            curObj = MovablesEngine.arrObjects[i];
            if (Viewport.objInsideViewport(curObj) || curObj == Protagonist.spaceship)
            {
                curObj.paint(Viewport.ctx, Viewport.viewportOffset, timeSinceLastFrame);
            }
        }
    },
    objInsideViewport: function (movingObject)
    {
        //TODO: implement me
        return true;
    }
};

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
                Protagonist.userInputDirection(Math.PI / 2, curKeyPress.timeElapsed);
            }
            else if (39 == curKeyPress.keyCode)
            {
                Protagonist.userInputDirection(0, curKeyPress.timeElapsed);
            }
            else if (40 == curKeyPress.keyCode)
            {
                Protagonist.userInputDirection(Math.PI / 2 * 3, curKeyPress.timeElapsed);
            }
            else if (32 == curKeyPress.keyCode)
            {
                Protagonist.spaceship.firingIntended();
            }
        }
    }
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
setTimeout(ProgramExecuter.init, 150);
MovablesEngine.addObject(new Spaceship("Enemy", "gegner_2", [4000, 4000], 10000));
MovablesEngine.addObject(new Spaceship("Enemy", "gegner_1", [9000, 5000], 10000));
MovablesEngine.addObject(new Spaceship("Enemy", "gegner_3", [7000, 4000], 10000));
MovablesEngine.addObject(new Spaceship("Enemy", "gegner_4", [1500, 3500], 10000));
MovablesEngine.arrObjects[0].velocity = 550;
MovablesEngine.arrObjects[0].engine = function ()
{
    this.moveDirection = Math.PI / 4 * (Viewport.curTime % 32000 / 4000);
}
MovablesEngine.arrObjects[1].velocity = 1700;
MovablesEngine.arrObjects[1].engine = function ()
{
    this.moveDirection = Math.PI * Math.round(Viewport.curTime % 10000 / 5000);
    this.velocity = Math.sin((Viewport.curTime + 2500 ) % 5000 * Math.PI / 5000) * 4000;
}
MovablesEngine.arrObjects[2].velocity = 250;
MovablesEngine.arrObjects[2].engine = function ()
{
    this.moveDirection = Math.PI / 4 * Math.round(7 - (Viewport.curTime % 48000 / 6000));
}
MovablesEngine.arrObjects[3].velocity = 250;
MovablesEngine.arrObjects[3].engine = function ()
{
    this.moveDirection = Math.PI / 2 * (Math.round(Viewport.curTime % 20000 / 10000) * 2 + 1);
}
