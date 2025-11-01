import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { GripVertical } from "lucide-react";
import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";

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
 */
export function createActionsColumn<TData>(
  actions?: Array<{
    label: string;
    onClick: (row: TData) => void;
    variant?: "default" | "destructive";
  }>
): ColumnDef<TData> {
  // Если actions не предоставлены, создаем пустую колонку
  if (!actions || actions.length === 0) {
    return {
      id: "actions",
      header: () => null,
      cell: () => null,
      enableSorting: false,
    };
  }

  // Для полной реализации нужно будет импортировать DropdownMenu компоненты
  // Пока возвращаем заглушку
  return {
    id: "actions",
    header: () => null,
    cell: () => null,
    enableSorting: false,
  };
}
