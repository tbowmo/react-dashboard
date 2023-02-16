import React from 'react'
import {
  FastRewind,
  FastForward,
  Pause,
  PowerSettingsNew,
  VolumeDown,
  VolumeUp,
  PlayArrow,
  SvgIconComponent,
} from '@mui/icons-material'
import { IconButton, Box } from '@mui/material'
import { useChromeCast } from '../../core/data'

type ControlKey = {
  icon: SvgIconComponent | undefined
  key: string
  state: 'ALL' | 'PAUSED' | 'PLAYING' | 'none'
  repeat?: boolean
}

const functions: ControlKey[] = [
  {
    icon: VolumeUp,
    key: 'volumeup',
    state: 'ALL',
    repeat: true,
  },
  {
    icon: VolumeDown,
    key: 'volumedown',
    state: 'ALL',
    repeat: true,
  },
  {
    icon: FastRewind,
    key: 'prev',
    state: 'ALL',
  },
  {
    icon: Pause,
    key: 'pause',
    state: 'PLAYING',
  },
  {
    icon: PlayArrow,
    key: 'play',
    state: 'PAUSED',
  },
  {
    icon: undefined,
    key: 'noKey',
    state: 'none',
  },
  {
    icon: FastForward,
    key: 'next',
    state: 'ALL',
  },
  {
    icon: PowerSettingsNew,
    key: 'off',
    state: 'ALL',
  },
]

let repeatIntervalTimer: ReturnType<typeof setInterval> | undefined

function stopInterval() {
  if (repeatIntervalTimer) {
    clearInterval(repeatIntervalTimer)
    repeatIntervalTimer = undefined
  }
}

export function Remote() {
  const [activeKey, setActiveKey] = React.useState<string>('')
  const [repeat, setRepeat] = React.useState<ControlKey | undefined>(undefined)

  const capabilities = useChromeCast('stuen')

  function buttonDown(target: ControlKey) {
    setRepeat(target)
    setActiveKey(target.key)
    fetch(`/remote/stuen/${target.key}`).then(() => {})
  }

  function buttonRelease() {
    setRepeat(undefined)
  }

  React.useEffect(() => {
    if (repeat?.repeat && repeatIntervalTimer === undefined) {
      repeatIntervalTimer = setInterval(() => {
        setActiveKey(repeat.key)
        fetch(`/remote/stuen/${repeat.key}`).then(() => {})
      }, 400)
    } else {
      stopInterval()
    }
    return () => stopInterval()
  }, [repeat, setActiveKey])

  React.useEffect(() => {
    if (activeKey !== '') {
      setTimeout(() => setActiveKey(''), 200)
    }
  }, [activeKey, setActiveKey])

  const remoteButtons = functions.filter((button): boolean => {
    if (button.state === 'ALL') return true
    const state = capabilities?.state || 'none'
    if (['PLAYING', 'PAUSED'].includes(state)) {
      return button.state === state
    }
    return button.state === 'none'
  })

  return (
    <Box
      sx={{
        width: '80px',
        height: '100%',
        gridTemplateRows: `repeat(${remoteButtons.length} 1fr)`,
        display: 'grid',
      }}
    >
      {remoteButtons.map((link) => (
        <IconButton
          key={link.key}
          onTouchStart={() => buttonDown(link)}
          onTouchEnd={() => buttonRelease()}
          onMouseDown={() => buttonDown(link)}
          onMouseUp={() => buttonRelease()}
        >
          {link.icon ? (
            <link.icon sx={{ width: '60px', height: '60px' }} />
          ) : null}
        </IconButton>
      ))}
    </Box>
  )
}
