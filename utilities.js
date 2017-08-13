var GraphicsRooster = {
    arrNames : new Array(),
    arrImages : new Array(),
    countImages: 0,
    addImage: function (nameStr, imageSrc, imgWidth, imgHeight)
    {
        var imageObj = new ImageWrapper(nameStr, imageSrc, imgWidth, imgHeight);
        GraphicsRooster.arrNames.push(nameStr);
        GraphicsRooster.arrImages.push(imageObj);
        GraphicsRooster.countImages ++;
    },
    getImgByName: function(nameStr)
    {
        nameStr = nameStr.toLowerCase();
        for(var i = 0; i < GraphicsRooster.countImages; i ++)
        {
            if (nameStr == GraphicsRooster.arrNames[i].toLowerCase())
            {
                return GraphicsRooster.arrImages[i];
            }
        }
    }
}

function ImageWrapper(nameStr, imageSrc, imgWidth, imgHeight)
{
    this.name = nameStr
    this.src = new Image()
    this.src.src = imageSrc;
    this.width = imgWidth;
    this.height = imgHeight;
}

var ParticlesTemplateRooster = {
    arrTemplateNames: new Array(),
    arrTemplateObj:   new Array(),
    countTemplates:   0,
    addTemplate: function (templateName, objTemplate)
    {
        ParticlesTemplateRooster.arrTemplateNames.push(templateName);
        ParticlesTemplateRooster.arrTemplateObj.push(objTemplate);
        ParticlesTemplateRooster.countTemplates ++;
    },
    getTemplate: function (searchedTemplate)
    {
        searchedTemplate = searchedTemplate.toLowerCase();
        for (var i = 0; i < ParticlesTemplateRooster.countTemplates; i++)
        {
            if(searchedTemplate == ParticlesTemplateRooster.arrTemplateNames[i].toLowerCase())
            {
                return ParticlesTemplateRooster.arrTemplateObj[i];
                
                
            }
        }
    }
};
function ParticleTemplate(paramImage)
{
    this.img = GraphicsRooster.getImgByName(paramImage);
    this.animSteps = new Array();
    this.minStepDuration = 100;
    this.addAnimStepsPerRow = function (frameSize, frameOffset, frameCount)
    {
        for (var i = 0; i < frameCount; i++)
        {
            this.animSteps.push([
                frameOffset[0] + frameSize[0] * i,
                frameOffset[1],
                frameSize[0],
                frameSize[1]
                ]);
        }
    }
    this.getAnimStep = function (indexAnimStep)
    {
        return this.animSteps[indexAnimStep % this.animSteps.length];
    }
    this.getStepCount = function ()
    {
        return this.animSteps.length;
    }
}

function getHexForRGB(red, green, blue)
{
    var hexValues = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
    var colorArr = [red, green, blue];
    var colorHex = "";
    for (var i = 0; i < 3; i++)
    {
        if (colorArr[i] > 255) colorArr[i] = 255;
        else if (colorArr[i] < 0) colorArr[i] = 0;
        
        colorHex += hexValues[Math.floor(colorArr[i] / 16)];
        colorHex += hexValues[colorArr[i] % 16];
    }
    return colorHex;
}
