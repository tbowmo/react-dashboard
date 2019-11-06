import * as React from 'react'
import { Card } from '../../core/card/card'
import './streams.scss'
import { useMqttClient } from '../../core/mqtt/mqtt'
import { MqttClient } from 'mqtt'

type Props = {
    type: string
}

type Stream = {
    label: string,
    link: string,
    type: string,
}

const TV: Stream[] = [
    {link:'https://dr01-lh.akamaihd.net/i/live/dr01_0@147054/master.m3u8?b=100-4000', type:'video/mp4', label:'DR1'},
    {link:'https://dr02-lh.akamaihd.net/i/live/dr02_0@147055/master.m3u8?b=100-4000', type:'video/mp4', label:'DR2'},
    {link:'https://dr03-lh.akamaihd.net/i/live/dr03_0@147056/master.m3u8?b=100-4000', type:'video/mp4', label:'DR3'},
    {link:'https://dr04-lh.akamaihd.net/i/live/dr04_0@147057/master.m3u8?b=100-4000', type:'video/mp4', label:'DRK'},
    {link:'https://dr05-lh.akamaihd.net/i/live/dr05_0@147058/master.m3u8?b=100-4000', type:'video/mp4', label:'Ramasjang'},
    {link:'https://dr06-lh.akamaihd.net/i/live/dr06_0@147059/master.m3u8?b=100-4000', type:'video/mp4', label:'Ultra'},
]

const RADIO: Stream[] = [
    { link:'http://live-icy.gss.dr.dk/A/A03H.mp3', type:'audio/mp3', label:'DR P1'},
    { link:'http://live-icy.gss.dr.dk/A/A04H.mp3', type:'audio/mp3', label:'DR P2'},
    { link:'http://live-icy.gss.dr.dk/A/A05H.mp3', type:'audio/mp3', label:'DR P3'},
    { link:'http://live-icy.gss.dr.dk/A/A10H.mp3', type:'audio/mp3', label:'DR P4'},
    { link:'http://live-icy.gss.dr.dk/A/A29H.mp3', type:'audio/mp3', label:'DR P6'},
    { link:'http://live-icy.gss.dr.dk/A/A21H.mp3', type:'audio/mp3', label:'DR P7'},
]

function SelectStream(stream: Stream, mqttClient: MqttClient, setActive: (value: string) => void) {
    setActive(stream.link)
    mqttClient.publish('chromecast/play', JSON.stringify(stream))
}

export function Streams(props: Props) {
    const [ active, setActive ] = React.useState('')
    const streams: Stream[] = (props.type === 'tv') ? TV : RADIO
    const mqttClient = useMqttClient()
    return (
        <div className="streams">
            { streams.map((streamEntry) => 
            <Card key={streamEntry.label} onClick={() => SelectStream(streamEntry, mqttClient, setActive)}>
                <div className={'center ' + ((streamEntry.link === active) ? 'active' : '')} >
                    {streamEntry.label}
                </div>
            </Card>
            )}

        </div>
    )
}
