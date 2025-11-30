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

export function buildLevel() { 
  LJS.engineObjectsDestroy();
  return loadLevelData(0);
}


function loadLevelData(level: number){
  let playerStartPos;
  if(level == 1){
    // return perlinGenerateMap();
  }
  const currLevel = Game.levels[level]

  const mapLayers = LJS.tileLayersLoad(currLevel, LJS.tile(0,64,0),0, 1);
  levelSize = mapLayers[0].size;
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


// function perlinGenerateGrid(){
//   let grid = [];
//   const nodes = 4;

//   for (let i = 0; i < nodes; i++) {
//     let row = [];
//     for (let j = 0; j < nodes; j++) {
//         row.push(random_unit_vector());
//     }
//     grid.push(row);
//   }

//   return grid
// }


// function perlin_get(x, y) {

//     let grid = perlinGenerateGrid() 

//     let x0 = Math.floor(x);
//     let x1 = x0 + 1;
//     let y0 = Math.floor(y);
//     let y1 = y0 + 1;

//     let dot = dot_prod_grid(x0, y0, x1, y1, grid)

//     return intensity;
// }

// function random_unit_vector(){
//     let theta = Math.random() * 2 * Math.PI;
//     return LJS.vec2(Math.cos(theta), Math.sin(theta))
// }

// function dot_prod_grid(x: number, y: number, vert_x: number, vert_y: number, grid: LJS.Vector2[][]){
//     var g_vect = grid[vert_y][vert_x];
//     var d_vect = {x: x - vert_x, y: y - vert_y};
//     return d_vect.x * g_vect.x + d_vect.y * g_vect.y;
// }

// function lin_interp(x, a, b){
//     return a + x * (b-a);
// }


// smootherstep: function(x){
//     return 6*x**5 - 15*x**4 + 10*x**3;
// },
// interp: function(x, a, b){
//     return a + smootherstep(x) * (b-a);
// },