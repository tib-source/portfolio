'use strict'; 

import * as LJS from "littlejsengine"; 
import * as GameObjects from "$lib/chaze/entities";
import * as Game from "$lib/chaze/chaze"
import { hsl } from "littlejsengine";

export let mapLayers: Array<LJS.TileCollisionLayer>;
export let levelSize: LJS.Vector2;
export let foregroundTileLayer: LJS.TileCollisionLayer;
export let tileLookup: any;


const walls = [];
export function generateArena() {
  // for (let x = 0; x < Game.GRID_SIZE; x++) {
  //   for (let y = 0; y < Game.GRID_SIZE; y++) {
  //     LJS.drawTile(LJS.vec2(x, y), LJS.vec2(1), Game.spriteAtlas.floor); // tile index 1 = floor
  //   }
  // }

}

export function buildLevel() { 
  // LJS.engineObjectsDestroy();
  return loadLevelData(0);
}


function loadLevelData(level: number){
  let playerStartPos;
  const currLevel = Game.levels[level]
  // console.log(currLevel )
  const mapLayers = LJS.tileLayersLoad(currLevel, LJS.tile(0,64,0),0, 1);
  const levelSize = mapLayers[0].size;
  let foregroundTileLayer = mapLayers[0]


  const tileLookup = {
    rook: 0,
    pawn: 1, 
    knight: 2,
    bishop: 3,

    potion:16,
    coin: 17,

    wall: 32,
    floor: 33


  }

  console.log(mapLayers.length)

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
      if (tileData == tileLookup.pawn){
        playerStartPos = objectPos

        // replace with empty tile and empty collision
        mapLayer.clearData(pos);
        mapLayer.clearCollisionData(pos);
        continue;


      }

      if (tileData == tileLookup.rook){
        new GameObjects.Rook(objectPos)
        // replace with empty tile and empty collision
        mapLayer.clearData(pos);
        mapLayer.clearCollisionData(pos);
        continue;

      }

      if (tileData == tileLookup.knight){
        new GameObjects.Knight(objectPos)

        // replace with empty tile and empty collision
        mapLayer.clearData(pos);
        mapLayer.clearCollisionData(pos);
        continue;

      }



      if (tileData == tileLookup.bishop){
        new GameObjects.Bishop(objectPos)

        // replace with empty tile and empty collision
        mapLayer.clearData(pos);
        mapLayer.clearCollisionData(pos);
        continue;

      }



      if (tileData == tileLookup.coin){
        new GameObjects.Coin(objectPos)

        // replace with empty tile and empty collision
        mapLayer.clearData(pos);
        mapLayer.clearCollisionData(pos);
        continue;

      }


      if (tileData == tileLookup.potion){
        new GameObjects.Potion(objectPos)

        // replace with empty tile and empty collision
        mapLayer.clearData(pos);
        mapLayer.clearCollisionData(pos);
        continue;

      }

      if (tileData == tileLookup.wall){
        let o = new LJS.EngineObject(objectPos, LJS.vec2(1), Game.spriteAtlas.wall)
        o.setCollision()
        o.mass=0

        // replace with empty tile and empty collision
        mapLayer.clearData(pos);
        mapLayer.clearCollisionData(pos);
        continue;

      }

        mapLayer.redraw();
      
      }



  }

  return playerStartPos;

}

export function drawWalls(){

  // for (let x = 0; x < Game.GRID_SIZE; x++) {
  //   for (let y = 0; y < Game.GRID_SIZE; y++) {
  //     if (x == 0 || y == 0 || x == Game.GRID_SIZE-1 || y == Game.GRID_SIZE-1) {
  //       let wall = new LJS.EngineObject(LJS.vec2(x, y), LJS.vec2(1), Game.spriteAtlas.wall);
  //       wall.setCollision();
  //       wall.mass = 0
  //     }
  //   }
  // }
}

export function getCameraTarget()
{
    // camera is above player
    const offset = 100/LJS.cameraScale*LJS.percent(LJS.mainCanvasSize.y, 300, 600);
    return Game.player.pos.add(LJS.vec2(0, offset));
}