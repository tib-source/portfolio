'use strict';
import * as LJS from 'littlejsengine';
import { Player } from '$lib/chaze/entities';
import level1 from '$lib/chaze/map/level1.json';
import SceneManager from './sceneManager';
import { PostProcessPlugin, setCanvasPixelated } from 'littlejsengine';
import { tvShader } from './shaders';

export const TILE_SIZE = 64;
export const GRID_SIZE = 50;
export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;
export let spriteAtlas: Record<string, LJS.TileInfo>;
export let player: Player;
export let debugPathFinderWithPlayer = false;
export let debugEnemyPathFinder = false;
export let debugEnemyInfo = false;
export let debugDisableEnemyShooting = false;
export let gameVolume = LJS.soundVolume;

export const levels = [level1];

let sceneManager = new SceneManager();

export function spawnNewPlayer(pos: LJS.Vector2) {
	player = new Player(pos);
}

export default function resize(w: number, h: number) {
	LJS.setCanvasMaxSize(LJS.vec2(w, h));
	LJS.setCanvasFixedSize(LJS.vec2(w, h));
}

export function gameInit() {
	// enable debug screens
	resize(GAME_WIDTH, GAME_HEIGHT);

	LJS.setObjectDefaultDamping(0.99);
	LJS.setObjectDefaultAngleDamping(0.99);
	LJS.setCameraScale(70);
	LJS.setCanvasPixelated(true);
	LJS.uiSetDebug(2);
	new PostProcessPlugin(tvShader);

	LJS.setCanvasClearColor(LJS.hsl(100, 0, 0, 0.5));
	const gameTile = (i: number | LJS.Vector2, size = 64) => LJS.tile(i, size, 0, 0);

	spriteAtlas = {
		// player tiles
		rook: gameTile(0),
		// pawn: gameTile(1),
		knight: gameTile(2),
		bishop: gameTile(3),
		pawn: gameTile(4),

		// collectables
		potion: gameTile(LJS.vec2(0, 1)),
		coin: gameTile(LJS.vec2(1, 1)),
		ammoPk: gameTile(LJS.vec2(2, 1)),
		speedBst: gameTile(LJS.vec2(3, 1)),
		shield: gameTile(LJS.vec2(4, 1)),
		slowDown: gameTile(LJS.vec2(5, 1)),
		poison: gameTile(LJS.vec2(6, 1)),
		pistol: gameTile(LJS.vec2(7, 1)),

		// environment
		wall: gameTile(LJS.vec2(0, 2)),
		floor: gameTile(LJS.vec2(1, 2)),
		sand: gameTile(LJS.vec2(2, 2)),
		water: gameTile(LJS.vec2(3, 2)),
		grass: gameTile(LJS.vec2(4, 2)),
		trap: gameTile(LJS.vec2(5, 2))
	};

	sceneManager.changeScene('Main');
}

export function gameUpdate() {
	// called every frame at 60 frames per second
	// handle input and update the game state

	if (LJS.keyWasPressed('Digit1')) {
		debugPathFinderWithPlayer = !debugPathFinderWithPlayer;
	}
	
    if (LJS.keyWasPressed('Digit2')) {
		debugEnemyPathFinder = !debugEnemyPathFinder;
	}
	
    if (LJS.keyWasPressed('Digit3')) {
		debugEnemyInfo = !debugEnemyInfo;
	}
    
    if (LJS.keyWasPressed('Digit4')) {
       debugDisableEnemyShooting = !debugDisableEnemyShooting;
	}

	if (LJS.keyWasPressed('Backspace')) {
		sceneManager.changeScene('Main');
	}

	if (debugEnemyInfo) {
		// mouse wheel = zoom
		LJS.setCameraScale(LJS.clamp(LJS.cameraScale * (1 - LJS.mouseWheel / 10), 10, 100));
	}
	sceneManager.update();
}

///////////////////////////////////////////////////////////////////////////////
export function gameUpdatePost() {
	// called after physics and objects are updated
	// setup camera and prepare for render
	sceneManager.updatePost();
}

///////////////////////////////////////////////////////////////////////////////
export function gameRender() {
	// called before objects are rendered
	// draw any background effects that appear behind objects
	sceneManager.render();
}

///////////////////////////////////////////////////////////////////////////////
export function gameRenderPost() {
	// called after objects are rendered
	// draw effects or hud that appear above all objects
	sceneManager.renderPost();
}
