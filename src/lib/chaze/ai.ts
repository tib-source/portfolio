import * as LJS from "littlejsengine";


export const directions = [
        LJS.vec2(1, 0),
        LJS.vec2(0, 1),
        LJS.vec2(1, 1),
        LJS.vec2(-1, 1),
        LJS.vec2(1, -1),
        LJS.vec2(-1, -1),
        LJS.vec2(-1, 0),
        LJS.vec2(0 , -1)
    ]



export function pickRandomPoints<T>(positions: T[]) {
    return positions[Math.floor(Math.random() * positions.length-1)]
}


export function getAvailablePointsNearObjectBFS(o: LJS.EngineObject, radius: number){

    let queue: LJS.Vector2[] = getNeighbours(o.pos)
    let visited = new Set();
    
    let maxX = o.pos.x + radius
    let maxY = o.pos.y + radius
    let minX = o.pos.x - radius
    let minY = o.pos.y - radius
    let available = []


    const key = (v: LJS.Vector2) => `${v.x},${v.y}`;

    while(queue.length > 0){
        let curr = queue.shift()
        if (curr){

            if (visited.has(key(curr)))
                continue

            visited.add(key(curr));


            if (curr.x >= maxX || curr.y >= maxY || curr.x <= minX || curr.y <= minY) continue;

            const collision = LJS.tileCollisionTest(curr, o.size, o, false);
            if (collision === undefined) {
                available.push(curr);
                queue.push(...getNeighbours(curr));

            }

        }


    }
            
    return available
    
}



function getNeighbours(pos: LJS.Vector2){

    let output = []
    for (let dir of directions){
        output.push(pos.add(dir))
    }

    return output
}