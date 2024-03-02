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
import Theme from "../../utils/Theme"

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
    for (let i = minRange; i < maxRange; i++) {
      points.push({
        x: i,
        y: model.slope * i + model.intercept,
      })
    }
    return points
  }

  const [linePoints, setLinePoints] = useState<Point2D[]>(generateLinePoints())

  const updateLinePoints = () => {
    setLinePoints(generateLinePoints())
  }

  useEffect(() => {
    if (pointsData && pointsData.length === 0) return
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
        {/* <Tooltip cursor={{ strokeDasharray: "3 3" }} /> */}
        {/* <Legend /> */}
        <Scatter name="points" data={pointsData} fill="#8884d8" />
        <Line
          type="monotone"
          dataKey="y"
          data={linePoints}
          stroke={Theme.colors.secondary}
          strokeWidth={2}
          dot={false}
          activeDot={false}
        />
        <Line
          type="monotone"
          dataKey="y"
          data={OLSpointsData}
          stroke={Theme.colors.primary}
          strokeWidth={2}
          dot={false}
          activeDot={false}
        />
      </ComposedChart>
    </div>
  )
}

export default LinearModelChart
