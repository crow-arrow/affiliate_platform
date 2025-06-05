import { useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { ThemedDataGrid } from "../data_grid_theme/ThemedDataGrid";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrips } from "../redux/features/users/userSlice";

export const Trips = () => {
  const dispatch = useDispatch();
  const { trips, status, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchTrips());
  }, [dispatch]);

  const columns = [
    { field: "id", headerName: "Order ID" },
    { field: "traveller_amount", headerName: "Traveller Amount" },
    {
      field: "booking_date",
      headerName: "Booking Date",
      flex: 1,
      renderCell: (params) => {
        if (params.value) {
          const date = new Date(params.value);
          if (!isNaN(date.getTime())) {
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
          }
          return "";
        }
      },
    },
    {
      field: "travel_date",
      headerName: "Travel Date",
      flex: 1,
      renderCell: (params) => {
        if (params.value) {
          const date = new Date(params.value);
          if (!isNaN(date.getTime())) {
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
          }
          return "";
        }
      },
    },
    {
      field: "order_status",
      headerName: "Order Status",
      flex: 1,
      minWidth: 175,
      renderCell: (params) => {
        const orderStatus = params.value;
        if (!orderStatus) return null;

        // Классы для разных статусов
        let statusClass = "";

        if (orderStatus === "cancel") {
          statusClass = "bg-accentPink/30 text-accentPink";
        } else if (orderStatus === "rejected") {
          statusClass = "bg-gray-300/30 text-gray-300";
        } else if (orderStatus === "pending") {
          statusClass = "bg-accentOrange/30 text-accentOrange";
        } else if (orderStatus === "wait-for-approval") {
          statusClass = "bg-accentBlue/30 text-accentBlue";
        } else {
          statusClass = "bg-accentAqua text-accentGreen";
        }

        const displayStatus = orderStatus
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

        return (
          <Box className="flex justify-start items-center">
            <Box
              className={`rounded-xl px-4 my-4 capitalize text-center justify-start ${statusClass}`}
            >
              <Typography>{displayStatus}</Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      field: "total_price",
      headerName: "Total Price in EUR",
      flex: 1,
      renderCell: (params) => {
        if (params.value !== null && params.value !== undefined) {
          const cleanedValue = params.value.replace(/[^0-9.]/g, "");
          const parsedValue = parseFloat(cleanedValue);
          if (!isNaN(parsedValue)) {
            return parseFloat(parsedValue).toFixed(2);
          }
          return "";
        }
        return "";
      },
    },
    {
      field: "commission",
      headerName: "Commission",
      cellClassName: "name-column--cell",
      flex: 1,
      renderCell: ({ row: { commission, isCompleted, isCanceled } }) => {
        return (
          <Box className="w-[100%] h-[100%] flex justify-start items-center">
            <Box
              className={`
                      ${
                        isCompleted
                          ? "text-green-400"
                          : isCanceled
                          ? "text-red-700 line-through"
                          : "text-gray-400"
                      }`}
            >
              <Typography>{commission.toFixed(2)}</Typography>
            </Box>
          </Box>
        );
      },
    },
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
      getRowId={(row) => row.id}
      disableRowSelectionOnClick
    />
  );
};
