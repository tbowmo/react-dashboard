import React from 'react'
import './App.scss'
import { DashTop } from './core/dash-top/dash-top'
import { Tabs, TabsSwitch } from './core/tabs/tabs'

const App: React.FC = () => {
    return (
        <div className="App">
            <div className="info">
                <DashTop />
                <TabsSwitch />
            </div>
            <Tabs />
        </div>
    )
}

export default App
