import * as React from 'react'
import style from './scene.module.scss'
import { IconType } from 'react-icons/lib/cjs'
import clsx from 'clsx'
import { deviceSet, DeviceType } from './device-set'
import { useTimeout } from '../../core/tabs/timeout'

export type Props = {
    className: string,
    label?: string,
    room?: string,
    type?: DeviceType,
    device: string,
    payload: string,
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
        deviceSet(room, type, device, payload)
    }
    
    const {startTimer} = useTimeout()
    
    React.useEffect( () => {
        if (keyActivated) {
            const timer = setTimeout(() => {
                setKey(false)
                startTimer(200)
            }, 200)
            return () => {clearTimeout(timer)}
        } 
    }, [keyActivated, startTimer])

    return (
        <div className={clsx(style.mqttBase, keyActivated && style.active, className)} onClick={click}>
            { Icon ? (<div className={style.center}><Icon /></div>) : null }
            <div className={style.center}>{label}</div>
        </div>
    )
}
