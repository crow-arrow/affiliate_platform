import { useEffect } from "react"
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useDispatch, useSelector } from "react-redux"
import { fetchTrips } from "../redux/features/users/userSlice"

export const Trips = () => {

  // console.log('Render List')
  
  const dispatch = useDispatch()
  const { trips, status, error } = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(fetchTrips())
  }, [dispatch])

  const columns = [
    { field: 'id', headerName: 'Order ID', flex: 1},
    { field: 'traveller_amount', headerName: 'Traveller Number', flex: 1 },
    { field: 'booking_date', headerName: 'Booking Date', flex: 1 },
    { field: 'travel_date', headerName: 'Travel Date', flex: 1 },
    { field: 'order_status', headerName: 'Order Status', flex: 1 },
    { 
      field: 'total_price', 
      headerName: 'Total Price in EUR',
      flex: 1,
      renderCell: (params) => {
        if (params.value !== null && params.value !== undefined) {
          const cleanedValue = params.value.replace(/[^0-9.]/g, '');
          const parsedValue = parseFloat(cleanedValue);
          if (!isNaN(parsedValue)) {
            return parseFloat(parsedValue).toFixed(2);
          }
          return '';
        }
        return '';
      },
    },
    { field: 'commission', headerName: 'Commission', cellClassName: 'name-column--cell', flex: 1,
      renderCell: ({ row: { commission, isCompleted, isCanceled,  } }) => {
        return (
                <Box 
                className={`w-[100%] text-center p-1.5 rounded-md
                    ${isCompleted ? 'text-green-400' : 
                      isCanceled ? 'text-red-700 line-through' : 'text-gray-400'}`}
                >
                    <Typography>
                        { commission.toFixed(2) }
                    </Typography>
                </Box>
        )
    }
    },
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

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6" color="error">Error: {error}</Typography>
      </Box>
    )
  }

  if (trips.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6">No trips available</Typography>
      </Box>
    )
  }

  return (
    <Box 
        sx={{
          flex: 1,
          minWidth: 0,
          "& .MuiDataGrid-root": {
              padding: "16px",
              border: "none",
          },
          "& .css-1bcfz0k-MuiDataGrid-root .MuiDataGrid-cell": {
              margin: "auto",
              color: "gray",
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
        className="p-4 rounded-2xl bg-white dark:bg-secondary"
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