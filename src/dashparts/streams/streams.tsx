import * as React from 'react'
import { Card } from '../../core/card/card'
import './streams.scss'
import { useMqttClient } from '../../core/mqtt/mqtt'
import { MqttClient } from 'mqtt'

type Props = {
    type: string
}

type Stream = {
    programme: string;
    start: string;
    stop:string;
    id:string;
    friendly:string;
    extra:string;
    xmlid: string;
    link:string;
    media:string;
}

function SelectStream(stream: Stream, mqttClient: MqttClient, setActive: (value: string) => void) {
    setActive(stream.link)
    mqttClient.publish('media/stuen/control/play', JSON.stringify(stream))
}

export function Streams(props: Props) {
    const {
        type
    } = props
    const [ active, setActive ] = React.useState('')
    const [ streams, setStreams] = React.useState([])

    React.useEffect(() => {
        fetch(`http://192.168.4.13:8181/${type}/list`)
          .then(resp => resp.json())
          .then(data => setStreams(data));
      }, [type, setStreams]);

    const mqttClient = useMqttClient()
    return (
        <div className="streams">
            { streams.map((streamEntry) => 
            <Card cols="2" className="singleStream" key={streamEntry.friendly} onClick={() => SelectStream(streamEntry, mqttClient, setActive)}>
                <div className={'center channel ' + ((streamEntry.link === active) ? 'active' : '')} >
                    {streamEntry.friendly}
                </div><div className="center show">
                    {streamEntry.programme || streamEntry.extra}
                </div>
            </Card>
            )}

        </div>
    )
}
