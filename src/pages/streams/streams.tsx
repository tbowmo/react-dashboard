import * as React from 'react'
import { Card } from '../../core/card/card'
import './streams.scss'
import { MqttClient } from 'mqtt'
import TextTruncate from 'react-text-truncate'
import {
    useStreams,
    StreamDto,
    useMqttClient,
} from '../../core/data'

type Props = {
    type: 'radio' | 'tv',
}

function SelectStream(stream: StreamDto, mqttClient: MqttClient, setActive: (value: string) => void) {
    setActive(stream.link)
    mqttClient.publish('media/stuen/control/play', JSON.stringify(stream))
}

export function Streams(props: Props) {
    const {
        type,
    } = props

    const [ active, setActive ] = React.useState('')
    const streams = useStreams(type)

    const mqttClient = useMqttClient()
    
    return (
        <div className="streams">
            {streams.map((streamEntry) => (
                <Card cols="2" className="singleStream" key={streamEntry.friendly} onClick={() => SelectStream(streamEntry, mqttClient, setActive)}>
                    <div className={'center channel ' + ((streamEntry.link === active) ? 'active' : '')}>
                        { streamEntry.icon === '' ? streamEntry.friendly : <img src={streamEntry.icon} /> }
                    </div>
                    <TextTruncate
                        line={1}
                        element="div"
                        truncateText="…"
                        text={streamEntry.programme || streamEntry.friendly}
                        className="center show"
                    />  
                </Card>
            ))}
        </div>
    )
}
