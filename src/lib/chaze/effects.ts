import * as LJS from "littlejsengine"

export function healEffect(pos: LJS.Vector2){
    let heal = new LJS.ParticleEmitter(
        pos, 0,	//position, angle
        1,	// emitSize
        0.1,	// emitTime
        10,	// emitRate
        3,	// emitConeAngle
        LJS.tile(6, 16),	// tileIndex
        new LJS.Color(0.439, 1, 0.451, .7),	// colorStartA
        new LJS.Color(0.11, 0.992, 0.537, .7),	// colorStartB
        new LJS.Color(0.235, 1, 0.18, 0),	// colorEndA
        new LJS.Color(0, 1, 0.533, 0),	// colorEndB
        0.5,	// particleTime
        0.01,	// sizeStart
        1,	// sizeEnd
        0.001,	// speed
        0,	// angleSpeed
        1,	// damping
        1,	// angleDamping
        0,	// gravityScale
        3.14,	// particleConeAngle
        0.05,	// fadeRate
        0.2,	// randomness
        false,
        true
        ) // particle emitter

    return heal

}


export const sound_shoot =        new LJS.Sound([,,90,,.01,.03,4,,,,,,,9,50,.2,,.2,.01]);
export const sound_destroyObject =new LJS.Sound([.5,,1e3,.02,,.2,1,3,.1,,,,,1,-30,.5,,.5]);
export const sound_die =          new LJS.Sound([.5,.4,126,.05,,.2,1,2.09,,-4,,,1,1,1,.4,.03]);
export const sound_jump =         new LJS.Sound([.4,.2,250,.04,,.04,,,1,,,,,3]);
export const sound_dodge =        new LJS.Sound([.4,.2,150,.05,,.05,,,-1,,,,,4,,,,,.02]);
export const sound_walk =         new LJS.Sound([.3,.1,50,.005,,.01,4,,,,,,,,10,,,.5]);
export const sound_explosion =    new LJS.Sound([2,.2,72,.01,.01,.2,4,,,,,,,1,,.5,.1,.5,.02]);
export const sound_grenade =      new LJS.Sound([.5,.01,300,,,.02,3,.22,,,-9,.2,,,,,,.5]);
export const sound_score =        new LJS.Sound([,,783,,.03,.02,1,2,,,940,.03,,,,,.2,.6,,.06]);
export const sound_reload =       new LJS.Sound([1.2, 0, 200, .4, , .6, 1, 3, , , , , , 4, 10, .8, , .3]);