// @flow
export opaque type TVector: [number, number] = [number, number]
export opaque type TPoint: [number, number] = [number, number]
export opaque type TRotation: [number, number] = [number, number]
export opaque type TIsometry: [TVector, TRotation] = [TVector, TRotation]
export opaque type TRect: [TPoint, TPoint] = [TPoint, TPoint]

type VectorCast = [number, number] => (TPoint & TVector & TRotation)
type IsometryCast = [TVector, TRotation] => TIsometry
type RectCast = [TPoint, TPoint] => TRect

type CastFn = VectorCast & IsometryCast & RectCast

function innerCast<T>(x: T): T {
    return x
}

export const cast: CastFn = innerCast

export const EPSILON: number = 1e-6
