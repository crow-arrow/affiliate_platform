import { useEffect } from "react"
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { Box, CircularProgress } from '@mui/material'
import { useDispatch, useSelector } from "react-redux"
import { fetchTrips } from "../redux/features/users/userSlice"

export const Trips = () => {
  const dispatch = useDispatch()
  const { trips, status } = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(fetchTrips())
  }, [dispatch])

  const columns = [
    { field: 'id', headerName: 'Order ID'},
    { field: 'traveller_amount', headerName: 'Traveller Number' },
    { field: 'travel_date', headerName: 'Travel Date', flex: 1 },
    { field: 'order_status', headerName: 'Order Status' },
    { field: 'total_price', headerName: 'Total Price in EUR' },
    { field: 'commission', headerName: 'Commission', cellClassName: 'name-column--cell', },
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
          "& .MuiDataGrid-root": {
              padding: "16px",
              border: "none",
          },
          "& .css-1bcfz0k-MuiDataGrid-root .MuiDataGrid-cell": {
              margin: "auto",
              color: "white",
              borderTop: "none",
          },
          "& .css-1bcfz0k-MuiDataGrid-root .MuiDataGrid-row--borderBottom .MuiDataGrid-columnHeader": {
            borderBottom: "none",
            borderTop: "none",
          },
          "& .css-1tdeh38": {
            borderTop: "none",
          },
          "& .MuiDataGrid-columnSeparator": {
            width: "0.5px"
          },
          "& .MuiDataGrid-filler": {
            borderTop: "none",
            border: "none",
          },
          "& .MuiDataGrid-container--top": {
              backgroundColor: (theme) => `${theme.palette.background.default} !important`,
              color: "#87888C",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
          },
          "& .css-1hr2sou-MuiTablePagination-root, .MuiButtonBase-root > svg, .MuiTablePagination-actions > button, .MuiInputBase-root > svg": {
            color: "#87888C",
            fill: "#87888C",
          },
          "& .name-column--cell": {
            color: (theme) => `${theme.palette.secondary.main} !important`,
            backgroundColor: (theme) => `${theme.custom.gradient} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButtonText": {
            color: "#ffffff",
            backgroundColor: "black",
          },
          "& .css-1gtchvp-MuiPaper-root, .css-1ws6qdq-MuiPaper-root-MuiDataGrid-paper": {
            color: "#ffffff",
            backgroundColor: "#000000 !important",
            borderRadius: "20px",
          },
        }} 
        style={{ height: '100%', width: '100%' }}
        className="p-4 rounded-2xl bg-secondary"
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