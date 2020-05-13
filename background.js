var Landscape = {
    tilesetSrc: "", //TODO: implement me
    tilesetImg: undefined,
    tileSize: new Vector2(32, 32),
    map: new Array(),
    showGrid: false,
    mapProvider: undefined,
    init: function ()
    {
        //Landscape.loadMapProvider("GrassMapProvider");
        Landscape.loadMapProvider("SpaceProvider");
    },
    loadMapProvider: function(mapName)
    {
      var url = "maps/" + mapName + ".js";
      var scriptEle = document.createElement("script");
      scriptEle.type = "text/javascript";
      console.log("loadMapProvider(" + mapName + ")");
      scriptEle.addEventListener("load", function (paramMapName) { return function(evtObj)
      {
        Landscape.setMapProvider(paramMapName);
      }; }(mapName));
      scriptEle.src = url;
      document.getElementsByTagName("head")[0].appendChild(scriptEle);

    },
    setMapProvider: function(mapName)
    {
      Landscape.mapProvider = MapProvider;
      Landscape.tilesetImg = GraphicsRooster.getImgByName(MapProvider.img);
      Landscape.map = new Array();
    },
    paint: function ()
    {
        if(!Landscape.mapProvider)
        {
          return false;
        }
        var startX = Math.floor(Viewport.viewportOffset.x * Viewport.pixelsPerThousand / 1000 / Landscape.tileSize.x);
        var endX =  Math.ceil((Viewport.viewportOffset.x + Viewport.viewportSize.x) * Viewport.pixelsPerThousand / 1000 / Landscape.tileSize.x);
        var startY = Math.floor(Viewport.viewportOffset.y * Viewport.pixelsPerThousand / 1000 / Landscape.tileSize.y);
        var endY = Math.ceil((Viewport.viewportOffset.y + Viewport.viewportSize.y) * Viewport.pixelsPerThousand / 1000 / Landscape.tileSize.y);
        var offsetX = startX * Landscape.tileSize.x - Viewport.viewportOffset.x * Viewport.pixelsPerThousand / 1000;
        var offsetY = startY * Landscape.tileSize.y - Viewport.viewportOffset.y * Viewport.pixelsPerThousand / 1000;
//console.log("X range:" + startX + " to " + endX);
//console.log("Y range:" + startY + " to " + endY);
        var destX = 0, destY = 0;
        var srcX = 0, srcY;
        for(var curY = startY; curY <= endY; curY++)
        {
          if(!Landscape.map[curY])
          {
            for(var i = Landscape.map.length; i < startY; ++i)
            {
              Landscape.map.push(new Array());
            }
            Landscape.map[curY] = new Array(endX + 1);
            Landscape.mapProvider.provideMapLine(Landscape.map, curY, startX, endX);
          }
        }
        for(var curY = startY; curY <= endY; curY++)
        {
            for(var curX = startX; curX <= endX; curX++)
            {
                destX = Viewport.paintOffset[0] + Math.round(offsetX + (curX - startX) * Landscape.tileSize.x);
                destY = Math.round(Viewport.paintOffset[1] + Viewport.paintSize[1] - (curY - startY) * Landscape.tileSize.y - Landscape.tileSize.y + (offsetY * -1));
                //this is supposed to be read out from array Landscape.map
                //TODO: implement a generator function to generate new tiles on-the-fly
                //srcX=curX%3*Landscape.tileSize.x;
                //srcY=(2-curY%3)*Landscape.tileSize.y;
                srcX = Landscape.map[curY][curX][0] * Landscape.tileSize.x;
                srcY = Landscape.map[curY][curX][1] * Landscape.tileSize.y;
//console.log("Destination: " + destX + "|" + destY );
                Viewport.ctx.drawImage(
                  Landscape.tilesetImg.src,
                  srcX,
                  srcY,
                  Landscape.tileSize.x,
                  Landscape.tileSize.y,
                  destX,
                  destY,
                  Landscape.tileSize.x,
                  Landscape.tileSize.y
                );
                if(Landscape.showGrid)
                {
                    Viewport.ctx.strokeStyle= "#" + getHexForRGB(Math.floor((255/endX*curX) % 255),225,225);
                    Viewport.ctx.strokeRect(destX,
                                          destY,
                                          Landscape.tileSize.x,Landscape.tileSize.y);
                }
            }
        }
    },

  isBetween: function(paramArr, firstRange, secondRange) {
    if(paramArr[0] >= firstRange[0]
    && paramArr[0] <= firstRange[1])
    {
      if(paramArr[1] >= secondRange[0]
      && paramArr[1] <= secondRange[1])
      {
        return true;
      }
    }
    return false;
  },
  oneElementOf: function(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },
  isElement: function(firstEleArr, secondEleArr) {
    if(undefined == firstEleArr
    || undefined == secondEleArr)
    {
      return false;
    }
    if(firstEleArr[0] == secondEleArr[0]
    && firstEleArr[1] == secondEleArr[1])
    {
      return true;
    }
    return false;
  }
}