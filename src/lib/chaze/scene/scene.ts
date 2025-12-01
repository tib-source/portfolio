import {
	keyWasPressed,
	mouseWasReleased,
	keyWasReleased,
	gamepadWasReleased
} from 'littlejsengine';
import type SceneManager from '../sceneManager';

export default class Scene {
	sm: SceneManager;
	constructor(sm: SceneManager) {
		this.sm = sm;
	}
	exit() {}

	enter() {}
	update() {}

	updatePost() {}

	render() {}

	renderPost() {}
}
