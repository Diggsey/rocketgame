// @flow
import Shape, {type MassInfo, type ShapeArgs} from '../shape.js'
import Point from '../../vecmath/point.js'
import Vector, {type TVector} from '../../vecmath/vector.js'

type BoxArgs = ShapeArgs & {
    +density?: number,
    +size: TVector,
}

export default class Box extends Shape {
    density: number
    size: TVector

    constructor({density = 1.0, size, ...other}: BoxArgs = {}) {
        super(other)
        this.density = density
        this.size = size
    }

    computeLocalMassInfo(): MassInfo {
        const mass = this.size[0] * this.size[1] * this.density
        return {
            com: Point.ORIGIN,
            mass,
            moi: mass*Vector.lenSq(this.size)/12.0,
        }
    }

    drawLocal(context: CanvasRenderingContext2D) {
        context.beginPath()
        context.rect(this.size[0]*-0.5, this.size[1]*-0.5, this.size[0], this.size[1])
        context.stroke()
    }
}
