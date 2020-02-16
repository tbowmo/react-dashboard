import * as React from 'react'
import { isNumber } from 'util'
import style from './card-2-line.module.scss'
import clsx from 'clsx'

export type colSize = '1' | '2' | '3' | '4' | '5' | '6'

export type rowSize = '1' | '2' | '3'

type Props = {
    cols?: colSize,
    rows?: rowSize,
    value?: string | number,
    children?: React.ReactNode,
    label: string,
    unit?: string,
    precission?: number,
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void,
    className?,
}

export function Card2Line(props: Props) {
    const {
        cols='1',
        rows='1',
        value,
        label,
        unit,
        children,
        precission = 0,
        onClick,
        className,
    } = props

    let v = value
    if (isNumber(value)) {
        if (precission === 0) {
            v = Math.round(value)
        } else {
            v = Math.round(value * (10*precission)) / (10*precission)
        }
    }

    const rowColumnClass = React.useMemo(() => {
        return clsx(style.card, style[`cols${cols}`], style[`rows${rows}`], className)
    }, [cols, rows, className])

    return (
        <div className={rowColumnClass} onClick={onClick}>
            <div className={style.card2line}>
                { value !== undefined ? <div className={clsx(style.section, style.value)}><span>{v}</span></div> : children }
                <div className={clsx(style.section, style.label)}>{label}{unit? `(${unit})` : ''}</div>
            </div>
        </div>
    )
}
