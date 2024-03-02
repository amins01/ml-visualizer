import React, { useEffect, useState, useSyncExternalStore } from "react"
import LinearModelChart from "../linear-model-chart/LinearModelChart"
import { LinearRegression } from "../../models/LinearRegression"
import LossChart from "../loss-chart/LossChart"
import Button from "@mui/material/Button"
import AutoGraphIcon from "@mui/icons-material/AutoGraph"
import "./Homepage.css"
import { Point2D } from "../../interfaces/Point2D"
import HelperUtils from "../../utils/HelperUtils"
import IconButton from "@mui/material/IconButton"
import RestartAltIcon from "@mui/icons-material/RestartAlt"
import LoadingButton from "@mui/lab/LoadingButton"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormControl from "@mui/material/FormControl"
import FormLabel from "@mui/material/FormLabel"
import { TrainingSize } from "../../interfaces/TrainingSize"
import Switch from "@mui/material/Switch"
import Slider from "@mui/material/Slider"
import CostFunctionLandscapeChart from "../cost-function-landscape-chart/CostFunctionLandscapeChart"
import { CustomLine } from "../../interfaces/CustomLine"

function Homepage() {
  const MIN_RANGE = 1
  const MAX_RANGE = 10
  const STOCHASTIC = 1
  const MINI_BATCH = 32
  const [learningRate, setLearningRate] = useState<number>(0.001)
  const [model, setModel] = useState(new LinearRegression(learningRate))
  const [trainingSize, setTrainingSize] = useState<TrainingSize>(
    TrainingSize.SMALL
  )
  const [isTraining, setIsTraining] = useState(false)
  const [linearPattern, setLinearPattern] = useState(true)
  const [pointsData, setPointsData] = useState<Point2D[]>(
    HelperUtils.generateRandomPoints(
      trainingSize,
      MIN_RANGE,
      MAX_RANGE,
      linearPattern
    )
  )
  const [OLSLine, setOLSLine] = useState<CustomLine>()
  const [OLSPointsData, setOLSPointsData] = useState<Point2D[]>([])
  const [batchSizeMarkIndex, setBatchSizeMarkIndex] = useState(3)

  const startTraining = () => {
    setIsTraining(true)
    model.train(
      pointsData,
      10000,
      getBatchSizeByMarkIndex(batchSizeMarkIndex),
      0
    )
  }

  const resetTraining = () => {
    setIsTraining(false)
    model.reset()
  }

  const generateDataset = () => {
    resetTraining()
    model.resetParams()
    setPointsData(
      HelperUtils.generateRandomPoints(
        trainingSize,
        MIN_RANGE,
        MAX_RANGE,
        linearPattern
      )
    )
  }

  const handleSliderChange = (event: any, newValue: any) => {
    const newBatchSize = getBatchSizeByMarkIndex(newValue)

    if (newBatchSize !== -1 && newValue !== batchSizeMarkIndex) {
      console.log(
        `old: ${getBatchSizeByMarkIndex(
          batchSizeMarkIndex
        )}, new: ${newBatchSize}`
      )
      setBatchSizeMarkIndex(newValue)
    }
  }

  const getBatchSizeByMarkIndex = (markIndex: number) => {
    if (markIndex === 1) return STOCHASTIC
    if (markIndex === 2) return MINI_BATCH
    if (markIndex === 3) return pointsData.length

    return -1
  }

  const handleTrainingSizeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedValue = parseInt(event.target.value)
    if (!Object.values(TrainingSize).includes(selectedValue))
      throw new Error("Invalid training size.")

    setTrainingSize(selectedValue)
  }

  useEffect(() => {
    generateDataset()
  }, [trainingSize, linearPattern])

  useEffect(() => {
    const { slope, intercept } = HelperUtils.generateOLSParams(pointsData)

    setOLSLine({
      slope: slope,
      intercept: intercept,
    })
  }, [pointsData])

  useEffect(() => {
    if (!OLSLine) return

    setOLSPointsData(
      HelperUtils.generatePointsFromParams(
        MIN_RANGE,
        MAX_RANGE,
        OLSLine.slope,
        OLSLine.intercept
      )
    )
  }, [OLSLine])

  return (
    <>
      <h1>ML Visualizer</h1>
      <div className="row-1">
        <div className="linear-reg-chart">
          <div>
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Training Size
              </FormLabel>
              <RadioGroup
                row
                name="row-radio-buttons-group"
                onChange={handleTrainingSizeChange}
              >
                <FormControlLabel
                  value={TrainingSize.SMALL}
                  control={<Radio />}
                  label="Small"
                  checked={trainingSize === TrainingSize.SMALL}
                />
                <FormControlLabel
                  value={TrainingSize.MEDIUM}
                  control={<Radio />}
                  label="Medium"
                  checked={trainingSize === TrainingSize.MEDIUM}
                />
                <FormControlLabel
                  value={TrainingSize.LARGE}
                  control={<Radio />}
                  label="Large"
                  checked={trainingSize === TrainingSize.LARGE}
                />
              </RadioGroup>
            </FormControl>
          </div>
          <div>
            <LoadingButton
              variant="contained"
              onClick={() => generateDataset()}
            >
              Generate new dataset
            </LoadingButton>
            <FormControlLabel
              control={
                <Switch
                  checked={linearPattern}
                  onChange={() => setLinearPattern(!linearPattern)}
                  name="Linear"
                />
              }
              label="Linear"
            />
          </div>
          <LinearModelChart
            width={400}
            height={400}
            minRange={MIN_RANGE}
            maxRange={MAX_RANGE}
            model={model}
            pointsData={pointsData}
            OLSpointsData={OLSPointsData}
          />
        </div>
        <div className="cost-landscape-chart">
          <CostFunctionLandscapeChart
            width={400}
            height={400}
            OLSLine={OLSLine}
            model={model}
          />
        </div>
        <div className="loss-chart">
          <div className="batch-size-slider">
            <Slider
              value={batchSizeMarkIndex}
              onChange={handleSliderChange}
              min={1}
              max={3}
              marks={[
                { value: 1, label: "Stochastic GD" },
                { value: 2, label: "Mini-batch GD" },
                { value: 3, label: "Batch GD" },
              ]}
              valueLabelDisplay="auto"
            />
          </div>
          <div>
            <LoadingButton
              variant="contained"
              endIcon={<AutoGraphIcon />}
              loading={isTraining}
              onClick={() => startTraining()}
            >
              Start Training
            </LoadingButton>
            <IconButton size="small" onClick={() => resetTraining()}>
              <RestartAltIcon fontSize="small" />
            </IconButton>
          </div>
          <LossChart width={400} height={400} model={model} />
        </div>
      </div>
    </>
  )
}

export default Homepage
