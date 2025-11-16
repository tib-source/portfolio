
import * as LJS from "littlejsengine";
import * as Game from "$lib/chaze/chaze"
import { vec2 } from "littlejsengine";


export class GameObject extends LJS.EngineObject 
{

    health: number;
    isGameObject: number;
    damageTimer: LJS.Timer;   
    
    constructor(pos: LJS.Vector2, size?: LJS.Vector2, tileInfo?: LJS.TileInfo, angle?: number)
    {
        super(pos, size, tileInfo, angle);
        this.health = 0;
        this.isGameObject = 1;
        this.damageTimer = new LJS.Timer;
    }

    update()
    {
        // flash white when damaged
        let brightness = 0;
        if (!this.isDead() && this.damageTimer.isSet())
            brightness = .5*LJS.percent(this.damageTimer.get(), .15, 0);
        this.additiveColor = LJS.hsl(0,0,brightness,0);

        // kill if below level
        if (!this.isDead() && this.pos.y < -9)
            this.kill(this);
    }

    damage(damage: number, damagingObject: GameObject)
    {
        LJS.ASSERT(damage >= 0);
        if (this.isDead())
            return 0;
        
        // set damage timer;
        this.damageTimer.set();
        for (const child of this.children)
            child.damageTimer && child.damageTimer.set();

        // apply damage and kill if necessary
        const newHealth = LJS.max(this.health - damage, 0);
        if (!newHealth)
            this.kill(damagingObject);

        // set new health and return amount damaged
        return this.health - (this.health = newHealth);
    }

    isDead()                { return !this.health; }
    kill(damagingObject: GameObject)    { this.destroy(); }
}



export class Player extends GameObject{
    shootTimer;
    fireRate;
    bulletSpeed;
    bulletSpread;
    bulletDamage;
    fireTimeBuffer;
    recoilTimer;
    shellEmitter;


    constructor(pos: LJS.Vector2){
        super(pos,LJS.vec2(1), Game.spriteAtlas.pawn, 0);
        this.setCollision()
        this.renderOrder = 1
        this.shootTimer = LJS.Timer


        // weapon settings
        this.fireRate      = 8;
        this.bulletSpeed   = vec2(.5);
        this.bulletSpread  = .1;
        this.bulletDamage  = 1;

        // prepare to fire
        this.fireTimeBuffer = this.localAngle = 0;
        this.recoilTimer = new LJS.Timer;

        // shell effect
        this.addChild(this.shellEmitter = new LJS.ParticleEmitter(
            LJS.vec2(), 0, 0, 0, 0, .1,  // pos, angle, size, time, rate, cone
            undefined,                       // tileInfo
            LJS.rgb(1,.8,.5), LJS.rgb(.9,.7,.5), // colorStartA, colorStartB
            LJS.rgb(1,.8,.5), LJS.rgb(.9,.7,.5), // colorEndA, colorEndB
            3, .1, .1, .15, .1, // time, sizeStart, sizeEnd, speed, angleSpeed
            1, .95, 1, 0, 0,    // damp, angleDamp, gravity, particleCone, fade
            .1, true               // randomness, collide
        ), LJS.vec2(.1,0), -.8);
        this.shellEmitter.restitution = .5;
        // this.shellEmitter.particleDestroyCallback = GameEffects.persistentParticleDestroyCallback;
    }

    update(): void {
        // apply movement controls
        const moveInput = LJS.keyDirection().clampLength(1).scale(.3);
        if (moveInput.length()) {
            this.velocity = moveInput;
        } else {
            this.velocity = LJS.vec2(0);
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
        this.velocity = LJS.vec2(0.0002).setAngle(angle - Deg2Rad(180)).clampLength(0.1);
        const velocity = direction.rotate(LJS.rand(-1,1)*this.bulletSpread);
        new Bullet(this.pos, this.parent, velocity, this.bulletDamage, angle);
        // spawn shell particle
        this.shellEmitter.emitParticle();
    }



}


export class Bishop extends GameObject{

}

export class Knight extends GameObject{

}

export class Rook extends GameObject{

}


export class Potion extends LJS.EngineObject{

    constructor(pos: LJS.Vector2){
        super(pos, LJS.vec2(.75), Game.spriteAtlas.potion)
        this.mass = 0;
    }

    render(){
        const hoverAmplitude = 0.2;
        const hoverSpeed = 2;
        const t = LJS.time + this.pos.x / 4 + this.pos.y / 4;
        const hoverOffset = LJS.sin(t * hoverSpeed) * hoverAmplitude;
        const hoverPos = LJS.vec2(this.pos.x, this.pos.y + hoverOffset);
        LJS.drawTile(hoverPos, this.size, this.tileInfo, this.color);

    }
}


export class Coin extends LJS.EngineObject 
{
    constructor(pos: LJS.Vector2) 
    { 
        super(pos, LJS.vec2(1), Game.spriteAtlas.coin);
        this.color = LJS.hsl(.15,1,.5);
        this.mass = 0;
    }

    render()
    {
        // side of coin
        LJS.drawTile(this.pos, LJS.vec2(.1, .6), undefined, this.color);

        // make it appear to spin
        const t = LJS.time+this.pos.x/4+this.pos.y/4;
        const spinSize = LJS.vec2(.5+.5*LJS.sin(t*2*LJS.PI), 1);
        if (spinSize.x > .1)
        LJS.drawTile(this.pos, spinSize, this.tileInfo, this.color);
    }

    update()
    {
        if (!Game.player)
            return;

        // check if player in range
        const d = this.pos.distanceSquared(Game.player.pos);
        if (d > .5)
            return; 
        
        // award points and destroy
        // Game.addToScore();
        // GameEffects.sound_score.play(this.pos);
        this.destroy();
    }
}

export function Deg2Rad(deg: number): number{ 
    return deg * (LJS.PI/180)
}





export class Bullet extends LJS.EngineObject 
{

    attacker; 
    damage; 
    range; 
    
    constructor(pos: LJS.Vector2, attacker: GameObject, velocity: LJS.Vector2, damage: number, angle: number) 
    { 
        super(pos, vec2());
        this.color = LJS.rgb(1,1,0);
        this.velocity = velocity;
        this.attacker = attacker;
        this.damage = damage;
        this.damping = 1;
        this.gravityScale = 0;
        this.renderOrder = 100;
        this.drawSize = vec2(.1,.3);
        this.range = 10;
        this.setCollision();
    }

    update()
    {
        // check if hit someone
        // LJS.engineObjectsCallback(this.pos, this.size, (o: LJS.EngineObject)=>
        // {
        //     if (o instanceof GameObject && o.isGameObject)
        //         this.collideWithObject(o)
        // });

        this.angle = this.velocity.angle();
        this.range -= this.getSpeed();
        if (this.range < 0)
        {
            new LJS.ParticleEmitter(
                this.pos, 0, .2, .1, 50, 3.14, Game.spriteAtlas.pawn, // pos, emit info, tileInfo
                LJS.rgb(1,1,.1), LJS.rgb(1,1,1),   // colorStartA, colorStartB
                LJS.rgb(1,1,.1,0), LJS.rgb(1,1,1,0), // colorEndA, colorEndB
                .1, .5, .1, .05, 0, // particleTime, sizeStart, sizeEnd, speed, angleSpeed
                1, 1, .5, 3.14, .1, // damping, angleDamping, gravityScale, cone, fadeRate, 
                .5, true, true            // randomness, collide, additive, randomColorLinear
            );

            this.destroy();
        }
    }
    
    collideWithObject(o: GameObject)
    {
        if (o.isGameObject && o != this.attacker)
        {
            o.damage(this.damage, o);
            o.applyForce(this.velocity.scale(.1));
        }
    
        this.kill();
        return true; 
    }

    kill()
    {
        if (this.destroyed)
            return;
        this.destroy();

        // spark effects
        const emitter = new LJS.ParticleEmitter(
            this.pos, 0, 0, .1, 100, .5, // pos, angle, size, time, rate, cone
            undefined,                           // tileInfo
            LJS.rgb(1,1,0), LJS.rgb(1,0,0), // colorStartA, colorStartB
            LJS.rgb(1,1,0), LJS.rgb(1,0,0), // colorEndA, colorEndB
            .2, .2, 0, .1, .1,  // time, sizeStart, sizeEnd, speed, angleSpeed
            1, 1, .5, 3.14, .1, // damp, angleDamp, gravityScale, particleCone, fade, 
            .5, true, true            // randomness, collide, additive
        );
        emitter.trailScale = 1;
        emitter.restitution = .3;
        emitter.angle = this.velocity.angle() + LJS.PI;
    }
}