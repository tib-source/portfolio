'use strict'; 

import * as LJS from "littlejsengine"; 
import * as GameObjects from "$lib/chaze/entities";
import * as Game from "$lib/chaze/chaze"
import PerlinNoise from "./perlin";
import { GRID_SIZE } from "$lib/chaze/chaze";
import { getAvailablePointsNearObjectBFS, gridKey, pickRandomPoints } from "./ai";
import { GameObject, type Enemy } from "$lib/chaze/entities";

export let mapLayers: Array<LJS.TileCollisionLayer>;
export let levelSize: LJS.Vector2;
export let foregroundTileLayer: LJS.TileCollisionLayer;
export let tileLookup: any;


const walls = [];

export function buildLevel() { 
  LJS.engineObjectsDestroy();
  return loadLevelData(0);
}


export function generateMap(){
  LJS.engineObjectsDestroy();
  let gameArea: LJS.Vector2[] = []
  while (gameArea.length < 100){
    proceduralMap()
    gameArea = [...findAvailableArea(30)]
  }

  return choosePlayerSpawn(gameArea);

}


tileLookup = {
    rook: 0,
    pawn: 1, 
    knight: 2,
    bishop: 3,

    potion:16,
    coin: 17,

    wall: 32,
    floor: 33
}


function loadLevelData(level: number){
  let playerStartPos;

  const currLevel = Game.levels[level]

  const mapLayers = LJS.tileLayersLoad(currLevel, LJS.tile(0,64,0),0, 1);
  levelSize = mapLayers[0].size;
  let foregroundTileLayer = mapLayers[0]





  for (let i = mapLayers.length -1 ; i > -1 ; i--){

    const isForeground = i == 0;
    let mapLayer = mapLayers[i];
    if (isForeground)
      foregroundTileLayer = mapLayer;
        

    for (let x = levelSize.x; x--;)
    for (let y = levelSize.y; y--;){
      
      const pos = LJS.vec2(x, levelSize.y-1-y); 
      const tileData = mapLayer.getData(pos).tile

      const objectPos = pos.add(LJS.vec2(.5))

      if (tileData == tileLookup.coin){
        new GameObjects.Coin(objectPos)
        mapLayer.clearData(pos, true);
        mapLayer.clearCollisionData(pos);
        continue;

      }


      if (tileData == tileLookup.potion){
        new GameObjects.Potion(objectPos)
        mapLayer.clearData(pos, true);
        mapLayer.clearCollisionData(pos);
        continue;

      }

      if (tileData == tileLookup.wall){
        let o = new LJS.EngineObject(objectPos, LJS.vec2(.5), LJS.tile(10, 64, 0, 0))
        o.setCollision()
        o.mass = 0
        mapLayer.setCollisionData(pos, 1)
        continue;

      }

      if (tileData == tileLookup.pawn){
        playerStartPos = objectPos
        mapLayer.clearData(pos, true);
        mapLayer.clearCollisionData(pos);
        continue;


      }

      if (tileData == tileLookup.rook){
        new GameObjects.Rook(objectPos)
        mapLayer.clearData(pos, true);
        mapLayer.clearCollisionData(pos);
      }

      if (tileData == tileLookup.knight){
        new GameObjects.Knight(objectPos)
        mapLayer.clearData(pos, true);
        mapLayer.clearCollisionData(pos);
        continue;

      }



      if (tileData == tileLookup.bishop){
        new GameObjects.Bishop(objectPos)
        mapLayer.clearData(pos, true);
        mapLayer.clearCollisionData(pos);
        continue;

      }
      
      }

  }
  return playerStartPos;
}


export function getCameraTarget()
{
    // camera is above player
    const offset = 100/LJS.cameraScale*LJS.percent(LJS.mainCanvasSize.y, 300, 600);
    return Game.player.pos.add(LJS.vec2(0, offset));
}

function proceduralMap() {

  const GRID = Game.GRID_SIZE;               // your tile grid size
  const perlin = new PerlinNoise();
  const SCALE = .125;                        // adjust for smoothness
  const WALL_THRESHOLD = 0.45;               // lower = more walls, higher = more open
  const tileLayer = new LJS.TileCollisionLayer(LJS.vec2(0), LJS.vec2(GRID, GRID));

  let playerStartPos = LJS.vec2(1, GRID - 2);

    for (let x = GRID; x--;)
    for (let y = GRID; y--;){


      let pos = LJS.vec2(x, y).add(LJS.vec2(0.5));
      const v = perlin.get(x * SCALE, y * SCALE);  
      let n = LJS.vec2(v).normalize().x

      let tile = isEdge(x, y, GRID) ? Game.spriteAtlas.wall :  (n > WALL_THRESHOLD)
        ? Game.spriteAtlas.wall :  Game.spriteAtlas.floor

      // LJS.drawTile(pos, LJS.vec2(1), tile)
      tileLayer.drawTile(pos, LJS.vec2(1), tile)

      // collision
      if (tile === Game.spriteAtlas.wall) {
          tileLayer.setCollisionData(LJS.vec2(x, y), 1);
      }
    }


  // put the layer into your mapLayers array format
  mapLayers = [tileLayer];
  foregroundTileLayer = tileLayer;
  levelSize = tileLayer.size;

  return playerStartPos;
}



function isEdge(x: number, y: number, grid: number) {
  return (
    x === 0 ||
    y === 0 ||
    x === grid - 1 ||
    y === grid - 1
  );
}


export function findAvailableArea(radius = 20): LJS.Vector2[] {

    const centerPos = LJS.vec2(levelSize.x / 2, levelSize.y / 2);
    
    const centerObj = new LJS.EngineObject(centerPos, LJS.vec2(1));

    const available = getAvailablePointsNearObjectBFS(centerObj, radius);

    centerObj.destroy()
    
    return available
}




export function spawnEnemies(player: GameObject, numEnemies = 6, numCollectables = 6, minDistance = 6, maxDistance = 12) {
    let availableTiles = getAvailablePointsNearObjectBFS(player, maxDistance);

    availableTiles = availableTiles.filter(tile => {
        const d = tile.distance(player.pos);
        return d >= minDistance && d <= maxDistance;
    });

    availableTiles.sort(() => Math.random() - 0.5);

    const spawnedEnemies: Enemy[] = [];

    for (let i = 0; i < numEnemies && availableTiles.length > 0; i++) {
        const pos = pickRandomPoints(availableTiles);

        const enemyClasses = [
            GameObjects.Bishop,
            // GameObjects.Knight,
            // GameObjects.Rook
        ];



        const enemyType = pickRandomPoints(enemyClasses);
        const enemy = new enemyType(pos)
        // enemy.state = GameObjects.ENEMY_STATE.ATTACK
        spawnedEnemies.push(enemy);
        availableTiles.splice(availableTiles.indexOf(pos), 1);
    }


    for (let i = 0; i < numCollectables && availableTiles.length > 0; i++) {
        const pos = pickRandomPoints(availableTiles);

        const collectables = [
            GameObjects.Potion,
            GameObjects.Coin,
            GameObjects.Speed,
            GameObjects.Ammo,
            GameObjects.Shield,
            GameObjects.Poison
        ];



        const collectable = pickRandomPoints(collectables);
        const enemy = new collectable(pos)
        availableTiles.splice(availableTiles.indexOf(pos), 1);
    }

    return spawnedEnemies;
}


export function choosePlayerSpawn(available: LJS.Vector2[]){

    const chosen = pickRandomPoints(available);
    return chosen

}