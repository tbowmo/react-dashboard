import * as React from 'react'
import { deviceSet, DeviceType } from './device-set'
import { useTabs } from '../../core/tabs/tabs-context'
import { SvgIconComponent } from '@mui/icons-material'
import { GridCard } from '../../core/card-2-line/grid-card'
import { CardContent, IconButton, Typography } from '@mui/material'

export type Props = {
  label?: string
  room?: string
  type?: DeviceType
  device: string
  payload: string
  icon?: SvgIconComponent
  active?: boolean
}

export function MqttButton(props: Props) {
  const {
    room = 'stuen',
    type = 'avctrl',
    device,
    payload,
    icon: Icon,
    label,
  } = props
  const [keyActivated, setKey] = React.useState<boolean>(false)

  function click() {
    setKey(true)
    deviceSet(room, type, device, payload)
  }

  const { startTimer } = useTabs()

  React.useEffect(() => {
    let timer: NodeJS.Timeout
    if (keyActivated) {
      timer = setTimeout(() => {
        setKey(false)
        startTimer(200)
      }, 200)
    }
    return () => {
      clearTimeout(timer)
    }
  }, [keyActivated, startTimer])

  return (
    <GridCard>
      <CardContent component={IconButton} onClick={() => click()}>
        {Icon ? <Icon fontSize="large" /> : null}
        <Typography>{label}</Typography>
      </CardContent>
    </GridCard>
  )
}
