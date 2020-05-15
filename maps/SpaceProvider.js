var MapProvider = {
	"img": "alien_tileset",
	"title": "Space",
	"provideMapLine": function(mapObject, lineNumber, startX, endX) {
		var newTile = undefined;
		for(var j = startX; j <= endX; ++j)
		{
		  newTile = undefined;
		  belowTile = undefined;
		  if(0 < lineNumber)
		  {
		  	belowTile = mapObject[lineNumber - 1][j];
		  }
		  // 3x2 yellow planet
		  if(Landscape.isElement(belowTile, [0, 2])) newTile = [0, 1];
		  else if(Landscape.isElement(belowTile, [1, 2])) newTile = [1, 1];
		  else if(Landscape.isElement(belowTile, [2, 2])) newTile = [2, 1];
		  // 3x2 blue planet
		  else if(Landscape.isElement(belowTile, [3, 1])) newTile = [3, 0];
		  else if(Landscape.isElement(belowTile, [4, 1])) newTile = [4, 0];
		  else if(Landscape.isElement(belowTile, [5, 1])) newTile = [5, 0];
		  // 3x2 red planet
		  else if(Landscape.isElement(belowTile, [3, 3])) newTile = [3, 2];
		  else if(Landscape.isElement(belowTile, [4, 3])) newTile = [4, 2];
		  else if(Landscape.isElement(belowTile, [5, 3])) newTile = [5, 2];
		  // 4x4 red planet
		  else if(Landscape.isElement(belowTile, [0, 7])) newTile = [0, 6];
		  else if(Landscape.isElement(belowTile, [1, 7])) newTile = [1, 6];
		  else if(Landscape.isElement(belowTile, [2, 7])) newTile = [2, 6];
		  else if(Landscape.isElement(belowTile, [3, 7])) newTile = [3, 6];
		  else if(Landscape.isElement(belowTile, [0, 6])) newTile = [0, 5];
		  else if(Landscape.isElement(belowTile, [1, 6])) newTile = [1, 5];
		  else if(Landscape.isElement(belowTile, [2, 6])) newTile = [2, 5];
		  else if(Landscape.isElement(belowTile, [3, 6])) newTile = [3, 5];
		  else if(Landscape.isElement(belowTile, [0, 5])) newTile = [0, 4];
		  else if(Landscape.isElement(belowTile, [1, 5])) newTile = [1, 4];
		  else if(Landscape.isElement(belowTile, [2, 5])) newTile = [2, 4];
		  else if(Landscape.isElement(belowTile, [3, 5])) newTile = [3, 4];
		  // 2x2 green planet
		  else if(Landscape.isElement(belowTile, [4, 5])) newTile = [4, 4];
		  else if(Landscape.isElement(belowTile, [5, 5])) newTile = [5, 4];
		  // 2x2 brown planet
		  else if(Landscape.isElement(belowTile, [4, 7])) newTile = [4, 6];
		  else if(Landscape.isElement(belowTile, [5, 7])) newTile = [5, 6];
		  // 3x3 blue planet with moon
		  else if(Landscape.isElement(belowTile, [2, 12])) newTile = [2, 11];
		  else if(Landscape.isElement(belowTile, [3, 12])) newTile = [3, 11];
		  else if(Landscape.isElement(belowTile, [4, 12])) newTile = [4, 11];
		  else if(Landscape.isElement(belowTile, [2, 11])) newTile = [2, 10];
		  else if(Landscape.isElement(belowTile, [3, 11])) newTile = [3, 10];
		  else if(Landscape.isElement(belowTile, [4, 11])) newTile = [4, 10];
		  // 2x3 space station
		  else if(Landscape.isElement(belowTile, [0, 12])) newTile = [0, 11];
		  else if(Landscape.isElement(belowTile, [1, 12])) newTile = [1, 11];
		  else if(Landscape.isElement(belowTile, [0, 11])) newTile = [0, 10];
		  else if(Landscape.isElement(belowTile, [1, 11])) newTile = [1, 10];
		  else {
			  if(0 == Math.floor(Math.random() * 50))
			  {
			  	let randomNum = Math.floor(Math.random() * 12);
			  	{
			  		if(0 == randomNum) { // 3x2 yellow planet
			  			mapObject[lineNumber][j] = [0, 2];
			  			mapObject[lineNumber][j + 1] = [1, 2];
			  			mapObject[lineNumber][j + 2] = [2, 2];
			  			Landscape.markSpawnPoint(lineNumber, j + 1);
			  			j += 2;
			  		}	
			  		else if(1 == randomNum) { // 3x2 blue planet
			  			mapObject[lineNumber][j] = [3, 1];
			  			mapObject[lineNumber][j + 1] = [4, 1];
			  			mapObject[lineNumber][j + 2] = [5, 1];
			  			Landscape.markSpawnPoint(lineNumber, j + 1);
			  			j += 2;
			  		}	
			  		else if(2 == randomNum) { // 3x2 red planet
			  			mapObject[lineNumber][j] = [3, 3];
			  			mapObject[lineNumber][j + 1] = [4, 3];
			  			mapObject[lineNumber][j + 2] = [5, 3];
			  			Landscape.markSpawnPoint(lineNumber, j + 1);
			  			j += 2;
			  		}	
			  		else if(3 == randomNum) { // 4x4 red planet
			  			mapObject[lineNumber][j] = [0, 7];
			  			mapObject[lineNumber][j + 1] = [1, 7];
			  			mapObject[lineNumber][j + 2] = [2, 7];
			  			mapObject[lineNumber][j + 3] = [3, 7];
			  			Landscape.markSpawnPoint(lineNumber, j + 1);
			  			j += 3;
			  		}	
			  		else if(4 == randomNum) { // 2x2 green planet
			  			mapObject[lineNumber][j] = [4, 5];
			  			mapObject[lineNumber][j + 1] = [5, 5];
			  			Landscape.markSpawnPoint(lineNumber, j + 1);
			  			j += 1;
			  		}	
			  		else if(5 == randomNum) { // 2x2 brown planet
			  			mapObject[lineNumber][j] = [4, 7];
			  			mapObject[lineNumber][j + 1] = [5, 7];
			  			Landscape.markSpawnPoint(lineNumber, j + 1);
			  			j += 1;
			  		}	
			  		else if(6 == randomNum) { // 1x1 single big star
			  			mapObject[lineNumber][j] = [5, 8];
			  			j += 0;
			  		}	
			  		else if(7 == randomNum) { // 1x1 two small stars
			  			mapObject[lineNumber][j] = [5, 9];
			  			j += 0;
			  		}	
			  		else if(8 == randomNum) { // 1x1 single small star
			  			mapObject[lineNumber][j] = [5, 10];
			  			j += 0;
			  		}	
			  		else if(9 == randomNum) { // 1x1 red planet
			  			mapObject[lineNumber][j] = [5, 11];
			  			Landscape.markSpawnPoint(lineNumber, j);
			  			j += 0;
			  		}	
			  		else if(10 == randomNum) { // 2x3 space station
			  			mapObject[lineNumber][j] = [0, 12];
			  			mapObject[lineNumber][j + 1] = [1, 12];
			  			j += 1;
			  		}	
			  		else if(11 == randomNum) { // 3x3 blue planet with moon
			  			mapObject[lineNumber][j] = [2, 12];
			  			mapObject[lineNumber][j + 1] = [3, 12];
			  			mapObject[lineNumber][j + 2] = [4, 12];
			  			Landscape.markSpawnPoint(lineNumber, j + 1);
			  			j += 2;
			  		}
				  }
		  	} else {
		  		newTile = Landscape.oneElementOf([
		  					[0, 0], [1, 0], [2, 0],
		  					[0, 3], [1, 3], [2, 3],
		  					[0, 8], [1, 8], [2, 8], [3, 8], [4, 8],
		  					[0, 9], [1, 9], [2, 9], [3, 9], [4, 9],
		  					]);
		  	}
		  }
		  if(newTile)
		  {
		    mapObject[lineNumber][j] = newTile;
		  }
		}
	}
};