import * as React from 'react'
import style from './streams.module.scss'
import { MqttClient } from 'mqtt'
import TextTruncate from 'react-text-truncate'
import {
    useStreams,
    StreamDto,
    useMqttClient,
} from '../../core/data'
import { resetTimer } from '../../core/tabs/tabs'
import moment from 'moment'
import clsx from 'clsx'

type Props = {
    type: 'radio' | 'tv',
}


export function Streams(props: Props) {
    const {
        type,
    } = props

    const [ active, setActive ] = React.useState('')
    const streams = useStreams(type)

    const mqtt = useMqttClient()

    function SelectStream(stream: StreamDto, mqttClient: MqttClient) {
        setActive(stream.link)
        mqttClient.publish('media/stuen/control/play', JSON.stringify(stream))
    }

    React.useEffect( () => {
        if (active !== '') {
            const timer = setTimeout(() => {
                setActive('')
                resetTimer(200)
            }, 200)
            return () => {clearTimeout(timer)}
        } 
    }, [active, mqtt])

    return (
        <div className={style.streams}>
            {streams.map((streamEntry) => (
                <div 
                    className={clsx(style.singleStream, (streamEntry.link === active) && style.active)}
                    key={streamEntry.friendly}
                    onClick={() => SelectStream(streamEntry, mqtt)}
                >
                    <div className={style.iconTime}>
                        <div className={clsx(style.center, style.channel)}>
                            { streamEntry.icon === '' ? streamEntry.friendly : <img src={streamEntry.icon} alt={streamEntry.friendly} /> }
                        </div>
                        <div className={style.time}>
                            { streamEntry.start !== streamEntry.stop ? ( 
                                <React.Fragment>
                                    <label className={style.startText}>Start</label>
                                    <div className={style.startTime}>{moment(streamEntry.start).format('HH:mm')}</div>
                                    <label className={style.endText}>Slut</label>
                                    <div className={style.endtime}>{moment(streamEntry.stop).format('HH:mm')}</div>
                                </React.Fragment>
                            ) : null }
                        </div>
                    </div>
                    <TextTruncate
                        line={1}
                        element="div"
                        truncateText="…"
                        text={streamEntry.programme || streamEntry.friendly}
                        className={clsx(style.center, style.show)}
                    />  
                </div>
            ))}
        </div>
    )
}
