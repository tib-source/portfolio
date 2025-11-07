import { cameraPos, EngineObject, keyDirection, RED, setCameraPos, tile, vec2, Vector2 } from "littlejsengine";

export class Player extends EngineObject{
    constructor(pos: Vector2){
        super(pos, vec2(2), undefined, 0, RED)
        this.setCollision()
        this.renderOrder = 1
    }

    update(): void {
        // apply movement controls
        const moveInput = keyDirection().clampLength(1).scale(.2);
        if (moveInput.length()) {
            this.velocity = moveInput; // Move at fixed speed
        } else {
            this.velocity = vec2(0); // Stop moving
        }

        setCameraPos(this.pos)
    }
}