// @flow
import Isometry, {type TIsometry} from '../vecmath/isometry.js'
import Point, {type TPoint} from '../vecmath/point.js'

export type MassInfo = {|
    com: TPoint,
    mass: number,
    moi: number,
|}

export type ShapeArgs = {
    +loc?: TIsometry
}

export default class Shape {
    loc: TIsometry

    constructor({loc = Isometry.IDENTITY}: ShapeArgs = {}) {
        this.loc = Isometry.IDENTITY
    }

    computeMassInfo(): MassInfo {
        const result = this.computeLocalMassInfo()
        result.com = Isometry.xfPoint(this.loc, result.com)
        return result
    }

    computeLocalMassInfo(): MassInfo {
        throw "Not Implemented"
    }

    drawLocal(context: CanvasRenderingContext2D) {
        throw "Not Implemented"
    }

    draw(context: CanvasRenderingContext2D) {
        context.save()
        Isometry.applyToCtx(this.loc, context)
        this.drawLocal(context)
        context.restore()
    }
}
