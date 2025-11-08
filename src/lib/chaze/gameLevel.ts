'use strict'; 

import * as LJS from "littlejsengine"; 
import * as GameObjects from "$lib/chaze/entities";
import * as Game from "$lib/chaze/chaze"


const walls = [];
export function generateArena() {
  for (let x = 0; x < Game.GRID_SIZE; x++) {
    for (let y = 0; y < Game.GRID_SIZE; y++) {
      LJS.drawTile(LJS.vec2(x, y), LJS.vec2(1), Game.spriteAtlas.floor); // tile index 1 = floor
    }
  }


}


export function drawWalls(){
    // draw walls
  for (let x = 0; x < Game.GRID_SIZE; x++) {
    for (let y = 0; y < Game.GRID_SIZE; y++) {
      if (x == 0 || y == 0 || x == Game.GRID_SIZE-1 || y == Game.GRID_SIZE-1) {
        let wall = new LJS.EngineObject(LJS.vec2(x, y), LJS.vec2(1), Game.spriteAtlas.wall);
        wall.setCollision();
        wall.mass = 0
      }
    }
  }
}

export function getCameraTarget()
{
    // camera is above player
    const offset = 100/LJS.cameraScale*LJS.percent(LJS.mainCanvasSize.y, 300, 600);
    return Game.player.pos.add(LJS.vec2(0, offset));
}