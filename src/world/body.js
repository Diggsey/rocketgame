// @flow
import Isometry, {type TIsometry} from '../vecmath/isometry.js'
import Shape, {type MassInfo} from './shape.js'
import Point, {type TPoint} from '../vecmath/point.js'
import Vector, {type TVector} from '../vecmath/vector.js'
import { EPSILON } from '../vecmath/types.js'
import Rotation from '../vecmath/rotation.js'

export default class Body {
    loc: TIsometry
    linVel: TVector
    angVel: number
    linAcc: TVector
    angAcc: number

    shapes: Shape[]
    massInfo: MassInfo

    constructor() {
        this.loc = Isometry.IDENTITY
        this.linVel = Vector.ZERO
        this.angVel = 0.0
        this.linAcc = Vector.ZERO
        this.angAcc = 0.0
        this.shapes = []
        this.massInfo = {
            mass: 1.0,
            com: Point.ORIGIN,
            moi: 1.0,
        }
    }

    setMassInfo(massInfo: MassInfo, conserveMomentum: boolean = true) {
        if (conserveMomentum) {
            // Update mass info, preserving linear and angular momentum
            const angScale = this.massInfo.moi / massInfo.moi
            const linScale = this.massInfo.mass / massInfo.mass

            this.angVel *= angScale
            this.angAcc *= angScale
            this.linVel = Vector.mul(this.linVel, linScale)
            this.linAcc = Vector.mul(this.linAcc, linScale)
        }
        this.massInfo = massInfo
    }

    recomputeMassInfo(conserveMomentum: boolean = true) {
        const massInfos = this.shapes.map(shape => shape.computeMassInfo())

        let mass = 0.0
        let accumCom = [0, 0]
        for (let m of massInfos) {
            mass += m.mass
            accumCom[0] += m.mass*m.com[0]
            accumCom[1] += m.mass*m.com[1]
        }

        if (mass < EPSILON) {
            throw "Mass is too small"
        }

        let invMass = 1.0/mass
        const com = Point.n(accumCom[0] * invMass, accumCom[1] * invMass)

        let moi = 0.0
        for (let m of massInfos) {
            const offset = Point.sub(m.com, com)
            moi += m.moi + m.mass * Vector.lenSq(offset)
        }

        if (moi < EPSILON) {
            throw "Moment of inertia is too small"
        }

        this.setMassInfo({
            mass,
            com,
            moi,
        }, conserveMomentum)
    }

    step(dt: number) {
        const hdt2 = dt*dt*0.5
        const oldPos = this.loc[0]
        const oldRot = this.loc[1]
        const oldRotCom = Rotation.xf(oldRot, this.massInfo.com)

        // Integrate angular velocity and acceleration assuming constant acceleration
        let angle = Rotation.angle(oldRot)
        angle += this.angVel*dt + this.angAcc*hdt2
        this.angVel += this.angAcc*dt
        this.angAcc = 0.0

        // Integrate linear velocity and acceleration assuming constant acceleration
        let pos = Point.add(oldRotCom, oldPos)
        pos = Point.addMul2(pos, this.linVel, dt, this.linAcc, hdt2)
        this.linVel = Vector.addMul(this.linVel, this.linAcc, dt)
        this.linAcc = Vector.ZERO

        const newRot = Rotation.fromAngle(angle)
        const newRotCom = Rotation.xf(newRot, this.massInfo.com)
        this.loc = Isometry.n(Point.sub(pos, newRotCom), newRot)
    }

    getCom(): TPoint {
        return Isometry.xfPoint(this.loc, this.massInfo.com)
    }

    applyForceThroughCom(force: TVector) {
        this.linAcc = Vector.addMul(this.linAcc, force, 1.0/this.massInfo.mass)
    }

    applyLocalForceThroughCom(force: TVector) {
        this.applyForceThroughCom(Isometry.xfVec(this.loc, force))
    }

    applyTorque(torque: number) {
        this.angAcc += torque/this.massInfo.moi
    }

    applyForce(pos: TPoint, force: TVector) {
        const offset = Point.sub(pos, this.getCom())
        this.applyForceThroughCom(force)
        this.applyTorque(Vector.cross(offset, force))
    }

    applyLocalForce(pos: TPoint, force: TVector) {
        const offset = Point.sub(pos, this.massInfo.com)
        this.applyLocalForceThroughCom(force)
        this.applyTorque(Vector.cross(offset, force))
    }

    draw(context: CanvasRenderingContext2D) {
        context.save()
        Isometry.applyToCtx(this.loc, context)
        for (let shape of this.shapes) {
            shape.draw(context)
        }
        context.restore()
    }
}