import React, { useState, useEffect, useRef } from "react"
import { Drag } from "@visx/drag"
import { Point2D } from "../../interfaces/Point2D"
import Theme from "../../utils/Theme"

function CostFunctionLandscapeChart(props: any) {
  const { height, width, OLSLine, model, isTraining, setIsTraining } = props
  const isTrainingRef = useRef(isTraining)
  const [OLSPoint, setOLSPoint] = useState<Point2D>({
    x: 0,
    y: 0,
  })
  const [modelPoint, setModelPoint] = useState<Point2D>({
    x: 0,
    y: 0,
  })
  const [modelPath, setModelPath] = useState<Point2D[]>([])

  const updateModelPoint = () => {
    const newPoint = normalizePoint(
      {
        x: model.intercept,
        y: model.slope,
      },
      1,
      3,
      1,
      3,
      width
    )

    if (!model.stopTraining) {
      setModelPath((prevPath) => [...prevPath, newPoint])
    } else if (model.stopTraining) {
      setModelPath([newPoint])
      setModelPoint(newPoint)
    }
  }

  useEffect(() => {
    isTrainingRef.current = isTraining
  }, [isTraining])

  const updateOLSPoints = () => {
    if (!OLSLine) return

    setOLSPoint(
      normalizePoint(
        {
          x: OLSLine.intercept,
          y: OLSLine.slope,
        },
        1,
        3,
        1,
        3,
        width
      )
    )
  }

  const handleModelPointDrag = (dx: number, dy: number) => {
    setIsTraining(false)
    model.stop()
    const newNormalizedPoint = {
      x: modelPoint.x + dx,
      y: modelPoint.y + dy,
    }
    const newDenormalizedPoint = denormalizePoint(
      newNormalizedPoint,
      1,
      3,
      1,
      3,
      width
    )
    model.updateParams(newDenormalizedPoint.y, newDenormalizedPoint.x)
  }

  useEffect(() => {
    model.subscribeUpdate(updateModelPoint)
    model.subscribeReset(() => {
      setModelPath([])
      updateModelPoint()
    })
  }, [])

  useEffect(() => {
    updateModelPoint()
    updateOLSPoints()
  }, [OLSLine])

  const normalizePoint = (
    point: Point2D,
    minX: number,
    maxX: number,
    minY: number,
    maxY: number,
    scale: number
  ) => {
    const normalizedX = ((point.x + maxX) / (maxX + maxX)) * scale
    const normalizedY = ((point.y + maxY) / (maxY + maxY)) * scale
    return { x: normalizedX, y: normalizedY }
  }

  const denormalizePoint = (
    point: Point2D,
    minX: number,
    maxX: number,
    minY: number,
    maxY: number,
    scale: number
  ) => {
    const denormalizedX = (point.x / scale) * (maxX + maxX) - maxX
    const denormalizedY = (point.y / scale) * (maxY + maxY) - maxY
    return { x: denormalizedX, y: denormalizedY }
  }

  return (
    <div>
      <svg width={width} height={height}>
        <defs>
          <radialGradient
            id="Gradient"
            cx={(OLSPoint.x / width) * 100 + "%"}
            cy={(OLSPoint.y / height) * 100 + "%"}
            r="70%"
            fx={(OLSPoint.x / width) * 100 + "%"}
            fy={(OLSPoint.y / height) * 100 + "%"}
          >
            <stop
              offset="0%"
              style={{ stopColor: "#124076", stopOpacity: 0.3 }}
            />
            <stop
              offset="25%"
              style={{ stopColor: "#124076", stopOpacity: 0.5 }}
            />
            <stop
              offset="50%"
              style={{ stopColor: "#124076", stopOpacity: 0.7 }}
            />
            <stop
              offset="75%"
              style={{ stopColor: "#124076", stopOpacity: 0.9 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#124076", stopOpacity: 1 }}
            />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#Gradient)" />
        <ellipse
          cx={OLSPoint.x}
          cy={OLSPoint.y}
          rx={width * 0.25}
          ry={width * 0.15}
          fill="none"
          stroke="white"
        />
        <ellipse
          cx={OLSPoint.x}
          cy={OLSPoint.y}
          rx={width * 0.5}
          ry={width * 0.3}
          fill="none"
          stroke="white"
        />
        <ellipse
          cx={OLSPoint.x}
          cy={OLSPoint.y}
          rx={width * 0.75}
          ry={width * 0.45}
          fill="none"
          stroke="white"
        />
        <ellipse
          cx={OLSPoint.x}
          cy={OLSPoint.y}
          rx={width}
          ry={width * 0.6}
          fill="none"
          stroke="white"
        />
        <circle
          cx={OLSPoint.x}
          cy={OLSPoint.y}
          r={8}
          fill={Theme.colors.primary}
        />
        <Drag
          width={width}
          height={height}
          x={modelPoint.x}
          y={modelPoint.y}
          onDragMove={({ dx, dy }) => handleModelPointDrag(dx, dy)}
        >
          {({ isDragging, dragStart, dragEnd, dragMove }) => (
            <circle
              cx={modelPoint.x}
              cy={modelPoint.y}
              r={isDragging ? 10 : 8}
              fill={Theme.colors.secondary}
              onMouseDown={dragStart}
              onMouseUp={dragEnd}
              onMouseMove={dragMove}
              onTouchStart={dragStart}
              onTouchEnd={dragEnd}
              onTouchMove={dragMove}
            />
          )}
        </Drag>
        <path
          d={modelPath
            .map((point, i) => `${i === 0 ? "M" : "L"} ${point.x} ${point.y}`)
            .join(" ")}
          stroke={Theme.colors.secondary}
          strokeWidth={1}
          fill="none"
        />
        <text x={width / 2} y={height - 10} textAnchor="middle" fill="white">
          intercept
        </text>
        <text
          x={10}
          y={height / 2}
          textAnchor="middle"
          transform={`rotate(-90,10,${height / 2})`}
          fill="white"
        >
          slope
        </text>
      </svg>
    </div>
  )
}

export default CostFunctionLandscapeChart
