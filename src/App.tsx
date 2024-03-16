import "./App.css"
import Homepage from "./components/homepage/Homepage"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import Theme from "./utils/Theme"

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
        <Homepage />
      </ThemeProvider>
    </div>
  )
}

export default App
