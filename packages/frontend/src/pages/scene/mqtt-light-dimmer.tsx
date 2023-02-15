import React from 'react'
import { Slider, Box, Modal, Typography } from '@mui/material'
import { Lightbulb, LightbulbOutlined } from '@mui/icons-material'
import { deviceSet } from './device-set'
import { MqttAction } from './mqtt-action'
import { useSSENumber } from '../../core/data'
import { useTabs } from '../../core/tabs/tabs-context'

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
  const [modalOpen, setModalOpen] = React.useState(false)
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

  const timerRef = React.useRef<ReturnType<typeof setTimeout>>()

  if (lightIntensity === undefined) return null

  const Bulb = disabled ? LightbulbOutlined : Lightbulb

  function touchStart(
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) {
    startTimer()
    event.preventDefault()
    timerRef.current = setTimeout(() => {
      setModalOpen(true)
    }, 500)
  }

  function touchEnd(
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) {
    event.preventDefault()
    if (!modalOpen) {
      if (currentLightIntensity > 0) {
        deviceSet(room, 'light', device, 'off')
      } else {
        deviceSet(room, 'light', device, 'on')
      }
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
  }

  return (
    <React.Fragment>
      <MqttAction
        onTouchStart={(event) => touchStart(event)}
        onMouseDown={(event) => touchStart(event)}
        onTouchEnd={(event) => touchEnd(event)}
        onMouseUp={(event) => touchEnd(event)}
        icon={Bulb}
        iconColor={`#${pickHex(startColor, endColor, lightIntensity)}`}
        label={label}
      />
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute' as const,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Typography sx={{ margin: 'auto' }}>{label}</Typography>
          <Slider
            sx={{
              '@media (pointer: coarse)': {
                padding: '10px 10px',
              },
              margin: 'auto',
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
        </Box>
      </Modal>
    </React.Fragment>
  )
}
