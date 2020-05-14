function Projectile (paramOriginSpaceship, imgName, paramPosition, paramPower, paramMoveDirection, paramVelocity) {
    this.id = objectIdCounter++;
    this.type = "projectile";
    this.originSpaceship = paramOriginSpaceship;
    this.name = "Projectile " + imgName;
    this.img = GraphicsRooster.getImgByName(imgName);
    this.position = paramPosition;
    this.power = paramPower;
    this.moveDirection = new Vector2(Math.cos(paramMoveDirection), Math.sin(paramMoveDirection));
    this.speed = paramVelocity;
    this.rotation = Math.PI/2 - paramMoveDirection ;
    this.rotationSpeed = 0;
    this.hitbox = [0,0,0,0]; 
    this.update = function(timeSinceLastFrame)
    { /* same as for spaceship */
        this.position.Add(this.moveDirection.Normalized.MultiplyNoChanges((this.speed * timeSinceLastFrame / 1000)));
        this.rotation += this.rotationSpeed * timeSinceLastFrame / 1000;
        if(this.rotation > (Math.PI * 2))
            this.rotation = this.rotation % (Math.PI * 2);
        else if(this.rotation  < 0)
            this.rotation = (Math.PI * 2) - (this.rotation % (Math.PI * -2));
        this.updateHitbox();
    } 
    this.updateHitbox = function ()
    {
        this.hitbox = [this.position.x - this.img.width * 1000 / 2 / Viewport.pixelsPerThousand,
                       this.position.y - this.img.height* 1000 / 2 / Viewport.pixelsPerThousand,
                       this.img.width * 1000 / Viewport.pixelsPerThousand,
                       this.img.height * 1000/ Viewport.pixelsPerThousand];
    }
    this.updateHitbox();

    this.paint = function (ctx, viewportOffset, viewportSize, timeSinceLastFrame)
    { /* same as for spaceship */
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

//DEBUG
    }
    this.hitcheck = function (otherSpaceship)
    {
        if (otherSpaceship &&  otherSpaceship.type == "spaceship" && otherSpaceship != this.originSpaceship)
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
                    for(var i = Math.floor(Math.random() * 5),particleMoveDirection; i >= 0; i--)
                    {
                        particleMoveDirection = this.moveDirection.clone();
                        particleMoveDirection.Add(Math.random() * 2 - 1 , Math.random() * 2 - 1);
                        MovablesEngine.createParticle("reddot", new Vector2(this.position.x, this.position.y), particleMoveDirection, this.speed / 4);
                    }
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
