import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { GripVertical, ChevronDown } from "lucide-react";
import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Компонент DragHandle для перетаскивания строк
 * Должен использоваться внутри SortableContext (который создается в DataTable)
 */
export function DragHandle({ id }: { id: string | number }) {
  const { attributes, listeners } = useSortable({
    id: id.toString(),
  });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <GripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

/**
 * Создает колонку с drag handle для перетаскивания строк
 * ВАЖНО: DragHandle использует useSortable, поэтому должен использоваться внутри SortableContext
 */
export function createDragColumn<TData>(): ColumnDef<TData> {
  return {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.id} />,
    enableSorting: false,
    enableHiding: false,
  };
}

/**
 * Создает колонку с checkbox для выбора строк
 */
export function createSelectColumn<TData>(): ColumnDef<TData> {
  return {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  };
}

/**
 * Создает колонку с действиями (actions menu)
 * @param actions - Массив действий для dropdown menu
 * @param options - Дополнительные опции (separatorBefore - массив индексов, перед которыми нужно вставить разделитель)
 */
export function createActionsColumn<TData>(
  actions?: Array<{
    label: string;
    onClick: (row: TData) => void;
    variant?: "default" | "destructive";
    icon?: React.ReactNode;
  }>,
  options?: {
    separatorBefore?: number[]; // Индексы элементов, перед которыми нужно вставить разделитель
  }
): ColumnDef<TData> {
  // Если actions не предоставлены, создаем пустую колонку
  if (!actions || actions.length === 0) {
    return {
      id: "actions",
      header: () => null,
      cell: () => null,
      enableSorting: false,
      enableHiding: false,
    };
  }

  return {
    id: "actions",
    header: () => null,
    cell: ({ row }) => {
      const separatorBefore = options?.separatorBefore || [];

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <ChevronDown className="size-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            {actions.map((action, index) => (
              <React.Fragment key={index}>
                {separatorBefore.includes(index) && <DropdownMenuSeparator />}
                <DropdownMenuItem
                  onClick={() => action.onClick(row.original)}
                  className={action.variant === "destructive" ? "text-destructive" : ""}
                >
                  {action.icon && <span className="mr-2">{action.icon}</span>}
                  {action.label}
                </DropdownMenuItem>
              </React.Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
  };
}
