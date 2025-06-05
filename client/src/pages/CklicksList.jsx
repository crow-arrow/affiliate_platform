import { useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { ThemedDataGrid } from "../data_grid_theme/ThemedDataGrid";
import { useDispatch, useSelector } from "react-redux";
import { fetchClicks } from "../redux/features/clicks/clicksSlice";

export const CklicksList = () => {
  const dispatch = useDispatch();
  const { clicks, status, error } = useSelector((state) => state.clicks);

  useEffect(() => {
    dispatch(fetchClicks());
  }, [dispatch]);

  const columns = [
    { field: "id", headerName: "Order ID" },
    { field: "referer", headerName: "Referer", flex: 1 },
    { field: "ip_address", headerName: "IP address", flex: 1 },
    {
      field: "timestamp",
      headerName: "Date of click",
      flex: 1,
      renderCell: (params) => {
        if (params.value) {
          const date = new Date(params.value);
          if (!isNaN(date.getTime())) {
            const day = date.toLocaleString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            });
            const time = date.toLocaleTimeString("ru-RU", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            });
            return `${day}, ${time}`;
          }
        }
      },
    },
    { field: "type", headerName: "type" },
    { field: "device_type", headerName: "Device" },
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

  if (clicks.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h6">No clicks available</Typography>
      </Box>
    );
  }

  return (
    <ThemedDataGrid
      rows={clicks}
      columns={columns}
      getRowId={(row) => row.id}
      disableRowSelectionOnClick
    />
  );
};
