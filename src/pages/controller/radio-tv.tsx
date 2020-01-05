import * as React from 'react'
import { Media } from '../../core/data'
import style from './controller.module.scss'
import { Duration } from './duration'
import { MediaProp } from './media-prop'

export function RadioTv(props: {media: Media}) {
    const { media } = props
    return (
        <React.Fragment>
            <Duration media={media} />
            <MediaProp
                label="Program"
                className={style.station}
                value={media.album}
            />
            <MediaProp
                label="Beskrivelse"
                className={style.description}
                value={media.title}
                lines={4}
            />
        </React.Fragment>
    )
}
