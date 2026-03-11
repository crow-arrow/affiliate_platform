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
  Calendar,
} from "lucide-react";
import { DataTable, type TabItem } from "@/components/data/DataTable";
import { getGroupedOrderTabs } from "@/theme/tokens/status";
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
    case "CANCELLED":
      return <XCircle className="w-3 h-3 mr-1" />;
    case "REJECTED":
      return <XCircle className="w-3 h-3 mr-1" />;
    case "PENDING":
      return <Clock className="w-3 h-3 mr-1" />;
    case "WAIT_FOR_APPROVAL":
      return <AlertCircle className="w-3 h-3 mr-1" />;
    case "DEPOSIT_PAID":
      return <CreditCard className="w-3 h-3 mr-1" />;
    case "ONLINE_PAID":
    case "RECEIPT_SUBMITTED":
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

  const tabs = useMemo<TabItem[]>(
    () => getGroupedOrderTabs({ allLabel: "All", allValue: "outline" }),
    []
  );

  const columns: ColumnDef<Trip>[] = useMemo(
    () => [
      createDragColumn<Trip>(),
      createSelectColumn<Trip>(),
      {
        accessorKey: "orderId",
        header: "Order ID",
        cell: ({ row }) => {
          return (
            <div className="flex items-center justify-center">{row.original.orderId ?? "--"}</div>
          );
        },
        enableHiding: false,
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
        accessorKey: "travellerAmount",
        header: "Traveller Number",
        cell: ({ row }) => {
          return (
            <div className="flex items-center justify-center">{row.original.travellerAmount}</div>
          );
        },
      },
      {
        accessorKey: "couponCode",
        header: "Coupon",
        cell: ({ row }) => {
          return <div className="flex items-center justify-center">{row.original.couponCode}</div>;
        },
      },
      {
        accessorKey: "affiliateId",
        header: "Ref ID",
        cell: ({ row }) => {
          return <div className="flex items-center justify-center">{row.original.affiliateId}</div>;
        },
      },
      {
        accessorKey: "orderStatus",
        header: "Order Status",
        cell: ({ row }) => {
          const orderStatus = (row.original as any).orderStatus || "PENDING";
          let bgColor = "bg-muted dark:bg-secondary";
          let textColor = "text-foreground dark:text-foreground";

          if (orderStatus === "CANCELLED") {
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
          } else if (
            orderStatus === "DEPOSIT_PAID" ||
            orderStatus === "ONLINE_PAID" ||
            orderStatus === "RECEIPT_SUBMITTED"
          ) {
            bgColor = "bg-green-100 dark:bg-green-900/30";
            textColor = "text-green-800 dark:text-green-300";
          }

          const displayStatus = orderStatus
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c: string) => c.toUpperCase());

          return (
            <div className="flex items-center justify-center">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
              >
                {getStatusIcon(orderStatus)}
                {displayStatus}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "totalPrice",
        header: "Total Price",
        cell: ({ row }) => {
          const price = (row.original as any).totalPrice
            ? parseFloat(String((row.original as any).totalPrice).replace(/[^0-9.]/g, ""))
            : 0;
          return <div className="text-right">{price.toFixed(2)}</div>;
        },
      },
      {
        accessorKey: "currency",
        header: "Currency",
        cell: ({ row }) => {
          return <div className="flex items-center justify-center">{row.original.currency}</div>;
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
      statusColumnId="orderStatus"
      tabs={tabs}
    />
  );
};
