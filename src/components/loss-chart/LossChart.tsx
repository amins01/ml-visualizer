import React, { useState, useEffect } from "react"
import { CartesianGrid, XAxis, YAxis, Line, ComposedChart } from "recharts"
import { Point2D } from "../../interfaces/Point2D"

function LossChart(props: any) {
  const { height, width, model } = props
  const [loss, setLoss] = useState<Point2D[]>([])

  const updateLossCurve = () => {
    setLoss((prevLoss) => [
      ...prevLoss,
      { x: model.currentEpoch, y: Math.abs(model.currentLoss) },
    ])
  }

  useEffect(() => {
    model.subscribeUpdate(updateLossCurve)
    model.subscribeReset(() => setLoss([]))
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
        <Line
          type="monotone"
          dataKey="y"
          data={loss}
          stroke="#ff7300"
          dot={false}
          activeDot={false}
        />
      </ComposedChart>
    </div>
  )
}

export default LossChart
