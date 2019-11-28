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
    IconDefinition,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    useCapabilities,
    useMedia,
    useMqttClient,
    useSubscribeStringPayload,
    Media,
} from '../../core/data/'
import { Card2Line } from '../../core/card-2-line/card-2-line'
import { Sensor } from '../../core/sensor/sensor'
import TextTruncate from 'react-text-truncate'
import { Weather } from './weather/weather'

type controlKey = {
    icon: IconDefinition,
    key: string,
    enabled: boolean,
}

const functions: controlKey[] = [
    {
        icon: faVolumeUp,
        key: 'volumeup',
        enabled: true,
    },
    {
        icon: faVolumeDown,
        key : 'volumedown',
        enabled: true,
    },
    {
        icon: faBackward,
        key: 'prev',
        enabled: true,
    },
    {
        icon: faPause,
        key: 'pause',
        enabled: true,
    },
    {
        icon: faForward,
        key: 'next',
        enabled: true,
    },
    {
        icon: faPowerOff,
        key: 'off',
        enabled: true,
    },
]

export function Controller() {
    const [ showWeather, setShowWeather ] = React.useState<boolean>(false)

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

    function mediaInfoClick() {
        setShowWeather(true)
        setTimeout(() => {
            setShowWeather(false)
        }, Number(process.env.REACT_APP_ACTION_TIMEOUT))
    }
    
    const media = useMedia()
    const capabilities = useCapabilities()
    const avcenter = useSubscribeStringPayload('avctrl/out/scene') || ''

    if (media === undefined || capabilities === undefined) {
        return null
    }
    
    return (
        <div className="controller">
            <Card cols="4" rows="2">
                { showWeather || !avcenter.toLowerCase().includes('stream') ? (
                    <Weather />
                ) : (
                    <div className="mediaInfo" onClick={mediaInfoClick}>
                        <div className="center">
                            <img src={media.album_art || capabilities.app_icon} alt={media.album} />
                        </div>
                        <Music media={media} />
                    </div>
                )}
            </Card>
            <Card2Line 
                cols="2"
                value={capabilities.app_icon === '' ? avcenter : undefined}
                label="A/V tilstand"
            >
                <div className="avcenter">
                    <div>{avcenter}</div>
                    <div><img src={capabilities.app_icon} /></div>
                </div>
            </Card2Line>
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
            { functions.map((link) => (
                <Card key={link.key} onClick={() => onClick(link)}>
                    <div className="center">
                        <FontAwesomeIcon icon={link.icon} className={link.enabled ? 'enabled':''} />
                    </div>
                </Card>
            ))}
        </div>
    )
}

function Music(props: {media: Media}) {
    const { media } = props
    return (
        <React.Fragment>
            <div>
                <label className="label">
                    Kunstner
                </label>
                <TextTruncate
                    line={1}
                    element="div"
                    truncateText="…"
                    text={media.artist}
                    className="info"
                />
            </div>
            <div>
                <label className="label">
                    Album
                </label>
                <TextTruncate
                    line={1}
                    element="div"
                    truncateText="…"
                    text={media.album}
                    className="info"
                />
            </div>
            <div>
                <label className="label">
                    Titel
                </label>
                <TextTruncate
                    line={1}
                    element="div"
                    truncateText="…"
                    text={media.title}
                    className="info"
                />
            </div>
        </React.Fragment>
    )    
}

