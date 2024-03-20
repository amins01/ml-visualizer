import "./App.css"
import GradientDescentVisualizer from "./components/gradient-descent-visualizer/GradientDescentVisualizer"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { Routes, Route } from "react-router-dom"
import Theme from "./utils/Theme"
import Navbar from "./components/navbar/Navbar"
import ComingSoonPage from "./components/coming-soon-page/ComingSoonPage"

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: Theme.colors.options,
      },
    },
  })

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Navbar
          pages={[
            { name: "Gradient Descent", path: "/gd" },
            { name: "Neural network", path: "/nn" },
            { name: "KNN", path: "/knn" },
          ]}
        />
        <Routes>
          <Route path="/" element={<GradientDescentVisualizer />} />
          <Route path="/gd" element={<GradientDescentVisualizer />} />
          <Route
            path="/nn"
            element={<ComingSoonPage title="Neural Network Visualizer" />}
          />
          <Route
            path="/knn"
            element={<ComingSoonPage title="K-Nearest Neighbors Visualizer" />}
          />
          {/* <Route index element={<GradientDescentVisualizer />} /> */}
          {/* <Route path="blogs" element={<Blogs />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NoPage />} /> */}
        </Routes>
      </ThemeProvider>
    </div>
  )
}

export default App
