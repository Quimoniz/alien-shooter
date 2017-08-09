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
    this.rotation = 0;
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
        this.rotation += this.rotationSpeed * timeSinceLastFrame / 1000;
        if(this.rotation > (Math.PI * 2))
            this.rotation = this.rotation % (Math.PI * 2);
        else if(this.rotation  < 0)
            this.rotation = (Math.PI * 2) - (this.rotation % (Math.PI * -2));
        if(this.id == Protagonist.spaceship.id)
        {
            if(this.position[1] < Viewport.viewportOffset[1] + 700)
            {
                this.position[1] = Viewport.viewportOffset[1] + 700;
            }
            if(this.position[0] < Viewport.viewportOffset[0])
            {
                this.position[0] = Viewport.viewportOffset[0];
            }
            if(this.position[0] > (Viewport.viewportOffset[0] + Viewport.viewportSize[0]))
            {
                this.position[0] = Viewport.viewportOffset[0] + Viewport.viewportSize[0];
            }
        }
        this.updateHitbox();
    }
    this.updateHitbox = function ()
    {
        this.hitbox = [this.position[0] - this.img.width * 1000 / 2 / Viewport.pixelsPerThousand,
                       this.position[1] - this.img.height* 1000 / 2 / Viewport.pixelsPerThousand,
                       this.img.width * 1000 / Viewport.pixelsPerThousand,
                       this.img.height * 1000/ Viewport.pixelsPerThousand];
    }
    this.updateHitbox();

    this.paint = function (ctx, viewportOffset, timeSinceLastFrame)
    {
        this.update(timeSinceLastFrame);
        
        var tileSource = [0,0,this.img.width,this.img.height];
        var tileDest = [(this.position[0] - viewportOffset[0]) * Viewport.pixelsPerThousand / 1000, (Viewport.viewportSize[1] - this.position[1] + viewportOffset[1]) * Viewport.pixelsPerThousand / 1000, tileSource[2], tileSource[3]];
        var origPoints = [tileDest[0], tileDest[1]];
        if(this.rotation != 0) {
            tileDest[0] = Math.round(0 - this.img.width / 2);
            tileDest[1] = Math.round(0 - this.img.height/ 2);
            ctx.save();
            ctx.translate(origPoints[0], origPoints[1]);
            ctx.rotate(this.rotation);
            ctx.drawImage(this.img.src, tileSource[0], tileSource[1], tileSource[2], tileSource[3], tileDest[0], tileDest[1], tileDest[2], tileDest[3]);
            ctx.restore();
        } else
        {
            tileDest[0] = Math.round(tileDest[0] - this.img.width / 2);
            tileDest[1] = Math.round(tileDest[1] - this.img.height/ 2);
            ctx.drawImage(this.img.src, tileSource[0], tileSource[1], tileSource[2], tileSource[3], tileDest[0], tileDest[1], tileDest[2], tileDest[3]);
        }

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
        if (otherSpaceship && "spaceship" == otherSpaceship.type)
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
                    if(otherSpaceship.id == Protagonist.spaceship.id)
                    {
                        Protagonist.spaceship.collisionDamage();
                    }
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
                    if (false) {  //DEBUG draw cross-hair
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
        var explosionParticle;
        var numOfExplosions = 1;
        if ("Boss" == this.name)
        {
            numOfExplosions = 3;
        }
        for (var i = 0; i < numOfExplosions; i++)
        {
            explosionParticle = MovablesEngine.createParticle("explosion", [this.position[0] + i / numOfExplosions * 3000, this.position[1]], this.moveDirection, this.velocity / 3);
            explosionParticle.template.minStepDuration = 70;
        }
        for (var i = 8 + Math.random() * 6; i > 0 ; i--)
        {
            explosionParticle = MovablesEngine.createParticle("reddot", [this.position[0], this.position[1]], Math.PI * 2 * i / 10 + Math.random() * Math.PI * 2 / 10, 800 + Math.random() * 1500 + Math.random () * 1500);
            explosionParticle.template.minStepDuration = 300;
        }
        
        if(Protagonist.spaceship.id == this.id)
        {
            alert("Game Over"); 
            clearInterval(myInterval); 
            location.reload();
        }
        else {
            Protagonist.score += this.health;  
             
            console.log("Spaceship with the ID: " + this.name + " has been destroyed!"); //Error for some reason?? Is this called too often? or the Hitbox not removed properly?
        }
		 MovablesEngine.removeObject(this);
    }
    this.damage = function (amountOfDamage)
    {
        this.health = this.health - amountOfDamage;  
        if ( this.health <= 0)
        {
            this.destroy();
        }
    }
    this.projectileHit = function (powerOfImpact)
    {
        this.damage(powerOfImpact);
    }
    this.collisionDamage = function ()
    {
        this.damage(25);
    }
    this.fireProjectile = function ()
    {
        if("Protagonist" == this.name)
        {
            var bullet = new Projectile(this, "bullet", [this.position[0]-440, this.position[1] +190], 25, this.rotation + Math.PI / 2, -3500);
            MovablesEngine.addObject(bullet);
                bullet = new Projectile(this, "bullet", [this.position[0]+440, this.position[1] +190], 25, this.rotation + Math.PI / 2, -3500);
            MovablesEngine.addObject(bullet);
        } else if("Boss" == this.name)
        {
            var bullet = new Projectile(this, "bullet", [this.position[0], this.position[1] - 500], 25, this.rotation + Math.PI / 2 * 3, -2200);
            MovablesEngine.addObject(bullet);
        } else
        {
            var bullet = new Projectile(this, "bullet", [this.position[0], this.position[1]], 25, this.rotation, 2200);
            MovablesEngine.addObject(bullet);
        }
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
