import { useHistory } from "react-router"
import { useCallback } from 'react'

let timer: ReturnType<typeof setTimeout> | null = null

export function useTimeout(): {
    startTimer: (timeout?: number) => void,
    stopTimer: () => void
} {
    const history = useHistory()


    const startTimer = useCallback((timeout: number = Number(process.env.REACT_APP_ACTION_TIMEOUT)) => {
        if (timer !== null) {
            clearTimeout(timer)
        }
        function mainPage() {
            history.replace('/')
            timer = null
        }
        timer = setTimeout(mainPage, timeout)
    }, [history])

    const stopTimer = useCallback(() => {
        if (timer !== null) {
            clearTimeout(timer)
        }
    }, [])

    return {
        startTimer,
        stopTimer,
    }
}
