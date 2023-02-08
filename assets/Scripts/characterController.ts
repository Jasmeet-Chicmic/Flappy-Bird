import {
  _decorator,
  Component,
  Input,
  lerp,
  Node,
  UITransform,
  Vec3,
} from "cc";
const { ccclass, property } = _decorator;
let birdBounce: boolean = false;
let hurdleStart: boolean = false;
@ccclass("characterController")
export class characterController extends Component {
  @property({ type: Node })
  flappyBird: Node = null;

  @property({ type: Node })
  hurdleUp_1: Node = null;

  @property({ type: Node })
  hurdleDown_1: Node = null;

  @property({ type: Node })
  hurdleUp_2: Node = null;

  @property({ type: Node })
  hurdleDown_2: Node = null;

  @property
  onLoad() {
    this.node.on(Input.EventType.TOUCH_START, this.birdController, this);
  }
  start() {}
  birdController() {
    hurdleStart = true;
    let birdOldPosition: Vec3 = this.flappyBird.getPosition();
    // lerp(birdOldPosition.y, birdOldPosition.y + 100, 0.2);
    birdOldPosition.y = birdOldPosition.y + 50;
    let birdNewPostion: Vec3 = birdOldPosition;
    this.flappyBird.angle = 15;
    // lerp(birdOldPosition.y, birdOldPosition.y + 50, 0.4);
    this.flappyBird.setPosition(birdNewPostion);
    // console.log(birdNewPostion);

    birdBounce = true;
    // setTimeout(this.setGoDownScheduler, 100);
    // this.setGoDownScheduler();
  }

  //   setGoDownScheduler = () => {
  //     this.flappyBird.angle = -30;
  //     this.schedule(this.goDown, 0.1);
  //   };

  goDown = (deltaTime) => {
    this.flappyBird.angle = -30;
    let birdOldPosition: Vec3 = this.flappyBird.getPosition();
    let canvasSize = this.node.getComponent(UITransform).contentSize.height;
    let birdHeight =
      this.node
        .getComponent(characterController)
        .flappyBird.getComponent(UITransform).contentSize.height /
        2 +
      3;

    if (
      birdBounce == true &&
      Math.floor(birdOldPosition.y) >
        -1 * Math.ceil(canvasSize / 2) + birdHeight
    ) {
      //   console.log((-1 * canvasSize) / 2);
      console.log(Math.floor(birdOldPosition.y));

      console.log(-1 * Math.ceil(canvasSize / 2) + birdHeight);

      lerp(birdOldPosition.y, birdOldPosition.y - 20, 0.01);
      birdOldPosition.y = birdOldPosition.y - 150 * deltaTime;
      let birdNewPostion: Vec3 = birdOldPosition;
      // this.flappyBird.angle = 0;
      this.flappyBird.setPosition(birdNewPostion);
      // console.log(birdNewPostion);
      // console.log(Math.floor(birdOldPosition.y));

      if (
        Math.floor(birdOldPosition.y) ==
        -1 * Math.ceil(canvasSize / 2) + birdHeight
      ) {
        // console.log("enter");

        // this.unschedule(this.goDown);
        birdBounce = false;
      }
    }
  };
  update(deltaTime: number) {
    if (hurdleStart == true) {
      let hurdleUp_1: Vec3 = this.hurdleUp_1.getPosition();
      hurdleUp_1.x = hurdleUp_1.x - 100 * deltaTime;
      this.hurdleUp_1.setPosition(hurdleUp_1);

      let hurdleDown_1: Vec3 = this.hurdleDown_1.getPosition();
      hurdleDown_1.x = hurdleDown_1.x - 100 * deltaTime;
      this.hurdleDown_1.setPosition(hurdleDown_1);

      if (hurdleUp_1.x < -500) {
        hurdleUp_1.x = 500;
        this.hurdleUp_1.setPosition(hurdleUp_1);
        hurdleDown_1.x = 500;
        this.hurdleDown_1.setPosition(hurdleDown_1);
      }

      let hurdleUp_2: Vec3 = this.hurdleUp_2.getPosition();
      hurdleUp_2.x = hurdleUp_2.x - 100 * deltaTime;
      this.hurdleUp_2.setPosition(hurdleUp_2);

      let hurdleDown_2: Vec3 = this.hurdleDown_2.getPosition();
      hurdleDown_2.x = hurdleDown_2.x - 100 * deltaTime;
      this.hurdleDown_2.setPosition(hurdleDown_2);

      if (hurdleUp_2.x < -500) {
        hurdleUp_2.x = 500;
        this.hurdleUp_2.setPosition(hurdleUp_2);
        hurdleDown_2.x = 500;
        this.hurdleDown_2.setPosition(hurdleDown_2);
      }
    }

    this.goDown(deltaTime);
    // let birdOldPosition:Vec3 = this.flappyBird.getPosition();
    // let canvasSize = this.node.getComponent(UITransform).contentSize.height;
    // let birdHeight = (this.node.getComponent(characterController).flappyBird.getComponent(UITransform).contentSize.height)/2;
    // if(birdBounce == true && Math.floor(birdOldPosition.y) !== (-1 * Math.ceil(canvasSize/2)) + birdHeight){
    //   console.log(-1 *canvasSize/2);
    //    setTimeout(()=>{ birdOldPosition.y = birdOldPosition.y - 10;
    //     let birdNewPostion:Vec3 = birdOldPosition;
    //     this.flappyBird.angle = 0;
    //     this.flappyBird.setPosition(birdNewPostion)
    //     console.log(birdNewPostion);
    //     console.log(Math.floor(birdOldPosition.y));
    //    },100);
    //    if( Math.floor(birdOldPosition.y) == (-1 * Math.ceil(canvasSize/2)) + birdHeight)
    //    {
    //     birdBounce = false;
    //    }
    // }
  }
}
