import * as React from 'react'
import style from './wifi.module.scss'
import { useSubscribeStringPayload } from '../../core/data'
var QRCode = require('qrcode.react')

export function Wifi() {
    const type='WPA'
    const ssid='bowmo-guests'
    const passphrase=useSubscribeStringPayload('wifi/bowmo-guests')
    const hidden='true'
    const data = `WIFI:T:${type};S:${ssid};P:${passphrase};H:${hidden};;`
    return (
        <div className={style.wifi}>
            <div className={style.headline}>
            scan koden for at komme på gæste netværket
            </div>
            <div className={style.code}>
                <figure>
                    <QRCode value={data} size={356} />
                    <figcaption>
                        <div><label>Wifi:</label> {ssid}</div>
                        <div><label>Kode:</label> {passphrase}</div>
                    </figcaption>
                </figure>
            </div>
        </div>
    )
}
