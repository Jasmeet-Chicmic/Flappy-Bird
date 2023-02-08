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
@ccclass("characterController")
export class characterController extends Component {
    @property({ type: Node })
    flappyBird: Node = null;
    onLoad() {
        this.node.on(Input.EventType.TOUCH_START, this.birdController, this);
    }
    start() { }
    birdController() {
        let birdOldPosition: Vec3 = this.flappyBird.getPosition();
        lerp(birdOldPosition.y, birdOldPosition.y + 100, 0.2);
        birdOldPosition.y = birdOldPosition.y + 100;
        let birdNewPostion: Vec3 = birdOldPosition;
        this.flappyBird.angle = 15;
        // lerp(birdOldPosition.y, birdOldPosition.y + 50, 0.4);
        this.flappyBird.setPosition(birdNewPostion);
        // console.log(birdNewPostion);

        birdBounce = true;
        setTimeout(this.setGoDownScheduler, 100);
    }

    setGoDownScheduler = () => {
        this.flappyBird.angle = -30;
        this.schedule(this.goDown, 0.1);
    };

    goDown = () => {
        let birdOldPosition: Vec3 = this.flappyBird.getPosition();
        let canvasSize = this.node.getComponent(UITransform).contentSize.height;
        let birdHeight =
            this.node
                .getComponent(characterController)
                .flappyBird.getComponent(UITransform).contentSize.height / 2;

        if (
            birdBounce == true &&
            Math.floor(birdOldPosition.y) !==
            -1 * Math.ceil(canvasSize / 2) + birdHeight
        ) {
            //   console.log((-1 * canvasSize) / 2);
            lerp(birdOldPosition.y, birdOldPosition.y - 20, 0.01);
            birdOldPosition.y = birdOldPosition.y - 20;
            let birdNewPostion: Vec3 = birdOldPosition;
            // this.flappyBird.angle = 0;
            this.flappyBird.setPosition(birdNewPostion);
            // console.log(birdNewPostion);
            // console.log(Math.floor(birdOldPosition.y));

            if (
                Math.floor(birdOldPosition.y) ==
                -1 * Math.ceil(canvasSize / 2) + birdHeight
            ) {
                this.unschedule(this.goDown);
                birdBounce = false;
            }
        }
    };
    update(deltaTime: number) {
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
