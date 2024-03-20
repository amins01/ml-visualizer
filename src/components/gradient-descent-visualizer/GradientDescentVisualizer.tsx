import React, { useEffect, useState } from "react"
import { InlineMath } from "react-katex"
import "katex/dist/katex.min.css"
import LinearModelChart from "../linear-model-chart/LinearModelChart"
import { LinearRegression } from "../../models/LinearRegression"
import LossChart from "../loss-chart/LossChart"
import AutoGraphIcon from "@mui/icons-material/AutoGraph"
import "./GradientDescentVisualizer.css"
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
import InfoCard from "../info-card/InfoCard"
import Theme from "../../utils/Theme"
import { Typography } from "@mui/material"
import { LearningRate } from "../../interfaces/LearningRate"

function GradientDescentVisualizer() {
  const MIN_RANGE = -10
  const MAX_RANGE = 10
  const STOCHASTIC = 1
  const MINI_BATCH = 32
  const [model, setModel] = useState(new LinearRegression())
  const [trainingSize, setTrainingSize] = useState<TrainingSize>(
    TrainingSize.LARGE
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
  const [learningRateMarkIndex, setLearningRateMarkIndex] = useState(1)
  const [batchSizeMarkIndex, setBatchSizeMarkIndex] = useState(3)

  const startTraining = () => {
    setIsTraining(true)
    model.train(
      pointsData,
      10000,
      getLearningRateByMarkIndex(learningRateMarkIndex),
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

  const handleBatchSizeSliderChange = (event: any, newValue: any) => {
    const newBatchSize = getBatchSizeByMarkIndex(newValue)

    if (newBatchSize !== -1 && newValue !== batchSizeMarkIndex) {
      resetTraining()
      setBatchSizeMarkIndex(newValue)
    }
  }

  const handleLearningRateSliderChange = (event: any, newValue: any) => {
    const newLearningRate = getLearningRateByMarkIndex(newValue)

    if (newLearningRate !== -1 && newValue !== learningRateMarkIndex) {
      resetTraining()
      setLearningRateMarkIndex(newValue)
      console.log("Learning rate", newLearningRate)
    }
  }

  const getBatchSizeByMarkIndex = (markIndex: number) => {
    if (markIndex === 1) return STOCHASTIC
    if (markIndex === 2) return MINI_BATCH
    if (markIndex === 3) return pointsData.length

    return -1
  }

  const getLearningRateByMarkIndex = (markIndex: number) => {
    if (markIndex === 1) return LearningRate.SMALL
    if (markIndex === 2) return LearningRate.MEDIUM
    if (markIndex === 3) return LearningRate.LARGE

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
      <div className="gd-header-wrapper">
        <div className="gd-title"> 📉 Gradient Descent </div>
        <div className="gd-subtitle">
          <InlineMath math="\theta_j := \theta_j - \alpha \frac{\partial}{\partial \theta_j} J(\theta)" />
        </div>
        <div className="gd-description">
          <p>
            The following is an interactive visualization of linear regression
            using gradient descent.{" "}
            <span style={{ fontWeight: "bold" }}>
              It demonstrates the impact of different hyperparameters on the
              gradient descent process.
            </span>{" "}
            I saw this interactive animation while navigating
            <span style={{ fontStyle: "italic" }}>{" deeplearning.ai "}</span>
            and decided to recreate it!
          </p>
        </div>
      </div>
      <div className="row-1">
        <div className="linear-reg-chart">
          <InfoCard
            title="1. Generate a dataset"
            description={
              <>
                First, select the training size and generate a random dataset.
                The{" "}
                <span style={{ color: Theme.colors.primary }}>
                  Ordinary Least Squares (OLS) line
                </span>{" "}
                minimizes the sum of squared residuals, given by the formula:{" "}
                <InlineMath math="\min_{\beta_0, \beta_1} \sum_{i=1}^{n} (y_i - (\beta_0 + \beta_1 x_i))^2" />
                {". "}
                The{" "}
                <span style={{ color: Theme.colors.secondary }}>
                  other line
                </span>
                , initially random, is adjusted using gradient descent to
                minimize the mean squared error between predicted and actual
                values.{" "}
                <span style={{ fontStyle: "italic" }}>
                  You can manually adjust its parameters in the next step.
                </span>
              </>
            }
            maxWidth={400}
          >
            <div>
              <FormControl>
                <FormLabel id="training-size-radio-buttons-group-label">
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
            <div className="generate-dataset-options">
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
              width={350}
              height={350}
              minRange={MIN_RANGE}
              maxRange={MAX_RANGE}
              model={model}
              pointsData={pointsData}
              OLSpointsData={OLSPointsData}
            />
          </InfoCard>
        </div>
        <InfoCard
          title="2. Set Initial Parameters and Explore the Cost Landscape"
          description={
            <>
              This chart represents the cost landscape (slope vs intercept). It
              shows the trajectory of parameter adjustments made through
              gradient descent.{" "}
              <span style={{ fontWeight: "bold" }}>
                You can adjust the initial parameters by dragging{" "}
                <span style={{ color: Theme.colors.secondary }}>the dot</span>{" "}
                on the chart.
              </span>
            </>
          }
          maxWidth={400}
        >
          <div className="cost-landscape-chart">
            <CostFunctionLandscapeChart
              width={350}
              height={350}
              OLSLine={OLSLine}
              model={model}
              isTraining={isTraining}
              setIsTraining={setIsTraining}
            />
          </div>
        </InfoCard>
        <InfoCard
          title="3. Adjust Gradient Descent Parameters and Start the Algorithm"
          description={
            <>
              <span style={{ fontWeight: "bold" }}>
                Adjust the batch size and learning rate for the gradient descent
                algorithm.
              </span>
              The following chart shows the loss for each iteration. It uses the
              MSE cost function:
              <br />
              <br />
              <div className="center">
                <InlineMath math="J(\theta) = \frac{1}{2m} \sum_{i=1}^{m} (h_\theta(x^{(i)}) - y^{(i)})^2" />
              </div>
            </>
          }
          maxWidth={400}
        >
          <div className="loss-card-content">
            <div className="gd-params-slider">
              <Typography fontSize={15}>Learning rate (α)</Typography>
              <Slider
                value={learningRateMarkIndex}
                onChange={handleLearningRateSliderChange}
                min={1}
                max={3}
                marks={[
                  { value: 1, label: `Small` },
                  { value: 2, label: `Medium` },
                  { value: 3, label: `Large` },
                ]}
                valueLabelDisplay="off"
              />
              <br />
              <Typography>Batch size</Typography>
              <Slider
                value={batchSizeMarkIndex}
                onChange={handleBatchSizeSliderChange}
                min={1}
                max={3}
                marks={[
                  { value: 1, label: `Stochastic (${STOCHASTIC})` },
                  { value: 2, label: `Mini-batch (${MINI_BATCH})` },
                  { value: 3, label: `Batch (${pointsData.length})` },
                ]}
                valueLabelDisplay="off"
              />
            </div>
            <div className="training-options">
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
            <div className="loss-chart">
              <LossChart width={400} height={200} model={model} />
            </div>
          </div>
        </InfoCard>
      </div>
    </>
  )
}

export default GradientDescentVisualizer
