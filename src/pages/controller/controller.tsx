import * as React from 'react'
import style from './controller.module.scss'
import {
    useCapabilities,
    useMedia,
    useSubscribeStringPayload,
} from '../../core/data/'
import { Weather } from '../weather/weather'
import { Music } from './music'
import { RadioTv } from './radio-tv'
import { Others } from './others'
import { Remote } from './remote'
import clsx from 'clsx'

export function Controller() {
    const [ showAlbumCover, setShowAlbumCover ] = React.useState<boolean>(false)

    const media = useMedia()
    const capabilities = useCapabilities()
    const avcenter = useSubscribeStringPayload('avctrl/out/scene') || ''

    function clickAlbumCover() {
        setShowAlbumCover(true)
    }

    React.useEffect(() => {
        if (showAlbumCover) {
            const timeOut = setTimeout(() => setShowAlbumCover(false), 5000)
            return () => {
                clearTimeout(timeOut)
            }
        }
    }, [showAlbumCover])

    if (avcenter.toLocaleLowerCase() === 'off' || media === undefined || capabilities === undefined) {   
        return (
            <Weather />
        )
    }

    const isStreaming = avcenter.toLocaleLowerCase().includes('stream')

    return (
        <div className={style.controller}> 
            { isStreaming ? (
                <div className={style.mediaInfo}>
                    { (media.album_art ?? '') !== '' && (capabilities.app_icon ?? '') !== '' ? (
                        <div className={style.appIcon}>
                            <img src={capabilities.app_icon} alt={capabilities.app} />
                        </div>
                    ) : null}
                    <div className={clsx(style.albumCover, showAlbumCover && style.raiseAppIcon)}>
                        <img src={media.album_art || capabilities.app_icon} alt={media.album} onClick={clickAlbumCover} />
                    </div>
                    { media.type === 0 ? (<Music media={media} />) : (<RadioTv media={media} />) }
                </div>
            ): (
                <Others type={avcenter} />
            )}
            <Remote />
        </div>
    )
}
