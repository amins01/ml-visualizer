import React, { ReactNode } from "react"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import "./InfoCard.css"

interface InfoCardProps {
  title: string
  description: string
  maxWidth: number
  children: ReactNode
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  description,
  maxWidth,
  children,
}) => (
  <Card style={{ maxWidth: maxWidth }}>
    <CardContent className="card-content">
      <Typography gutterBottom variant="h5" component="div">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
      {children}
    </CardContent>
  </Card>
)

export default InfoCard
