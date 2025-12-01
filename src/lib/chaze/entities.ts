
import * as LJS from "littlejsengine";
import * as Game from "$lib/chaze/chaze"
import * as AI from "$lib/chaze/ai"
import * as Effects from "$lib/chaze/effects";
import { Color, ParticleEmitter, tile, vec2 } from "littlejsengine";
import { Switch } from "bits-ui";

const PLAYER_HEALTH = 100
const KNIGHT_HEALTH = 50
const ROOK_HEALTH   = 100;
const BISHIP_HEALTH = 500;


let ITEM_ID = 0

export enum BOOST_TYPE{
    SPEED="SPEED",
    POISON="POISON",
    SHIELD="SHIELD",
    AMMO="AMMO",
}

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
    shootTimer;
    bulletSpeed;
    bulletSpread;
    baseBulletDamage;
    bulletDamage;
    fireTimeBuffer;
    recoilTimer;


    boostTimer: LJS.Timer | undefined;
    boostType: BOOST_TYPE | undefined;
    
    
    baseSpeed: number;
    speed: number;


    baseFireRate: number;
    fireRate: number;

    baseDamageMultiplier: number;
    damageMultiplier: number;

    poisonTimer; 



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

        this.poisonTimer = new LJS.Timer;

        this.baseBulletDamage = 10
        this.bulletDamage = this.baseBulletDamage
        
        this.baseDamageMultiplier = 1 
        this.damageMultiplier = 1 

        this.baseSpeed = 0.45; 
        this.speed = this.baseSpeed;

        // weapon settings
        this.baseFireRate           = 0.1;
        this.fireRate               = this.baseFireRate
        
        
        this.shootTimer         = new LJS.Timer;
        this.bulletSpeed        = vec2(.5);
        this.bulletSpread       = .1;
        this.baseBulletDamage   = 10;


        this.boostTimer = new LJS.Timer;

        // prepare to fire
        this.fireTimeBuffer = this.localAngle = 0;
        this.recoilTimer = new LJS.Timer;
        this.id = ITEM_ID
        ITEM_ID += 1
    }

    update()
    {
        this.handleBoost()
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
        const newHealth = LJS.max(this.health - (damage * this.damageMultiplier), 0);
        
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

            let healthColor = this.isBoosted(BOOST_TYPE.SHIELD) ? LJS.BLUE : this.isBoosted(BOOST_TYPE.POISON) ? LJS.PURPLE :  this.isEnemy ? LJS.RED : LJS.GREEN
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


    isBoosted(boost: BOOST_TYPE){
        return this.boostTimer?.active() && this.boostType == boost
    }


    getAngleTowardPos(pos: LJS.Vector2){
        const direction = pos.subtract(this.pos).normalize();
        const angle = LJS.atan2(direction.x, direction.y)
        return angle
    }

    handleBoost(){
        if (!this.boostTimer?.active()) {
            this.resetBoost()
            return
        }

        if (this.boostTimer.elapsed()) {
            this.resetBoost();
            return;
        }

        switch (this.boostType) {
            case BOOST_TYPE.POISON:
                if(!this.poisonTimer.isSet()){
                    this.poisonTimer.set(0.5)
                }

                if(this.poisonTimer.elapsed()){
                    this.damage(this.fullHealth * 0.025, this);
                    this.poisonTimer.set(0.25)
                }
                break;

            case BOOST_TYPE.AMMO:
                this.fireRate = this.baseFireRate / 2
                this.bulletDamage = this.baseBulletDamage * 3
                break;

            case BOOST_TYPE.SPEED:
                this.speed = this.baseSpeed * 1.50
                break;

            case BOOST_TYPE.SHIELD:
                this.damageMultiplier = 0.01;
                break
            

        }
    }

    resetBoost() {
        this.speed = this.baseSpeed;
        this.damageMultiplier = this.baseDamageMultiplier
        this.fireRate = this.baseFireRate
        this.bulletDamage = this.baseBulletDamage
        this.poisonTimer.unset()
        this.boostType = undefined;
    }

    applyBoost(boost: BOOST_TYPE, duration: number){
        this.resetBoost()
        this.boostTimer = new LJS.Timer(duration)
        this.boostType = boost
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


    debuf(){
        this.additiveColor = LJS.hsl(.15,1,.5);
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
        const moveInput = LJS.keyDirection().clampLength(1).scale(.3);
        if (moveInput.length()) {
            this.applyForce(moveInput.multiply(vec2(this.speed)));
        } else {
            this.velocity = LJS.vec2(0);
        }

        let angle = this.getAngleTowardPos(LJS.mousePos)
        this.angle = angle - Deg2Rad(90)
        LJS.setCameraPos(this.pos)
        this.handleShoot(angle)
        super.update()
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
    movementDirs;
    movementTimer;
    bulletDamage;
    nearbyAllies: Enemy[];
    movingToAlly: Enemy | undefined;
    haveFled;
    assisting; 
    lastGoal: LJS.Vector2 | undefined;
    buffSpeedMultiplier = 1;
    buffDamageMultiplier = 1; 

    constructor(pos: LJS.Vector2, tileInfo: LJS.TileInfo){
        super(pos, vec2(.95), tileInfo )
        this.displayHUD = true
        this.isEnemy = true
        this.setCollision()
        this.renderOrder = 1
        this.patrolRadius = 4
        this.wayPoints = []
        this.movementDirs = AI.directions;
        this.movementTimer = new LJS.Timer(.50);
        this.bulletDamage = this.baseBulletDamage * this.buffDamageMultiplier
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
                if (this.health == this.fullHealth * LJS.rand(0.1, 0.35)){
                    if (!this.haveFled)
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
                
            this.applyForce((this.nextPos.subtract(this.pos).normalize(1).multiply(vec2(this.buffSpeedMultiplier))))
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

    applyBishopBuff() {
        if (!this.boostTimer || !this.boostTimer.isSet()) 
            this.boostTimer = new LJS.Timer(3)
        if (this.boostTimer?.elapsed()){
            this.removeBishopBuff()
            this.boostTimer.unset()
        }
        if (this.boostTimer?.active()){
            this.buffSpeedMultiplier = 1.4;
            this.buffDamageMultiplier = 1.3;
        }
    }

    removeBishopBuff() {
        this.buffSpeedMultiplier = 1;
        this.buffDamageMultiplier = 1;
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

    isBoosted(boost: BOOST_TYPE): boolean | undefined {
        return this.boostTimer?.active()
    }

}


export class Bishop extends Enemy {
    auraRange: number;
    auraPulse: LJS.Timer;
    constructor(pos: LJS.Vector2){
        super(pos, Game.spriteAtlas.bishop)
        this.fullHealth = BISHIP_HEALTH
        this.health = BISHIP_HEALTH
        this.auraRange = 5;
        this.auraPulse = new LJS.Timer();
    }


    update(): void {
        if(this.state != ENEMY_STATE.IDLE)
            this.applyAuraBuffs();
        super.update()
    }


    applyAuraBuffs() {
        if (!this.auraPulse.isSet()) this.auraPulse.set(1);
        if (this.auraPulse.elapsed()){
            let nearby = AI.getNearbyObjectBFS(this, this.auraRange, GameObject);
            for (let o of nearby){
                if (o instanceof Player){
                    o.damage(this.bulletDamage * 0.025, this)
                }
                if (o instanceof Enemy){
                    if (o === this) return;
                    o.applyBishopBuff()
                }
            }

            this.emitAuraParticles()
            // if (nearby.length != 0){
            // }
            this.auraPulse.set(1)
        }
    }


    emitAuraParticles() {
        new ParticleEmitter(
        this.pos, 0,	//position, angle
        1,	// emitSize
        0.2,	// emitTime
        50,	// emitRate
        3,	// emitConeAngle
        Game.spriteAtlas.shield,	// tileIndex
        new Color(0.439, 0.933, 1, 1),	// colorStartA
        new Color(0, 0.667, 1, 1),	// colorStartB
        new Color(0.341, 1, 0.988, 0),	// colorEndA
        new Color(0, 0.333, 1, 0),	// colorEndB
        0.5,	// particleTime
        0.5,	// sizeStart
        1,	// sizeEnd
        0.1,	// speed
        0,	// angleSpeed
        1,	// damping
        1,	// angleDamping
        0,	// gravityScale
        0,	// particleConeAngle
        0.5,	// fadeRate
        0,	// randomness
        true,	// additive
        false
        ); // particle emitter
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
}

export class Rook extends Enemy {
    constructor(pos: LJS.Vector2){
        super(pos, Game.spriteAtlas.rook)
        this.fullHealth = ROOK_HEALTH
        this.health = ROOK_HEALTH
    }

    playerSeeBehaviour(): void {
        if (!this.assisting && !this.haveFled){
            this.state = ENEMY_STATE.FLEE
            return
        }
        super.playerSeeBehaviour()
    }
}



export class Collectable extends LJS.EngineObject 
{

    duration: number; 

    constructor(pos: LJS.Vector2, tileInfo: LJS.TileInfo) 
    { 
        super(pos, LJS.vec2(1), tileInfo);
        this.mass = 0;
        this.duration = 15;
    }

    spin()
    {
        LJS.drawTile(this.pos, LJS.vec2(.1, .6), undefined, this.color);
        const t = LJS.time+this.pos.x/4+this.pos.y/4;
        const spinSize = LJS.vec2(.5+.5*LJS.sin(t*2*LJS.PI), 1);
        if (spinSize.x > .1)
        LJS.drawTile(this.pos, spinSize, this.tileInfo, this.color);
    }

    update()
    {

        // check if hit someone
        LJS.engineObjectsCallback(this.pos, this.size, (o: LJS.EngineObject)=>
        {
            if (o instanceof GameObject && this.interactionCheck(o)){
                this.collideWithObject(o)
            }

        });

        if (!Game.player)
            return;

        // check if player in range
        const d = this.pos.distanceSquared(Game.player.pos);
        if (d > .5)
            return; 
        
        this.destroy();
    }

    hover(){
        const hoverAmplitude = 0.2;
        const hoverSpeed = 2;
        const t = LJS.time + this.pos.x / 4 + this.pos.y / 4;
        const hoverOffset = LJS.sin(t * hoverSpeed) * hoverAmplitude;
        const hoverPos = LJS.vec2(this.pos.x, this.pos.y + hoverOffset);
        LJS.drawTile(hoverPos, this.size, this.tileInfo, this.color);
    }


    interactionCheck(o: GameObject): boolean{
        return true;
    }

}


export class Potion extends Collectable{

    constructor(pos: LJS.Vector2){
        super(pos, Game.spriteAtlas.potion)
        this.mass = 0;
    }
    update(){        
        Effects.healEffect(this.pos)
        super.update()
    }

    collideWithObject(object: GameObject): boolean {
        if (object.health == object.fullHealth) return false
        object.health = object.fullHealth
        Effects.sound_score.play(this.pos, Game.gameVolume)
        this.destroy()
        return true
    }
}



export class Coin extends Collectable
{
    constructor(pos: LJS.Vector2) 
    { 
        super(pos, Game.spriteAtlas.coin);
        this.color = LJS.hsl(.15,1,.5);
        this.mass = 0;
    }

    update()
    {
        super.update()
    }

    render(): void {
        this.spin()
    }

}



export class Speed extends Collectable
{
    constructor(pos: LJS.Vector2) 
    { 
        super(pos, Game.spriteAtlas.speedBst);
        this.color = LJS.hsl(.15,1,.5);
        this.mass = 0;
    }

    update()
    {
        super.update()
    }

    render(): void {
        this.hover()
    }

    collideWithObject(object: GameObject): boolean {
        object.applyBoost(BOOST_TYPE.SPEED, this.duration)
        Effects.sound_score.play(this.pos, Game.gameVolume)
        this.destroy()
        return true
    }


    interactionCheck(o: GameObject): boolean {
        return o instanceof Player
    }


}


export class Ammo extends Collectable
{
    constructor(pos: LJS.Vector2) 
    { 
        super(pos, Game.spriteAtlas.ammoPk);
        this.color = LJS.hsl(.15,1,.5);
        this.mass = 0;
    }

    update()
    {
        super.update()
    }

    render(): void {
        this.hover()
    }

    collideWithObject(object: GameObject): boolean {
        object.applyBoost(BOOST_TYPE.AMMO, this.duration)
        Effects.sound_score.play(this.pos, Game.gameVolume)
        this.destroy()
        return true
    }
}


export class Poison extends Collectable
{
    constructor(pos: LJS.Vector2) 
    { 
        super(pos, Game.spriteAtlas.poison);
        this.mass = 0;
    }

    render(): void {
        this.hover()
    }

    collideWithObject(object: GameObject): boolean {
        object.applyBoost(BOOST_TYPE.POISON, this.duration)
        Effects.sound_score.play(this.pos, Game.gameVolume)
        this.destroy()
        return true
    }
}






export class Shield extends Collectable
{
    constructor(pos: LJS.Vector2) 
    { 
        super(pos, Game.spriteAtlas.shield);
        this.color = LJS.hsl(.15,1,.5);
        this.mass = 0;
    }

    update()
    {
        super.update()
    }

    render(): void {
        this.hover()
    }

    collideWithObject(object: GameObject): boolean {
        object.applyBoost(BOOST_TYPE.SHIELD, this.duration)
        Effects.sound_score.play(this.pos, Game.gameVolume)
        this.destroy()
        return true
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