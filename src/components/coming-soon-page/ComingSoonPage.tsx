import React from "react"
import { Container, Box, Typography, CircularProgress } from "@mui/material"
import loadingGif from "../../assets/loading.gif"

function ComingSoonPage(props: any) {
  const { title } = props

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          textAlign: "center",
        }}
      >
        <Typography variant="h2" component="div" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h5" component="div" gutterBottom>
          Coming Soon
        </Typography>
        <Typography variant="body1" component="div" gutterBottom>
          I'm working on this visualization. Stay tuned!
        </Typography>
        <Box sx={{ m: 2 }}>
          <img src={loadingGif} height={60} width={60} />
          {/* <CircularProgress /> */}
        </Box>
      </Box>
    </Container>
  )
}

export default ComingSoonPage
