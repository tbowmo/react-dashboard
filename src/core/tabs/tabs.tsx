import * as React from 'react'
import './tabs.scss'
import { Card } from '../card/card'
import { Switch, Route } from 'react-router'
import { Streams } from '../../pages/streams/streams'
import { Controller } from '../../pages/controller/controller'
import history from '../../history'
import { Scene } from '../../pages/scene/scene'
import { Surveilance } from '../../pages/surveilance/surveilance'
import { House } from '../../pages/house/house'

let timer: ReturnType<typeof setTimeout> | null = null
type MenuEntry = {
    label: string,
    target: string,
    css: string,
}

function buttonClick(menu: MenuEntry, setActive: any) {
    if (timer !== null) {
        clearTimeout(timer)
        timer = null
    }
    function mainPage() {
        history.replace('/')
        setActive('/')
        timer = null
    }
    if (menu.target !== '/') {
        timer = setTimeout(mainPage, 5000)
    }
    setActive(menu.target)
    history.replace(menu.target)
}

export function Tabs() {
    const [active, setActive] = React.useState('/')

    const menuLinks = [
        {
            label: 'Main',
            target: '/',
            css: 'active',
        },
        {
            label: 'Radio',
            target : '/streams/radio',
            css: '',
        },
        {
            label: 'TV',
            target: '/streams/tv',
            css: '',
        },
        {
            label: 'Scene',
            target: '/scene',
            css: '',
        },
        {
            label: 'Hus',
            target: '/house',
            css: '',
        },
        {
            label: 'Video',
            target: '/surveilance',
            css: '',
        },
    ]
    
    return (
        <div className="tabs">
            { menuLinks.map((menuEntry) => (
                <Card key={menuEntry.label} onClick={() => buttonClick(menuEntry, setActive)}>
                    <div className={'center ' + ((menuEntry.target === active) ? 'active' : '')}>
                        {menuEntry.label}
                    </div>
                </Card>
            ))}
        </div>
    )
}

function StreamRender(props : { match: { params: {type: any}} }) {
    const { type } = props.match.params
    return (
        <Streams type={type} />
    )
}

export function TabsSwitch() {
    return (
        <Switch>
            <Route 
                path="/scene"
                exact={true}
                component={Scene}
            />
            <Route
                path="/streams/:type"
                exact={false}
                component={StreamRender}
            />
            <Route
                path="/surveilance"
                exact={true}
                component={Surveilance}
            />
            <Route
                path="/house"
                exact={true}
                component={House}
            />
            <Route
                path="/"
                exact={false}
                component={Controller}
            />
        </Switch>
    )
}