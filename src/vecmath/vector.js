// @flow
import {cast, type TVector} from './types.js'
export type {TVector} from './types.js'

export default class Vector {
    static ZERO: TVector = Vector.n(0, 0)

    static n(x: number, y: number): TVector {
        return cast([x, y])
    }

    static add(a: TVector, b: TVector): TVector {
        return Vector.n(a[0] + b[0], a[1] + b[1])
    }
    static sub(a: TVector, b: TVector): TVector {
        return Vector.n(a[0] - b[0], a[1] - b[1])
    }
    static neg(a: TVector): TVector {
        return Vector.n(-a[0], -a[1])
    }
    static dot(a: TVector, b: TVector): number {
        return a[0] * b[0] + a[1] * b[1]
    }
    static perp(a: TVector): TVector {
        return Vector.n(-a[1], a[0])
    }
    static lenSq(a: TVector): number {
        return Vector.dot(a, a)
    }
    static len(a: TVector): number {
        return Math.sqrt(Vector.lenSq(a))
    }
    static mul(a: TVector, b: number): TVector {
        return Vector.n(a[0] * b, a[1] * b)
    }
    static div(a: TVector, b: number): TVector {
        return Vector.mul(a, 1.0/b)
    }
    static norm(a: TVector): TVector {
        return Vector.div(a, Vector.len(a))
    }
    static lerp(a: TVector, b: TVector, c: number): TVector {
        const ic = 1.0 - c
        return Vector.n(a[0]*c + b[0]*ic, a[1]*c + b[1]*ic)
    }
    static addMul(a: TVector, b: TVector, c: number): TVector {
        return Vector.n(a[0] + b[0]*c, a[1] + b[1]*c)
    }
    static cross(a: TVector, b: TVector): number {
        return a[0]*b[1] - a[1]*b[0]
    }
}
