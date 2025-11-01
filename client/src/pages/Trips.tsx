import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchTrips } from "../redux/features/users/userSlice";
import { TripsDataTable } from "../components/trips-data-table";
import { Loader2 } from "lucide-react";

export const Trips = () => {
  const dispatch = useAppDispatch();
  const { trips, tripsStatus, tripsError } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchTrips());
  }, [dispatch]);

  if (tripsStatus === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="size-6 animate-spin" />
          <span className="text-lg">Loading trips...</span>
        </div>
      </div>
    );
  }

  if (tripsError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive mb-2">Error loading trips</h2>
          <p className="text-muted-foreground">{tripsError}</p>
        </div>
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No trips available</h2>
          <p className="text-muted-foreground">
            You don't have any trips yet. Start booking to see them here.
          </p>
        </div>
      </div>
    );
  }

  // Transform data to match the new schema
  const transformedTrips = trips.map((trip) => ({
    id: trip.id,
    traveller_amount: Number(trip.traveller_amount) || 0,
    booking_date: trip.booking_date || "",
    travel_date: trip.travel_date || "",
    order_status: trip.order_status || "pending",
    total_price: trip.total_price || "0",
    commission: Number(trip.commission) || 0,
    isCompleted: Boolean(trip.isCompleted),
    isCanceled: Boolean(trip.isCanceled),
  }));

  return <TripsDataTable data={transformedTrips} />;
};
