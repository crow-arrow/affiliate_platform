import { useEffect } from "react"
import { Box, CircularProgress, Typography } from '@mui/material'
import { useDispatch, useSelector } from "react-redux"
import { fetchTrips } from "../redux/features/users/userSlice"
import { ThemedDataGrid } from "../data_grid_theme/ThemedDataGrid"

export const Trips = () => {

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
    <ThemedDataGrid 
      rows={trips}
      columns={columns}
      getRowId={(row) => row.id}
      disableRowSelectionOnClick
    />
  )
}