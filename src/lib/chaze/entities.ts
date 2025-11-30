
import * as LJS from "littlejsengine";
import * as Game from "$lib/chaze/chaze"
import * as AI from "$lib/chaze/ai"
import * as Effects from "$lib/chaze/effects";
import { vec2 } from "littlejsengine";

const PLAYER_HEALTH = 100
const KNIGHT_HEALTH = 50
const ROOK_HEALTH   = 100;
const BISHIP_HEALTH = 500;
let ITEM_ID = 0
export enum ENEMY_STATE{
    IDLE="IDLE",
    PATROL="PATROL",
    ATTACK="ATTACK",
    FLEE="FLEE",
    DEAD="DEAD",
}

export class GameObject extends LJS.EngineObject 
{
    id: number;
    health: number;
    isGameObject: number;
    damageTimer: LJS.Timer;   
    displayHUD: boolean;
    fullHealth = 100;
    isEnemy: boolean;
    state: ENEMY_STATE;
    previousState: ENEMY_STATE | undefined;
    ammoCount: number;
    reloadTimer; 

    //
    shootTimer;
    bulletSpeed;
    bulletSpread;
    bulletDamage;
    fireTimeBuffer;
    recoilTimer;
    fireRate;

    constructor(pos: LJS.Vector2, size?: LJS.Vector2, tileInfo?: LJS.TileInfo, angle?: number, displayHUD?: boolean)
    {
        super(pos, size, tileInfo, angle);
        this.health = this.fullHealth;
        this.isGameObject = 1;
        this.damping = .5;
        this.damageTimer = new LJS.Timer;
        this.displayHUD = true
        this.isEnemy = false
        this.state = ENEMY_STATE.IDLE;
        this.ammoCount = 10; 
        this.reloadTimer = new LJS.Timer;


        // weapon settings
        this.fireRate      = 0.1;
        this.shootTimer    = new LJS.Timer;
        this.bulletSpeed   = vec2(.5);
        this.bulletSpread  = .1;
        this.bulletDamage  = 10;

        // prepare to fire
        this.fireTimeBuffer = this.localAngle = 0;
        this.recoilTimer = new LJS.Timer;
        this.displayHUD = true
        this.id = ITEM_ID
        ITEM_ID += 1
    }

    update()
    {

        // kill if below level
        if (!this.isDead() && this.pos.y < -9){
            this.kill(this);
        }
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

    render(){
        if (this.displayHUD){
            let x = this.health/this.fullHealth
            let base = 1

            let healthColor = this.isEnemy ? LJS.RED : LJS.GREEN
            LJS.drawRect(this.pos.add(vec2(0 ,base)), vec2(1.05, .2), LJS.BLACK);
            LJS.drawRect(this.pos.add(vec2(-.50 +  (x / 2), base)), vec2(x, .15), healthColor);


            if (!(this instanceof Player) && Game.debugEnemyInfo){

                LJS.drawText(`STATE: ${this.state}`, this.pos.add(vec2(0, base + 0.25)), .25, LJS.WHITE)
                LJS.drawText(`AMMO: ${this.ammoCount}`, this.pos.add(vec2(0, base + 0.5)), .25, LJS.WHITE)
                LJS.drawText(`ID: ${this.getName()}`, this.pos.add(vec2(0, base + 0.75)), .25, LJS.WHITE)
            
            }
        }

        super.render()
    }


    getAngleTowardPos(pos: LJS.Vector2){
        const direction = pos.subtract(this.pos).normalize();
        const angle = LJS.atan2(direction.x, direction.y)
        return angle
    }



    shoot(angle: number): void {

        if(this.ammoCount <= 0 ){
            this.ammoCount = 10
        }



        if(this.ammoCount > 0 && this.shootTimer.elapsed() && this.reloadTimer.elapsed()){
            Effects.sound_shoot.play(this.pos, Game.gameVolume)
            const direction = LJS.vec2(5*this.getMirrorSign(), 0).setAngle(angle);
            this.applyForce(LJS.vec2(1).setAngle(angle - Deg2Rad(180)).clampLength(0.1))
            const velocity = direction.rotate(LJS.rand(-1,1)*this.bulletSpread);
            new Bullet(this.pos, this, velocity, this.bulletDamage, angle);
            this.ammoCount = this.ammoCount - 1 

            if (this.ammoCount <= 0 ){
                this.reloadTimer.set(2)
            }

        }

        if(this.shootTimer.elapsed()){
            this.shootTimer.set(this.fireRate)
        }

    
    
    }


    getName(){
        return this.constructor.name + " " + this.id
    }
}



export class Player extends GameObject{
    shootTimer;

    constructor(pos: LJS.Vector2){
        super(pos,LJS.vec2(1), Game.spriteAtlas.pawn, 0);
        this.fullHealth = PLAYER_HEALTH
        this.health = PLAYER_HEALTH
        this.renderOrder = 1
        this.shootTimer = new LJS.Timer(0.25);
        this.setCollision()


    }

    update(): void {
        // apply movement controls
        const moveInput = LJS.keyDirection().clampLength(1).scale(.3);
        if (moveInput.length()) {
            this.velocity = moveInput;
        } else {
            this.velocity = LJS.vec2(0);
        }

        let angle = this.getAngleTowardPos(LJS.mousePos)
        this.angle = angle - Deg2Rad(90)
        LJS.setCameraPos(this.pos)
        this.handleShoot(angle)
    }

    handleShoot(angle: number){
        if (LJS.mouseIsDown(0)){
            if (Game.debugPathFinderWithPlayer){
                let path = AI.aStarPathFinder(this.pos, LJS.mousePos)
                for (let node of path){
                    LJS.debugPoint(node.add(LJS.vec2(.5)), LJS.RED, .1)
                }
            }else{
                this.shoot(angle)
            }
        }else{
            this.shootTimer.set(0)
            this.reloadTimer.set(0)
        }
    }
}

export class Enemy extends GameObject{
    wayPoints: LJS.Vector2[];
    patrolRadius;
    nextPos: LJS.Vector2 | undefined;
    patrolSpeed;
    movementDirs;
    movementTimer;
    bulletDamage;
    nearbyAllies: Enemy[];
    movingToAlly: Enemy | undefined;
    haveFled;
    assisting; 
    lastGoal: LJS.Vector2 | undefined; 
    constructor(pos: LJS.Vector2, tileInfo: LJS.TileInfo){
        super(pos, vec2(.95), tileInfo )
        this.displayHUD = true
        this.isEnemy = true
        this.setCollision()
        this.renderOrder = 1
        this.patrolRadius = 4
        this.wayPoints = []
        this.patrolSpeed = 0.1
        this.movementDirs = AI.directions;
        this.movementTimer = new LJS.Timer(.50);
        this.bulletDamage = 5
        this.fireRate = 0.4
        this.nearbyAllies = []
        this.haveFled = false;
        this.assisting = false;
        this.state = ENEMY_STATE.PATROL; 
        this.shootTimer = new LJS.Timer(0)
        this.reloadTimer= new LJS.Timer(0)
    }


      update(): void {


        let brightness = 0;
        if (!this.isDead() && this.damageTimer.isSet()){ // I dont understand 
            // DONT MOVE FROM THE ENEMY BLOCK, DOESNT WORK IN THE GAME OBJECT 
            // I DONT KNOW WHY 
            brightness = .5*LJS.percent(this.damageTimer.get(), .15, 0);
        }
        this.additiveColor = LJS.hsl(0,0,brightness,0)

        switch(this.state){
            case ENEMY_STATE.IDLE: 
                break; // do nothing 
            case ENEMY_STATE.PATROL:
                this.patrol()
                if( this.canSeePlayer()){
                    this.state = ENEMY_STATE.ATTACK
                }
                break;
            case ENEMY_STATE.ATTACK:
                this.fireTimeBuffer += LJS.timeDelta;
                this.moveToPosition(Game.player.pos)
                if( this.canSeePlayer()){
                    this.playerSeeBehaviour()
                }
                if (((this.fullHealth * LJS.rand(0.1, 0.35)) && (!this.haveFled))){
                    this.state = ENEMY_STATE.FLEE
                }
                break;
            case ENEMY_STATE.FLEE:
                this.alertNearbyAlly()
                break;
                
                
        }

      }

      patrol(){
        if (this.wayPoints.length == 0){
            this.wayPoints = AI.getAvailablePointsNearObjectBFS(this, this.patrolRadius)
        }

        if( LJS.debugOverlay){
            for (let item of this.wayPoints){
                LJS.debugPoint(item, LJS.GREEN, 0.1)
            }
        }
        if (!this.nextPos || this.pos.distance(this.nextPos) <= .5){
            this.nextPos = AI.pickRandomPoints(this.wayPoints)
        }

        if(this.nextPos){
            this.velocity = this.velocity.add(((this.nextPos.subtract(this.pos).normalize(.05))))
            if (LJS.debugOverlay || Game.debugEnemyPathFinder)
                LJS.debugPoint(this.nextPos, LJS.RED, 0.1)
        }
      }

    playerSeeBehaviour(){
        this.shoot(this.getAngleTowardPos(Game.player.pos))
        this.moveToPosition(Game.player.pos)

    }


    moveToPosition(goal: LJS.Vector2){

        const goalChanged = !this.lastGoal || !(goal.distance(this.lastGoal) > 2)
        const noPath = !this.wayPoints || this.wayPoints.length === 0;

        if (goalChanged || noPath) {
            this.wayPoints = AI.aStarPathFinder(this.pos, goal, this.movementDirs)
            this.lastGoal = goal.copy()
        }

        if(Game.debugEnemyPathFinder){
            for(let point of this.wayPoints){
                LJS.debugPoint(point, LJS.RED, 0.1)
            }
        }
        
        this.nextPos = this.wayPoints.pop()
        if(this.nextPos && this.movementTimer.elapsed()){
                
            this.applyForce((this.nextPos.subtract(this.pos).normalize(1)))
            Effects.sound_walk.play(this.pos, Game.gameVolume)

            if (LJS.debugOverlay)
                LJS.debugPoint(this.nextPos, LJS.RED, .1)

            this.movementTimer.set(0.25)

        }
    }

    startPatrolling(){
        this.wayPoints = []
        this.state = ENEMY_STATE.PATROL
    }


    canSeePlayer(){
        if (Game.player.pos.distance(this.pos) < 10)
            return AI.getNearbyObjectBFS(this, 6, Player, undefined, Game.player).length > 0
        return false
    }

    findNearestEnemy(){
        if (this.nearbyAllies.length == 0){
            this.nearbyAllies = AI.getNearbyObjectBFS(this, 6, Enemy)
        }
    }

    alertNearbyAlly(){
        if(this.nearbyAllies?.length == 0){
            const ally = this.findNearestEnemy()
            if (this.nearbyAllies.length == 0){
                this.haveFled = true
                this.state = ENEMY_STATE.ATTACK  
            }
        }else{
            if (!this.movingToAlly){
                this.movingToAlly = this.nearbyAllies.shift()
                if (this.nearbyAllies.length == 0 || !this.movingToAlly){
                    this.state = ENEMY_STATE.ATTACK
                    this.haveFled = true
                    return
                }

            }

            this.moveToPosition(this.movingToAlly.pos)
            if (this.movingToAlly.pos.distance(this.pos) < 2){
                this.movingToAlly.state = ENEMY_STATE.ATTACK
                this.movingToAlly.assisting = true; 
                this.movingToAlly = undefined
            }

        }

    }


    damage(damage: number, damagingObject: GameObject){
        this.state = ENEMY_STATE.ATTACK
        return super.damage(damage, damagingObject)
    }


    destroy(): void {
        Effects.sound_die.play(this.pos, Game.gameVolume)
        super.destroy()
    }

}


export class Bishop extends Enemy {
    constructor(pos: LJS.Vector2){
        super(pos, Game.spriteAtlas.bishop)
        this.fullHealth = BISHIP_HEALTH
        this.health = BISHIP_HEALTH
    }

}

export class Knight extends Enemy {
    constructor(pos: LJS.Vector2){
        super(pos, Game.spriteAtlas.knight)
        this.fullHealth = KNIGHT_HEALTH
        this.health = KNIGHT_HEALTH
        // this.movementDirs = [
        //     LJS.vec2(1, 2),
        //     LJS.vec2(2, 1),
        //     LJS.vec2(-1, 2),
        //     LJS.vec2(-2, 1),
        //     LJS.vec2(1, -2),
        //     LJS.vec2(2, -1),
        //     LJS.vec2(-1, -2),
        //     LJS.vec2(-2, -1),
        // ] 
    }

    playerSeeBehaviour(): void {
        if (!this.assisting && !this.haveFled){
            this.state = ENEMY_STATE.FLEE
            return
        }
        super.playerSeeBehaviour()
    }
}

export class Rook extends Enemy {
    constructor(pos: LJS.Vector2){
        super(pos, Game.spriteAtlas.rook)
        this.fullHealth = ROOK_HEALTH
        this.health = ROOK_HEALTH
    }
}


export class Potion extends LJS.EngineObject{

    constructor(pos: LJS.Vector2){
        super(pos, LJS.vec2(.75), Game.spriteAtlas.potion)
        this.mass = 0;
    }
    update(){
            // check if hit someone
        LJS.engineObjectsCallback(this.pos, this.size, (o: LJS.EngineObject)=>
        {
            if (o instanceof GameObject){
                this.collideWithObject(o)
            }

        });

        Effects.healEffect(this.pos)

    }
    render(){
        const hoverAmplitude = 0.2;
        const hoverSpeed = 2;
        const t = LJS.time + this.pos.x / 4 + this.pos.y / 4;
        const hoverOffset = LJS.sin(t * hoverSpeed) * hoverAmplitude;
        const hoverPos = LJS.vec2(this.pos.x, this.pos.y + hoverOffset);
        LJS.drawTile(hoverPos, this.size, this.tileInfo, this.color);
        


    }

    collideWithObject(object: GameObject): boolean {
        if (object.health == object.fullHealth) return false
        object.health = object.fullHealth
        Effects.sound_score.play(this.pos, Game.gameVolume)

        this.destroy()
        return true
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
        super(pos);
        this.color = LJS.rgb(1,1,0);
        this.velocity = velocity;
        this.attacker = attacker;
        this.damage = damage;
        this.damping = 1;
        this.gravityScale = 0;
        this.renderOrder = 100;
        this.drawSize = vec2(.15,.15);
        this.size = vec2(.15,.15);
        this.range = LJS.rand(7, 10);
        this.setCollision();
    }

    update()
    {
        // check if hit someone
        LJS.engineObjectsCallback(this.pos, this.size, (o: LJS.EngineObject)=>
        {
            if (o instanceof GameObject && o.isGameObject && o != this.attacker){
                this.collideWithObject(o)

            }

        });

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

        this.kill()
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