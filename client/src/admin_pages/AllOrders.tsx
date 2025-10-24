import { useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getAllTrips } from "../redux/features/trips/tripSlice";
import { ThemedDataGrid } from "../data_grid_theme/ThemedDataGrid";

export const AllOrders = () => {
  console.log("Render List");

  const dispatch = useDispatch();
  const { trips, status, error } = useSelector((state) => state.trips || []);

  useEffect(() => {
    dispatch(getAllTrips());
  }, []);

  const columns = [
    { field: "id", headerName: "Order ID" },
    { field: "travel_date", headerName: "Travel Date", flex: 1 },
    { field: "traveller_amount", headerName: "Traveller Number" },
    { field: "coupon_code", headerName: "Coupon", flex: 1 },
    { field: "affiliate_id", headerName: "Ref ID", flex: 1 },
    { field: "order_status", headerName: "Order Status" },
    { field: "total_price", headerName: "Total Price" },
    { field: "currency", headerName: "Currency" },
  ];

  if (status === "loading") {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  if (trips.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h6">No trips available</Typography>
      </Box>
    );
  }

  return (
    <ThemedDataGrid
      rows={trips}
      columns={columns}
      checkboxSelection
      disableRowSelectionOnClick
      getRowId={(row) => row.id}
    />
  );
};
