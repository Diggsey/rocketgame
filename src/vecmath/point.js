// @flow
import {cast, type TPoint} from './types.js'
export type {TPoint} from './types.js'
import Vector, {type TVector} from './vector.js'


export default class Point {
    static ORIGIN: TPoint = Point.n(0, 0)

    static n(x: number, y: number): TPoint {
        return cast([x, y])
    }

    static add(a: TPoint, b: TVector): TPoint {
        return Point.n(a[0] + b[0], a[1] + b[1])
    }
    static sub: ((TPoint, TPoint) => TVector) & ((TPoint, TVector) => TPoint) = (a, b) => {
        return cast([a[0] - b[0], a[1] - b[1]])
    }
    static lerp(a: TPoint, b: TPoint, c: number): TPoint {
        const ic = 1.0 - c
        return Point.n(a[0]*c + b[0]*ic, a[1]*c + b[1]*ic)
    }
    static addMul(a: TPoint, b: TVector, c: number): TPoint {
        return Point.n(a[0] + b[0]*c, a[1] + b[1]*c)
    }
    static addMul2(a: TPoint, b: TVector, c: number, d: TVector, e: number): TPoint {
        return Point.n(a[0] + b[0]*c + d[0]*e, a[1] + b[1]*c + d[1]*e)
    }
}
