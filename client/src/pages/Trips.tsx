import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchTrips } from "../redux/features/users/userSlice";
import { DataTable } from "@/components/DataTable";
import { createDragColumn, createSelectColumn } from "@/components/data-table-columns";
import { ColumnDef } from "@tanstack/react-table";
import {
  Loader2,
  User,
  Calendar,
  Euro,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  CreditCard,
} from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

// Function to get status icon
function getStatusIcon(status: string) {
  switch (status) {
    case "COMPLETED":
    case "APPROVED":
    case "CONFIRMED":
      return <CheckCircle2 className="w-3 h-3 mr-1" />;
    case "CANCEL":
      return <XCircle className="w-3 h-3 mr-1" />;
    case "REJECTED":
      return <XCircle className="w-3 h-3 mr-1" />;
    case "PENDING":
      return <Clock className="w-3 h-3 mr-1" />;
    case "WAIT_FOR_APPROVAL":
      return <AlertCircle className="w-3 h-3 mr-1" />;
    case "DEPOSIT_PAID":
      return <CreditCard className="w-3 h-3 mr-1" />;
    default:
      return <Clock className="w-3 h-3 mr-1" />;
  }
}

function TripCellViewer({ item }: { item: TripData }) {
  const isMobile = useIsMobile();

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          #{item.id}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>Trip #{item.id}</DrawerTitle>
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
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="wait-for-approval">Wait for Approval</SelectItem>
                    <SelectItem value="cancel">Cancelled</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
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
          return <TripCellViewer item={row.original} />;
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
          const status = row.original.orderStatus;
          let bgColor = "bg-gray-100";
          let textColor = "text-gray-800";

          if (status === "CANCEL") {
            bgColor = "bg-red-100";
            textColor = "text-red-800";
          } else if (status === "REJECTED") {
            bgColor = "bg-gray-100";
            textColor = "text-gray-800";
          } else if (status === "PENDING") {
            bgColor = "bg-orange-100";
            textColor = "text-orange-800";
          } else if (status === "WAIT_FOR_APPROVAL") {
            bgColor = "bg-blue-100";
            textColor = "text-blue-800";
          } else if (status === "COMPLETED") {
            bgColor = "bg-green-100";
            textColor = "text-green-800";
          } else if (status === "APPROVED") {
            bgColor = "bg-green-100";
            textColor = "text-green-800";
          } else if (status === "CONFIRMED") {
            bgColor = "bg-green-100";
            textColor = "text-green-800";
          } else if (status === "DEPOSIT_PAID") {
            bgColor = "bg-blue-100";
            textColor = "text-blue-800";
          }

          const displayStatus = status
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c: string) => c.toUpperCase());

          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
            >
              {getStatusIcon(status)}
              {displayStatus}
            </span>
          );
        },
      },
      {
        accessorKey: "totalPrice",
        header: () => <div className="w-full text-right">Total Price</div>,
        cell: ({ row }) => {
          const price = parseFloat((row.original.totalPrice || "0").replace(/[^0-9.]/g, ""));
          return (
            <div className="flex items-center justify-end gap-2">
              <Euro className="size-4 text-muted-foreground" />
              <span className="text-right">{price.toFixed(2)}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "commission",
        header: () => <div className="w-full text-right">Commission</div>,
        cell: ({ row }) => {
          const { commission, isCompleted, isCanceled } = row.original;
          let textColor = "text-gray-400";

          if (isCompleted) {
            textColor = "text-green-400";
          } else if (isCanceled) {
            textColor = "text-red-700 line-through";
          }

          return (
            <div className="flex items-center justify-end gap-2">
              <Euro className="size-4 text-muted-foreground" />
              <span className={`text-right ${textColor}`}>{commission.toFixed(2)}</span>
            </div>
          );
        },
      },
      {
        id: "actions",
        cell: () => (
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
        ),
      },
    ],
    []
  );

  // Transform data to match the table format
  const transformedTrips: TripData[] = trips.map((trip) => ({
    id: trip.id,
    travellerAmount: Number(trip.travellerAmount) || 0,
    bookingDate: trip.bookingDate || null,
    travelDate: trip.travelDate || null,
    orderStatus: trip.orderStatus || "PENDING",
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
    />
  );
};
