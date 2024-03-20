import React, { useState, useEffect } from "react"
import { CartesianGrid, XAxis, YAxis, Line, ComposedChart } from "recharts"
import { Point2D } from "../../interfaces/Point2D"
import Theme from "../../utils/Theme"

function LossChart(props: any) {
  const { height, width, model } = props
  const [loss, setLoss] = useState<Point2D[]>([])

  const updateLossCurve = () => {
    if (model.currentLoss === 0) return

    setLoss((prevLoss) => [
      ...prevLoss,
      { x: model.currentStep, y: Math.abs(model.currentLoss) },
    ])
  }

  useEffect(() => {
    model.subscribeUpdate(updateLossCurve)
    model.subscribeReset(() => setLoss([]))
  }, [])

  return (
    <div>
      <ComposedChart
        width={width}
        height={height}
        margin={{ top: 20, right: 20, bottom: 20, left: 10 }}
      >
        <CartesianGrid />
        <XAxis
          type="number"
          dataKey="x"
          name="x"
          label={{
            value: `Iteration`,
            style: { textAnchor: "middle" },
            position: "insideBottom",
            offset: -15,
          }}
        />
        <YAxis
          type="number"
          dataKey="y"
          name="y"
          label={{
            value: `cost`,
            style: { textAnchor: "middle" },
            angle: -90,
            position: "left",
            offset: -18,
          }}
        />
        <Line
          type="monotone"
          dataKey="y"
          data={loss}
          stroke={Theme.colors.secondary}
          strokeWidth={2}
          dot={false}
          activeDot={false}
        />
      </ComposedChart>
    </div>
  )
}

export default LossChart
