import * as React from 'react'
import { Chromecast } from '@dashboard/types'
import style from './controller.module.scss'
import { Duration } from './duration'
import { MediaProp } from './media-prop'

export function RadioTv(props: {media: Chromecast.Media}) {
    const { media } = props
    return (
        <React.Fragment>
            <Duration />
            <MediaProp
                label="Program"
                className={style.station}
                value={media?.album}
            />
            <MediaProp
                label="Beskrivelse"
                className={style.description}
                value={media?.title}
                lines={4}
            />
        </React.Fragment>
    )
}
