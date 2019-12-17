import React from 'react'
import { Switch, Slider } from '@material-ui/core'
import style from './scene.module.scss'
import { Card2Line } from '../../core/card-2-line/card-2-line'
import { useMqttClient } from '../../core/data'

type Props = {
    mqttPath: string,
    label: string,
}

export function LightDimmer(props: Props) {
    const mqtt = useMqttClient()

    function valuetext(value) {
        return `${value}°C`
    }

    return (
        <Card2Line cols="2" label={props.label}>
            <div className={style.light}>
                <div>
                    <Switch color="primary" />
                </div>
                <div className={style.slider}>
                    <Slider 
                        defaultValue={80}
                        getAriaValueText={valuetext}
                        aria-labelledby="discrete-slider-always"
                        step={10}
                        valueLabelDisplay="on"
                    />
                </div>
            </div>
        </Card2Line>
    )
}
