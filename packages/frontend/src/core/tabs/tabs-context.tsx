import * as React from 'react'

const DEFAULTTAB = 0 // for debugging, this can be set to whatever tab you need

type TimerType = ReturnType<typeof setTimeout> | null

type TabsContent = {
  activeTab: number
  setActiveTab: (index: number) => void
  startTimer: (timeout?: number) => void
  stopTimer: () => void
}

const TabsContext = React.createContext<TabsContent>({
  activeTab: 0,
  setActiveTab: (index: number) => {},
  startTimer: (timeout?: number) => {},
  stopTimer: () => {},
})

type Props = {
  children: React.ReactNode
}

export function TabsProvider(props: Props) {
  const [activeTab, setActiveTab] = React.useState<number>(DEFAULTTAB)
  const timer = React.useRef<TimerType>(null)

  const stopTimer = React.useCallback(() => {
    if (timer.current !== null) {
      clearTimeout(timer.current)
      timer.current = null
    }
  }, [])

  const startTimer = React.useCallback(
    (timeout: number = Number(process.env.REACT_APP_ACTION_TIMEOUT)) => {
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
    (index: number) => {
      setActiveTab(index)
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

  return (
    <TabsContext.Provider value={value}>{props.children}</TabsContext.Provider>
  )
}

export function useTabs(): TabsContent {
  return React.useContext(TabsContext)
}
