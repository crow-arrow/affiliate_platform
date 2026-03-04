import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchTrips } from "../redux/features/users/userSlice";
import { DataTable, getTabsFromStatusConfig, type TabItem } from "@/components/data/DataTable";
import { createDragColumn, createSelectColumn } from "@/components/data/data-table-columns";
import { ColumnDef } from "@tanstack/react-table";
import { Loader2, User, Calendar, Euro, MoreVertical, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { StatusBadge } from "@/components/ui/status-badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { statusConfig, type TripStatus } from "@/theme/tokens/status";

interface TripData {
  id: string;
  travellerAmount: number;
  bookingDate: string | null;
  travelDate: string | null;
  orderStatus: string;
  totalPrice: string;
  commission: number;
  isCompleted: boolean;
  isCanceled: boolean;
}

const ORDER_STATUS_OPTIONS = (Object.keys(statusConfig) as (keyof typeof statusConfig)[]).filter(
  (key): key is TripStatus => key !== "default"
);

function TripCellViewer({ item }: { item: TripData }) {
  const isMobile = useIsMobile();

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item.id}
        </Button>
      </DrawerTrigger>
      <DrawerContent direction={isMobile ? "bottom" : "right"}>
        <DrawerHeader className="gap-1">
          <DrawerTitle>Trip {item.id}</DrawerTitle>
          <DrawerDescription>Trip details and commission information</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="trip-id">Trip ID</Label>
              <Input id="trip-id" defaultValue={item.id.toString()} disabled />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="travellers">Travellers</Label>
                <Input id="travellers" defaultValue={item.travellerAmount.toString()} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue={item.orderStatus}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    {ORDER_STATUS_OPTIONS.map((status: TripStatus) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="booking-date">Booking Date</Label>
                <Input
                  id="booking-date"
                  defaultValue={
                    item.bookingDate ? new Date(item.bookingDate).toLocaleDateString() : ""
                  }
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="travel-date">Travel Date</Label>
                <Input
                  id="travel-date"
                  defaultValue={
                    item.travelDate ? new Date(item.travelDate).toLocaleDateString() : ""
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="total-price">Total Price</Label>
                <Input id="total-price" defaultValue={item.totalPrice} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="commission">Commission</Label>
                <Input id="commission" defaultValue={item.commission.toFixed(2)} />
              </div>
            </div>
          </form>
        </div>
        <DrawerFooter>
          <Button>Save Changes</Button>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export const Trips = () => {
  const dispatch = useAppDispatch();
  const { trips, tripsStatus, tripsError } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchTrips());
  }, [dispatch]);

  const columns: ColumnDef<TripData>[] = useMemo(
    () => [
      createDragColumn<TripData>(),
      createSelectColumn<TripData>(),
      {
        accessorKey: "id",
        header: "Order ID",
        cell: ({ row }) => {
          return (
            <div className="flex items-center justify-center">
              <TripCellViewer item={row.original} />
            </div>
          );
        },
        enableHiding: false,
      },
      {
        accessorKey: "travellerAmount",
        header: "Travellers",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <User className="size-4 text-muted-foreground" />
            <span>{row.original.travellerAmount}</span>
          </div>
        ),
      },
      {
        accessorKey: "bookingDate",
        header: "Booking Date",
        cell: ({ row }) => {
          if (!row.original.bookingDate) {
            return (
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">-</span>
              </div>
            );
          }
          const date = new Date(row.original.bookingDate);
          if (isNaN(date.getTime())) {
            return (
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Invalid Date</span>
              </div>
            );
          }
          return (
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-muted-foreground" />
              <span>
                {date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "travelDate",
        header: "Travel Date",
        cell: ({ row }) => {
          if (!row.original.travelDate) {
            return (
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">-</span>
              </div>
            );
          }
          const date = new Date(row.original.travelDate);
          if (isNaN(date.getTime())) {
            return (
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Invalid Date</span>
              </div>
            );
          }
          return (
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-muted-foreground" />
              <span>
                {date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "orderStatus",
        header: "Status",
        cell: ({ row }) => {
          return (
            <div className="flex items-center justify-center">
              <StatusBadge status={row.original.orderStatus || "UNKNOWN"} />
            </div>
          );
        },
      },
      {
        accessorKey: "totalPrice",
        header: () => <div className="w-full text-center">Total Price</div>,
        cell: ({ row }) => {
          const price = parseFloat((row.original.totalPrice || "0").replace(/[^0-9.]/g, ""));
          return (
            <div className="flex items-center justify-end">
              <Euro className="size-4 text-muted-foreground" />
              <span className="text-right">{price.toFixed(2)}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "commission",
        header: () => <div className="w-full text-center">Commission</div>,
        cell: ({ row }) => {
          const { commission, isCompleted, isCanceled } = row.original;
          let textColor = "text-muted-foreground dark:text-muted-foreground";

          if (isCompleted) {
            textColor = "text-green-400";
          } else if (isCanceled) {
            textColor = "text-red-700 line-through";
          }

          return (
            <div className="flex items-center justify-end">
              <Euro className={`size-4 ${textColor}`} />
              <span className={`text-right ${textColor}`}>{commission.toFixed(2)}</span>
            </div>
          );
        },
      },
      {
        id: "actions",
        cell: () => (
          <div className="flex items-center justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                  size="icon"
                >
                  <MoreVertical />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem>View Details</DropdownMenuItem>
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Download Invoice</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">Cancel Trip</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    []
  );

  const tabs = useMemo<TabItem[]>(
    () => getTabsFromStatusConfig(statusConfig, { allLabel: "All", allValue: "outline" }),
    []
  );

  // Transform data to match the table format
  const transformedTrips: TripData[] = trips.map((trip) => ({
    id: trip.id,
    travellerAmount: Number(trip.travellerAmount) || 0,
    bookingDate: trip.bookingDate || null,
    travelDate: trip.travelDate || null,
    orderStatus: trip.orderStatus || "UNKNOWN",
    totalPrice: trip.totalPrice || "0",
    commission: Number(trip.commission) || 0,
    isCompleted: Boolean(trip.isCompleted),
    isCanceled: Boolean(trip.isCanceled),
  }));

  return (
    <DataTable
      data={transformedTrips}
      columns={columns}
      getRowId={(row) => row.id}
      emptyMessage="No trips found."
      isLoading={tripsStatus === "loading"}
      statusColumnId="orderStatus"
      tabs={tabs}
    />
  );
};
