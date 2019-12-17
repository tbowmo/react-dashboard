import * as React from 'react'
import style from './wifi.module.scss'
var QRCode = require('qrcode.react')

export function Wifi() {
    const type='WPA'
    const ssid='bowmo-guests'
    const password='krypteret2019'
    const hidden='true'
    const data = `WIFI:T:${type};S:${ssid};P:${password};H:${hidden};;`
    return (
        <div className={style.wifi}>
            <QRCode value={data} size={256} />
            scan koden for at komme på gæste netværket
            <div>
                <div><label>Wifi</label> {ssid}</div>
                
                <div><label>Kode</label> {password}</div>
            </div>
        </div>
    )
}