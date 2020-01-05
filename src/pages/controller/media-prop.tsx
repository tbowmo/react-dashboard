import * as React from 'react'
import clsx from 'clsx'
import style from './controller.module.scss'
import TextTruncate from 'react-text-truncate'

type Props = {
    className: string,
    label: string,
    lines?: number,
    value?: string,
}

export function MediaProp(props: Props) {
    const {
        className,
        label,
        lines = 1,
        value,
    } = props

    if (!value) {
        return null
    }
    return (
        <div className={clsx(className, style.info)}>
            <label className={style.label}>
                {label}
            </label>
            <TextTruncate
                line={lines}
                element="div"
                truncateText="…"
                text={value}
            />
        </div>
    )
}