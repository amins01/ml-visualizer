import HelperUtils from "../utils/HelperUtils"
import { Point2D } from "../interfaces/Point2D"

export class LinearRegression {
  updateCallbacks: (() => void)[]
  resetCallbacks: (() => void)[]
  initialSlope: number
  initialIntercept: number
  slope: number
  intercept: number
  currentLoss: number
  currentEpoch: number
  learningRate: number
  stopTraining: boolean

  constructor(learningRate: number) {
    this.updateCallbacks = []
    this.resetCallbacks = []
    this.slope = Math.random()
    this.intercept = Math.random()
    this.initialSlope = this.slope
    this.initialIntercept = this.intercept
    this.currentLoss = 0
    this.currentEpoch = 0
    this.learningRate = learningRate
    this.stopTraining = false
  }

  subscribeUpdate(cb: () => void) {
    this.updateCallbacks.push(cb)
  }

  subscribeReset(cb: () => void) {
    this.resetCallbacks.push(cb)
  }

  async train(points: Point2D[], epochs: number, delay: number) {
    console.log(`Starting Training for ${epochs} epochs...`)
    this.stopTraining = false
    const normalizedPoints = HelperUtils.getNormalizedPoints(points)
    for (let epoch = 1; epoch <= epochs; epoch++) {
      if (this.stopTraining) break
      this.currentEpoch = epoch
      let delta_slope = 0
      let delta_intercept = 0
      for (let i = 0; i < normalizedPoints.length; i++) {
        const y_hat = this.slope * normalizedPoints[i].x + this.intercept
        const error = normalizedPoints[i].y - y_hat
        delta_slope += -2 * error * normalizedPoints[i].x
        delta_intercept += -2 * error
      }
      this.slope -= (this.learningRate * delta_slope) / normalizedPoints.length
      this.intercept -=
        (this.learningRate * delta_intercept) / normalizedPoints.length

      this.currentLoss =
        normalizedPoints.reduce((sum, point) => {
          const y_hat = this.slope * point.x + this.intercept
          const error = point.y - y_hat
          return sum + error ** 2
        }, 0) / normalizedPoints.length
      console.log(`Loss epoch ${this.currentEpoch}`, this.currentLoss)
      this.notify()
      await HelperUtils.sleep(delay)
    }
    this.currentEpoch = 0
    this.currentLoss = 0
    this.stopTraining = false
  }

  resetParams() {
    this.slope = Math.random()
    this.intercept = Math.random()
    this.initialSlope = this.slope
    this.initialIntercept = this.intercept
    this.resetCallbacks.forEach((callback) => callback())
  }

  reset() {
    this.stopTraining = true
    this.slope = this.initialSlope
    this.intercept = this.initialIntercept
    this.currentLoss = 0
    this.currentEpoch = 0
    this.resetCallbacks.forEach((callback) => callback())
  }

  notify() {
    this.updateCallbacks.forEach((callback) => callback())
  }
}
