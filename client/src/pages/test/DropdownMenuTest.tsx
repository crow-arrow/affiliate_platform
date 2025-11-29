import { useState } from "react";
import { DataTable } from "@/components/data/DataTable";
import {
  createDragColumn,
  createSelectColumn,
  createActionsColumn,
} from "@/components/data/data-table-columns";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash2, Download, Copy, Star } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Тестовые данные
interface TestData {
  id: string;
  name: string;
  email: string;
  status: string;
}

const mockData: TestData[] = [
  { id: "1", name: "John Doe", email: "john@example.com", status: "Active" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", status: "Inactive" },
  { id: "3", name: "Bob Johnson", email: "bob@example.com", status: "Active" },
  { id: "4", name: "Alice Williams", email: "alice@example.com", status: "Pending" },
];

export function DropdownMenuTest() {
  const [data, setData] = useState<TestData[]>(mockData);

  const handleView = (row: TestData) => {
    toast.info(`Viewing: ${row.name}`);
  };

  const handleEdit = (row: TestData) => {
    toast.info(`Editing: ${row.name}`);
  };

  const handleDelete = (row: TestData) => {
    toast.error(`Deleting: ${row.name}`);
    setData((prev) => prev.filter((item) => item.id !== row.id));
  };

  const handleDownload = (row: TestData) => {
    toast.success(`Downloading data for: ${row.name}`);
  };

  const handleCopy = (row: TestData) => {
    navigator.clipboard.writeText(row.email);
    toast.success(`Copied email: ${row.email}`);
  };

  const handleFavorite = (row: TestData) => {
    toast.success(`Added to favorites: ${row.name}`);
  };

  const columns: ColumnDef<TestData>[] = [
    createDragColumn<TestData>(),
    createSelectColumn<TestData>(),
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.original.status === "Active"
              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
              : row.original.status === "Inactive"
                ? "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                : "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300"
          }`}
        >
          {row.original.status}
        </span>
      ),
    },
    createActionsColumn<TestData>(
      [
        {
          label: "View Details",
          onClick: handleView,
          icon: <Eye className="size-4" />,
        },
        {
          label: "Edit",
          onClick: handleEdit,
          icon: <Pencil className="size-4" />,
        },
        {
          label: "Copy Email",
          onClick: handleCopy,
          icon: <Copy className="size-4" />,
        },
        {
          label: "Download",
          onClick: handleDownload,
          icon: <Download className="size-4" />,
        },
        {
          label: "Add to Favorites",
          onClick: handleFavorite,
          icon: <Star className="size-4" />,
        },
        {
          label: "Delete",
          onClick: handleDelete,
          variant: "destructive",
          icon: <Trash2 className="size-4" />,
        },
      ],
      {
        separatorBefore: [3, 5], // Разделители перед "Download" и "Delete"
      }
    ),
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dropdown Menu Test</CardTitle>
          <CardDescription>
            Тестирование компонента createActionsColumn с различными действиями
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={data}
            columns={columns}
            getRowId={(row) => row.id}
            emptyMessage="No data available"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Примеры использования</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Базовое использование:</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
              {`createActionsColumn<TripData>(
  [
    {
      label: "View Details",
      onClick: (row) => handleView(row),
      icon: <Eye className="size-4" />,
    },
    {
      label: "Edit",
      onClick: (row) => handleEdit(row),
      icon: <Pencil className="size-4" />,
    },
    {
      label: "Delete",
      onClick: (row) => handleDelete(row),
      variant: "destructive",
      icon: <Trash2 className="size-4" />,
    },
  ],
  {
    separatorBefore: [2], // Разделитель перед "Delete"
  }
)`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
