import * as React from 'react'
import './controller.scss'
import { Card } from '../../core/card/card'
import {
    faBackward,
    faForward,
    faPause,
    faPowerOff,
    faVolumeDown,
    faVolumeUp,
    IconDefinition
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    useCapabilities,
    useMedia,
    useMqttClient,
    useSubscribeStringPayload,
    useSubscribeNumberPayload,
    Media
} from '../../core/mqtt/mqtt'
import { Card2Line } from '../../core/card-2-line/card-2-line'
import { Sensor } from '../../core/sensor/sensor'

type controlKey = {
    icon: IconDefinition,
    key: string,
    enabled: boolean,
}

export function Controller() {

    const mqttClient = useMqttClient()

    function onClick(target: controlKey) {
        if (mqttClient && target.enabled) {
            if (target.key === 'off') {
                mqttClient.publish('avctrl/in/scene', target.key)
            } else {
                mqttClient.publish('avctrl/in/control', target.key)
            }
        }
    }

    const media = useMedia()
    const capabilities = useCapabilities()
    const avcenter = useSubscribeStringPayload('avctrl/out/scene')

    if ((media === undefined) || (capabilities === undefined)) {
        return null
    }

    const functions: controlKey[] = [
        {icon: faVolumeUp, key: 'volumeup', enabled: true},
        {icon: faVolumeDown, key : 'volumedown', enabled: true},
        {icon: faBackward, key: 'prev', enabled: capabilities.supported_features.skip_bck},
        {icon: faPause, key: 'pause', enabled: capabilities.supported_features.pause},
        {icon: faForward, key: 'next', enabled: capabilities.supported_features.skip_fwd},
        {icon: faPowerOff, key: 'off', enabled: true},
      ];

    return (
        <div className="controller">
        <Card cols="4" rows="2">
        { capabilities.app !== 'None' ? (
            <div className="mediaInfo">
                <div className="center">
                    <img src={media.album_art || capabilities.app_icon} alt={media.album}/>
                </div>
                    <Music media={media} />
            </div>
                ): (
                    <div className="surveilance">
                        <SurveilanceVideo />
                    </div>
                )}
        </Card>
        <Card2Line 
            cols="2"
            value={avcenter}
            label="A/V tilstand"
        />
        <Sensor
            sensorId={99}
            type={18}
            child={2}
            cols="1"
            label="EL forbrug i dag"
            unit="wH"
            precission={0}
        />
        <Sensor
            cols="1"
            sensorId={99}
            type={17}
            child={1}
            label="Aktuelt EL forbrug"
            precission={0}
            unit="watt"
        />
        { functions.map((link) => 
            <Card key={link.key} onClick={() => onClick(link)}>
                <div className="center">
                    <FontAwesomeIcon icon={link.icon} className={link.enabled ? 'enabled':''} />
                </div>
            </Card>
            )}
        </div>
    )
}

function truncString(input: string): string {
    const truncatedString = (input || '').substr(0, 16)
    return truncatedString + ((input !== truncatedString) ? '...' : '')
}

function Music(props: {media: Media}) {
    const { media } = props;
    return (
        <React.Fragment>
            <div>
                <div className="info">{truncString(media.artist)}</div>
            </div>
            <div>
                <div className="info">{truncString(media.album)}</div>
            </div>
            <div>
                <div className="info">{truncString(media.title)}</div>
            </div>
        </React.Fragment>
    )    
}

function Movie(props: {media: Media}) {
    const { media } = props
    return (
        <div />
    )
}

function SurveilanceVideo() {
    return (
        <React.Fragment>
            <img src="http://192.168.3.111/cgi-bin/hi3510/snap.cgi?&-getstream&-chn=2" alt=""/>
            <img src="http://192.168.3.112/cgi-bin/hi3510/snap.cgi?&-getstream&-chn=2" alt=""/>
        </React.Fragment>
    )
}