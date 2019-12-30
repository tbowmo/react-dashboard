import React from 'react'
import style from './app.module.scss'
import { DashTop } from './core/dash-top/dash-top'
import { Tabs, TabsSwitch } from './core/tabs/tabs'

export function App() {

    return (
        <div className={style.App}>
            <div className={style.info}>
                <DashTop />
                <TabsSwitch />
            </div>
            <Tabs />
        </div>
    )
}
