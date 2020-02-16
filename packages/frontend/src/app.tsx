import React from 'react'
import style from './app.module.scss'
import { DashTop } from './core/dash-top/dash-top'
import { Tabs, TabsSwitch } from './core/tabs/tabs'
import { SSEProvider } from 'react-hooks-sse'
import { SSEHandler } from './core/data'

export function App() {
    return (
        <SSEProvider endpoint="http://localhost:5000/api/sse">
            <SSEHandler>
                <div className={style.App}>
                    <div className={style.info}>
                        <DashTop />
                        <TabsSwitch />
                    </div>
                    <Tabs />
                </div>
            </SSEHandler>
        </SSEProvider>
    )
}
