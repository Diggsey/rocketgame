// @flow
import {cast, type TIsometry} from './types.js'
export type {TIsometry} from './types.js'
import Rotation, {type TRotation} from './rotation.js'
import Vector, {type TVector} from './vector.js'
import Point, {type TPoint} from './point.js'

export default class Isometry {
    static IDENTITY: TIsometry = Isometry.n(Vector.ZERO, Rotation.IDENTITY)

    static n(trn: TVector, rot: TRotation): TIsometry {
        return cast([trn, rot])
    }

    static xfVec(a: TIsometry, b: TVector): TVector {
        return Rotation.xf(a[1], b)
    }

    static xfPoint(a: TIsometry, b: TPoint): TPoint {
        return Point.add(Rotation.xf(a[1], b), a[0])
    }

    static unxfVec(a: TIsometry, b: TVector): TVector {
        return Rotation.unxf(a[1], b)
    }

    static unxfPoint(a: TIsometry, b: TPoint): TPoint {
        return Rotation.unxf(a[1], Point.sub(b, a[0]))
    }

    static inverse(a: TIsometry): TIsometry {
        return Isometry.n(Rotation.unxfNeg(a[1], a[0]), Rotation.inverse(a[1]))
    }
    static applyToCtx(a: TIsometry, b: CanvasRenderingContext2D) {
        b.transform(a[1][0], a[1][1], -a[1][1], a[1][0], a[0][0], a[0][1])
    }
    static applyInverseToCtx(a: TIsometry, b: CanvasRenderingContext2D) {
        Isometry.applyToCtx(Isometry.inverse(a), b)
    }
}
