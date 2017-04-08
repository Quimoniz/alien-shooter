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
var GraphicsRooster = {
    arrNames : new Array(),
    arrImages : new Array(),
    countImages: 0,
    addImage: function(nameStr, imageSrc)
    {
        var imageObj = new ImageWrapper(nameStr, imageSrc);
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

function ImageWrapper(nameStr, imageSrc)
{
    this.name = nameStr
    this.src = new Image(imageSrc);
    var selfReference;
    this.src.onload = function () {
        selfReference.width = selfReference.src.width;
        selfReference.height = selfReference.src.height;
    }
}

function flyingObject () {
    this.id;
    this.name;
    this.velocity;
    this.direction;
}

var Landscape = {
    tilesetSrc: ""
}

var Viewport = {
    viewportCanvas: undefined,
    ctx: undefined,
    pxWidth : 0,
    pxHeight : 0,
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
    update: function()
    {
        Viewport.adjustIfResizedWindow();
        var referenceMaximum = 15000;
        var curTime = (new Date()).getTime();
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
        Viewport.ctx.fillStyle = "rgba(" + colors[0] + "," + colors[1] + "," + colors[2] +  ")";
        Viewport.ctx.fillRect(0,0,Viewport.pxWidth, Viewport.pxHeight);
    }
};

var ProgramExecuter = {
    currentRunningInterval: -1,
    init: function()
    {
        Viewport.init();
        setTimeout(ProgramExecuter.startLevelLoop, 200);
    },
    startLevelLoop: function ()
    {
	ProgramExecuter.oneTickLevelLoop();
        ProgramExecuter.currentRunningInterval = setInterval(ProgramExecuter.oneTickLevelLoop, 50);
    },
    oneTickLevelLoop: function ()
    {
        Viewport.update();
    }
};





GraphicsRooster.addImage("gegner_1", "gegner_1.png");
GraphicsRooster.addImage("gegner_2", "gegner_2.png");
GraphicsRooster.addImage("gegner_3", "gegner_3.png");
GraphicsRooster.addImage("gegner_4", "gegner_4.png");
GraphicsRooster.addImage("gegner_5", "gegner_5.png");
setTimeout(ProgramExecuter.init, 150);

