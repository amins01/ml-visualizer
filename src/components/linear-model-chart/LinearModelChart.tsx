import React, { useState, useEffect } from "react"
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Scatter,
  Line,
  ComposedChart,
} from "recharts"
import { Point2D } from "../../interfaces/Point2D"

function LinearModelChart(props: any) {
  const {
    height,
    width,
    minRange,
    maxRange,
    model,
    pointsData,
    OLSpointsData,
  } = props

  const generateLinePoints = () => {
    const points: Point2D[] = []
    const xs = pointsData.map((p: Point2D) => p.x)
    const ys = pointsData.map((p: Point2D) => p.y)
    const minX = Math.min(...xs),
      maxX = Math.max(...xs)
    const minY = Math.min(...ys),
      maxY = Math.max(...ys)
    for (let i = minRange; i < maxRange; i++) {
      const x = (i - minX) / (maxX - minX)
      const y_hat_normalized = model.slope * x + model.intercept
      const y = y_hat_normalized * (maxY - minY) + minY
      points.push({
        x: i,
        y: y,
      })
    }
    return points
  }

  const [linePoints, setLinePoints] = useState<Point2D[]>(generateLinePoints())

  const updateLinePoints = () => {
    setLinePoints(generateLinePoints())
  }

  useEffect(() => {
    if (pointsData && pointsData.length == 0) return
    model.subscribeUpdate(updateLinePoints)
    model.subscribeReset(updateLinePoints)
  }, [])

  return (
    <div>
      <ComposedChart
        width={height}
        height={width}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <CartesianGrid />
        <XAxis type="number" dataKey="x" name="x" />
        <YAxis type="number" dataKey="y" name="y" />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        {/* <Legend /> */}
        <Scatter name="points" data={pointsData} fill="#8884d8" />
        <Line
          type="monotone"
          dataKey="y"
          data={linePoints}
          stroke="#ff7300"
          dot={false}
          activeDot={false}
        />
        <Line
          type="monotone"
          dataKey="y"
          data={OLSpointsData}
          stroke="#FF0000"
          dot={false}
          activeDot={false}
        />
      </ComposedChart>
    </div>
  )
}

export default LinearModelChart
