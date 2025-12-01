import {
	engineObjectsDestroy,
	keyIsDown,
	keyWasPressed,
	mouseWasReleased,
	keyWasReleased,
	gamepadWasReleased
} from 'littlejsengine';
import Scene from './scene/scene.js';
import Chaze from './scene/chaze.js';
import Main from './scene/main.js';
import Maze from './scene/maze.js';
import Splash from './scene/splash.js';

const Scenes: Record<string, typeof Scene> = {
	Splash: Splash,
	Main: Main,
	Maze: Maze,
	Chaze: Chaze
};

export default class SceneManager {
	currentScene: Scene | undefined;

	constructor() {
		this.currentScene = undefined;
	}

	changeScene(newScene: string) {
		window.setTimeout(() => {
			if (this.currentScene) {
				this.currentScene.exit();
			}
			engineObjectsDestroy();
			this.currentScene = new Scenes[newScene](this);
			this.currentScene.enter();
		}, 250);
	}

	update() {
		if (this.currentScene) {
			this.currentScene.update();
		}
	}

	updatePost() {
		if (this.currentScene) {
			this.currentScene.updatePost();
		}
	}

	render() {
		if (this.currentScene) {
			this.currentScene.render();
		}
	}

	renderPost() {
		if (this.currentScene) {
			this.currentScene.renderPost();
		}
	}
}
