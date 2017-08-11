var Credits = {
    isShowing: false,
    timer: 0,
    creditsSpeed: 3,
    
    ShowCredits : function () {
        if (!this.isShowing) {
                this.isShowing = true;
            }
    },
    
    DrawText : function (Text, offset) {
        var textLength = Viewport.ctx.measureText(Text).width, curLength = 0, i = 0, char;
        
        for (i = 0; i < Text.length; i++) {
            char = Text.charAt(i);
            Viewport.ctx.fillText(char, (Viewport.viewportCanvas.width / 2 - textLength / 2 + curLength + 0.5), this.timer * this.creditsSpeed + Math.sin(Math.PI * 2 / 10 * i + this.timer / 5) * 15);
            curLength += Viewport.ctx.measureText(char).width + 0.5;
        }
    },
    
    DrawCredits : function () {
        if (this.isShowing) {
            DrawText("Niklas Werner", 300);
            DrawText("Lars Jitschin", 0);
            
            this.timer++;
            
            if (this.timer * this.creditsSpeed > Viewport.viewportCanvas.height) {
                    this.timer = 0;
                    this.isShowing = false;
            }
        }
    }
};
