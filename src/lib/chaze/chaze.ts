'use strict';
import * as LJS from "littlejsengine"
import { Player } from "$lib/chaze/entities";
import * as GameLevel from "$lib/chaze/gameLevel";
import level1 from "$lib/chaze/map/level1.json";

const {vec2, rgb} = LJS;



export const TILE_SIZE = 64
export const GRID_SIZE = 100;
export let spriteAtlas: Record<string, LJS.TileInfo>;
export let player: Player;
export let debugPathFinderWithPlayer    = false;
export let debugEnemyPathFinder         = false
let particleEmitter;


export const levels = [
    level1
]

///////////////////////////////////////////////////////////////////////////////
export function gameInit()
{

    // setup level
    LJS.setObjectDefaultDamping(.99);
    LJS.setObjectDefaultAngleDamping(.99);
    LJS.setCameraScale(GRID_SIZE/2);
    LJS.setTileDefaultBleed(.5);
    LJS.setCanvasMaxSize(vec2(3840, 2160));

    // create a table of all sprites
    LJS.setCanvasClearColor(LJS.hsl(.3,.2,.6))
    const gameTile = (i: number | LJS.Vector2, size=64)=> LJS.tile(i, size, 0, 0);
    
    spriteAtlas =
    {
        // player tiles 
        rook:   gameTile(0),
        pawn:   gameTile(1),
        knight: gameTile(2),
        bishop: gameTile(3),

        // collectables 
        potion: gameTile(vec2(0,1)),
        coin:   gameTile(vec2(1,1)),

        // environment
        wall:   gameTile(vec2(0,2)),
        floor:  gameTile(vec2(1,2))

    };

    let playerStartPos = GameLevel.buildLevel()
    if (!playerStartPos){
        playerStartPos = vec2(0,1)
    }
    player = new Player(playerStartPos);
    LJS.setCameraPos(GameLevel.getCameraTarget());



}

///////////////////////////////////////////////////////////////////////////////
export function gameUpdate()
{
    // called every frame at 60 frames per second
    // handle input and update the game state
    // mouse wheel = zoom
    if (LJS.keyWasPressed('Digit1')){
        debugPathFinderWithPlayer   = !debugPathFinderWithPlayer
    }
    if (LJS.keyWasPressed('Digit2')){
        debugEnemyPathFinder        = !debugEnemyPathFinder
    }

    LJS.setCameraScale(LJS.clamp(LJS.cameraScale*(1-LJS.mouseWheel/10), 1, 1e3));
    
}

///////////////////////////////////////////////////////////////////////////////
export function gameUpdatePost()
{
    // called after physics and objects are updated
    // setup camera and prepare for render
    // LJS.setCameraPos(LJS.cameraPos.lerp(GameLevel.getCameraTarget(), LJS.clamp(player.getAliveTime()/2)));

}

///////////////////////////////////////////////////////////////////////////////
export function gameRender()
{
    // called before objects are rendered
    // draw any background effects that appear behind objects
    GameLevel.generateArena()

}

///////////////////////////////////////////////////////////////////////////////
export function gameRenderPost()
{
    // called after objects are rendered
    // draw effects or hud that appear above all objects
    // LJS.drawTextScreen('Hello World!', LJS.mainCanvasSize.scale(.5), 80);
}
