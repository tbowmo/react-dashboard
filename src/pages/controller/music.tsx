import * as React from 'react'
import { Media } from '../../core/data'
import style from './controller.module.scss'
import { Duration } from './duration'
import { MediaProp } from './media-prop'

type Props = {
    media: Media,
}

export function Music(props: Props) {
    const { media } = props

    return (
        <React.Fragment>
            <Duration media={media} />
            <MediaProp 
                label="Kunstner"
                className={style.artist}
                value={media.artist}
            />
            <MediaProp 
                label="Album"
                className={style.album}
                value={media.album}
            />
            <MediaProp
                label="Titel"
                className={style.title}
                value={media.title}
            />
        </React.Fragment>
    )    
}

