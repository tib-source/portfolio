import { GAME_WIDTH } from "../chaze";
import SceneManager from "../sceneManager";
import Scene from "./scene";
import * as LJS from "littlejsengine"

export default class Main extends Scene {
    active: number;
    options: any[]
    sm: SceneManager;
    startTime: number;
    constructor(sm: SceneManager){
        super(sm)
        this.active = 0
        this.options = []
        this.sm = sm
        this.startTime = Date.now()
    }

  enter() {
    this.startTime = Date.now()
    let levelSize = LJS.vec2();
    LJS.setCameraPos(levelSize.scale(.5));
    let center = GAME_WIDTH / 2;

    this.options = [
      ['Level 1', LJS.vec2(center, 600), 'Maze'],
      ['Level 2', LJS.vec2(center, 650), 'Chaze'],
    ];
    this.active = 0;
  }

  update() {
    super.update();
    let dir = '';

    if (LJS.keyWasPressed('ArrowUp') || dir === 'up') {
      this.active -= 1;
    } else if (LJS.keyWasPressed('ArrowDown') || dir === 'down') {
      this.active += 1;
    }

    if (this.active < 0) { this.active = this.options.length - 1; }
    if (this.active > this.options.length - 1) { this.active = 0; }

    if (LJS.keyWasPressed('Space') || LJS.keyWasPressed('KeyX') || LJS.gamepadWasPressed(0) || LJS.gamepadWasPressed(2)) {
      let scene = this.options[this.active][2];
      this.sm.changeScene(scene);
    }
  }

  render() {
    let center = GAME_WIDTH / 2;

  const now = Date.now();
  const t = now * 0.003;
  const breathe = 0.5 + Math.sin(now * 0.006) * 0.5;

  // Fade-in
  const fade = Math.min(1, (now - this.startTime) * 0.0015);


  // -------------------------------
  // HERO IMAGE (LEFT SIDE)
  // -------------------------------
  const heroBase = LJS.vec2(center - 300, 380);
  const floatOffset = Math.sin(t) * 10;
  const heroSize = LJS.vec2(360, 360);

//   LJS.drawImage(
//     this.heroImg,
//     heroBase.add(LJS.vec2(0, floatOffset)),
//     heroSize
//   );


  // -------------------------------
  // TITLE
  // -------------------------------

  const glowAlpha = 0.2 + breathe * 0.4;
  const glowColor = LJS.rgb(100, 69, 71, glowAlpha);

  // Shadow
  LJS.drawTextScreen(
    "CHAZE",
    LJS.vec2(center + 3, 223),
    200,
    LJS.rgb(100, 69, 71, 0.45),
    20,
    LJS.rgb(100, 69, 71, 0.45),
    "center",
  );

  // Glow text
  LJS.drawTextScreen(
    "CHAZE",
    LJS.vec2(center, 220),
    200,
    glowColor
  );

  this.options.forEach((o, i) => {

    const pos = o[1];
    const isActive = this.active === i;

    // Drop shadow
    LJS.drawTextScreen(o[0], pos.add(LJS.vec2(0, 3)), 50, LJS.rgb(0, 0, 0, 0.4));

    // Base text
    LJS.drawTextScreen(o[0], pos, 50, LJS.rgb(255, 255, 255));

    if (isActive) {

      // Breathing highlight color
      const bright = Math.floor(150 + breathe * 105);
      const activeCol = LJS.rgb(255, bright, 100);

      // Scale effect
      const scale = 1 + breathe * 0.05;
      LJS.drawTextScreen(o[0], pos, 50 * scale, activeCol);

      // Animated underline
      const underlineWidth = 150 + Math.sin(t) * 30;

      LJS.drawRect(
        pos.add(LJS.vec2(-underlineWidth / 2, 40)),
        LJS.vec2(underlineWidth, 5),
        activeCol
      );
    }
  });

 }
}