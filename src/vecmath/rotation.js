// @flow
import {cast, EPSILON, type TRotation} from './types.js'
export type {TRotation} from './types.js'
import Vector, {type TVector} from './vector.js'
import Point, {type TPoint} from './point.js'


// Rotation represented as a unitary complex number
export default class Rotation {
    static IDENTITY: TRotation = Rotation.n(1, 0)

    static n(re: number, im: number): TRotation {
        return cast([re, im])
    }

    static fromAngle(angle: number): TRotation {
        return Rotation.n(Math.cos(angle), Math.sin(angle))
    }

    static angle(a: TRotation): number {
        return Math.atan2(a[1], a[0])
    }

    static mul(a: TRotation, b: TRotation): TRotation {
        return Rotation.n(a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0])
    }

    static inverse(a: TRotation): TRotation {
        return Rotation.n(a[0], -a[1])
    }

    static perp(a: TRotation): TRotation {
        return cast(Vector.perp(cast(a)))
    }

    static xf: ((TRotation, TVector) => TVector) & ((TRotation, TPoint) => TPoint) = (a, b) => {
        return cast([a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]])
    }

    static unxf: ((TRotation, TVector) => TVector) & ((TRotation, TPoint) => TPoint) = (a, b) => {
        return cast([a[0] * b[0] + a[1] * b[1], a[0] * b[1] - a[1] * b[0]])
    }

    static xfNeg(a: TRotation, b: TVector): TVector {
        return cast([a[1] * b[1] - a[0] * b[0], -a[0] * b[1] - a[1] * b[0]])
    }

    static unxfNeg(a: TRotation, b: TVector): TVector {
        return cast([-a[0] * b[0] - a[1] * b[1], a[1] * b[0] - a[0] * b[1]])
    }

    static renorm(a: TRotation): TRotation {
        const va: TVector = cast(a)
        const lenSq = Vector.lenSq(va)
        if (Math.abs(lenSq - 1.0) > EPSILON) {
            return cast(Vector.div(va, Math.sqrt(lenSq)))
        } else {
            return a
        }
    }

    static slerp(a: TRotation, b: TRotation, t: number): TRotation {
        const dp = Vector.dot(cast(a), cast(b))
        // Same direction
        if (dp < EPSILON) {
            return cast(Vector.lerp(cast(a), cast(b), t))
        }
        // Opposite direction
        if (dp > 1.0 - EPSILON) {
            return Rotation.slerp(a, Rotation.perp(b), t*2.0)
        }

        const theta = Math.acos(dp)
        const invDet = 1.0/Math.sin(theta)

        const p0 = invDet*Math.sin((1.0 - t)*theta)
        const p1 = invDet*Math.sin(t*theta)

        return Rotation.n(p0*a[0] + p1*b[0], p0*a[1] + p1*b[1])
    }
}
