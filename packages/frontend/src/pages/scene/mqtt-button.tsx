import * as React from 'react'
import style from './scene.module.scss'
import { IconType } from 'react-icons/lib/cjs'
import { resetTimer } from '../../core/tabs/tabs'
import clsx from 'clsx'

export type Props = {
    className: string,
    label?: string,
    room?: string,
    type?: string,
    device: string,
    payload?: string,
    icon?: IconType,
}

export function MqttButton(props: Props) {
    const {
        room = 'stuen',
        type = 'avctrl',
        device,
        payload,
        icon: Icon,
        label,
        className,
    } = props
    const [ keyActivated, setKey ] = React.useState<boolean>(false)

    function click() {
        setKey(true)
        fetch(`button/${room}/${type}/${device}/${payload}`)
    } 

    React.useEffect( () => {
        if (keyActivated) {
            const timer = setTimeout(() => {
                setKey(false)
                resetTimer(200)
            }, 200)
            return () => {clearTimeout(timer)}
        } 
    }, [keyActivated, props])

    return (
        <div className={clsx(style.mqttBase, keyActivated && style.active, className)} onClick={click}>
            { Icon ? (<div className={style.center}><Icon /></div>) : null }
            <div className={style.center}>{label}</div>
        </div>
    )
}
