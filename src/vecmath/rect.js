// @flow

import {cast, type TRect} from './types.js'
export type {TRect} from './types.js'
import Vector, {type TVector} from './vector.js'
import Point, {type TPoint} from './point.js'


export default class Rect {
    static n(min: TPoint, max: TPoint): TRect {
        return cast([min, max])
    }

    static fromSize(min: TPoint, size: TVector): TRect {
        return Rect.n(min, Point.add(min, size))
    }

    static fromCentered(pos: TPoint, size: TVector): TRect {
        return Rect.n(Point.addMul(pos, size, -0.5), Point.addMul(pos, size, 0.5))
    }

    static translate(a: TRect, b: TVector): TRect {
        return Rect.n(Point.add(a[0], b), Point.add(a[1], b))
    }

    static containsPoint(a: TRect, b: TPoint): boolean {
        return b[0] >= a[0][0] && b[0] < a[1][0] 
            && b[1] >= a[0][1] && b[1] < a[1][1]
    }

    static intersection(a: TRect, b: TRect): TRect {
        return Rect.n(
            Point.n(Math.max(a[0][0], b[0][0]), Math.max(a[0][1], b[0][1])),
            Point.n(Math.min(a[1][0], b[1][0]), Math.min(a[1][1], b[1][1])),
        )
    }

    static isEmpty(a: TRect): boolean {
        return a[1][0] <= a[0][0] || a[1][1] <= a[0][1]
    }

    static bounding(a: TRect, b: TRect): TRect {
        return Rect.n(
            Point.n(Math.min(a[0][0], b[0][0]), Math.min(a[0][1], b[0][1])),
            Point.n(Math.max(a[1][0], b[1][0]), Math.max(a[1][1], b[1][1])),
        )
    }

    static size(a: TRect): TVector {
        return Point.sub(a[1], a[0])
    }

    static width(a: TRect): number {
        return a[1][0] - a[0][0]
    }
    static height(a: TRect): number {
        return a[1][1] - a[0][1]
    }
}
