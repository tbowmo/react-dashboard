import * as React from 'react'
import style from './tabs.module.scss'
import { Switch, Route } from 'react-router'
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
} from 'react-icons/md'

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
        timer = setTimeout(mainPage, Number(process.env.REACT_APP_ACTION_TIMEOUT))
    }
    setActive(menu.target)
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
    }, /*
    {
        label: 'Scene',
        target: '/scene',
        css: '',
    },
    {
        label: 'Hus',
        target: '/house',
        css: '',
    },*/
    {
        label: 'Video',
        target: '/surveilance',
        css: '',
        icon: MdVideocam,
    },
]

export function Tabs() {
    const [active, setActive] = React.useState('/')
     
    return (
        <div className={style.tabs}>
            { menuLinks.map((menuEntry) => (
                <div 
                    key={menuEntry.label} 
                    onClick={() => buttonClick(menuEntry, setActive)} 
                    className={((menuEntry.target === active) ? `${style.active} ` : '') + `${style.tab}`}
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
                path="/"
                exact={false}
                component={Controller}
            />
        </Switch>
    )
}