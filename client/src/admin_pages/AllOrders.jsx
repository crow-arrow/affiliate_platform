import React, { useEffect } from "react"
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { Box, Typography, CircularProgress } from '@mui/material'
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
    { field: 'id', headerName: 'Order ID'},
    { field: 'travel_date', headerName: 'Travel Date', flex: 1 },
    { field: 'traveller_amount', headerName: 'Traveller Number'},
    { field: 'coupon_code', headerName: 'Coupon', flex: 1 },
    { field: 'affiliate_id', headerName: 'Ref ID', flex: 1 },
    { field: 'order_status', headerName: 'Order Status' },
    { field: 'total_price', headerName: 'Total Price' },
    { field: 'currency', headerName: 'Currency' },
  ];

  // Статус загрузки
  if (status === 'loading') {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    )
  }

  // Ошибка
  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6" color="error">Error: {error}</Typography>
      </Box>
    )
  }

  // Если нет туров
  if (trips.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6">No trips available</Typography>
      </Box>
    )
  }

  return (
    <Box style={{ height: '100%', width: '100%' }}>
      <DataGrid 
        rows={trips}
        columns={columns}
        checkboxSelection
        disableRowSelectionOnClick
        slots={{ toolbar: GridToolbar }}
        getRowId={(row) => row.id}
      />
    </Box>
  )
}