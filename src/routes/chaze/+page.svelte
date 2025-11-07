<script lang="ts">
    /*
    Little JS Hello World Demo
    - Just prints 'Hello World!'
    - A good starting point for new projects
*/
export const ssr = false;

'use strict';

// import LittleJS module
import * as LJS from "littlejsengine"
import tiles from "$lib/assets/chaze/tiles.png"
import { Player } from "$lib/chaze/entities";

const {vec2, rgb} = LJS;


///////////////////////////////////////////////////////////////////////////////
function gameInit()
{
// setup level
    let canvasClearColor = LJS.hsl(.3,.2,.6);
    new Player(vec2(1,1));

    // create collision objects
    for (let i=300; i--;)
    {
        const pos = LJS.randInCircle(15+i,7);
        const size = vec2(LJS.rand(4,9),LJS.rand(4,9));
        const color = LJS.hsl(.1,.5,LJS.rand(.2));
        const o = new LJS.EngineObject(pos, size, undefined, 0, color);
        o.setCollision(); // make object collide
        o.mass = 0; // make object have static physics
    }


}

///////////////////////////////////////////////////////////////////////////////
function gameUpdate()
{
    // called every frame at 60 frames per second
    // handle input and update the game state
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdatePost()
{
    // called after physics and objects are updated
    // setup camera and prepare for render
}

///////////////////////////////////////////////////////////////////////////////
function gameRender()
{
    // called before objects are rendered
    // draw any background effects that appear behind objects
}

///////////////////////////////////////////////////////////////////////////////
function gameRenderPost()
{
    // called after objects are rendered
    // draw effects or hud that appear above all objects
    // LJS.drawTextScreen('Hello World!', LJS.mainCanvasSize.scale(.5), 80);
}

///////////////////////////////////////////////////////////////////////////////
// Startup LittleJS Engine
LJS.engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, [tiles]);
</script>

