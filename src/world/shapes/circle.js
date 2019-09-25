// @flow
import Shape, {type MassInfo, type ShapeArgs} from '../shape.js'
import Point from '../../vecmath/point.js'

type CircleArgs = ShapeArgs & {
    +density?: number,
    +radius: number
}

export default class Circle extends Shape {
    density: number
    radius: number

    constructor({density = 1.0, radius, ...other}: CircleArgs = {}) {
        super(other)
        this.density = density
        this.radius = radius
    }

    computeLocalMassInfo(): MassInfo {
        const r2 = this.radius * this.radius
        const mass = Math.PI * r2 * this.density
        return {
            com: Point.ORIGIN,
            mass,
            moi: mass*r2*0.5,
        }
    }

    drawLocal(context: CanvasRenderingContext2D) {
        context.beginPath()
        context.ellipse(0, 0, this.radius, this.radius, 0.0, 0.0, Math.PI*2.0)
        context.stroke()
    }
}
