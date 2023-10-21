import React from 'react'
import { useNavigate } from 'react-router-dom'

const DEFAULTTAB = 'main' // for debugging, this can be set to whatever tab you need

type TimerType = ReturnType<typeof setTimeout> | null

type TabsContent = {
  activeTab: string
  setActiveTab: (index: string) => void
  startTimer: (timeout?: number) => void
  stopTimer: () => void
}

const TabsContext = React.createContext<TabsContent>({
    activeTab: '',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setActiveTab: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    startTimer: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    stopTimer: () => {},
})

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
        (timeout = Number(import.meta.env.VITE_ACTION_TIMEOUT)) => {
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

    return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>
}

export function useTabs(): TabsContent {
    return React.useContext(TabsContext)
}
