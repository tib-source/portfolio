
# Games AI Report

The following report details my implementation and analysis of intelligent systems and terrain generation within a game called Chaze. We will first discuss the finite state machines(FSM) that the intelligence systems or non player characters (NPC) use to model their behaviour. Then we will cover their path finding systems, and their interactions with the player character. The next  section will go through the implementation of procedurally generated environments available in Chaze as well as the constraints used for generating enemies and artifacts within those environments. Here we will also test how different sizes of environments affect the generation. 

## Non Player Character Modeling

Chaze is a top down shooter which features chess pieces with guns that can shoot enemies. The player is a pawn with a pistol and all other characters are NPC’s. The game has three distinct types of NPCs available to interact with. The knight, rook and bishop are these pieces. They share a basic finite state machine though their behaviour in every state and transitions between states are varied. 

<div align="center">

![][image1] ![][image2]

*figure(1): FSM's that dictate NPC behaviour*

</div>

<div align="center">

![][image3]

*figure(2): Code implementation of NPC FSM.*

</div>

The NPC’s within Chaze have their behavior mainly modelled by the above two finite state machines. Each bot starts in an idle state where once the map is loaded, all game objects within a certain distance of the player character are set to a patrol state whereas the rest are idle as to save on compute resources. Once a bot has moved into a patrol state, it obtains its patrol range from its constructor and gets a list of all available way points around it that it can travel to. The bot caches these points and until a player interacts with it, chooses a random point within its list of available points and moves towards them. Once it reaches that point, it chooses another and continues to do so forever. See figure below for code snippet and demonstration. 

<div align="center">

![][image4]

*figure(3): Code implementation of patrol logic*

</div>

<div align="center">

![][image5]

*figure(4): Knight NPC in patrol state, green are available positions and red is next target*

</div>

The transition to the attack state is determined by the *`this.playerSeeBehaviour`* function. Originally, this relied on a euclidean distance check. If the distance between the NPC and player fell below 5 units, the attack state was triggered. However, this led to moments where NPCs would detect players through solid walls. To resolve this, I implemented a secondary validation step. Even if the player is within range, the NPC now performs a Breadth-First Search (BFS) to confirm that a valid path exists before triggering the state change.

While this solved the issue, full BFS exploration introduced a performance cost. To optimize this, I modified the algorithm into a directed BFS. Instead of expanding all neighboring nodes blindly, the search only greedily accepts neighbor nodes that reduce the distance to the player. This significantly reduced the number of iterations required to confirm visibility.

<div align="center">

![][image6]

*figure(5): Directed BFS checks to see that the player is accessible*

</div>

The Knight serves as the standard aggressive unit. Its state transition is triggered either by taking damage or by detecting the player within a specific range. Once triggered, it enters a chase state, using the A\* pathfinding algorithm to calculate the optimal route to the player's current position. It uses the same logic from its patrol to check that it can see the player before proceeding to shoot at the player. The rook on the other hand behaves differently whereby if it's attacked and damaged, it does BFS with a slightly wider range to identify all allies and then go to each of those positions and changes the state of those allies to attack and provides the players coordinates. Once it has alerted all its nearby allies from its initial BFS search, it then changes its state to attack and joins the pack to attack the player.

<div align="center">

![][image7]

*figure(6): Alert nearby enemy implementation.*

</div> 

This functionality’s implementation introduces some pseudo states for the NPCs to be in which are *`this.haveFleed`* and *`this.assisting`*. These were added to prevent enemies who have already tried to flee from attempting to do so again if they find no one nearby. It also prevents allies who have been called to assist from fleeing themselves.

Finally the bishop, who is a supporting character, when attacking has an extended behaviour of checking for allies nearby, when it finds enemies, it buffs their damage and speed. This is done again using BFS to make sure allies in a different room aren't buffed by a bishop in a different location. Further more, this buff area also acts as a weapon, damaging the player if he gets too close too it so bishop will always try to come as close as possible

<div align="center">

![][image8]

*figure(7): Bishop aura buff implementation when its in attack state*

</div>

In addition to the above, to save compute resources and make sure that game is optimised, on each frame, I collect all available objects within a range of 20 tiles from the player and make sure only those are in an active state. This is achieved by saving their current state in an additional value called *`previousState`* and setting the current state to idle. If a bot was attacked and it started fleeing but the player moved so this bot went out of range, it will go idle until the player comes back close where it will resume previous state of flee and will alert other enemies. 

Finally, I had some trouble in the implementation of the path finding for this game when multiple enemies are in attack state and each of them are doing A\* Each frame to determine the players location, the performance of the game was taking a hit. To help reduce this, the system now caches the calculated path to a specific destination. As the environment is static, this significantly reduces computation.

## Terrain Generation and Game Environment

For this section, we will explore how Chaze implements Perlin-based terrain generation and how artifacts generated within this terrain are validated to ensure accessibility. In the state of this new scene, all existing objects are first destroyed and a nested loop starts which iterates through all available x and y positions on the provided grid size. For each of these coordinate values, they are multiplied by a specified scale factor and passed through a Perlin noise generator, which returns a value between \-1 and 1\. This value is then normalised and compared against a specific threshold. Based on this comparison, I generate either a wall or a floor tile and set their respective collision values. The implementation of this can seen below: 

<div align="center">

![][image9]

*figure(8): procedural generation of map*

</div>

An additional check is performed to see if the current coordinates represent edge pieces on the map. This ensures that the perimeter of the game area is always a wall tile and that the player cannot go outside the bounds. Otherwise, the tile type is determined by the noise function. There was experimentation with adding other types of tiles, i.e. sand, water and I found that perlin noise generates things in such a way that it makes islands, and so the different terrains wouldn't get their own sections but rather would be generated at the ends of another. For example when adding the sand tiles, they were generated on the edges of the walls. 

This results in a map that looks like the following:

<div align="center">

![][image10]

*figure(9): example generated arena with just wall and floor*

</div>

<div align="center">

![][image11]

*figure(10): example generated map with multiple terrain*

</div>


Once the map is generated, we can then continue with generating the different characters and artifacts. The procedural generation places 6 distinct artifact types: potion, shield, speed boost, ammo pack, coin and poison, ensuring a minimum of 6 instances are spawned. At this point,  I encountered an issue where the random generation sometimes produced bad seeds, i.e maps where the play area was too small or disjointed for gameplay. To combat this, I implemented a validation step where for each generation, the most central floor tile of the map will be taken and a BFS flood fill search is done, If this BFS search concludes with less than a given number of available tiles for the character to move in, the game will regenerate the map until it reaches that threshold. As the generation is completely random, multiple bad generations could lead to bad load time for this method which is a downside that has been observed. 

<div align="center">

![][image12]

*figure(11): map regenerated until good amount of play area*

</div>


For the artifact generation, I set up specific rules to make sure items are placed correctly in the environment. First, I check that a tile is actually available before generating anything. I keep a list of valid floor tiles, and once an artifact claims a spot, I remove that tile from the list so that nothing else can overlap with it. I also use the BFS check mentioned earlier to make sure the player can actually reach the item. Finally, I added a rule for the spawn distance. I implemented a minimum and maximum distance from the player's current location. This ensures that artifacts don't spawn right on top of the player, but also aren't placed so far away that they are impossible to find.

The following testing was done to see the performance of the environment with different variables : 

| Grid | Enemies | Artifacts | Total Assets | Map Gen Time (ms) | Artifact Gen Time (ms) | Total Scene Setup (ms) |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| 50 | 5 | 5 | 10 | 19.70 | 4.30 | **20.20** |
| 50 | 10 | 10 | 20 | 21.00 | 2.80 | **21.40** |
| 50 | 15 | 15 | 30 | 13.30 | 4.50 | **13.60** |
| 50 | 20 | 20 | 40 | 18.40 | 3.70 | **18.90** |

The above was run with a static grid size and the below with a varied grid : 

| Grid Dimension | Total Cells (Area) | Map Gen Time (ms) | Time Increase Factor | Assets Spawned |
| :---- | :---- | :---- | :---- | :---- |
| 50 x 50 | 2,500 | 22.10 | 1x  | 2E / 6C |
| 75 x 75 | 5,625 | 134.20 | \~6x | 2E / 6C |
| 100 x 100 | 10,000 | 414.60 | \~19x | 2E / 6C |

<div align="center">

*figure(12): Graph mapping generation time over various grid size and asset count*

</div>


The performance penalty based on increased grid size is evident, leading to almost 19x in time taken to generate the map when taken to the extremes. Increase in artifacts and collectables though had a much more negligible effect on the performance.

For the advanced section of this coursework, I brought the NPCs modeled in the first section into the procedural environment from Section 2, spawning them in waves. To satisfy the requirement for asymmetric combat, I implemented a probability based aiming system for the bots. Instead of shooting directly at the player every time, I added a *`missChance`* variable. When a bot calculates the angle to the player, this variable adds a random deviation to the shot. A high *`missChance`* means a wide spray, while a low *`missChance`* results in a highly accurate shot. Different bots have different values so they are asymmetric.

<div align="center">

![][image13]
*figure(13): Probabilistic accuracy shooting*

</div>

In addition to this, the game environment is dynamic because the artifacts are not just for the player. If a bot gets a shield or speed buff, they become a much bigger threat. This adds another asymmetric layer to the gameplay, where the player has to race against the bots to secure resources.

I also implemented group formation and specific agent roles. As discussed previously, the Knight is a basic aggressive unit, the rooks are programmed with self preservation whereby any initial contact with them results in them trying to find allies before engaging and when they do, they attempt to swarm the player together. Finally the bishop is a support character where it possesses a lower fire rate but emits an area of effect buff that multiplies the fire rate and damage of all allies that are next to it. This hierarchy forces the player to engage with enemies in different ways and adds an element of strategy to the game.

# References

Perlin noise implementation : [https://joeiddon.github.io/perlin/](https://joeiddon.github.io/perlin/)   
Unity a\* path finding tutorial : [https://www.youtube.com/watch?v=alU04hvz6L4](https://www.youtube.com/watch?v=alU04hvz6L4) 

For this project, I chose to implement the game using LittleJS, a lightweight JavaScript engine, rather than Unity. This decision was based on my strong familiarity with JavaScript and a desire to challenge myself by learning a recently released engine. Because LittleJS is very new, I relied on its official documentation and examples to implement the core features, such as the scene managers and the tile-map loading logic.

Using this engine meant that I could not use pre built tools like Unity’s NavMesh. Instead, I had to implement the A\* and BFS pathfinding algorithms from scratch. This gave me complete control over the AI logic and allowed me to tightly integrate the pathfinding with the procedural terrain generation.

Little JS official repository : [https://github.com/KilledByAPixel/LittleJS](https://github.com/KilledByAPixel/LittleJS)


[image1]: docs/image01.png

[image2]: docs/image02.png

[image3]: docs/image03.png

[image4]: docs/image04.png

[image5]: docs/image05.png

[image6]: docs/image06.png

[image7]: docs/image07.png

[image8]: docs/image08.png

[image9]: docs/image09.png

[image10]: docs/image10.png

[image11]: docs/image11.png

[image12]: docs/image12.png

[image13]: docs/image13.png

[image14]: docs/image14.png
