import {
    TableContainer,
    TableHead,
    TableCell,
    Table,
    TableBody,
    TableRow,
    Grid,
} from '@mui/material'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
} from 'recharts'
import { useUtilityPrices, useLastUpdated } from '../../core/data'
import { GridCard } from '../../core/card-2-line/grid-card'
import { useFormatDate } from '../../core/date-time'

export function Electricity() {
    const formattedPrices = useUtilityPrices()
    const lastUpdated = useLastUpdated()
    const dateFormat = useFormatDate()

    return (
        <Grid container>
            <GridCard>
                <LineChart width={900} height={600} data={formattedPrices}>
                    <text x={900 / 2} y={20} fill="white" textAnchor="middle" dominantBaseline="central">
                        <tspan fontSize="14">Data sidst hentet {dateFormat(lastUpdated, 'compactDateTime')}</tspan>
                    </text>
                    <Line type="stepAfter" dataKey="totalPrice" stroke="#8884d8" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                </LineChart>
            </GridCard>
            <GridCard columns={2}>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>tid</TableCell>
                                <TableCell>Pris</TableCell>
                                <TableCell>Tarrif</TableCell>
                                <TableCell>Afgift</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {formattedPrices?.map((item) => (
                                <TableRow key={item.hour}>
                                    <TableCell>{item.hour}</TableCell>
                                    <TableCell>{item.totalPrice.toFixed(2)}</TableCell>
                                    <TableCell>{item.tarrif.toFixed(2)}</TableCell>
                                    <TableCell>{item.govCharge.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </GridCard>
        </Grid>
    )
}
