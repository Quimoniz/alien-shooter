
var EnemyWaves =  {
    spawnAllSeconds: 3500, //Miliseconds
    powerupsAllSeconds: 15000,
    difficulty: 4,
    loopedAmount: 0,
    lastWaveTime: 0,
    lastPowerupTime: 0,
    freeTimeAtStart: 5000,
    timeStart: 0,
    waveIntention: function() {
        if(0 == EnemyWaves.timeStart)
        {
            EnemyWaves.timeStart = (new Date()).getTime();
        }
        if(Viewport.curTime > (EnemyWaves.timeStart + EnemyWaves.freeTimeAtStart))
        {
            var timeElapsed = Viewport.curTime - EnemyWaves.lastWaveTime;
            if(timeElapsed >= (EnemyWaves.spawnAllSeconds - EnemyWaves.difficulty * EnemyWaves.loopedAmount))
            {
              //DEBUG: Don't spawn waves
                //spawnWave(EnemyWaves.loopedAmount);
              //DEBUG: Instead launch an enemy ship
                launchEnemyShip(0);
                launchEnemyShip(1);
                launchEnemyShip(2);
                EnemyWaves.loopedAmount++;
                EnemyWaves.lastWaveTime = Viewport.curTime;
            }
            var powerupTimeElapsed = Viewport.curTime - EnemyWaves.lastPowerupTime;
            if(powerupTimeElapsed >= (EnemyWaves.powerupsAllSeconds + EnemyWaves.difficulty))
            {
                new Powerup(1, new Vector2(Math.floor(Viewport.viewportOffset.x + Math.random() * Viewport.viewportSize.x), Math.floor(Viewport.viewportOffset.y + Viewport.viewportSize.y )));
            EnemyWaves.lastPowerupTime = Viewport.curTime;
            }
        }
    }
};

function spawnWave(waveNum)
{
    var screenTopPos = Math.floor(Viewport.viewportOffset.y + Viewport.viewportSize.y);
    switch(waveNum % 5)
    {
        case 0:
          var randomXPos = Math.floor(Viewport.viewportOffset.x + 500 + (Math.random() * (Viewport.viewportSize.x - 5000)));
          spawnEnemyOfType(1, new Vector2(randomXPos, screenTopPos));
          //spawnEnemyOfType(1, new Vector2(randomXPos + 4999, screenTopPos));
          break;
        case 1:
          spawnEnemyOfType(2, new Vector2(Viewport.viewportOffset.x + 4000, screenTopPos));
          spawnEnemyOfType(2, new Vector2(Viewport.viewportOffset.x + Viewport.viewportSize.x/2, screenTopPos));
          spawnEnemyOfType(2, new Vector2(Viewport.viewportOffset.x + Viewport.viewportSize.x - 4000, screenTopPos));
          break;
        case 2:
          var xFraction = (Viewport.viewportSize.x - 4000) / 3;
          var xOffset = 2000;
          spawnEnemyOfType(3, new Vector2(xOffset, screenTopPos));
          spawnEnemyOfType(3, new Vector2(xOffset + xFraction * 1, screenTopPos));
          spawnEnemyOfType(3, new Vector2(xOffset + xFraction * 2, screenTopPos));
          break;
        case 3:
          var randomXPos = Math.floor(Viewport.viewportOffset.x + 500 + (Math.random() * (Viewport.viewportSize.x - 7500)));
          // reduce wave size
          //spawnEnemyOfType(4, new Vector2(randomXPos + 750, screenTopPos - 40));
          spawnEnemyOfType(4, new Vector2(randomXPos + 2250, screenTopPos - 40));
          spawnEnemyOfType(4, new Vector2(randomXPos + 3750, screenTopPos - 40));
          spawnEnemyOfType(4, new Vector2(randomXPos + 5250, screenTopPos - 40));
          //spawnEnemyOfType(4, new Vector2(randomXPos + 6750, screenTopPos - 40));
          break;
        case 4:
          var randomXPos = Math.floor(Viewport.viewportOffset.x + 500 + (Math.random() * (Viewport.viewportSize.x - 2000)));
          spawnEnemyOfType(5, new Vector2(randomXPos, screenTopPos));
          break;
    }
    if(0.1 > Math.random())
    {
      setTimeout(spawnRandomEnemy, 800);
    }
}

function launchEnemyShip(launchPointOffset)
{
  if(0 < Landscape.spawnPoints.length)
  {
    var launchPointNum = Landscape.spawnPoints.length - 1 - launchPointOffset;
    while(0 > launchPointNum)
    {
      launchPointNum += Landscape.spawnPoints.length;
    }
    var selectedSpawnPoint = new Vector2(Landscape.spawnPoints[launchPointNum].x + 400 + Math.random() * 800 - 400,
                                         Landscape.spawnPoints[launchPointNum].y + 1000);
    var spawnedEnemy = spawnEnemyOfType(Math.floor(Math.random() * 4 + 1), selectedSpawnPoint);
    spawnedEnemy.setScale(0.02);
    var defaultEngine = spawnedEnemy.engine;
    var defaultSpeed = spawnedEnemy.maxSteeringSpeed;
    var creationTime = Viewport.curTime;
    spawnedEnemy.maxSteeringSpeed = spawnedEnemy.speed = 1400;
    spawnedEnemy.engine = function(paramSelfReference, paramOldEngine, paramCreationTime, paramDefaultSpeed) { return function() {
      if(Viewport.curTime > (paramCreationTime + 1000))
      {
        paramSelfReference.rotation = 0;
        paramSelfReference.setScale(1);
        paramSelfReference.engine = paramOldEngine;
        paramSelfReference.maxSteeringSpeed = paramSelfReference.speed = paramDefaultSpeed;
      } else
      {
        var progress = (Viewport.curTime - paramCreationTime) / 1000;
        //console.log("progress: " + progress);
        //paramSelfReference.steerTowardsDirection(Vector2.RadToVector(Math.PI * (1.5 - 1 * progress)) * paramSelfReference.speed);
        if(0 == (paramSelfReference.id % 2))
        {//turn left
          paramSelfReference.moveDirection = Vector2.RadToVector(Math.PI * (0.5 + 1 * progress));
          paramSelfReference.rotation = Math.PI * (1 - 1 * progress);
        } else
        {//turn right
          paramSelfReference.moveDirection = Vector2.RadToVector(Math.PI * (0.5 - 1 * progress));
          paramSelfReference.rotation = Math.PI * (1 + progress);
        }
        paramSelfReference.setScale(0.02 + (1 - 0.02) * progress);
      }
     }; }(spawnedEnemy, defaultEngine, creationTime, defaultSpeed);
     /*
     console.log("Created spaceship at position " + spawnedEnemy.position.x + ", " + spawnedEnemy.position.y);
     if(Viewport.vecInsideViewport(spawnedEnemy.position))
     {
       console.log("Inside Viewport");
     } else
     {
       console.log("Outside Viewport, Viewport x:" + Viewport.viewportOffset.x + "-" + (Viewport.viewportOffset.x + Viewport.viewportSize.x)
                                 + ", Viewport y:" + Viewport.viewportOffset.y + "-" + (Viewport.viewportOffset.y + Viewport.viewportSize.y));
     }
     */
     return spawnedEnemy;
  }
}



//All the rotations are being converted to Vectors
function spawnRandomEnemy()
{
    var enemyType;

    if(0 == Math.floor(Math.random() * 35))
    {
        enemyType = 5;
    }
    else 
    {
        enemyType = Math.floor(Math.random() * 4 + 1);
    }
    var newPos = new Vector2(Math.floor(Viewport.viewportOffset.x + Math.random() * Viewport.viewportSize.x), Math.floor(Viewport.viewportOffset.y + Viewport.viewportSize.y ));

    return spawnEnemyOfType(enemyType, newPos);
}
function spawnEnemyOfType(enemyType, enemyPos)
{
    //Spawn a enemy with Name, Type and Position as Vector, Mass and Health
    var newEnemy = new Spaceship("Enemy " + enemyType, "gegner_" + enemyType, enemyPos, 5000, 100);
    switch(enemyType)
    {
        case 1: // Kamikaze spaceship
            newEnemy.maxSteeringSpeed = newEnemy.speed = 4500;
            newEnemy.initHealth(50);
            // follow the player
            newEnemy.engine = function ()
            {
                var newDirection = Protagonist.spaceship.position.clone().Subtract(this.position);
                if(newDirection.length > 0)
                {
                  newDirection.Divide(newDirection.length / this.maxSteeringSpeed);
                }
                this.steerTowardsDirection(
                  newDirection
                );
                var normalized = this.moveDirection.Normalized;
                this.rotation = Math.PI*2 - Vector2.VectorToRad(normalized.x , normalized.y);
                this.rotation = (Math.PI / 2 * 3 + this.rotation) % (Math.PI*2);
            }
            break;
        case 2:
            newEnemy.maxSteeringSpeed = newEnemy.speed = 1100;
            // move in circle
            newEnemy.engine = function ()
            {
                this.steerTowardsDirection(
                  Vector2.RadToVector((Math.PI / 4 * ((Viewport.curTime + this.id * 2000) % 16000 / 2000))).Normalized.Multiply(this.maxSteeringSpeed)
                );
                this.rotation = Math.PI * 2 + Math.PI / 2 * 2.5  - Math.PI / 4 * ((Viewport.curTime + this.id * 2000) % 16000 / 2000);
            }
            break;
        case 3:
            newEnemy.maxSteeringSpeed = newEnemy.speed = 2000;
            newEnemy.mass = 100;
            newEnemy.timeBetweenFiring = 2000;
            // move octagonally
            newEnemy.engine = function ()
            {
                this.steerTowardsDirection(
                  Vector2.RadToVector(Math.PI / 4 * Math.round(7 - ((Viewport.curTime + this.id * 1000) % 8000 / 1000))).Normalized.Multiply(this.maxSteeringSpeed)
                );
                this.firingIntended();
            }
            break;
        case 4:
            newEnemy.maxSteeringSpeed = newEnemy.speed = 700;//450;
            newEnemy.initHealth(225);
            newEnemy.mass = 15000;
            // move up and down
            newEnemy.engine = function ()
            {
                this.steerTowardsDirection(
                  Vector2.RadToVector(Math.PI / 2 * (Math.round((Viewport.curTime + this.id * 5000) % 10000 / 5000) * 2 + 1)).Normalized.Multiply(this.maxSteeringSpeed)
                );
            }
            break;
        case 5:
            newEnemy.name = "Boss";
            newEnemy.velocity = 300;
            newEnemy.timeBetweenFiring = 1000;
            newEnemy.initHealth(600);
            newEnemy.mass = 200000;
            newEnemy.maxSteeringSpeed = 4000;
            newEnemy.engine = function ()
            {
                // try to escape upwards when health is low
                if(175 > this.curHealth)
                {
                  this.steerTowardsDirection((new Vector2(0, 1)).Multiply(this.maxSteeringSpeed));
                }
                this.firingIntended();
            }
            break;
    }
    MovablesEngine.addObject(newEnemy);
    return newEnemy;
}