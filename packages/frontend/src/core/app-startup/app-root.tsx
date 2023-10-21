import React from 'react'
import {
    Box,
    Tabs,
    Tab,
} from '@mui/material'
import { DashTop } from '../dash-top/dash-top'
import { Outlet } from 'react-router'
import { SvgIconComponent } from '@mui/icons-material'
import { useTabs , TabsProvider } from '../tabs/tabs-context'

type MenuEntry = {
    label: string
    icon: SvgIconComponent
    component: JSX.Element
  }

type Props = { 
    menuLinks: MenuEntry[]
}

/**
 * This resets navigation timeout for returning back to the main page, when suspense is resolved
 * (ie, when this component is unmounted the useEffect cleanup is run)
 * Should assure that we do not navigate to the main screen a few seconds after data is loaded
 */
function Fallback() {
    const { startTimer } = useTabs()

    React.useEffect(() => {
        return () => startTimer()
    }, [startTimer])

    return (
        <div />
    )
}

export function InnerAppRoot(props: Props) {
    const { menuLinks } = props

    const { activeTab, setActiveTab } = useTabs()

    function handleChange(_event, value) {
        setActiveTab(value)
    }

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateRows: 'min-content 1fr',
                height: '100vh',
                width: '100vw',
            }}
        >
            <DashTop />
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
                            value={menuEntry.label.toLowerCase()}
                            icon={<menuEntry.icon sx={{ width: '60px', height: '60px' }} />}
                        />
                    ))}
                </Tabs>
                <Box sx={{ width: '100%', height: '100%' }}>
                    <React.Suspense fallback={<Fallback />}>
                        <Outlet />                  
                    </React.Suspense>
                </Box>
            </Box>
        </Box>
    )
}

export function AppRoot(props: Props) {
    return (
        <TabsProvider>
            <InnerAppRoot {...props}/>
        </TabsProvider>
    )
}
