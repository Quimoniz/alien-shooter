var Credits = {
    isShowing: false,
    timer: 0,
    creditsSpeed: 3,
    authors: ["Niklas Werner", "Franz Melzow", "Lars Jitschin"],
    distanceBetweenAuthors : 170,
    
    ShowCredits : function () {
        if (!this.isShowing) {
                this.isShowing = true;
            }
    },
    
    DrawText : function (Text, offset) {
        var textLength = Viewport.ctx.measureText(Text).width, curLength = 0, i = 0, char;

        Viewport.ctx.fillStyle = "#000000";

        for (i = 0; i < Text.length; i++) {
            char = Text.charAt(i);
            Viewport.ctx.fillText(char, (Viewport.viewportCanvas.width / 2 - textLength / 2 + curLength), this.timer * this.creditsSpeed + Math.sin(Math.PI * 2 / 10 * i + this.timer / 5) * 11 + offset);
            curLength += Viewport.ctx.measureText(char).width + 0.5;
        }
    },
    
    DrawCredits : function () {
        if (this.isShowing) {
            var maxHeight = 0, i = 0;
            for (; i < Credits.authors.length; i++)
            {
                Credits.DrawText(Credits.authors[i], i * Credits.distanceBetweenAuthors);
            }
            maxHeight = Credits.distanceBetweenAuthors * i;
            
            this.timer++;
            
            if (this.timer * this.creditsSpeed > Viewport.viewportCanvas.height + maxHeight) {
                    this.timer = 0;
                    this.isShowing = false;
            }
        }
    }
};
