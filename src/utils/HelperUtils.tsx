import { CustomLine } from "../interfaces/CustomLine"
import { Point2D } from "../interfaces/Point2D"

export default class HelperUtils {
  static generateRandomPoints(
    quantity: number,
    min: number,
    max: number,
    linearPattern = false
  ) {
    const points: Point2D[] = []

    for (let i = 0; i < quantity; i++) {
      const x = Math.random() * (max - min) + min
      const y = linearPattern
        ? x + Math.random() * 5 * (Math.random() < 0.5 ? -1 : 1)
        : Math.random() * (max - min) + min

      if (y < min || y > max) continue

      points.push({
        x: x,
        y: y,
      })
    }

    return points
  }

  static getMSE(truth: Point2D[], pred: CustomLine) {
    return (
      truth.reduce((sum, point) => {
        const y_hat = pred.slope * point.x + pred.intercept
        const error = point.y - y_hat
        return sum + error ** 2
      }, 0) / truth.length
    )
  }

  static generateOLSParams(points: Point2D[]) {
    let sumX = 0
    let sumY = 0
    let sumXY = 0
    let sumXX = 0

    for (let i = 0; i < points.length; i++) {
      sumX += points[i].x
      sumY += points[i].y
      sumXY += points[i].x * points[i].y
      sumXX += points[i].x * points[i].x
    }

    const meanX = sumX / points.length
    const meanY = sumY / points.length

    const slope =
      (points.length * sumXY - sumX * sumY) /
      (points.length * sumXX - sumX * sumX)
    const intercept = meanY - slope * meanX

    return { slope, intercept }
  }

  static generatePointsFromParams(
    min: number,
    max: number,
    slope: number,
    intercept: number
  ) {
    const points: Point2D[] = []

    for (let i = min; i < max; i++) {
      points.push({
        x: i,
        y: slope * i + intercept,
      })
    }

    return points
  }

  static calculateMeanY(points: Point2D[]) {
    let sumY = 0
    for (let i = 0; i < points.length; i++) {
      sumY += points[i].y
    }
    return sumY / points.length
  }

  static getInterpolatedPoint(posX: number, line: Point2D[]) {
    if (line.length < 2) throw new Error("Line must have more than 2 points.")

    const pointA = line[0]
    const pointB = line[1]

    return {
      x: posX,
      y:
        pointA.y +
        (pointB.y - pointA.y) * ((posX - pointA.x) / (pointB.x - pointA.x)), // y = y1 + (y2-y1) x [(x-x1) / (x2-x1)]
    }
  }

  static getNormalizedPoints(points: Point2D[]) {
    const xs = points.map((p) => p.x)
    const ys = points.map((p) => p.y)
    const minX = Math.min(...xs),
      maxX = Math.max(...xs)
    const minY = Math.min(...ys),
      maxY = Math.max(...ys)
    return points.map((p) => ({
      x: (p.x - minX) / (maxX - minX),
      y: (p.y - minY) / (maxY - minY),
    }))
  }

  static sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
}
