import React from 'react'
import { useNavigate } from 'react-router-dom'
import { tabsContext } from './tabs-context'

const DEFAULTTAB = 'main' // for debugging, this can be set to whatever tab you need
const defaultTimeout = import.meta.env.VITE_ACTION_TIMEOUT ?? 20000

type TimerType = ReturnType<typeof setTimeout> | null

type Props = {
  children: React.ReactNode
}

export function TabsProvider(props: Props) {
    const { children } = props
    const [activeTab, setActiveTab] = React.useState<string>(DEFAULTTAB)
    const timer = React.useRef<TimerType>(null)
    const navigate = useNavigate()

    React.useEffect(() => {
        navigate(`/${activeTab}`)
    }, [activeTab, navigate])

    const stopTimer = React.useCallback(() => {
        if (timer.current !== null) {
            clearTimeout(timer.current)
            timer.current = null
        }
    }, [])

    const startTimer = React.useCallback(
        (timeout = defaultTimeout) => {
            if (timer.current !== null) {
                stopTimer()
            }
            timer.current = setTimeout(() => {
                setActiveTab(DEFAULTTAB)
            }, timeout)
        },
        [stopTimer],
    )

    const setTab = React.useCallback(
        (page: string) => {
            setActiveTab(page)
            startTimer()
        },
        [startTimer],
    )

    const value = React.useMemo(
        () => ({
            activeTab,
            setActiveTab: setTab,
            startTimer,
            stopTimer,
        }),
        [activeTab, startTimer, stopTimer, setTab],
    )

    return <tabsContext.Provider value={value}>{children}</tabsContext.Provider>
}

