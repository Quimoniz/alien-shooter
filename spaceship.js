function Spaceship (paramName, imgName, paramPosition, paramMass, paramInitialHealth) {
    this.id = objectIdCounter++;
    this.type = "spaceship";
    this.name = paramName;
    this.img = GraphicsRooster.getImgByName(imgName);
    this.shieldImg = GraphicsRooster.getImgByName("shield");
    this.position = paramPosition;
    this.defaultSpeed = 800;
    this.speed = 0;
    this.moveDirection = new Vector2(0, -1);
    this.steerIntention = undefined;
    this.curHealth = paramInitialHealth;
    this.maxHealth = paramInitialHealth;
    this.mass = paramMass;
    this.rotation = 0;
    this.rotationSpeed = 0;
    this.hitbox = [0,0,0,0];
    this.lastFired = 0;
    this.timeBetweenFiring = 250;
    this.invincible = false;
    this.hasShield = false;
    this.shieldCurHealth = 0;
    this.shieldMaxHealth = 0;


    this.engine = function()
    {
    }
    this.steerTowardsMoveDirection = function(intendedMoveDirection)
    {
      this.steerIntention = intendedMoveDirection;
    }
    this.update = function(timeSinceLastFrame)
    {
        this.engine();
        if(this.steerIntention)
        {
          var appliedCurrentSpeed = this.moveDirection.MultiplyNoChanges(this.speed);
          var deltaSpeed;
          deltaSpeed =  this.steerIntention.clone().Subtract(appliedCurrentSpeed);
          if(deltaSpeed.length < this.defaultSpeed * 0.10)
          {
            this.moveDirection = this.steerIntention;
            this.speed = this.defaultSpeed;
            this.steerIntention = undefined;
          }
          appliedCurrentSpeed.Add(deltaSpeed.Normalized.MultiplyNoChanges(this.defaultSpeed * timeSinceLastFrame / 1000));
          // maximum speed is default speed
          if(appliedCurrentSpeed.length > this.defaultSpeed)
          {
            appliedCurrentSpeed.Multiply(this.defaultSpeed / appliedCurrentSpeed.length)
          }
          this.speed = appliedCurrentSpeed.length;
          this.moveDirection = appliedCurrentSpeed.Normalized;

          
        }
        this.position.Add(this.moveDirection.MultiplyNoChanges((this.speed * timeSinceLastFrame / 1000)));
        this.rotation += this.rotationSpeed * timeSinceLastFrame / 1000;
        if(this.rotation > (Math.PI * 2))
            this.rotation = this.rotation % (Math.PI * 2);
        else if(this.rotation  < 0)
            this.rotation = (Math.PI * 2) - (this.rotation % (Math.PI * -2));
        if(this.id == Protagonist.spaceship.id)
        {
            if(this.position.y < Viewport.viewportOffset.y + 700)
            {
                this.position.y = Viewport.viewportOffset.y + 700;
            }
            if(this.position.x < Viewport.viewportOffset.x)
            {
                this.position.x = Viewport.viewportOffset.x;
                this.moveDirection.x = 0;
                this.speed = this.moveDirection.y * this.speed;
                this.moveDirection.Normalize();
            }
            if(this.position.x > (Viewport.viewportOffset.x + Viewport.viewportSize.x))
            {
                this.position.x = Viewport.viewportOffset.x + Viewport.viewportSize.x;
                this.moveDirection.x = 0;
                this.speed = this.moveDirection.y * this.speed;
                this.moveDirection.Normalize();
            }
        }
        this.updateHitbox();
    }
    this.updateHitbox = function ()
    {
        this.hitbox = [this.position.x - this.img.width * 1000 / 2 / Viewport.pixelsPerThousand,
                       this.position.y - this.img.height* 1000 / 2 / Viewport.pixelsPerThousand,
                       this.img.width * 1000 / Viewport.pixelsPerThousand,
                       this.img.height * 1000/ Viewport.pixelsPerThousand];
        if(this.hasShield)
        {
          this.hitbox = [this.position.x - this.shieldImg.width * 1000 / 2 / Viewport.pixelsPerThousand,
                         this.position.y - this.shieldImg.height* 1000 / 2 / Viewport.pixelsPerThousand,
                         this.shieldImg.width * 1000 / Viewport.pixelsPerThousand,
                         this.shieldImg.height * 1000/ Viewport.pixelsPerThousand];
        }
    }
    this.updateHitbox();

    this.paint = function (ctx, viewportOffset, timeSinceLastFrame)
    {
        this.update(timeSinceLastFrame);
        
        var tileSource = [0,0,this.img.width,this.img.height];
        var tileDest = [Viewport.paintOffset[0] + (this.position.x - viewportOffset.x) * Viewport.pixelsPerThousand / 1000, Viewport.paintOffset[1] + (Viewport.viewportSize.y - this.position.y + viewportOffset.y) * Viewport.pixelsPerThousand / 1000, tileSource[2], tileSource[3]];
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
        if(this.hasShield)
        {
            ctx.drawImage(this.shieldImg.src, 0, 0, this.shieldImg.width, this.shieldImg.height, origPoints[0] + Math.round(0 - this.shieldImg.width / 2), origPoints[1] + Math.round(0 - this.shieldImg.width / 2), this.shieldImg.width, this.shieldImg.height);
        }

//DEBUG
        if (false)
        {
            ctx.fillStyle = "#D00000";
            ctx.fillRect(origPoints[0] - 2, origPoints[1] - 10, 4, 20);
            ctx.fillRect(origPoints[0] - 10, origPoints[1] - 2, 20, 4);
            ctx.strokeStyle = "#0000FF";
            ctx.strokeRect(Math.round((this.hitbox[0] - viewportOffset.x) * Viewport.pixelsPerThousand / 1000), Math.round((this.hitbox[1] - viewportOffset.x) * Viewport.pixelsPerThousand / 1000), this.img.width, this.img.height);
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
/*
                    if(otherSpaceship.id == Protagonist.spaceship.id)
                    {
                        Protagonist.spaceship.collisionDamage();
                    }
*/
                    //will be handled by MovablesEngine
                    //otherSpaceship.collision(this, hitRect);
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
                        markerposition.x = Math.round(hitRect[0] + hitRect[2] / 2);
                        markerposition.y = Math.round(hitRect[1] + hitRect[3] / 2);
                        Viewport.ctx.fillStyle = "#000080";
                        Viewport.ctx.fillRect( Math.round((markerposition.x - Viewport.viewportOffset[0]) * Viewport.pixelsPerThousand / 1000)- 2, Math.round((markerposition.y - Viewport.viewportOffset[1]) * Viewport.pixelsPerThousand / 1000) - 10, 4, 20);
                        Viewport.ctx.fillRect( Math.round((markerposition.x - Viewport.viewportOffset[0]) * Viewport.pixelsPerThousand / 1000) - 10, Math.round((markerposition.y - Viewport.viewportOffset[1]) * Viewport.pixelsPerThousand / 1000) - 2, 20, 4);
                    }
                    return hitRect;
                }
            }

        }
        return false;
    }
    
    this.destroy = function ()
    {
        var explosionParticle;
        var numOfExplosions = 1;
        if ("Boss" == this.name)
        {
            numOfExplosions = 3;
            new Powerup(2, this.position);
        }
        for (var i = 0; i < numOfExplosions; i++)
        {
            explosionParticle = MovablesEngine.createParticle("explosion", new Vector2(this.position.x + i / numOfExplosions * 3000, this.position.y), this.moveDirection, this.speed / 3);
            explosionParticle.template.minStepDuration = 70;
        }
        for (var i = 8 + Math.random() * 6; i > 0 ; i--)
        {
            explosionParticle = MovablesEngine.createParticle("reddot", new Vector2(this.position.x, this.position.y), Vector2.RadToVector(Math.PI * 2 * i / 10 + Math.random() * Math.PI * 2 / 10), 800 + Math.random() * 1500 + Math.random () * 1500);
            explosionParticle.template.minStepDuration = 300;
        }
        
        if(Protagonist.spaceship.id == this.id)
        {
            ProgramExecuter.gameOver();
        } else
        {
            Protagonist.score += this.maxHealth;  
             
            //console.log("Spaceship with the ID: " + this.name + " has been destroyed!"); //Error for some reason?? Is this called too often? or the Hitbox not removed properly?
        
            if(Math.floor(Math.random() * 100) < 10)
            {
                new Powerup(3, this.position.AddVectorNoChanges(new Vector2(Math.floor(Math.random() * 400), Math.floor(Math.random() * 400))));
            }
        }
		 MovablesEngine.removeObject(this);
    }
    this.initHealth = function (paramHealth)
    {
        this.maxHealth = paramHealth;
        this.curHealth = paramHealth;
    }
    this.addToShield = function (shieldPower)
    {
        if(!this.hasShield)
        {
          this.activateShield(shieldPower);
        } else
        {
          this.shieldCurHealth += shieldPower;
          if(this.shieldCurHealth > this.shieldMaxHealth)
          {
            this.shieldMaxHealth = this.shieldCurHealth;
          }
        }
    }
    this.activateShield = function (paramShieldHealth)
    {
        if(0 < paramShieldHealth)
        {
          this.shieldCurHealth = paramShieldHealth;
          this.shieldMaxHealth = paramShieldHealth;
          this.hasShield = true;
        }
    }
    this.damage = function (amountOfDamage)
    {
        if(this.invincible)
        {
          return;
        } else if(this.hasShield)
        {
          this.shieldCurHealth -= amountOfDamage;
          if(0 >= this.shieldCurHealth)
          {
            this.hasShield = 0;
          }
          // abort, we don't want to have damage happening to the main spaceship
          return;
        }
        this.curHealth = this.curHealth - amountOfDamage;  
        if ( this.curHealth <= 0)
        {
            this.destroy();
        }
    }
    this.projectileHit = function (powerOfImpact)
    {
        this.damage(powerOfImpact);
    }
    this.collision = function (otherSpaceship, collisionBox)
    {
        var collisionCenter = [
          collisionBox[0] + collisionBox[2] / 2,
          collisionBox[1] + collisionBox[3] / 2
        ];
        var collisionVec = new Vector2(
          (this.hitbox[0] + this.hitbox[2] / 2) - collisionCenter[0],
          (this.hitbox[1] + this.hitbox[3] / 2) - collisionCenter[1]
        );
        var totalColisionMass = this.mass + otherSpaceship.mass;
        var speedFactor = 1 - (this.mass / totalColisionMass);
        collisionVec.Multiply(speedFactor).Normalize();
        console.log(this.moveDirection + " multiplied with collisionVec " + collisionVec);
        //this.moveDirection.Add(collisionVec);
        this.moveDirection = collisionVec;
        this.speed = 8000 * speedFactor;
        console.log("results in" + this.moveDirection);
        
        
        //this.collisionDamage();
    }
    this.collisionDamage = function ()
    {
        this.damage(25);
    }
    this.fireProjectile = function ()
    {
        if("Protagonist" == this.name)
        {
            if(Protagonist.amountOfBullets == 1)
            {
                var bullet = new Projectile(this, "bullet_2", new Vector2(this.position.x, this.position.y +190), 25, this.rotation * -1 + Math.PI/2, Math.max(0, this.speed * this.moveDirection.y) + 4000);
                MovablesEngine.addObject(bullet);
            } else if(Protagonist.amountOfBullets == 2)
            {
                var bullet = new Projectile(this, "bullet_2", new Vector2(this.position.x-440, this.position.y +190), 25, this.rotation * -1 + Math.PI/2, Math.max(0, this.speed * this.moveDirection.y) + 4000);
                MovablesEngine.addObject(bullet);
                var bullet = new Projectile(this, "bullet_2", new Vector2(this.position.x+440, this.position.y +190), 25, this.rotation * -1 + Math.PI/2, Math.max(0, this.speed * this.moveDirection.y) + 4000);
                MovablesEngine.addObject(bullet);
            }
            else {
                var hitPower = 25 * Math.floor(Protagonist.amountOfBullets / 3 );
                var bulletType = "bullet_2";
                if(50 <= hitPower)
                {
                  bulletType = "bullet_3";
                }
                var bullet = new Projectile(this, bulletType, new Vector2(this.position.x, this.position.y +190), hitPower, this.rotation * -1 + Math.PI/2, Math.max(0, this.speed * this.moveDirection.y) + 4000);
                MovablesEngine.addObject(bullet);
                var bullet = new Projectile(this, bulletType, new Vector2(this.position.x-440, this.position.y +190), hitPower, this.rotation * -1 + Math.PI/2, Math.max(0, this.speed * this.moveDirection.y) + 4000);
                MovablesEngine.addObject(bullet);
                var bullet = new Projectile(this, bulletType, new Vector2(this.position.x+440, this.position.y +190), hitPower, this.rotation * -1 + Math.PI/2, Math.max(0, this.speed * this.moveDirection.y) + 4000);
                MovablesEngine.addObject(bullet);
            }
          

        //        bullet = new Projectile(this, "bullet", new Vector2(this.position.x+440, this.position.y +190), 25, this.rotation, this.speed + 2000);
     //       MovablesEngine.addObject(bullet);
        } else if("Boss" == this.name)
        {
            var bullet = new Projectile(this, "laser_2", new Vector2(this.position.x, this.position.y - 500), 40, this.rotation + Math.PI/2 * 3, Math.max(0, this.speed * this.moveDirection.y) + 2200);
            MovablesEngine.addObject(bullet);
        } else
        {
            var bullet = new Projectile(this, "laser_1", new Vector2(this.position.x, this.position.y - 200), 15, this.rotation + Math.PI /2 * 3, Math.max(0, this.speed * this.moveDirection.y) + 2200);
            MovablesEngine.addObject(bullet);
        }
    }
    this.firingIntended = function ()
    {
        if(this.timeBetweenFiring <= (Viewport.curTime - this.lastFired))
        {
            this.lastFired = Viewport.curTime;
            this.fireProjectile();
        }
    }
    this.showText = function(text)
    {
      var screenPos = [ 
        (this.position.x - Viewport.viewportOffset.x) / 1000 * Viewport.pixelsPerThousand + Viewport.paintOffset[0],
        (Viewport.viewportSize.y - (this.position.y  - Viewport.viewportOffset.y)) / 1000 * Viewport.pixelsPerThousand + Viewport.paintOffset[0]
      ];  
      Viewport.ctx.fillStyle = "#000000";
      Viewport.ctx.fillText(text, screenPos[0], screenPos[1]);

    }
}
