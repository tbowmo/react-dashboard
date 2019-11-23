import * as React from 'react'
import {
    Card,
    colSize,
    rowSize,
} from '../card/card'
import './card-2-line.scss'
import { isNumber } from 'util'

type Props = {
    cols?: colSize,
    rows?: rowSize,
    value?: string | number,
    children?: React.ReactNode,
    label: string,
    unit?: string,
    precission?: number,
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
    } = props

    let v = value
    if (isNumber(value)) {
        if (precission === 0) {
            v = Math.round(value)
        } else {
            v = Math.round(value * (10*precission)) / (10*precission)
        }
    }
    
    return (
        <Card cols={cols} rows={rows}>
            <div className="card2line">
                { value !== undefined ? <div className="section value"><span>{v}</span></div> : children }
                <div className="section label">{label}{unit? `(${unit})` : ''}</div>
            </div>
        </Card>
    )
}
