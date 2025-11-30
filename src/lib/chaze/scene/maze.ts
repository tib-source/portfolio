import Scene from "./scene";
import * as LJS from "littlejsengine"
import { Enemy, ENEMY_STATE, Player } from "../entities";
import * as GameLevel from "$lib/chaze/gameLevel";
import * as Game from "$lib/chaze/chaze"
import { player } from "$lib/chaze/chaze";

export default class Maze extends Scene{
  enter(){
    LJS.engineObjectsDestroy()
    let playerStartPos = GameLevel.buildLevel();
    if (!playerStartPos){
        playerStartPos = LJS.vec2(0,1)
    }
    Game.spawnNewPlayer(playerStartPos)
    LJS.setCameraPos(GameLevel.getCameraTarget());
  }


  update() {
    // Find all enemies within 10 object radius from character, everything else set to idle to save comptuer 
    let all = LJS.engineObjects
    for (let item of all ){
        if (! (item instanceof Enemy)) continue
        if (item.pos.distance(player.pos) < 20){
            if (item.state == ENEMY_STATE.IDLE){
                if (item.previousState){
                    item.state = item.previousState
                    item.previousState = undefined
                }else{
                    item.state = ENEMY_STATE.PATROL 
                } 
            }
        }else{
            if (item.state != ENEMY_STATE.IDLE){
                item.previousState = item.state
            }
            item.state = ENEMY_STATE.IDLE
        }

    }

    if (player.isDead()){
        this.sm.changeScene("Main")
    }
  }

  updatePost() { }

  render() { }

  renderPost() {
    LJS.drawTextScreen(`Ammo : ${"⁍ ".repeat(player.ammoCount)}`, LJS.vec2(30,30), 20, LJS.WHITE, 1, LJS.WHITE, "left")
    let x = (player.health/ player.fullHealth )* 240
    let pos = 
    // LJS.drawTextScreen("test", pos, 1)
    LJS.drawRect(LJS.vec2(150, 60), LJS.vec2(240,30), LJS.BLACK, undefined, undefined, true);
    LJS.drawRect(LJS.vec2(150, 60).add(LJS.vec2(-120 +  (x / 2), 0)), LJS.vec2(x, 30), LJS.GREEN, undefined, undefined, true);

    // if(player.reloadTimer.isSet()){
    //     LJS.drawNineSlice(vec2(30,30), vec2(1), spriteAtlas.pawn)
    // }

    
  }

}