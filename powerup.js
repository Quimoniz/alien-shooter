
class Powerup
{
    
    constructor(powerupNumber, paramPosition)
    {
        this.id = objectIdCounter++;
        this.name = "Powerup " + powerupNumber;
        this.position = paramPosition;
        this.rotation = 0;
        this.mass = 100;
        this.rotationSpeed = 0;
        this.powerupNumber = powerupNumber;
        this.isCollected = false;
        this.initPowerup();
        MovablesEngine.addObject(this);
    }

    initPowerup()
    {
        switch(this.powerupNumber)
        {
            case(1):
                this.img = GraphicsRooster.getImgByName("powerup_1");
                break;
            case(2):
                this.img = GraphicsRooster.getImgByName("powerup_2");
                break;
            case(3):
                this.img = GraphicsRooster.getImgByName("powerup_3");
                break;
        }
    }

    destroy ()
    {
        MovablesEngine.removeObject(this);

    }

    PowerupEffect()
    {
        switch(this.powerupNumber)
        {
            case(1):
            {
                Protagonist.spaceship.addToShield(100);
                break;
            }
            case(2):
                Protagonist.amountOfBullets++;
                break;
            case(3):
            {
                Protagonist.spaceship.curHealth += 25;

                if(Protagonist.spaceship.curHealth > Protagonist.spaceship.maxHealth)
                {
                    Protagonist.spaceship.curHealth = Protagonist.spaceship.maxHealth;
                }
                
                break;
            }
        } 
    }

    update (timeSinceLastFrame)
    { /* same as for spaceship */
        this.updateHitbox();
    } 

    updateHitbox ()
    {
        this.hitbox = [this.position.x - this.img.width * 1000 / 2 / Viewport.pixelsPerThousand,
                       this.position.y - this.img.height* 1000 / 2 / Viewport.pixelsPerThousand,
                       this.img.width * 1000 / Viewport.pixelsPerThousand,
                       this.img.height * 1000/ Viewport.pixelsPerThousand];
    }

    paint (ctx, viewportOffset, timeSinceLastFrame)
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
    }

    hitcheck (otherSpaceship)
    {
        if (otherSpaceship && Protagonist.spaceship.id == otherSpaceship.id && !this.isCollected && this.hitbox)
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
                    this.isCollected = true;
                    this.PowerupEffect();
                    this.destroy();
                }
            }

        }
    }
}

