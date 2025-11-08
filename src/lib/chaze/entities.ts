
import * as LJS from "littlejsengine";
import * as Game from "$lib/chaze/chaze"



export class Player extends LJS.EngineObject{
    shootTimer; 


    constructor(pos: LJS.Vector2){
        super(pos, LJS.vec2(2), Game.spriteAtlas.pawn, 0);
        this.setCollision()
        this.renderOrder = 1
        this.shootTimer = LJS.Timer
    }

    update(): void {
        // apply movement controls
        const moveInput = LJS.keyDirection().clampLength(1).scale(.2);
        if (moveInput.length()) {
            this.velocity = moveInput; // Move at fixed speed
        } else {
            this.velocity = LJS.vec2(0); // Stop moving
        }

        const direction = LJS.mousePos.subtract(this.pos).normalize();
        const angle = LJS.atan2(direction.x, direction.y)
        this.angle = angle - Deg2Rad(90)

        LJS.setCameraPos(this.pos)
        
        if (LJS.mouseIsDown(0)){
            this.shoot(angle)
        }
    }


    shoot(angle: number): void { 
        const direction = LJS.vec2(5*this.getMirrorSign(), 0).setAngle(angle);
        const bullet = new LJS.EngineObject(this.pos, LJS.vec2(.2,.5), undefined, angle);
        bullet.velocity = direction
        bullet.setCollision()
    }


}


export function Deg2Rad(deg: number): number{ 
    return deg * (LJS.PI/180)
}


