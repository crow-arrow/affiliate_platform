import React, { useEffect } from "react"
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { Box, Typography } from '@mui/material'
// import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import { useDispatch, useSelector } from "react-redux"
import { getAllTrips } from "../redux/features/trips/tripSlice"

export const AllOrders = () => {
  const dispatch = useDispatch()
  const { trips, status, error } = useSelector((state) => state.trips || [])

  useEffect(() => {
    dispatch(getAllTrips())
  }, [dispatch])

  // const handleCopy = (id) => {
  //   navigator.clipboard.writeText(id).then(() => {
  //     alert('ID copied to clipboard!')
  //   }).catch((err) => {
  //     alert('Failed to copy: ' + err)
  //   })
  // }

  const columns = [
    { field: 'order_id', headerName: 'Order ID'},
    { field: 'travel_date', headerName: 'Travel Date', flex: 1 },
    { field: 'traveller_amount', headerName: 'Traveller Number', flex: 1 },
    { field: 'coupon_code', headerName: 'Coupon', flex: 1 },
    { field: 'affiliate_id', headerName: 'Ref ID', flex: 1 },
    { field: 'order_status', headerName: 'Order Status' },
    { field: 'total_price', headerName: 'Total Price' },
    { field: 'currency', headerName: 'Currency' },
  ];

  if (status === 'loading') return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <Box style={{ height: '100%', width: '100%' }}>
      <DataGrid 
        rows={trips}
        columns={columns}
        checkboxSelection
        disableRowSelectionOnClick
        slots={{ toolbar: GridToolbar }}
        getRowId={(row) => row.order_id}
      />
    </Box>
  )
}