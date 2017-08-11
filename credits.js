var Credits = {
    isShowing: false,
    timer: 0,
    text: "Lars Jitschin",
    creditsSpeed: 3,
    
    ShowCredits : function()
    {
        if(!this.isShowing)
            {
                this.isShowing = true;
               
            }
        
    },
    
    DrawCredits : function()
    {
        if(this.isShowing)
        {
            var textLength = Viewport.ctx.measureText(this.text).width;
            var curLength = 0;
            for(i = 0; i < this.text.length; i++)
            {
                var char = this.text.charAt(i);
                Viewport.ctx.fillText(char, (Viewport.viewportCanvas.width/2-textLength/2+curLength), this.timer*this.creditsSpeed+Math.random()*10);
                curLength += Viewport.ctx.measureText(char).width;
                console.log(curLength);
            }
            this.timer++;
            
            if(this.timer*this.creditsSpeed > Viewport.viewportCanvas.height)
            {
                    this.timer = 0;
                    this.isShowing = false;
            }
        }
    }
};
