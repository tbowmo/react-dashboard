import * as React from 'react'
import { 
    MdAlbum,
    MdTv,
    MdGames,
} from 'react-icons/md'
import style from './media.module.scss'
import { MediaProp } from './media-prop'


type Props = {
    type: string,
}

function Icon(props: {type: string}): React.ReactElement{
    switch (props.type.toLowerCase())
    {
    case 'tv' :
        return ( <MdTv /> )
    case 'wii':
    case 'ps2':
        return ( <MdGames /> )
    default:
        return ( <MdAlbum /> )
    }
}

export function Others(props: Props) {
    return (
        <div className={style.mediaInfo}>
            <div className={style.albumCover}>
                <Icon type={props.type} />
            </div>
            <MediaProp
                label=""
                className={style.artist}
                value="Ingen information"
            />
        </div>
    )
}

