import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getAllTrips, Trip } from "../redux/features/trips/tripSlice";
import {
  Loader2,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  CreditCard,
} from "lucide-react";
import { DataTable } from "@/components/data/DataTable";
import { createDragColumn, createSelectColumn } from "@/components/data/data-table-columns";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

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

export const AllOrders = () => {
  const dispatch = useAppDispatch();
  const { trips, status, error } = useAppSelector((state) => state.trips);

  useEffect(() => {
    dispatch(getAllTrips());
  }, [dispatch]);

  const columns: ColumnDef<Trip>[] = useMemo(
    () => [
      createDragColumn<Trip>(),
      createSelectColumn<Trip>(),
      {
        accessorKey: "id",
        header: "Order ID",
        enableHiding: false,
      },
      {
        accessorKey: "travel_date",
        header: "Travel Date",
      },
      {
        accessorKey: "traveller_amount",
        header: "Traveller Number",
      },
      {
        accessorKey: "coupon_code",
        header: "Coupon",
      },
      {
        accessorKey: "affiliate_id",
        header: "Ref ID",
      },
      {
        accessorKey: "order_status",
        header: "Order Status",
        cell: ({ row }) => {
          const orderStatus = (row.original as any).order_status || "PENDING";
          let bgColor = "bg-muted dark:bg-secondary";
          let textColor = "text-foreground dark:text-foreground";

          if (orderStatus === "CANCEL") {
            bgColor = "bg-red-100 dark:bg-red-900/30";
            textColor = "text-red-800 dark:text-red-300";
          } else if (orderStatus === "REJECTED") {
            bgColor = "bg-muted dark:bg-secondary";
            textColor = "text-foreground dark:text-foreground";
          } else if (orderStatus === "PENDING") {
            bgColor = "bg-orange-100 dark:bg-orange-900/30";
            textColor = "text-orange-800 dark:text-orange-300";
          } else if (orderStatus === "WAIT_FOR_APPROVAL") {
            bgColor = "bg-blue-100 dark:bg-blue-900/30";
            textColor = "text-blue-800 dark:text-blue-300";
          } else if (orderStatus === "COMPLETED") {
            bgColor = "bg-green-100 dark:bg-green-900/30";
            textColor = "text-green-800 dark:text-green-300";
          } else if (orderStatus === "APPROVED") {
            bgColor = "bg-green-100 dark:bg-green-900/30";
            textColor = "text-green-800 dark:text-green-300";
          } else if (orderStatus === "CONFIRMED") {
            bgColor = "bg-green-100 dark:bg-green-900/30";
            textColor = "text-green-800 dark:text-green-300";
          } else if (orderStatus === "DEPOSIT_PAID") {
            bgColor = "bg-blue-100 dark:bg-blue-900/30";
            textColor = "text-blue-800 dark:text-blue-300";
          }

          const displayStatus = orderStatus
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c: string) => c.toUpperCase());

          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
            >
              {getStatusIcon(orderStatus)}
              {displayStatus}
            </span>
          );
        },
      },
      {
        accessorKey: "total_price",
        header: () => <div className="w-full text-right">Total Price</div>,
        cell: ({ row }) => {
          const price = (row.original as any).total_price
            ? parseFloat(String((row.original as any).total_price).replace(/[^0-9.]/g, ""))
            : 0;
          return <div className="text-right">{price.toFixed(2)}</div>;
        },
      },
      {
        accessorKey: "currency",
        header: "Currency",
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
              <DropdownMenuItem className="text-destructive">Cancel Order</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    []
  );

  return (
    <DataTable
      data={trips || []}
      columns={columns}
      getRowId={(row) => String(row.id)}
      emptyMessage="No orders found."
      isLoading={status === "loading" || status === "idle"}
    />
  );
};
