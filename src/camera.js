// @flow
import World from './world'
import Isometry, {type TIsometry} from './vecmath/isometry'
import Vector, {type TVector} from './vecmath/vector'
import Point, {type TPoint} from './vecmath/point'
import Rect, {type TRect} from './vecmath/rect'

type CameraArgs = {
    +world: World,
    +loc?: TIsometry,
    +size?: TVector,
    +viewport?: TRect,
}

const DEFAULT_CAMERA_SIZE = Vector.n(40, 30)
const DEFAULT_VIEWPORT = Rect.n(Point.ORIGIN, Point.n(1024, 768))

export default class Camera {
    world: World
    loc: TIsometry
    size: TVector
    viewport: TRect

    constructor({
        world,
        loc=Isometry.IDENTITY,
        size=DEFAULT_CAMERA_SIZE,
        viewport=DEFAULT_VIEWPORT
    }: CameraArgs) {
        this.world = world
        this.loc = loc
        this.size = size
        this.viewport = viewport
    }

    setViewportFromCanvas(canvas: HTMLCanvasElement, adjustAspectRatio: boolean=true) {
        this.viewport = Rect.n(Point.ORIGIN, Point.n(canvas.width, canvas.height))
        if (adjustAspectRatio) {
            const aspectRatio = canvas.width / canvas.height
            this.size = Vector.n(aspectRatio * this.size[1], this.size[1])
        }
    }

    draw(context: CanvasRenderingContext2D) {
        context.clearRect(
            this.viewport[0][0], this.viewport[0][1],
            Rect.width(this.viewport), Rect.height(this.viewport)
        )
        context.save()
        context.translate(this.viewport[0][0], this.viewport[0][1])
        context.scale(Rect.width(this.viewport)/this.size[0], Rect.height(this.viewport)/this.size[1])
        context.translate(this.size[0]*0.5, this.size[1]*0.5)
        Isometry.applyInverseToCtx(this.loc, context)
        this.world.draw(context)
        context.restore()
    }
}
