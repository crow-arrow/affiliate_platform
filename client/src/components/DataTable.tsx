"use client";

import * as React from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  LayoutGrid,
  GripVertical,
} from "lucide-react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  getRowId?: (row: TData) => string;
  emptyMessage?: string;
  enableDragAndDrop?: boolean;
  enableColumnVisibility?: boolean;
  defaultPageSize?: number;
  onDataChange?: (data: TData[]) => void;
  className?: string;
  isLoading?: boolean;
  skeletonRows?: number;
}

// DragHandle is now created by createDragColumn helper

function DraggableRow<TData>({
  row,
  enableDragAndDrop,
}: {
  row: Row<TData>;
  enableDragAndDrop: boolean;
}) {
  const rowId = row.id;
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: rowId,
    disabled: !enableDragAndDrop,
  });

  const style = enableDragAndDrop
    ? {
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }
    : {};

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className={`relative z-0 ${enableDragAndDrop ? "data-[dragging=true]:z-10 data-[dragging=true]:opacity-80" : ""}`}
      style={style}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

function TableSkeletonRow({
  headerGroups,
  rowIndex = 0,
}: {
  headerGroups: any[];
  rowIndex?: number;
}) {
  // Получаем все заголовки из первой группы
  // headerGroups уже содержит только видимые заголовки
  const headers = headerGroups[0]?.headers || [];

  // Используем rowIndex для генерации стабильных "случайных" значений
  const stableSeed = rowIndex * 7919; // Простое число для генерации

  return (
    <TableRow>
      {headers.map((header: any, index: number) => {
        // Безопасно получаем columnId
        const columnId = header?.column?.id || header?.id || `col-${index}`;
        const isDrag = columnId === "drag";
        const isSelect = columnId === "select";
        const isAvatar = columnId === "avatarUrl" || columnId === "avatar";
        const isAction = columnId === "actions";
        const isStatus = columnId?.toLowerCase().includes("status");

        // Стабильные "случайные" значения для этой строки и колонки
        const widthSeed = (stableSeed + index) % 50;
        const showSecond = (stableSeed + index) % 10 > 2; // ~70% показывают второй элемент

        return (
          <TableCell key={header.id || index} className="py-4">
            <div className="flex items-center gap-2">
              {/* Для drag колонки */}
              {isDrag && <GripVertical className="h-5 w-5 rounded" />}

              {/* Для select колонки */}
              {isSelect && <Checkbox disabled />}

              {/* Для колонок с аватарами */}
              {isAvatar && (
                <>
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </>
              )}

              {/* Для action колонок */}
              {isAction && <Skeleton className="h-8 w-8 rounded" />}

              {/* Для status колонок - badge стиль */}
              {isStatus && <Skeleton className="h-6 w-20 rounded-full" />}

              {/* Для обычных колонок */}
              {!isDrag && !isSelect && !isAvatar && !isAction && !isStatus && (
                <>
                  <Skeleton
                    className="h-4"
                    style={{
                      width: `${50 + widthSeed}%`,
                      maxWidth: index < 3 ? "180px" : "220px",
                      minWidth: "80px",
                    }}
                  />
                  {/* Дополнительный элемент для реалистичности */}
                  {showSecond && index > 2 && <Skeleton className="h-4 w-12" />}
                </>
              )}
            </div>
          </TableCell>
        );
      })}
    </TableRow>
  );
}

export function DataTable<TData extends Record<string, any>>({
  data: initialData,
  columns,
  getRowId = (row: TData) => String((row as any).id ?? Math.random().toString()),
  emptyMessage = "No results found.",
  enableDragAndDrop = true,
  enableColumnVisibility = true,
  defaultPageSize = 10,
  onDataChange,
  isLoading = false,
  skeletonRows = 10,
}: DataTableProps<TData>) {
  const [data, setData] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });
  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  // Sync external data changes
  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map((row) => getRowId(row)) || [],
    [data, getRowId]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  function handleDragEnd(event: DragEndEvent) {
    if (!enableDragAndDrop) return;

    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const newData = arrayMove(data, dataIds.indexOf(active.id), dataIds.indexOf(over.id));
      setData(newData);
      onDataChange?.(newData);
    }
  }

  return (
    <div className="w-full h-full flex flex-col gap-6 min-w-0 p-4 lg:p-6">
      {enableColumnVisibility && (
        <div className="flex-shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <LayoutGrid />
                  <span className="hidden lg:inline">Customize Columns</span>
                  <span className="lg:hidden">Columns</span>
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {table
                  .getAllColumns()
                  .filter(
                    (column) => typeof column.accessorFn !== "undefined" && column.getCanHide()
                  )
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
      <div className="flex-1 flex flex-col gap-4 min-w-0 min-h-0">
        <div className="flex-1 rounded-lg border overflow-hidden min-w-0 flex flex-col">
          <div className="flex-1 overflow-y-auto overflow-x-auto min-h-0">
            <DndContext
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
              onDragEnd={handleDragEnd}
              sensors={enableDragAndDrop ? sensors : []}
              id={sortableId}
            >
              <Table>
                <TableHeader className="bg-muted sticky top-0 z-10">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id} colSpan={header.colSpan}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody className="**:data-[slot=table-cell]:first:w-8">
                  {isLoading ? (
                    // Показываем skeleton строки во время загрузки (с пульсацией)
                    Array.from({ length: skeletonRows }).map((_, index) => (
                      <TableSkeletonRow
                        key={`skeleton-${index}`}
                        headerGroups={table.getHeaderGroups()}
                        rowIndex={index}
                      />
                    ))
                  ) : table.getRowModel().rows?.length ? (
                    // Показываем реальные данные
                    <SortableContext
                      items={enableDragAndDrop ? dataIds : []}
                      strategy={verticalListSortingStrategy}
                    >
                      {table.getRowModel().rows.map((row) => (
                        <DraggableRow
                          key={row.id}
                          row={row}
                          enableDragAndDrop={enableDragAndDrop}
                        />
                      ))}
                    </SortableContext>
                  ) : (
                    // Показываем placeholder строки когда данных нет (но не во время загрузки)
                    Array.from({ length: Math.min(skeletonRows, 7) }).map((_, index) => (
                      <TableSkeletonRow
                        key={`empty-${index}`}
                        headerGroups={table.getHeaderGroups()}
                        rowIndex={index}
                      />
                    ))
                  )}
                </TableBody>
              </Table>
            </DndContext>
          </div>
        </div>
        <div className="flex-shrink-0 flex items-center justify-between">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="w-20" id="rows-per-page">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
