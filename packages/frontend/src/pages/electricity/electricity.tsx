import {
  TableContainer,
  TableHead,
  TableCell,
  Table,
  TableBody,
  TableRow,
  Grid,
} from '@mui/material'
import React from 'react'
import { LineChart, Line, XAxis, YAxis } from 'recharts'
import { format, parseISO } from 'date-fns'
import { useUtilityPrices } from '../../core/data'
import { GridCard } from '../../core/card-2-line/grid-card'

export function Electricity() {
  const data = useUtilityPrices(12)

  const formattedPrices = React.useMemo(
    () =>
      data
        ?.sort(
          (a, b) => new Date(a.hour).getTime() - new Date(b.hour).getTime(),
        )
        .map((item) => ({
          ...item,
          hour: format(parseISO(item.hour), 'HH:mm'),
        })),
    [data],
  )
  return (
    <Grid container>
      <GridCard>
        <LineChart width={900} height={600} data={formattedPrices}>
          <Line type="stepBefore" dataKey="totalPrice" stroke="#8884d8" />
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
              </TableRow>
            </TableHead>
            <TableBody>
              {formattedPrices?.map((item) => (
                <TableRow key={item.hour}>
                  <TableCell>{item.hour}</TableCell>
                  <TableCell>{item.totalPrice.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </GridCard>
    </Grid>
  )
}
