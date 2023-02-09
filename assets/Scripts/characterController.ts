import {
  _decorator,
  Component,
  Input,
  instantiate,
  lerp,
  Node,
  NodePool,
  Prefab,
  random,
  randomRangeInt,
  UITransform,
  Vec3,
} from "cc";

const { ccclass, property } = _decorator;
let birdBounce: boolean = false;
let hurdleStart: boolean = false;
let birdAngle: boolean = false;

@ccclass("characterController")
export class characterController extends Component {
  @property({ type: Node })
  flappyBird: Node = null;
  @property({ type: Prefab })
  hurdle: Prefab = null;
  @property
  hurdlePool = null;
  @property
  hurdle_NodePool = null;
  @property
  hurdleReRenderFlag = false;


  onLoad() {
    this.node.on(Input.EventType.TOUCH_START, this.birdController, this);
    this.putNodesOnNodePool();

  }

  scheduleCreateHurdle() {
    this.createHurdle();
  }
  putNodesOnNodePool() {
    this.hurdlePool = new NodePool();
    let init = 5;
    for (let i = 0; i < init; i++) {
      let hurdleInstance = instantiate(this.hurdle);
      this.hurdlePool.put(hurdleInstance);

    }
    this.hurdleReRenderFlag = true;
  }

  createHurdle() {
    if (this.hurdlePool.size() > 0) {
      this.hurdle_NodePool = this.hurdlePool.get();
      let pos = this.hurdle_NodePool.getPosition();
      let canvasWidth = this.node.getComponent(UITransform).contentSize.width;

      let hurdleWidth = this.hurdle_NodePool.getComponent(UITransform).width;
      pos.x = (canvasWidth * 0.5 + hurdleWidth * 0.5)  //* randomRangeInt(1, 5);
      pos.y = randomRangeInt(-5, 5) * 10;
      this.hurdle_NodePool.setPosition(pos);
      this.node.getChildByName("Hurdle").addChild(this.hurdle_NodePool);

      // this.hurdlePool.put(this.hurdle_NodePool);
    }

    console.log("create hurdle chal riha");

    hurdleStart = true;
  }

  start() { this.schedule(this.scheduleCreateHurdle, 0.8); }

  birdController() {
    hurdleStart = true;
    let birdOldPosition: Vec3 = this.flappyBird.getPosition();

    birdOldPosition.y = birdOldPosition.y + 50;
    let birdNewPostion: Vec3 = birdOldPosition;
    this.flappyBird.angle = 15;
    this.flappyBird.setPosition(birdNewPostion);
    birdBounce = true;

    setTimeout(() => {
      birdAngle = true;
    }, 100);


  }



  goDown = (deltaTime) => {
    if (birdAngle == false) {
      this.flappyBird.angle = -30;
    }
    let birdOldPosition: Vec3 = this.flappyBird.getPosition();
    let canvasSize = this.node.getComponent(UITransform).contentSize.height;
    let birdHeight = (this.node.getComponent(characterController).flappyBird.getComponent(UITransform).contentSize.height) / 2 + 3;

    if (birdBounce == true &&
      Math.floor(birdOldPosition.y) >
      -1 * Math.ceil(canvasSize / 2) + birdHeight
    ) {


      lerp(birdOldPosition.y, birdOldPosition.y - 20, 0.01);
      birdOldPosition.y = birdOldPosition.y - 150 * deltaTime;
      let birdNewPostion: Vec3 = birdOldPosition;
      this.flappyBird.setPosition(birdNewPostion);

      if (Math.floor(birdOldPosition.y) == -1 * Math.ceil(canvasSize / 2) + birdHeight) {
        birdBounce = false;
      }
    }
  };

  hurdleMovement(deltaTime) {
    this.flappyBird.angle = -10;
    if (hurdleStart) {
      let hurdleSize = this.node.getChildByName("Hurdle").children.length;
      for (let i = 0; i < hurdleSize - 1; i++) {
        let node = this.node.getChildByName("Hurdle").children[i];
        let hurdleUp_1: Vec3 = node.getPosition();
        hurdleUp_1.x = hurdleUp_1.x - 200 * deltaTime;
        node.setPosition(hurdleUp_1);
        let canvasWidth = this.node.getComponent(UITransform).contentSize.width;

        let hurdleWidth = node.getComponent(UITransform).width;
        if (node.getPosition().x < ((-1 * (canvasWidth) * 0.5)) - (hurdleWidth / 2)) {
          this.hurdlePool.put(node);
        }
      }
    }
  }

  update(deltaTime: number) {
    // if (this.hurdleReRenderFlag) {
    //   this.createHurdle();
    // }

    this.hurdleMovement(deltaTime);
    this.goDown(deltaTime);
  }

}
