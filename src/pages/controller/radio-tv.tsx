import * as React from 'react'
import { Media } from '../../core/data'
import style from './controller.module.scss'
import TextTruncate from 'react-text-truncate'

export function RadioTv(props: {media: Media}) {
    const { media } = props
    return (
        <React.Fragment>
            <div className={`${style.station} ${style.info}`}>
                <label className={style.label}>
                    Program
                </label>
                <TextTruncate
                    line={2}
                    element="div"
                    truncateText="…"
                    text={media.album}
                />
            </div>
            <div className={`${style.description} ${style.info}`}>
                <label className={style.label}>
                    Beskrivelse
                </label>
                <TextTruncate
                    line={5}
                    element="div"
                    truncateText="…"
                    text={media.title}
                />
            </div>
        </React.Fragment>
    )
}
