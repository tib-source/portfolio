'use strict';
import * as LJS from "littlejsengine"
import { Player } from "$lib/chaze/entities";
import level1 from "$lib/chaze/map/level1.json";
import SceneManager from "./sceneManager";
import { PostProcessPlugin } from "littlejsengine";
import { tvShader } from "./shaders";

const {vec2, rgb} = LJS;


export const TILE_SIZE = 64
export const GRID_SIZE = 100;
export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;
export let spriteAtlas: Record<string, LJS.TileInfo>;
export let player: Player;
export let debugPathFinderWithPlayer    = false;
export let debugEnemyPathFinder         = false;
export let debugEnemyInfo               = false;
export let gameVolume = LJS.soundVolume + 10


export const levels = [
    level1,
]


let sceneManager = new SceneManager()

export function spawnNewPlayer(pos: LJS.Vector2){
    player = new Player(pos);
}


export default function resize(w: number, h: number) {
    LJS.setCanvasMaxSize(vec2(w, h));
    LJS.setCanvasFixedSize(vec2(w, h));
}

///////////////////////////////////////////////////////////////////////////////
export function gameInit()
{

    // setup level
    LJS.setObjectDefaultDamping(.99);
    LJS.setObjectDefaultAngleDamping(.99);
    LJS.setCameraScale(GRID_SIZE/2);
    resize(GAME_WIDTH,GAME_HEIGHT);
    new PostProcessPlugin(tvShader);

    LJS.setCanvasClearColor(LJS.hsl(100,0,0, .5))
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

    sceneManager.changeScene("Main")

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
    if (LJS.keyWasPressed('Digit3')){
        debugEnemyInfo              = !debugEnemyInfo
    }

    if (LJS.keyWasPressed("Backspace")){
        sceneManager.changeScene("Main")
    }

    sceneManager.update();
    let cameraScaleLimit = 30
    if(debugEnemyInfo){
        cameraScaleLimit = 10
    }

    LJS.setCameraScale(LJS.clamp(LJS.cameraScale*(1-LJS.mouseWheel/10), cameraScaleLimit, 100));
}

///////////////////////////////////////////////////////////////////////////////
export function gameUpdatePost()
{
    // called after physics and objects are updated
    // setup camera and prepare for render
    sceneManager.updatePost()

}

///////////////////////////////////////////////////////////////////////////////
export function gameRender()
{
    // called before objects are rendered
    // draw any background effects that appear behind objects
    sceneManager.render()
}

///////////////////////////////////////////////////////////////////////////////
export function gameRenderPost()
{
    // called after objects are rendered
    // draw effects or hud that appear above all objects
    sceneManager.renderPost()
}
