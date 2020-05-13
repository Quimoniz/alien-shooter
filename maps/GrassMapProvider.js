var MapProvider = {
  "img": "01_tiles",
  "title": "GrassMap",
  "provideMapLine": function(mapObject, lineNumber, startX, endX) {
    var belowTile;
    var newTile;

	  //mapObject.push(new Array(endX+1));
	  //mapObject[lineNumber] = new Array(endX + 1);
	  for(var j=0; j<=endX; j++)
	  {
	    //default tile
	    newTile= [10,1];

	    if(0 == lineNumber
	    || undefined === mapObject[lineNumber - 1]
	    || undefined === mapObject[lineNumber - 1][j])
	    {
	      newTile= [10,1];
	    } else
	    {
	      leftTile = [10,1];
	      if(0 < j)
	      {
	        leftTile = mapObject[lineNumber][j - 1];
	      }
	      belowTile=mapObject[lineNumber - 1][j];
	      /*    6   7   8   |   9  10  11
	       * 0 e/g e/g e/g  |  g/e g/e g/e
	       * 1 e/g  g  e/g  |  g/e  e  g/e
	       * 2 e/g e/g e/g  |  g/e g/e g/e
	       * ___________________
	       *   e = earth,  g = grass
	       */
	      var bottomType = "earth";
	      if(Landscape.isBetween(belowTile, [6,8], [0,0])
	      || Landscape.isBetween(belowTile, [10,10], [1,2]))
	      {
	        bottomType = "earth";
	      } else if(Landscape.isBetween(belowTile, [9,11], [0,0])
	      || Landscape.isBetween(belowTile, [7,7], [1,2]))
	      {
	        bottomType = "grass";
	      } else
	      {
	        bottomType = "split";
	      }

	      if("earth" == bottomType)
	      {
	        if(Landscape.isBetween(leftTile, [6,7], [2,2])
	        || Landscape.isBetween(leftTile, [9,9], [0,0]))
	        {
	          newTile = Landscape.oneElementOf([[7,2],[8,2],[8,2]]);
	        } else
	        {
	          newTile = Landscape.oneElementOf([[10,1],[10,1],[10,1],[10,1],[10,1],[6,2]]);
	        }
	      } else if("grass" == bottomType)
	      {
	        if(Landscape.isBetween(leftTile, [9,9], [2,2]))
	        {
	          newTile = Landscape.oneElementOf([[7,0],[7,0],[11,2]]);
	        } else if(Landscape.isBetween(leftTile, [6,7], [1,1])
	        || Landscape.isBetween(leftTile, [11,11], [0,2]))
	        {
	          newTile = Landscape.oneElementOf([[7,1],[9,2],[9,2]]);
	        } else if(Landscape.isBetween(leftTile, [6,6], [0,0]))
	        {
	          newTile = [11,2];
	        } else if(Landscape.isBetween(leftTile, [7,7], [0,0])
	        || Landscape.isBetween(leftTile, [10,10], [2,2]))
	        {
	          newTile = Landscape.oneElementOf([[7,0],[11,2]]);
	        } else
	        {
	          newTile = [7,1];
	        }
	      } else if("split" == bottomType)
	      {
	        if(Landscape.isBetween(belowTile, [6,6], [1,2])
	        || Landscape.isBetween(belowTile, [11,11], [1,1]))
	        {
	          if(Landscape.isBetween(leftTile, [6,6], [1,2])
	          || Landscape.isBetween(leftTile, [7,7], [1,2])
	          || Landscape.isBetween(leftTile, [11,11], [0,2])
	          || Landscape.isBetween(leftTile, [9,9], [0,0]))
	          {
	            newTile = [11,0];
	          } else
	          {
	            newTile = Landscape.oneElementOf([[6,0],[6,0],[6,1]]);
	          }
	        } else if(Landscape.isBetween(belowTile, [8,8],[1,2]))
	        {
	          if(Landscape.isBetween(leftTile, [6,6], [1,2])
	          || Landscape.isBetween(leftTile, [7,7], [1,1])
	          || Landscape.isBetween(leftTile, [11,11], [0,2]))
	          {
	            newTile = Landscape.oneElementOf([[8,1],[8,1],[9,0]]);
	          } else {
	            newTile = [8,0];
	          }
	        } else if(Landscape.isBetween(belowTile, [9,9], [1,2]))
	        {
	          if(Landscape.isBetween(leftTile, [6,7], [1,1])
	          || Landscape.isBetween(leftTile, [11, 11], [0,2]))
	          {
	            newTile = Landscape.oneElementOf([[8,1],[8,1],[9,0]]);
	          } else
	          {
	            newTile = [8,0];
	          }
	        } else if(Landscape.isBetween(belowTile, [11,11], [1,2]))
	        {
	          if(Landscape.isBetween(leftTile, [9,9], [0,0])
	          || Landscape.isBetween(leftTile, [6,7], [2,2]))
	          {
	            newTile = [11,0];
	          } else
	          {
	            newTile = Landscape.oneElementOf([[6,1], [6,0],[6,0]]);
	          }
	        }
	      }
	    //console.log("[i:" + i + ", j:" + j + "] belowTile: [" + belowTile.join(",") + "](" + bottomType + "), leftTile: [" + leftTile.join(",") + "]  resulting newTile: [" + newTile.join(",") + "]");
	    }
	    mapObject[lineNumber][j] = newTile;
	  }
    //TODO here: check if currentLine also contains startX and endX, generate them if necessary
  }	
};