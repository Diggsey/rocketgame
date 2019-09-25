// @flow
import Body from './body.js'

export default class World {
    bodies: Body[]

    constructor() {
        this.bodies = []
    }

    draw(context: CanvasRenderingContext2D) {
        for (let body of this.bodies) {
            body.draw(context)
        }
    }

    step(dt: number) {
        for (let body of this.bodies) {
            body.step(dt)
        }
    }
}