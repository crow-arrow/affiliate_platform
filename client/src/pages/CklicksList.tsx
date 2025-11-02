import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchClicks, Click } from "../redux/features/clicks/clicksSlice";
import { DataTable } from "@/components/data/DataTable";
import { createDragColumn, createSelectColumn } from "@/components/data/data-table-columns";
import { ColumnDef } from "@tanstack/react-table";
import { Loader2, Calendar, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const CklicksList = () => {
  const dispatch = useAppDispatch();
  const { clicks, status, error } = useAppSelector((state) => state.clicks);
  const currentUser = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(fetchClicks(currentUser.id));
    }
  }, [dispatch, currentUser?.id]);

  const columns: ColumnDef<Click>[] = useMemo(
    () => [
      createDragColumn<Click>(),
      createSelectColumn<Click>(),
      {
        accessorKey: "id",
        header: "Click ID",
        enableHiding: false,
      },
      {
        accessorKey: "referer",
        header: "Referer",
      },
      {
        accessorKey: "ip_address",
        header: "IP Address",
      },
      {
        accessorKey: "timestamp",
        header: "Date of Click",
        cell: ({ row }) => {
          const timestamp = row.original.timestamp;
          if (!timestamp) return "-";

          const date = new Date(timestamp);
          if (isNaN(date.getTime())) return "-";

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

          return (
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-muted-foreground" />
              <span>{`${day}, ${time}`}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "type",
        header: "Type",
      },
      {
        accessorKey: "device_type",
        header: "Device",
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
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    []
  );

  return (
    <DataTable
      data={clicks || []}
      columns={columns}
      getRowId={(row) => String(row.id)}
      emptyMessage="No clicks found."
      isLoading={status === "loading"}
    />
  );
};
