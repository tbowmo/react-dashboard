import * as React from 'react'
import { Media } from '../../core/data'
import style from './controller.module.scss'
import TextTruncate from 'react-text-truncate'

export function Music(props: {media: Media}) {
    const { media } = props
    return (
        <React.Fragment>
            { media.artist !== '' ? (
                <div className={`${style.artist} ${style.info}`}>
                    <label className={style.label}>
                        Kunstner
                    </label>
                    <TextTruncate
                        line={1}
                        element="div"
                        truncateText="…"
                        text={media.artist}
                    />
                </div>
            ) : null }
            { media.album !== '' ? (
                <div className={`${style.album} ${style.info}`}>
                    <label className={style.label}>
                        Album
                    </label>
                    <TextTruncate
                        line={1}
                        element="div"
                        truncateText="…"
                        text={media.album}
                    />
                </div>
            ): null}
            { media.title !== '' ? (
                <div className={`${style.title} ${style.info}`}>
                    <label className={style.label}>
                        Titel
                    </label>
                    <TextTruncate
                        line={1}
                        element="div"
                        truncateText="…"
                        text={media.title}
                    />
                </div>
            ): null}
        </React.Fragment>
    )    
}

