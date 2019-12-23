import React from 'react'
import { Slider } from '@material-ui/core'
import style from './scene.module.scss'
import { Card2Line } from '../../core/card-2-line/card-2-line'
import { useMqttClient, useSubscribeNumberPayload } from '../../core/data'
import { FaLightbulb, FaRegLightbulb } from 'react-icons/fa'
import { resetTimer } from '../../core/tabs/tabs'

type Props = {
    mqttTopic: string,
    label: string,
}

function rgbToHex(rgb: number): string { 
    var hex = Number(rgb).toString(16)
    if (hex.length < 2) {
        hex = '0' + hex
    }
    return hex
}

function pickHex(color1, color2, weight): string {
    weight = weight / 100
    var w1 = weight
    var w2 = 1 - w1
    var rgb = [Math.round(color1[0] * w1 + color2[0] * w2),
        Math.round(color1[1] * w1 + color2[1] * w2),
        Math.round(color1[2] * w1 + color2[2] * w2)]
    return rgbToHex(rgb[0])+rgbToHex(rgb[1])+rgbToHex(rgb[2])
}

export function LightDimmer(props: Props) {
    const [ lightIntensity, setLightIntensity ] = React.useState(100)
    const [ disabled, setDisabled ] = React.useState(false)

    const mqtt = useMqttClient()

    const endColor: number[] = [0x15, 0x15, 0x15]
    const startColor: number[] = [0xff, 0x8c, 0x00]

    function valueUpdate(_event, value) {
        setLightIntensity(value)
        resetTimer()
    }

    function valueCommit(_event, value) {
        mqtt.publish(`light/${props.mqttTopic}/set`, value.toString())
    }
    
    const mqttLightIntensity = useSubscribeNumberPayload(`light/${props.mqttTopic}`)
    
    React.useEffect(() => {
        if (mqttLightIntensity < 0) {
            setLightIntensity(0)
            setDisabled(true)
        } else {
            setLightIntensity(mqttLightIntensity)
            setDisabled(false)
        }
    }, [mqttLightIntensity])
    
    if (lightIntensity === undefined) return null

    return (
        <Card2Line cols="2" label={props.label}>
            <div className={style.light}>
                <div style={{ color: '#' + pickHex(startColor, endColor, lightIntensity) }}>
                    { disabled ? (<FaRegLightbulb />) : (<FaLightbulb />) }
                </div>

                <div className={style.slider}>
                    <Slider 
                        value={lightIntensity}
                        name={props.mqttTopic}
                        disabled={disabled}
                        step={10}
                        onChange={valueUpdate}
                        onChangeCommitted={valueCommit}
                    />
                </div>
            </div>
        </Card2Line>
    )
}
