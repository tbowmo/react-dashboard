import { Grid, Typography } from '@mui/material'
import QRCode from 'qrcode.react'
import { useSSEString } from '../../core/data'

export function WifiPassPhrase() {
    const type = 'WPA'
    const ssid = 'bowmo-guest'
    const passphrase = useSSEString('global', 'wifi', 'bowmo_guest') ?? ''

    const hidden = 'false'
    const data = `WIFI:T:${type};S:${ssid};P:${passphrase};H:${hidden};;`
    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
        >
            <Grid item xs={3}>
                <Typography variant="h5">
                    scan koden for at komme på gæste netværket
                </Typography>
                <figure>
                    <QRCode value={data} size={356} />
                    <figcaption>
                        <Grid container>
                            <Grid item xs={6}>
                                <Typography>Wifi :</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>{ssid}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>Kode:</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>{passphrase}</Typography>
                            </Grid>
                        </Grid>
                    </figcaption>
                </figure>
            </Grid>
        </Grid>
    )
}
