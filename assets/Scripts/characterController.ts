import {
  _decorator,
  Component,
  director,
  Input,
  instantiate,
  lerp,
  Node,
  NodePool,
  Prefab,
  random,
  randomRange,
  randomRangeInt,
  UITransform,
  Vec3, game
} from "cc";

const { ccclass, property } = _decorator;
let birdBounce: boolean = false;
let hurdleStart: boolean = false;
let birdAngle: boolean = false;
let stopHurdleGeneration = false;
let scored = 0;
let score: number = 0;
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
  @property
  startCollisionDetector = false;

  @property({ type: Node })
  gameover: Node = null;

  onLoad() {
    this.node.on(Input.EventType.TOUCH_START, this.birdController, this);

    this.putNodesOnNodePool();
    // director.preloadScene("Start");
    this.node.children[4].active = false;
    // this.gameover.on(Input.EventType.TOUCH_START, this.loadStartScene)

  }

  loadStartScene() {

    director.loadScene("Start");
  }
  putNodesOnNodePool() {
    this.hurdlePool = new NodePool();
    let init = 5;
    for (let i = 0; i < init; i++) {
      let hurdleInstance = instantiate(this.hurdle);
      hurdleInstance.name = "hurdleName"
      this.hurdlePool.put(hurdleInstance);

    }
    // this.createHurdle();

    this.hurdleReRenderFlag = true;
  }

  start() { this.scheduleOnce(this.scheduleCreateHurdle, 2); }

  scheduleCreateHurdle = () => {


    let num = randomRange(1, 3)
    if (!stopHurdleGeneration) {
      this.createHurdle();
      setTimeout(this.scheduleCreateHurdle, num * 1000)
    }

    // this.unschedule(this.scheduleCreateHurdle);
    // console.log("hello");

    // this.scheduleOnce(this.scheduleCreateHurdle, 3);
  }

  createHurdle() {
    this.startCollisionDetector = true;
    if (this.hurdlePool.size() > 0) {
      this.hurdle_NodePool = this.hurdlePool.get();
      let pos = this.hurdle_NodePool.getPosition();
      let canvasWidth = this.node.getComponent(UITransform).contentSize.width;

      let hurdleWidth = this.hurdle_NodePool.getComponent(UITransform).width;
      pos.x = (canvasWidth * 0.5 + hurdleWidth * 0.5);
      pos.y = randomRangeInt(-10, 10) * 10;
      this.hurdle_NodePool.setPosition(pos);
      this.node.getChildByName("Hurdle").addChild(this.hurdle_NodePool);

      // this.hurdlePool.put(this.hurdle_NodePool);
    }

    console.log("create hurdle chal riha");

    hurdleStart = true;
  }



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
      let hurdleChildrenArray = this.node.getChildByName("Hurdle").children
      // for (let i = 0; i < hurdleSize - 1; i++) 
      // {
      hurdleChildrenArray.forEach((hurdleElement) => {
        if (hurdleElement.name == "hurdleName") {
          let node = hurdleElement;
          let hurdleUp_1: Vec3 = node.getPosition();
          hurdleUp_1.x = hurdleUp_1.x - 200 * deltaTime;
          node.setPosition(hurdleUp_1);
          let canvasWidth = this.node.getComponent(UITransform).contentSize.width;

          let hurdleWidth = node.getComponent(UITransform).width;
          if (node.getPosition().x < ((-1 * (canvasWidth) * 0.5)) - (hurdleWidth / 2)) {
            this.hurdlePool.put(node);
          }
        }
      })

    }

  }


  //COLLISION DETECTION

  collisionDetector() {

    let hurdleArray = this.node.getChildByName("Hurdle").children;

    // let hurdleUpBoundingBox = this.node.getChildByName("Hurdle").getChildByName("hurdleName").getChildByName("hurdleUp").getComponent(UITransform).getBoundingBoxToWorld();
    // let hurdleDownBoundingBox = this.node.getChildByName("Hurdle").getChildByName("hurdleName").getChildByName("hurdleDown").getComponent(UITransform).getBoundingBoxToWorld();
    let birdBoundingBox = this.node.children[2].children[0].getComponent(UITransform).getBoundingBoxToWorld();
    let scoreNodeBoundingBox = this.node.getChildByName("Hurdle").getChildByName("hurdleName").children[2].getComponent(UITransform).getBoundingBoxToWorld();

    hurdleArray.forEach((e) => {
      if (e.name == "hurdleName") {
        let hurdleUpBoundingBox = e.getChildByName("hurdleUp").getComponent(UITransform).getBoundingBoxToWorld();
        let hurdleDownBoundingBox = e.getChildByName("hurdleDown").getComponent(UITransform).getBoundingBoxToWorld();
        if (birdBoundingBox.intersects(hurdleDownBoundingBox)) {
          console.log("collision with Down hurdle detected");
          // director.loadScene("GameOver");
          this.node.children[4].active = true;
          this.startCollisionDetector = false;
          stopHurdleGeneration = true;
          game.pause();


        }
        if (birdBoundingBox.intersects(hurdleUpBoundingBox)) {
          console.log("collision with up hurdle detected");
          this.node.children[4].active = true;
          this.startCollisionDetector = false;
          stopHurdleGeneration = true;
          game.pause();


        }

        if (birdBoundingBox.intersects(scoreNodeBoundingBox)) {

          this.node.getChildByName("Hurdle").getChildByName("hurdleName").children[2].active = false;
          score++;
          console.log(score);
          // game.pause()





        }
      }
    })


  }



  update(deltaTime: number) {
    // if (this.hurdleReRenderFlag) {
    //   this.createHurdle();
    // }
    if (this.startCollisionDetector) {
      this.hurdleMovement(deltaTime);
      this.goDown(deltaTime);
    }

    if (this.startCollisionDetector) { this.collisionDetector(); }
  }

}
