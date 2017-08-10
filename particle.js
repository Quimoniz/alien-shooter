function Particle(particleTemplate, paramPosition, paramMoveDirection, paramVelocity) {
    this.id = particleIdCounter++;
    this.type = "particle";
    this.template = ParticlesTemplateRooster.getTemplate(particleTemplate);
    this.curAnimStep = 0;
    this.position = paramPosition;
    this.moveDirection = paramMoveDirection;
    this.velocity = paramVelocity;
    this.rotation = 0;
    this.rotationSpeed = 0;
    this.ttl = this.template.getStepCount();
    this.timeLastFrame = 0;
    this.isActive = true;
    this.update = function(timeSinceLastFrame)
    {
        this.position[0] += Math.cos(this.moveDirection) * this.velocity * timeSinceLastFrame / 1000;
        this.position[1] += Math.sin(this.moveDirection) * this.velocity * timeSinceLastFrame / 1000 * -1;
        this.rotation += this.rotationSpeed * timeSinceLastFrame / 1000;
        if(this.rotation > (Math.PI * 2))
            this.rotation = this.rotation % (Math.PI * 2);
        else if(this.rotation  < 0)
            this.rotation = (Math.PI * 2) - (this.rotation % (Math.PI * -2));
    } 
    this.paint = function (ctx, viewportOffset, timeSinceLastFrame)
    {
        if((Viewport.curTime - this.timeLastFrame) >= this.template.minStepDuration)
        {
            this.curAnimStep ++ ;
            this.ttl -- ;
            this.timeLastFrame = Viewport.curTime;
        }
        if( 0 < this.ttl)
        {
            this.update(timeSinceLastFrame);
            var tileSource = this.template.getAnimStep(this.curAnimStep);
            var tileDest = [(this.position[0] - viewportOffset[0]) * Viewport.pixelsPerThousand / 1000, (Viewport.viewportSize[1] - this.position[1] + viewportOffset[1]) * Viewport.pixelsPerThousand / 1000, tileSource[2], tileSource[3]];
            var origPoints = [tileDest[0], tileDest[1]];
            if(this.rotation != 0) {
                tileDest[0] = Math.round(0 - tileSource[2] / 2);
                tileDest[1] = Math.round(0 - tileSource[3] / 2);
                ctx.save();
                ctx.translate(origPoints[0], origPoints[1]);
                ctx.rotate(this.rotation);
                ctx.drawImage(this.template.img.src, tileSource[0], tileSource[1], tileSource[2], tileSource[3], tileDest[0], tileDest[1], tileDest[2], tileDest[3]);
                ctx.restore();
            } else
            {
                tileDest[0] = Math.round(tileDest[0] - tileSource[2] / 2);
                tileDest[1] = Math.round(tileDest[1] - tileSource[3] / 2);
                ctx.drawImage(this.template.img.src, tileSource[0], tileSource[1], tileSource[2], tileSource[3], tileDest[0], tileDest[1], tileDest[2], tileDest[3]);
            }
        } else
        {
            this.isActive = false;
        }
    }
}
