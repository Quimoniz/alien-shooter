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

function Spaceship (paramName, imgName, paramPosition, paramMass) {
    this.id = objectIdCounter++;
    this.name = paramName;
    this.img = GraphicsRooster.getImgByName(imgName);
    this.position = paramPosition;
    this.velocity = 0;
    this.moveDirection = Math.PI / 2;
    this.mass = paramMass;
    this.rotation = Math.PI / 2;
    this.rotationSpeed = 0;
    this.engine = function()
    {
    }
    this.update = function(timeSinceLastFrame)
    {
        this.engine();

        this.position[0] += Math.cos(this.moveDirection) * this.velocity * timeSinceLastFrame / 1000;
        this.position[1] += Math.sin(this.moveDirection) * this.velocity * timeSinceLastFrame / 1000 * -1;
    }

    this.paint = function (ctx, viewportOffset, timeSinceLastFrame)
    {
        this.update(timeSinceLastFrame);
        var tileSource = [0,0,this.img.width,this.img.height];
        var tileDest = [Math.round((this.position[0] - viewportOffset[0]) * Viewport.pixelsPerThousand / 1000), Math.round((this.position[1] - viewportOffset[1]) * Viewport.pixelsPerThousand / 1000), tileSource[2], tileSource[3]];
        
        ctx.drawImage(this.img.src, tileSource[0], tileSource[1], tileSource[2], tileSource[3], tileDest[0], tileDest[1], tileDest[2], tileDest[3]);
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
        Protagonist.spaceship.velocity = 2500;
        Protagonist.spaceship.moveDirection = (Protagonist.spaceship.moveDirection + direction) / 2;
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
        for (var i = 0; i < this.arrObjects.length; i++)
        {
            if (oldObject.id == this.arrObjects[i].id)
            {
                newArrObjects = this.arrObjects.slice(0,i);
                if ((i + 1) < this.arrObjects.length)
                {
                    newArrObjects.concat(this.arrObjects.slice(i+1));
                }
                this.arrObjects = newArrObjects;
                break;
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
        for( var i = 0; i < movablesLength; i++)
        {
            if (Viewport.objInsideViewport(MovablesEngine.arrObjects[i]))
            {
                MovablesEngine.arrObjects[i].paint(Viewport.ctx, Viewport.viewportOffset, timeSinceLastFrame);
            }
        }
    },
    objInsideViewport: function ()
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
            UserInput.keysUsedQueue.push(new KeyPressObj(keyCode));
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
setTimeout(ProgramExecuter.init, 150);
MovablesEngine.addObject(new Spaceship("Enemy", "gegner_2", [4000, 4000], 10000));
MovablesEngine.addObject(new Spaceship("Enemy", "gegner_1", [9000, 5000], 10000));
MovablesEngine.addObject(new Spaceship("Enemy", "gegner_3", [7000, 4000], 10000));
MovablesEngine.addObject(new Spaceship("Enemy", "gegner_4", [1500, 3500], 10000));
MovablesEngine.arrObjects[0].velocity = 1100;
MovablesEngine.arrObjects[0].engine = function ()
{
    this.moveDirection = Math.PI / 4 * (Viewport.curTime % 16000 / 2000);
}
MovablesEngine.arrObjects[1].velocity = 1700;
MovablesEngine.arrObjects[1].engine = function ()
{
    this.moveDirection = Math.PI * Math.round(Viewport.curTime % 10000 / 5000);
    this.velocity = Math.sin((Viewport.curTime + 2500 ) % 5000 * Math.PI / 5000) * 4000;
}
MovablesEngine.arrObjects[2].velocity = 500;
MovablesEngine.arrObjects[2].engine = function ()
{
    this.moveDirection = Math.PI / 4 * Math.round(7 - (Viewport.curTime % 24000 / 3000));
}
MovablesEngine.arrObjects[3].velocity = 500;
MovablesEngine.arrObjects[3].engine = function ()
{
    this.moveDirection = Math.PI / 2 * (Math.round(Viewport.curTime % 10000 / 5000) * 2 + 1);
}
