import React from 'react'
import { CardContent, Slider, Typography, Box } from '@mui/material'
import { useSSENumber } from '../../core/data'
import { deviceSet } from './device-set'
import { useTabs } from '../../core/tabs/tabs-context'
import { GridCard } from '../../core/card-2-line/grid-card'
import { Lightbulb, LightbulbOutlined } from '@mui/icons-material'

type Props = {
  room?: string
  device: string
  label: string
}

function rgbToHex(rgb: number): string {
  let hex = Number(rgb).toString(16)
  if (hex.length < 2) {
    hex = `0${hex}`
  }
  return hex
}

function pickHex(color1, color2, weight): string {
  const w1 = weight / 100
  const w2 = 1 - w1
  const rgb = [
    Math.round(color1[0] * w1 + color2[0] * w2),
    Math.round(color1[1] * w1 + color2[1] * w2),
    Math.round(color1[2] * w1 + color2[2] * w2),
  ]
  return rgbToHex(rgb[0]) + rgbToHex(rgb[1]) + rgbToHex(rgb[2])
}

export function LightDimmer(props: Props) {
  const { room = 'stuen', device, label } = props
  const [lightIntensity, setLightIntensity] = React.useState(100)
  const [disabled, setDisabled] = React.useState(false)

  const endColor: number[] = [0x15, 0x15, 0x15]
  const startColor: number[] = [0xff, 0x8c, 0x00]
  const { startTimer } = useTabs()

  function valueUpdate(value) {
    setLightIntensity(value)
    startTimer()
  }

  function valueCommit(value) {
    deviceSet(room, 'light', device, value)
  }

  const currentLightIntensity = useSSENumber(room, 'light', device) || 0

  React.useEffect(() => {
    if (currentLightIntensity < 0) {
      setLightIntensity(0)
      setDisabled(true)
    } else {
      setLightIntensity(currentLightIntensity)
      setDisabled(false)
    }
  }, [currentLightIntensity])

  if (lightIntensity === undefined) return null

  const Bulb = disabled ? LightbulbOutlined : Lightbulb

  return (
    <GridCard xs={5}>
      <CardContent>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'min-content auto',
            gridTemplateRows: 'auto min-content',
            gap: 2,
            gridTemplateAreas: `"bulb slider"
                    "bulb legend"`,
          }}
        >
          <Bulb
            fontSize="large"
            sx={{
              color: `#${pickHex(startColor, endColor, lightIntensity)}`,
              gridArea: 'bulb',
            }}
          />
          <Slider
            sx={{
              '@media (pointer: coarse)': {
                padding: '10px 10px',
              },
              gridArea: 'slider',
            }}
            value={lightIntensity}
            name={device}
            disabled={disabled}
            step={10}
            onChange={(_event, value) => valueUpdate(value)}
            onChangeCommitted={(_event, value) => valueCommit(value)}
            min={0}
            max={100}
          />
          <Typography sx={{ gridArea: 'legend', textAlign: 'center' }}>
            {label}
          </Typography>
        </Box>
      </CardContent>
    </GridCard>
  )
}
