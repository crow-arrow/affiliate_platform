import React, { useEffect } from "react"
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { Box, Typography, CircularProgress } from '@mui/material'
import { useDispatch, useSelector } from "react-redux"
import { fetchTrips } from "../redux/features/users/userSlice"

export const Trips = () => {
  const dispatch = useDispatch()
  const { trips, status, error } = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(fetchTrips())
  }, [dispatch])

  const columns = [
    { field: 'id', headerName: 'Order ID'},
    { field: 'traveller_amount', headerName: 'Traveller Number' },
    { field: 'travel_date', headerName: 'Travel Date', flex: 1 },
    { field: 'order_status', headerName: 'Order Status' },
    { field: 'total_price', headerName: 'Total Price in EUR' },
    { field: 'commission', headerName: 'Commission' },
  ];

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

  return (
    <Box 
        sx={{
          "& .MuiDataGrid-cell": {
              margin: "auto",
              color: "white",
          },
          "& .MuiDataGrid-footerContainer, .MuiDataGrid-container--top": {
              backgroundColor: (theme) => `${theme.palette.background.default} !important`,
          },
        }} 
        style={{ height: '100%', width: '100%' }}
      >
      <DataGrid 
        rows={trips}
        columns={columns}
        disableRowSelectionOnClick
        slots={{ toolbar: GridToolbar }}
        getRowId={(row) => row.id}
      />
    </Box>
  )
}