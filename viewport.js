var Viewport = {
    viewportCanvas: undefined,
    viewportOffset: new Vector2(0,0),
    viewportSize: new Vector2(20000, 12000),
    paintOffset: [0,0], //TODO: vectorize me
    paintSize: [200,200], //TODO: vectorize me
    hudPlacement: "right",
    deltaTimePreviousFrame: 0,
    curTime: 0,
    ctx: undefined,
    pxWidth: 0,
    pxHeight: 0,
    lastFrameTime: 0,
    pixelsPerThousand: 50,
    movePerSecond: 800,//default: 800
    hudSum: 0,
    mouse: undefined,
    mousedown: false,
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
        //Viewport.viewportCanvas.addEventListener("mousemove", Viewport.mouseHover);
        //Viewport.viewportCanvas.addEventListener("mouseover", Viewport.mouseHover);
        //Viewport.viewportCanvas.addEventListener("mouseenter", Viewport.mouseHover);
        window.onmousemove = Viewport.mouseHover;
        window.onmouseover = Viewport.mouseHover;
        window.onmouseenter = Viewport.mouseHover;
        window.onmousedown = function () { Viewport.mousedown = true; };
        window.ontouchstart = function (evt) { Viewport.mouseHover(evt); Viewport.mousedown = true; };
        window.onmouseup = function () { Viewport.mousedown = false; };
        window.ontouchend = function (evt) { Viewport.mouseHover(evt); Viewport.mousedown = false; };
        window.ontouchenter = Viewport.mouseHover;
        window.ontouchmove = Viewport.mouseHover;
        window.ontouchleave = Viewport.mouseHover;
    },
    mouseHover: function(evt)
    {
      if(evt && evt.pageX && evt.pageY)
      {
        Viewport.mouse = new Vector2(evt.pageX, evt.pageY);
      }
      return true;
    },
    moveToProtagonist: function()
    {
        if(Protagonist.spaceship.position.y > (Viewport.viewportOffset.y + Viewport.viewportSize.y - Protagonist.spaceship.hitbox[3] * 2))
        {
            Viewport.viewportOffset.y = Protagonist.spaceship.position.y - Viewport.viewportSize.y + Protagonist.spaceship.hitbox[3] * 2;
        }
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
        if(Viewport.pxWidth >= Viewport.pxHeight)
        {
            Viewport.paintOffset = [ 0, 0];
            Viewport.paintSize = [ Viewport.pxWidth - 230, Viewport.pxHeight];
            Viewport.hudPlacement = "right";
        } else
        {
            Viewport.paintOffset = [ 0, 170];
            Viewport.paintSize = [ Viewport.pxWidth, Viewport.pxHeight - 170];
            Viewport.hudPlacement = "top";
        }
        Viewport.viewportSize.x = Viewport.paintSize[0] / Viewport.pixelsPerThousand * 1000;
        Viewport.viewportSize.y = Viewport.paintSize[1] / Viewport.pixelsPerThousand * 1000;
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
        Viewport.moveToProtagonist();
        var curTime = (new Date()).getTime();
        Viewport.curTime = curTime;

//TESTING CODE, to be REMOVED in alpha stage
//Viewport.debugTestingBackgroundPaint(curTime);

        var timeSinceLastFrame = 0;
        if ( Viewport.wasRunning  )
        {
            timeSinceLastFrame = curTime - Viewport.lastFrameTime;
            Viewport.deltaTimePreviousFrame = timeSinceLastFrame;
        }
        Viewport.viewportOffset.y += Viewport.movePerSecond * timeSinceLastFrame / 1000;

      
        
        Viewport.paintMovables(timeSinceLastFrame);
        Viewport.paintParticles(timeSinceLastFrame);
        Viewport.ctx.fillStyle = "red";
        Credits.DrawCredits();

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
            if(curObj)
            {
              if (Viewport.objInsideViewport(curObj) || curObj == Protagonist.spaceship)
              {
                  curObj.paint(Viewport.ctx, Viewport.viewportOffset, Viewport.viewportSize, timeSinceLastFrame);
              } else
              {
                  curObj.isAlive = false;
                  //MovablesEngine.removeObject(curObj);
              }
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
                curParticle.paint(Viewport.ctx, Viewport.viewportOffset, Viewport.viewportSize, timeSinceLastFrame);
                newParticleArr.push(curParticle);
            } else
            {
                curParticle.isActive = false;
                delete curParticle;
            }
        }
        MovablesEngine.arrParticles = newParticleArr;
    },
    paintHud: function()
    {
        var curHudSum = (EnemyWaves.loopedAmount << 24) + (Protagonist.score  << 16) + (Protagonist.spaceship.curHealth << 8) + (Protagonist.spaceship.shieldCurHealth);
        if(curHudSum != Viewport.hudSum)
        {
            Viewport.hudSum = curHudSum;
        
            if("top" == Viewport.hudPlacement)
            {
                //do a clear:
                Viewport.ctx.fillStyle = "#ffffff";
                Viewport.ctx.fillRect(0,
                                      0,
                                      Viewport.pxWidth,
                                      Viewport.paintOffset[1]);

                Viewport.ctx.strokeStyle = "#e00000";
                Viewport.ctx.fillStyle   = "#e00000";
                Viewport.ctx.fillText("Score: " +  Protagonist.score,10, 30);
                Viewport.ctx.fillText("Wave: " + EnemyWaves.loopedAmount,10, 70);
                Viewport.ctx.strokeRect(Viewport.pxWidth / 2 - Viewport.pxWidth / 8 * 3, 130, Viewport.pxWidth / 4 * 3, 30);
                Viewport.ctx.fillRect(Viewport.pxWidth / 2 - Viewport.pxWidth / 8 * 3, 130, Protagonist.spaceship.curHealth * (Viewport.pxWidth / 4 * 3) / Protagonist.spaceship.maxHealth, 30);
                if(Protagonist.spaceship.hasShield)
                {
                  Viewport.ctx.strokeStyle = "#60b0ea";
                  Viewport.ctx.fillStyle   = "#60b0ea";
                  Viewport.ctx.strokeRect(Viewport.pxWidth / 2 - Viewport.pxWidth / 8 * 3, 90, Viewport.pxWidth / 4 * 3, 30);
                  Viewport.ctx.fillRect(Viewport.pxWidth / 2 - Viewport.pxWidth / 8 * 3, 90, Protagonist.spaceship.shieldCurHealth * (Viewport.pxWidth / 4 * 3) / Protagonist.spaceship.shieldMaxHealth, 30);
                }
            } else if("bottom" == Viewport.hudPlacement)
            {
                //do a clear:
                Viewport.ctx.fillStyle = "#ffffff";
                Viewport.ctx.fillRect(0,
                                      Viewport.paintOffset[1] + Viewport.paintSize[1],
                                      Viewport.pxWidth,
                                      Viewport.pxHeight - (Viewport.paintOffset[1] + Viewport.paintSize[1]));

                Viewport.ctx.strokeStyle = "#e00000";
                Viewport.ctx.fillStyle   = "#e00000";
                Viewport.ctx.fillText("Score: " +  Protagonist.score,10,Viewport.paintOffset[1] + Viewport.paintSize[1] + 100);
                Viewport.ctx.fillText("Wave: " + EnemyWaves.loopedAmount,10,Viewport.paintOffset[1] + Viewport.paintSize[1] + 150);
                Viewport.ctx.strokeRect(Viewport.pxWidth / 2 - Viewport.pxWidth / 8 * 3, Viewport.paintOffset[1] + Viewport.paintSize[1], Viewport.pxWidth / 4 * 3, 30);
                Viewport.ctx.fillRect(Viewport.pxWidth / 2 - Viewport.pxWidth / 8 * 3, Viewport.paintOffset[1] + Viewport.paintSize[1], Protagonist.spaceship.curHealth * (Viewport.pxWidth / 4 * 3) / Protagonist.spaceship.maxHealth, 30);
                if(Protagonist.spaceship.hasShield)
                {
                  Viewport.ctx.strokeStyle = "#60b0ea";
                  Viewport.ctx.fillStyle   = "#60b0ea";
                  Viewport.ctx.strokeRect(Viewport.pxWidth / 2 - Viewport.pxWidth / 8 * 3, Viewport.paintOffset[1] + Viewport.paintSize[1] + 40, Viewport.pxWidth / 4 * 3, 30);
                  Viewport.ctx.fillRect(Viewport.pxWidth / 2 - Viewport.pxWidth / 8 * 3, Viewport.paintOffset[1] + Viewport.paintSize[1] + 40, Protagonist.spaceship.shieldCurHealth * (Viewport.pxWidth / 4 * 3) / Protagonist.spaceship.shieldMaxHealth, 30);
                }
            } else if("right" == Viewport.hudPlacement)
            {
                //do a clear:
                Viewport.ctx.fillStyle = "#ffffff";
                Viewport.ctx.fillRect(Viewport.paintOffset[0] + Viewport.paintSize[0],
                                      0,
                                      Viewport.pxWidth - (Viewport.paintOffset[0] + Viewport.paintSize[0]),
                                      Viewport.pxHeight);
                
                Viewport.ctx.strokeStyle = "#e00000";
                Viewport.ctx.fillStyle   = "#e00000";
                Viewport.ctx.fillText("Score: " +  Protagonist.score,Viewport.paintOffset[0] + Viewport.paintSize[0],40);
                Viewport.ctx.fillText("Wave: " + EnemyWaves.loopedAmount,Viewport.paintOffset[0] + Viewport.paintSize[0],80);
                Viewport.ctx.strokeRect(Viewport.paintOffset[0] + Viewport.paintSize[0],
                                        100,
                                        40,
                                        Viewport.pxHeight - 100);
                var healthHeight = Math.floor((Viewport.pxHeight - 100) * (Protagonist.spaceship.curHealth / Protagonist.spaceship.maxHealth));
                Viewport.ctx.fillRect(Viewport.paintOffset[0] + Viewport.paintSize[0],
                                      Viewport.pxHeight - healthHeight,
                                      40,
                                      healthHeight);

                if(Protagonist.spaceship.hasShield)
                {
                  Viewport.ctx.strokeStyle = "#60b0ea";
                  Viewport.ctx.fillStyle   = "#60b0ea";
                  Viewport.ctx.strokeRect(Viewport.paintOffset[0] + Viewport.paintSize[0] + 50,
                                          100,
                                          40,
                                          Viewport.pxHeight - 100);
                  var shieldHeight = Math.floor((Viewport.pxHeight - 100) * (Protagonist.spaceship.shieldCurHealth / Protagonist.spaceship.shieldMaxHealth));
                  Viewport.ctx.fillRect(Viewport.paintOffset[0] + Viewport.paintSize[0] + 50,
                                        Viewport.pxHeight - shieldHeight,
                                        40,
                                        shieldHeight);
                }
//                Viewport.ctx.fillRect(Viewport.paintOffset[0] + Viewport.paintSize[0], 0, 100, 100);
            }
        }
    },
    vecInsideViewport: function(vec)
    {
        if(vec.x > Viewport.viewportOffset.x
        && vec.x < (Viewport.viewportOffset.x + Viewport.viewportSize.x)
        && vec.y > Viewport.viewportOffset.y
        && vec.y < (Viewport.viewportOffset.y + Viewport.viewportSize.y))
        {
            return true;
        }
        return false;
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
                if(intersectHitbox[0] > Viewport.viewportSize.x)
                {
                    intersectHitbox[2] = 0;
                } else if ((intersectHitbox[0] + intersectHitbox[2]) > Viewport.viewportSize.x)
                {
                    intersectHitbox[2] = Viewport.viewportSize.x - intersectHitbox[0];
                }
                if(intersectHitbox[1] > Viewport.viewportSize.y)
                {
                    intersectHitbox[3] = 0;
                } else if ((intersectHitbox[1] + intersectHitbox[3]) > Viewport.viewportSize.y)
                {
                    intersectHitbox[3] = Viewport.viewportSize.y - intersectHitbox[1];
                }
                /* not necessary
                if(intersectHitbox[i+2] < 0)
                {
                    intersectHitbox[i+2] = 0;
                }
                */
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
