import * as React from 'react'
import style from './tabs.module.scss'
import {
    Switch,
    Route,
    useLocation,
} from 'react-router'
import { Streams } from '../../pages/streams/streams'
import { Controller } from '../../pages/controller/controller'
import history from '../../history'
import { Scene } from '../../pages/scene/scene'
import { Surveilance } from '../../pages/surveilance/surveilance'
import { House } from '../../pages/house/house'
import { Weather } from '../../pages/weather/weather'
import { 
    MdHome,
    MdRadio,
    MdTv,
    MdVideocam,
    MdWbSunny,
    MdSettingsRemote,
} from 'react-icons/md'
import { Wifi } from '../../pages/wifi/wifi'
import clsx from 'clsx'

let timer: ReturnType<typeof setTimeout> | null = null

type MenuEntry = {
    label: string,
    target: string,
    css: string,
}

export function resetTimer(timeout = Number(process.env.REACT_APP_ACTION_TIMEOUT)) {
    if (timer !== null) {
        clearTimeout(timer)
    }
    function mainPage() {
        history.replace('/')
        timer = null
    }
    timer = setTimeout(mainPage, timeout)
}

function stopTimer() {
    if (timer !== null) {
        clearTimeout(timer)
    }
}

function buttonClick(menu: MenuEntry) {
    history.replace(menu.target)
}

const menuLinks = [
    {
        label: 'Main',
        target: '/',
        css: 'active',
        icon: MdHome,
    },
    {
        label: 'Radio',
        target : '/streams/radio',
        css: '',
        icon: MdRadio,
    },
    {
        label: 'TV',
        target: '/streams/tv',
        css: '',
        icon: MdTv,
    },
    {
        label: 'Weather',
        target: '/weather',
        css: '',
        icon: MdWbSunny,
    }, 
    {
        label: 'Scene',
        target: '/scene',
        css: '',
        icon: MdSettingsRemote,
    },
    {
        label: 'Video',
        target: '/surveilance',
        css: '',
        icon: MdVideocam,
    },
]

export function Tabs() {
    const location = useLocation()

    React.useEffect(() => {
        if (location.pathname === '/') {
            stopTimer()
        } else {
            resetTimer()
        }
    }, [location])

    return (
        <div className={style.tabs}>
            { menuLinks.map((menuEntry) => (
                <div 
                    key={menuEntry.label} 
                    onClick={() => buttonClick(menuEntry)} 
                    className={clsx((menuEntry.target === location.pathname) && style.active, style.tab)}
                >
                    <div className={style.center}>
                        <menuEntry.icon />
                    </div>
                </div>
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
                path="/weather"
                exact={false}
                component={Weather}
            />
            <Route
                path="/wifi"
                exact={false}
                component={Wifi}
            />
            <Route
                path="/"
                exact={false}
                component={Controller}
            />
        </Switch>
    )
}