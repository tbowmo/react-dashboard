import * as React from 'react'
import style from './tabs.module.scss'
import {
    useLocation,
    useHistory,
} from 'react-router'

import { 
    MdHome,
    MdRadio,
    MdTv,
    MdVideocam,
    MdWbSunny,
    MdSettingsRemote,
    MdWifi,
} from 'react-icons/md'

import clsx from 'clsx'
import { useTimeout } from './timeout'

type MenuEntry = {
    label: string,
    target: string,
    css: string,
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
    {
        label: 'Wifi',
        target: '/wifi',
        css: '',
        icon: MdWifi,
    },
]

export function Tabs() {
    const location = useLocation()
    const timeout = useTimeout()

    React.useEffect(() => {
        if (location.pathname === '/') {
            timeout.stopTimer()
        } else {
            timeout.startTimer()
        }
    }, [location])

    const history = useHistory()

    function buttonClick(menu: MenuEntry) {
        history.replace(menu.target)
    }
    
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
