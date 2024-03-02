import React, { useState, useEffect } from "react"
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  ComposedChart,
  Scatter,
} from "recharts"
import { Point2D } from "../../interfaces/Point2D"
import Theme from "../../utils/Theme"

function CostFunctionLandscapeChart(props: any) {
  const { height, width, OLSLine, model } = props
  const [OLSPoint, setOLSPoint] = useState<Point2D[]>([])
  const [modelPoint, setModelPoint] = useState<Point2D[]>([])

  const updateModelPoints = () => {
    setModelPoint([
      {
        x: model.intercept,
        y: model.slope,
      },
    ])
  }

  const updateOLSPoints = () => {
    if (!OLSLine) return

    setOLSPoint([
      {
        x: OLSLine.intercept,
        y: OLSLine.slope,
      },
    ])
  }

  useEffect(() => {
    model.subscribeUpdate(updateModelPoints)
    model.subscribeReset(updateModelPoints)
  }, [])

  useEffect(() => {
    updateModelPoints()
    updateOLSPoints()
  }, [OLSLine])

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
        <Scatter data={OLSPoint} fill={Theme.colors.primary} />
        <Scatter data={modelPoint} fill={Theme.colors.secondary} />
      </ComposedChart>
    </div>
  )
}

export default CostFunctionLandscapeChart
