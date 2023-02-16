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
import { useUtilityPrices } from '../../core/data'
import { GridCard } from '../../core/card-2-line/grid-card'
import { SuspenseFallback } from '../../core/suspense-fallback'

function ShowTable() {
  const formattedPrices = useUtilityPrices(12)

  return (
    <React.Suspense fallback={<SuspenseFallback />}>
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
    </React.Suspense>
  )
}

export function Electricity() {
  return (
    <React.Suspense fallback={<SuspenseFallback />}>
      <ShowTable />
    </React.Suspense>
  )
}
