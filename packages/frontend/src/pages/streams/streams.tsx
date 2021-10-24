import * as React from 'react'
import style from './streams.module.scss'
import TextTruncate from 'react-text-truncate'
import {
    useStreams,
    StreamDto,
} from '../../core/data'
import moment from 'moment'
import clsx from 'clsx'
import { useTimeout } from '../../core/tabs/timeout'

type Props = {
    type: 'radio' | 'tv',
}


export function Streams(props: Props) {
    const {
        type,
    } = props

    const [ active, setActive ] = React.useState('')
    const streams = useStreams(type)

    function SelectStream(stream: StreamDto) {
        setActive(stream.link)
        console.log('Selecting stream')
        const xhttp = new XMLHttpRequest()
        xhttp.open('POST', '/media/stuen/play', true)
        xhttp.setRequestHeader('Content-type', 'application/json')
        xhttp.send(JSON.stringify(stream))
    }

    const {startTimer} = useTimeout()

    React.useEffect( () => {
        if (active !== '') {
            const timer = setTimeout(() => {
                setActive('')
                startTimer(200)
            }, 200)
            return () => {clearTimeout(timer)}
        }
    }, [active, startTimer])

    return (
        <div className={style.streams}>
            {streams?.map((streamEntry) => (
                <div
                    className={clsx(style.singleStream, (streamEntry.link === active) && style.active)}
                    key={streamEntry.xmlid}
                    onClick={() => SelectStream(streamEntry)}
                >
                    <div className={style.iconTime}>
                        <div className={clsx(style.center, style.channel)}>
                            { streamEntry.icon === '' ? streamEntry.xmlid : <img src={streamEntry.icon} alt={streamEntry.xmlid} /> }
                        </div>
                        <div className={style.time}>
                            { streamEntry.programmes[0].start !== streamEntry.programmes[0].end ? (
                                <React.Fragment>
                                    <label className={style.startText}>Start</label>
                                    <div className={style.startTime}>{moment(streamEntry.programmes[0].start).format('HH:mm')}</div>
                                    <label className={style.endText}>Slut</label>
                                    <div className={style.endtime}>{moment(streamEntry.programmes[0].end).format('HH:mm')}</div>
                                </React.Fragment>
                            ) : null }
                        </div>
                    </div>
                    <TextTruncate
                        line={1}
                        element="div"
                        truncateText="…"
                        text={streamEntry.programmes[0].title}
                        className={clsx(style.center, style.show)}
                    />
                </div>
            ))}
        </div>
    )
}
