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

  const PointsShape = (props: any) => {
    const { cx, cy } = props
    return <circle cx={cx} cy={cy} r={3} fill={Theme.colors.options} />
  }

  const generateLinePoints = () => {
    const points: Point2D[] = []
    for (let i = minRange; i < maxRange; i++) {
      const y = model.slope * i + model.intercept
      if (y >= minRange * 1.1 && y <= maxRange * 1.1) {
        points.push({
          x: i,
          y: y,
        })
      }
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
        margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
      >
        <CartesianGrid />
        <XAxis
          type="number"
          dataKey="x"
          name="x"
          label={{
            value: `x`,
            style: { textAnchor: "middle" },
            position: "insideBottom",
            offset: -15,
          }}
          tickFormatter={(tick) => Math.round(tick) + ""}
          domain={[minRange * 1.1, maxRange * 1.1]}
        />
        <YAxis
          type="number"
          dataKey="y"
          name="y"
          label={{
            value: `y`,
            style: { textAnchor: "middle" },
            angle: -90,
            position: "left",
            offset: -15,
          }}
          tickFormatter={(tick) => Math.round(tick) + ""}
          domain={[minRange * 1.1, maxRange * 1.1]}
        />
        {/* <Tooltip cursor={{ strokeDasharray: "3 3" }} /> */}
        {/* <Legend /> */}
        <Scatter name="points" data={pointsData} shape={PointsShape} />
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
