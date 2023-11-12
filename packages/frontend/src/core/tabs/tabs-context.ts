import { useContext, createContext } from 'react'

type TabsContent = {
    activeTab: string
    setActiveTab: (index: string) => void
    startTimer: (timeout?: number) => void
    stopTimer: () => void
  }
  
export const tabsContext = createContext<TabsContent>({
    activeTab: '',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setActiveTab: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    startTimer: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    stopTimer: () => {},
})

export function useTabs(): TabsContent {
    return useContext(tabsContext)
}
