import React from 'react'
import { Switch, Slider } from '@material-ui/core'
import './scene.scss'
import { Card2Line } from '../../core/card-2-line/card-2-line'

type Props = {
    light: string,
    label: string,
}

export function LightDimmer(props: Props) {
    return (
        <Card2Line cols="2" label={props.label}>
            <div className="light">
                <div>
                    <Switch color="primary" />
                </div>
                <div className="slider">
                    <Slider />
                </div>
            </div>
        </Card2Line>

    )
}