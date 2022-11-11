import * as React from 'react'
import SwipeableViews from 'react-swipeable-views'
import { Tab, Tabs, Box } from '@mui/material'
import {
  House,
  ShowChart,
  Radio,
  WbSunny,
  Videocam,
  Wifi,
  SvgIconComponent,
} from '@mui/icons-material'
import { Controller } from '../../pages/media/media'
import { Streams } from '../../pages/streams/streams'
import { Weather } from '../../pages/weather/weather'
import { Surveilance } from '../../pages/surveilance/surveilance'
import { WifiPassPhrase } from '../../pages/wifi/wifi-pass-phrase'
import { useTabs } from './tabs-context'
import { Scene } from '../../pages/scene/scene'
import { RemoteTv } from 'mdi-material-ui'
import { Utility } from '../../pages/utility/utility'

type MenuEntry = {
  label: string
  icon: SvgIconComponent
  component: JSX.Element
}

const menuLinks: MenuEntry[] = [
  {
    label: 'Main',
    icon: House,
    component: <Controller />,
  },
  {
    label: 'TV',
    icon: Radio,
    component: <Streams />,
  },
  {
    label: 'Scene',
    icon: RemoteTv,
    component: <Scene />,
  },
  {
    label: 'Weather',
    icon: WbSunny,
    component: <Weather />,
  },
  {
    label: 'Video',
    icon: Videocam,
    component: <Surveilance />,
  },
  {
    label: 'Utility',
    icon: ShowChart,
    component: <Utility />,
  },
  {
    label: 'Wifi',
    icon: Wifi,
    component: <WifiPassPhrase />,
  },
]

interface TabPanelProps {
  children?: React.ReactNode
  active: boolean
}

function TabPanel(props: TabPanelProps) {
  const { children, active } = props

  return (
    <Box sx={{ height: '100%', marginLeft: 1, marginRight: 0 }}>
      {active && children}
    </Box>
  )
}

export function IotTabs() {
  const { activeTab, setActiveTab } = useTabs()

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const handleChangeIndex = (index: number) => {
    setActiveTab(index)
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'min-content auto',
        height: '100%',
        width: '100%',
      }}
    >
      <Tabs
        orientation="vertical"
        variant="standard"
        sx={{ borderColor: 'divider' }}
        value={activeTab}
        onChange={handleChange}
        textColor="inherit"
        indicatorColor="secondary"
      >
        {menuLinks.map((menuEntry) => (
          <Tab
            key={menuEntry.label}
            icon={<menuEntry.icon sx={{ width: '60px', height: '60px' }} />}
          />
        ))}
      </Tabs>
      <SwipeableViews
        axis="y"
        index={activeTab}
        onChangeIndex={handleChangeIndex}
        style={{ width: '100%', height: '100%' }}
        containerStyle={{ width: '100%', height: '100%' }}
        slideStyle={{ height: '100%' }}
        enableMouseEvents
        resistance
      >
        {menuLinks.map((menuEntry, index) => (
          <TabPanel active={activeTab === index} key={menuEntry.label}>
            {menuEntry.component}
          </TabPanel>
        ))}
      </SwipeableViews>
    </Box>
  )
}
