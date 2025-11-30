import Scene from "./scene";
import * as LJS from "littlejsengine"
import { Enemy, ENEMY_STATE, Player } from "../entities";
import * as GameLevel from "$lib/chaze/gameLevel";
import * as Game from "$lib/chaze/chaze"
import { spawnEnemies } from "$lib/chaze/gameLevel";

export let wave = 0
let baseEnemyCount = 3
export let enemiesLeft = baseEnemyCount
export const waveTimer = new LJS.Timer();
let enemiesSpawned = false
let enemies: Set<Enemy> = new Set();
let timeBetweenWaves = 0.1

function getEnemyCount(){
    return Math.floor(baseEnemyCount * (wave/1.5))
}

export default class Chaze extends Scene{

  enter(){    
    LJS.engineObjectsDestroy()
    wave = 0; 
    enemiesLeft = baseEnemyCount;
    enemiesSpawned = false;
    waveTimer.set(timeBetweenWaves);
    let playerStartPos = GameLevel.generateMap()
    Game.spawnNewPlayer(playerStartPos)
    LJS.setCameraScale(50)
  }


  update() {
    // Find all enemies within 10 object radius from character, everything else set to idle to save comptuer 
    if (!enemiesSpawned && waveTimer.elapsed()){
        startNewWave()
    }

    if (Game.player.isDead()){
        this.sm.changeScene("Main")
    }

    if (enemiesSpawned){
        for( let enemy of enemies){
            if (enemy.isDead()){
                enemies.delete(enemy)
            }
        }

        if(enemies.size == 0){
            waveTimer.set(timeBetweenWaves)
            enemiesSpawned = false
        }
    }


    // super.update()


  }

  updatePost() { }

  render() { }

  renderPost() {

    let center = Game.GAME_WIDTH / 2
    LJS.engineFontImage.drawTextScreen(`Ammo : ${"⁍ ".repeat(Game.player.ammoCount)}`, LJS.vec2(30,30), 20,false, LJS.WHITE)
    let x = (Game.player.health/ Game.player.fullHealth )* 240
    LJS.drawRect(LJS.vec2(150, 60), LJS.vec2(240,30), LJS.BLACK, undefined, undefined, true);
    LJS.drawRect(LJS.vec2(150, 60).add(LJS.vec2(-120 +  (x / 2), 0)), LJS.vec2(x, 30), LJS.GREEN, undefined, undefined, true);
    LJS.engineFontImage.drawTextScreen(`WAVE : ${wave}`, LJS.vec2(30,100), 20,false, LJS.WHITE)
    LJS.engineFontImage.drawTextScreen(`ENEMIES LEFT : ${enemies.size}`, LJS.vec2(Game.GAME_WIDTH-200,30), 20, true, LJS.WHITE)

    if(waveTimer.active()){
        LJS.engineFontImage.drawTextScreen("NEW WAVE STARTING", LJS.vec2(center,100), 40, true, LJS.BLACK)
    }

    if(Game.player.boostTimer?.active()){
        LJS.engineFontImage.drawTextScreen(`BOOST : ${Game.player.boostType}`, LJS.vec2(Game.GAME_WIDTH-200,60), 20, true, LJS.WHITE)
    }

  }

}



function startNewWave(){
    wave += 1
    let en = spawnEnemies(Game.player, getEnemyCount(), 6,6, 30)
    enemies = new Set([...en])
    enemiesSpawned = true
    Game.player.fullHealth += 50
    Game.player.health = Game.player.fullHealth
}