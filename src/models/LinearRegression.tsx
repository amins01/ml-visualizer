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
  currentStep: number
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
    this.currentStep = 0
    this.learningRate = learningRate
    this.stopTraining = false
  }

  subscribeUpdate(cb: () => void) {
    this.updateCallbacks.push(cb)
  }

  subscribeReset(cb: () => void) {
    this.resetCallbacks.push(cb)
  }

  splitArrayIntoBatches(array: Point2D[], batchSize: number) {
    const resultArray = []
    for (let i = 0; i < array.length; i += batchSize) {
      resultArray.push(array.slice(i, i + batchSize))
    }
    return resultArray
  }

  async train(
    points: Point2D[],
    epochs: number,
    batchSize: number,
    delay: number
  ) {
    console.log(`Starting Training for ${epochs} epochs...`)
    this.stopTraining = false

    for (let epoch = 1; epoch <= epochs; epoch++) {
      if (this.stopTraining) break

      this.currentEpoch = epoch
      const batches = this.splitArrayIntoBatches(points, batchSize)

      for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
        const batch = batches[batchIndex]
        let delta_slope = 0
        let delta_intercept = 0

        for (let i = 0; i < batch.length; i++) {
          const y_hat = this.slope * batch[i].x + this.intercept
          const error = batch[i].y - y_hat
          delta_slope += -2 * error * batch[i].x
          delta_intercept += -2 * error
        }

        this.slope -= (this.learningRate * delta_slope) / batch.length
        this.intercept -= (this.learningRate * delta_intercept) / batch.length

        this.currentLoss =
          batch.reduce((sum, point) => {
            const y_hat = this.slope * point.x + this.intercept
            const error = point.y - y_hat
            return sum + error ** 2
          }, 0) / batch.length

        //console.log(`Loss ${this.currentEpoch}-${batchIndex}`, this.currentLoss)
        this.currentStep++
        this.notify()
        await HelperUtils.sleep(delay)
      }

      //this.currentLoss = currentLoss / batches.length

      // console.log(`Slope epoch ${this.currentEpoch}`, this.slope)
      // console.log(`Intercept epoch ${this.currentEpoch}`, this.intercept)
      console.log(`Loss epoch ${this.currentEpoch}`, this.currentLoss)
    }
    this.currentEpoch = 0
    this.currentStep = 0
    this.currentLoss = 0
    this.stopTraining = false
  }

  updateParams(slope: number, intercept: number) {
    this.slope = slope
    this.intercept = intercept
    this.initialSlope = this.slope
    this.initialIntercept = this.intercept
    this.updateCallbacks.forEach((callback) => callback())
  }

  resetParams() {
    this.slope = Math.random()
    this.intercept = Math.random()
    this.initialSlope = this.slope
    this.initialIntercept = this.intercept
    this.resetCallbacks.forEach((callback) => callback())
  }

  stop() {
    this.stopTraining = true
    this.currentLoss = 0
    this.currentEpoch = 0
    this.currentStep = 0
    this.resetCallbacks.forEach((callback) => callback())
  }

  async reset() {
    this.stopTraining = true
    this.slope = this.initialSlope
    this.intercept = this.initialIntercept
    this.currentLoss = 0
    this.currentEpoch = 0
    this.currentStep = 0
    this.resetCallbacks.forEach((callback) => callback())
  }

  notify() {
    if (this.stopTraining) return

    this.updateCallbacks.forEach((callback) => callback())
  }
}
