import * as React from 'react'
import style from './controller.module.scss'
import {
    useChromecast,
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

    const cast = useChromecast('stuen')
    const avcenter = useSubscribeStringPayload('stuen', 'avctrl', 'scene') || ''

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

    if (avcenter.toLocaleLowerCase() === 'off' || cast === undefined) {   
        return (
            <Weather />
        )
    }

    const isStreaming = avcenter.toLocaleLowerCase().includes('stream')

    return (
        <div className={style.controller}> 
            { isStreaming ? (
                <div className={style.mediaInfo}>
                    { (cast.media.album_art ?? '') !== '' && (cast.capabilities.app_icon ?? '') !== '' ? (
                        <div className={style.appIcon}>
                            <img src={cast.capabilities.app_icon} alt={cast.capabilities.app} />
                        </div>
                    ) : null}
                    <div className={clsx(style.albumCover, showAlbumCover && style.raiseAppIcon)}>
                        <img src={cast.media.album_art || cast.capabilities.app_icon} alt={cast.media.album} onClick={clickAlbumCover} />
                    </div>
                    { cast.media.type === 0 ? (<Music media={cast.media} />) : (<RadioTv media={cast.media} />) }
                </div>
            ): (
                <Others type={avcenter} />
            )}
            <Remote />
        </div>
    )
}
