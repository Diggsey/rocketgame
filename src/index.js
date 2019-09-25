// @flow

import downcast from './utils/downcast.js'
import Point, {type TPoint} from './vecmath/point.js'
import Vector, {type TVector} from './vecmath/vector.js'
import Isometry, {type TIsometry} from './vecmath/isometry.js'
import World from './world/index.js'
import Camera from './camera.js'
import Body from './world/body.js'
import Box from './world/shapes/box.js'

const world = new World()
const camera = new Camera({world})
const canvas = downcast(HTMLCanvasElement, document.getElementById('canvas'))
const context = canvas.getContext('2d')

let lastRenderTime: ?DOMHighResTimeStamp = null
function render(ts: DOMHighResTimeStamp) {
    const dt = (lastRenderTime == null) ? 0 : (ts - lastRenderTime)*0.001
    lastRenderTime = ts

    world.step(dt)
    camera.draw(context)

    requestAnimationFrame(render)
}

function init() {
    window.onresize = function() {
        canvas.width = canvas.clientWidth
        canvas.height = canvas.clientHeight
        camera.setViewportFromCanvas(canvas)
    }
    window.onresize()

    requestAnimationFrame(render)
}

function createScene() {
    const body = new Body()
    body.shapes.push(new Box({size: Vector.n(2, 1)}))
    body.recomputeMassInfo()
    body.angVel = 1.0
    world.bodies.push(body)
}

init()
createScene()
