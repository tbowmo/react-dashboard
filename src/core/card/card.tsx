import * as React from 'react'
import './card.scss'

export type colSize = "1" | "2" | "3" | "4" | "5" | "6"

export type rowSize = "1" | "2" | "3"

type Props = {
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void,
    children: React.ReactNode,
    className?: string,
    cols?: colSize,
    rows?: rowSize,
}

export function Card(props: Props) {
    const {
        cols="1",
        rows="1",
        className=''
    } = props

    return (
        <div onClick={props.onClick} className={`card cols${cols} rows${rows} ${className}`}>
            {props.children}
        </div>
    )
}
