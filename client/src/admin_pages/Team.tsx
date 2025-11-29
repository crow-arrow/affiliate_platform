import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchUsers, User } from "../redux/features/users/userSlice";
import { toast } from "sonner";
import { Loader2, Copy, MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import avatarLogo from "../assets/avatar.webp";

export const Team = () => {
  const dispatch = useAppDispatch();
  const { users, usersStatus, usersError } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleCopy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Copied to clipboard!");
      })
      .catch((err) => {
        toast.error("Failed to copy: " + err);
      });
  };

  const columns: ColumnDef<User>[] = useMemo(
    () => [
      createDragColumn<User>(),
      createSelectColumn<User>(),
      {
        accessorKey: "avatarUrl",
        header: "Avatar",
        cell: ({ row }) => (
          <div className="flex justify-center items-center">
            <Avatar>
              <AvatarImage
                src={
                  row.original.avatarUrl
                    ? `${import.meta.env.VITE_API_URL}${row.original.avatarUrl}`
                    : avatarLogo
                }
                alt={row.original.first_name}
                onError={(e) => {
                  console.error("Error Avatar rendering:", row.original.avatarUrl, e);
                }}
              />
              <AvatarFallback>{row.original.first_name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
          </div>
        ),
        enableSorting: false,
      },
      { accessorKey: "first_name", header: "First Name" },
      { accessorKey: "last_name", header: "Last Name" },
      {
        accessorKey: "email",
        header: "Email",
        enableSorting: false,
      },
      {
        accessorKey: "phone",
        header: "Phone",
        enableSorting: false,
      },
      { accessorKey: "role", header: "Role" },
      {
        accessorKey: "level",
        header: "Level",
        cell: ({ row }) => {
          const level = row.original.level;
          return (
            <div className="w-full flex justify-center items-center">
              <div
                className={`w-full text-center p-1.5 rounded-md ${
                  level === "Bronze"
                    ? "bg-gradient-bronze border-[1px] border-solid border-bronze-border text-bronze-text [text-shadow:0_2px_1px_rgba(205,_127,_50,_1)]"
                    : level === "Silver"
                      ? "bg-gradient-silver border-[1px] border-solid border-silver-border text-gray-700 dark:text-gray-300 [text-shadow:0_2px_1px_rgba(187,_187,_187,_1)] dark:[text-shadow:none]"
                      : level === "Gold"
                        ? "bg-gradient-gold border-[1px] border-solid border-gold-border text-gold-text [text-shadow:0_2px_1px_rgba(180,_126,_17,_1)]"
                        : "bg-none"
                }`}
              >
                {level}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "coupon_code",
        header: "Coupon",
        enableSorting: false,
      },
      {
        accessorKey: "affiliate_id",
        header: "Ref Link",
        enableSorting: false,
        cell: ({ row }) => {
          const affiliateId = row.original.affiliate_id;
          if (!affiliateId) return null;
          const truncatedRef =
            affiliateId.length > 5 ? affiliateId.slice(0, 5) + "..." : affiliateId;
          const refLink = `https://jinn-travel.com/?affiliateId=${affiliateId}`;

          return (
            <div className="flex justify-between items-center gap-2">
              <a
                href={refLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline underline-offset-4 decoration-accent hover:text-accent duration-300"
              >
                {truncatedRef}
              </a>
              <button
                onClick={() => handleCopy(refLink)}
                className="hover:opacity-70 transition-opacity"
              >
                <Copy className="size-4" />
              </button>
            </div>
          );
        },
      },
      { accessorKey: "booked_trips_count", header: "Trips" },
      { accessorKey: "number_of_travellers", header: "Nº Travellers" },
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
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [handleCopy]
  );

  return (
    <DataTable
      data={users || []}
      columns={columns}
      getRowId={(row) => String(row.id)}
      emptyMessage="No team members found."
      isLoading={usersStatus === "loading"}
    />
  );
};
