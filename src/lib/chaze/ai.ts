import * as LJS from "littlejsengine";
import { levelSize } from "./gameLevel";
import { debugEnemyPathFinder } from "./chaze";
import { Enemy, GameObject } from "./entities";


let grid: Map<string, Node>;


const pathCache = new Map<string, LJS.Vector2[]>();


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


const walkCache = new Map<LJS.Vector2, boolean>();
function isWalkable(o: GameObject, pos: LJS.Vector2) {
    if (walkCache.has(pos)) return walkCache.get(pos);

    const hit = LJS.tileCollisionTest(pos, LJS.vec2(1), o) 
    walkCache.set(pos, hit == undefined);
    return hit;
}


export function pickRandomPoints<T>(positions: T[]) {
    return positions[Math.floor(Math.random() * positions.length)];
}


export function getAvailablePointsNearObjectBFS(o: LJS.EngineObject, radius: number){

    let queue: LJS.Vector2[] = getNeighbourVectors(o.pos)
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
                queue.push(...getNeighbourVectors(curr));

            }

        }


    }
            
    return available
    
}



export function getNearbyObjectBFS<T extends GameObject>(o: GameObject, radius: number, ObjectType: new (...args: any[]) => T, dirs?: LJS.Vector2[], optimiseForObject?: GameObject){
    let queue: LJS.Vector2[] = []
    let seen = new Set<string>();
    
    let maxX = o.pos.x + radius
    let maxY = o.pos.y + radius
    let minX = o.pos.x - radius
    let minY = o.pos.y - radius
    let available = []
    
    let startNode = o.pos.floor()

    queue.push(startNode)

    while(queue.length > 0){
        let curr = queue.shift()
        if (curr){
            if (debugEnemyPathFinder){
                LJS.debugPoint(curr, LJS.BLUE, 0.1)
            }
            if (seen.has(gridKey(curr)))
                continue

            seen.add(gridKey(curr))


            if (curr.x >= maxX || curr.y >= maxY || curr.x <= minX || curr.y <= minY) continue;

            const objects = LJS.engineObjectsCollect(curr, LJS.vec2(2));
            for (let obj of objects){
                if (obj instanceof ObjectType  && obj !== o){
                    available.push(obj)
                }
            }

            let neighbors = getNeighbourVectors(curr)
            for (let n of neighbors){

                if(optimiseForObject && optimiseForObject.pos.distance(n) > optimiseForObject.pos.distance(curr)){
                    continue
                }

                if (!n){
                    continue
                }
                if (!isWalkable(o, n) && !seen.has(gridKey(n))){
                    queue.push(n)
                    continue
                }
            }

        }


    }
            
    return available
    
}


export function aStarPathFinder(start: LJS.Vector2, goal: LJS.Vector2, givenDirs?: LJS.Vector2[], optimiseForObject?: GameObject){
    grid = generateGrid(true)

    start = start.floor().add(LJS.vec2(.5))
    goal= goal.floor().add(LJS.vec2(.5))
    let queue = new Set<Node>();
    let seen = new Set<Node>();

    let startNode = new Node(start)
    startNode.gCost = 0

    const key = `${start.x},${start.y}-${goal.x},${goal.y}`;

    // ---- CACHE LOOKUP ----
    if (pathCache.has(key)) {
        // Return a COPY so the caller can pop() without destroying cached path
        return [...pathCache.get(key)!];
    }


    queue.add(startNode)
    while(queue.size > 0){
        
        let curr = getLowestFCostNode(queue)
        if (curr?.pos.distance(goal) == 0){
            let path =  getPathFromNode(curr) 
            pathCache.set(key, path)
            return [...path]
        }

        queue.delete(curr)
        seen.add(curr)

        let dirs = givenDirs || directions 
        for (let dir of dirs){
            let node = grid.get(gridKey(curr.pos.add(dir)))

            if (!node) continue
            
            if (!node || seen.has(node) || !node.walkable || LJS.tileCollisionRaycast(curr.pos, node.pos)) continue
            let tempG = curr.gCost + (node.pos.distance(curr.pos))
            if (tempG < node.gCost){
                node.gCost = tempG
                node.hCost = goal.distance(node.pos)
                node.parent = curr
                if (!queue.has(node)){
                    queue.add(node)
                }
            }
        }

    }
    pathCache.set(key, [])
    return []
}


export function invalidatePathCache() {
    pathCache.clear();
}


export function generateGrid(offset: boolean = true){
    let grid = new Map<string, Node>();

    for (let x = levelSize.x; x--;)
    for (let y = levelSize.y; y--;){
        let pos; 
        if (offset){
            pos = LJS.vec2(x,y).add(LJS.vec2(0.5))
        }else{
            pos = LJS.vec2(x,y)
        }
        
        let collision = LJS.tileCollisionTest(pos, LJS.vec2(1))
        let node = new Node(pos)
        if (collision){
            if(debugEnemyPathFinder || debugEnemyPathFinder)
                LJS.debugPoint(pos, LJS.RED, 0.1)
            node.walkable = false
        }

        grid.set(gridKey(pos), node)
    }

    return grid
}

export function getPathFromNode(node: Node){
    let path = []
    let curr = node
    while(curr.parent){
        path.push(curr.pos)
        curr = curr.parent
    }
    return path;
}

export function getLowestFCostNode(nodes: Set<Node>){
    let smallest = nodes.values().toArray()[0]
    for (let node of nodes){
        let curr = node.getFcost()
        if (curr < smallest.getFcost()){
            smallest = node
        }
    }

    return smallest
}


function getNeighbourVectors(pos: LJS.Vector2){

    let output = []
    for (let dir of directions){
        output.push(pos.add(dir))
    }

    return output
}


function getNeighbourNodes(pos: LJS.Vector2, grid: Map<string, Node>, givenDirs?: LJS.Vector2[]){
    let dirs = givenDirs || directions 
    let output = []
    for (let dir of dirs){
        let node = grid.get(gridKey(pos.add(dir)))
        output.push(node)
    }

    return output
}




export class Node{ 
    pos: LJS.Vector2; 
    parent: Node| undefined;

    hCost = 0;
    gCost = Infinity;
    walkable = true;


    constructor(pos: LJS.Vector2){
        this.pos = pos; 

    }

    setParent(parent: Node){
        this.parent = parent;
    }

    getFcost(){
        return this.hCost + this.gCost
    }
}


export function gridKey(pos: LJS.Vector2) {
  return `${pos.x},${pos.y}`;
}