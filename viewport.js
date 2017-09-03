var Viewport = {
    viewportCanvas: undefined,
    viewportOffset: new Vector2(0,0),
    viewportSize: new Vector2(20000, 12000),
    curTime: 0,
    ctx: undefined,
    pxWidth: 0,
    pxHeight: 0,
    lastFrameTime: 0,
    pixelsPerThousand: 50,
    movePerSecond: 800,
    init: function()
    {
        Viewport.initCanvas();
    },
    initCanvas: function()
    {
        Viewport.viewportCanvas = document.getElementById("mainCanvas");
        Viewport.setPxSize(window.innerWidth, window.innerHeight);
        Viewport.ctx = Viewport.viewportCanvas.getContext("2d");
        Viewport.ctx.font = "32px Sans, Sans-Serif";
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
        Viewport.viewportSize.x = Viewport.pxWidth  / Viewport.pixelsPerThousand * 1000;
        Viewport.viewportSize.y = Viewport.pxHeight / Viewport.pixelsPerThousand * 1000;
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
//Viewport.debugTestingBackgroundPaint(curTime);

        var timeSinceLastFrame = 0;
        if ( Viewport.wasRunning  )
        {
            timeSinceLastFrame = curTime - Viewport.lastFrameTime;
        }
        Viewport.viewportOffset.y += Viewport.movePerSecond * timeSinceLastFrame / 1000;

      
        
        Viewport.paintMovables(timeSinceLastFrame);
        Viewport.paintParticles(timeSinceLastFrame);
        Viewport.paintPowerups(timeSinceLastFrame);
        Viewport.ctx.fillStyle = "red";
        Credits.DrawCredits();
        Viewport.ctx.fillText("Score: " +  Protagonist.score,10,50);
        Viewport.ctx.fillText("Wave: " + EnemyWaves.loopedAmount,10,100);
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
            } else
            {
/*DEBUG
                if(curObj)
                {
                    console.log("Object (" + curObj.id + ", " + curObj.img.name + ") left viewport. Deleting.");
                }
*/
                MovablesEngine.removeObject(curObj);
            }
        }
    },
    paintParticles: function(timeSinceLastFrame)
    {
        var newParticleArr = new Array();
        var curParticle;
        var particleCount = MovablesEngine.arrParticles.length;
        for ( var i = 0; i < particleCount; i++)
        {
            curParticle = MovablesEngine.arrParticles[i];
            if(curParticle.isActive && Viewport.objInsideViewport(curParticle))
            {
                curParticle.paint(Viewport.ctx, Viewport.viewportOffset, timeSinceLastFrame);
                newParticleArr.push(curParticle);
            } else
            {
                curParticle.isActive = false;
                delete curParticle;
            }
        }
        MovablesEngine.arrParticles = newParticleArr;
    },
    paintPowerups: function(timeSinceLastFrame)
    {
        var curPowerup;
        var powerupCount = allPowerups.length;
        for ( var i = 0; i < powerupCount; i++)
        {
            curPowerup = allPowerups[i];
            if(Viewport.objInsideViewport(curPowerup))
            {
                curPowerup.paint(Viewport.ctx, Viewport.viewportOffset, timeSinceLastFrame);
            }
        }
    },
    objInsideViewport: function (movingObject)
    {
        if(movingObject)
        {
            if(movingObject.hitbox)
            {
                var relationalHitbox = [
                    movingObject.hitbox[0] - Viewport.viewportOffset.x,
                    movingObject.hitbox[1] - Viewport.viewportOffset.y,
                    movingObject.hitbox[2],
                    movingObject.hitbox[3]
                ];
                var intersectHitbox = [
                    0,
                    0,
                    relationalHitbox[2],
                    relationalHitbox[3] 
                ];
                for (var i = 0; i < 2; i++)
                {
                    if(relationalHitbox[i] < 0)
                    {
                        intersectHitbox[i+2] += relationalHitbox[i];
                        intersectHitbox[i] = 0;
                    } else
                    {
                        intersectHitbox[i] = relationalHitbox[i];
                    }
                }
                for (var i = 0; i < 2; i++)
                {
                    if ((intersectHitbox[i] + intersectHitbox[i+2]) > Viewport.viewportSize[i])
                    {
                        intersectHitbox[i+2] = Viewport.viewportSize[i] - intersectHitbox[i];
                    }
                    if(intersectHitbox[i+2] < 0)
                    {
                        intersectHitbox[i+2] = 0;
                    }
                }
                intersectHitbox[0] += Viewport.viewportOffset.x;
                intersectHitbox[1] += Viewport.viewportOffset.y;
                
                
                if (intersectHitbox[2] > 0 && intersectHitbox[3] > 0)
                {
/* DEBUG
                    if (true)
                    {
                        Viewport.ctx.strokeStyle = "#0000FF";
                        Viewport.ctx.strokeRect(Math.round((intersectHitbox[0] - Viewport.viewportOffset[0]) * Viewport.pixelsPerThousand / 1000), Math.round((intersectHitbox[1] - Viewport.viewportOffset[1]) * Viewport.pixelsPerThousand / 1000), intersectHitbox[2] * Viewport.pixelsPerThousand / 1000, intersectHitbox[3] * Viewport.pixelsPerThousand / 1000);
                    }
*/
                    return true;
                } else
                {
                    return false;
                }
    return true;
            } else
            {
                if(movingObject.position.x > Viewport.viewportOffset.x &&
                   movingObject.position.x < (Viewport.viewportOffset.x + Viewport.viewportSize.x) &&
                   movingObject.position.y > Viewport.viewportOffset.y &&
                   movingObject.position.y < (Viewport.viewportOffset.y + Viewport.viewportSize.y))
                {
                    return true;
                } else
                {
                    return false;
                }
            }
            return true;
        } else
        {
            return false;
        }
    }
};
