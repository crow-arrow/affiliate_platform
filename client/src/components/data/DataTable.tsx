"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
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
  GripVertical,
  LayoutGrid,
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
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { EmptyGridAnimation } from "@/components/ui/empty-grid-animation";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

/** Фиксированная ширина колонок drag, select, actions — чтобы не растягивались. */
const FIXED_COLUMN_CLASS: Record<string, string> = {
  drag: "w-12 min-w-12 max-w-12 shrink-0",
  select: "w-10 min-w-10 max-w-10 shrink-0",
  actions: "w-12 min-w-12 max-w-12 shrink-0",
};

/** Маппинг вкладки → статус для фильтра (null = без фильтра). Колонка задаётся через statusColumnId. */
export type TabStatusFilter = Record<string, string | null>;

/** Элемент вкладки: value — id вкладки, status — значение для фильтра по колонке (null = все). */
export type TabItem = {
  value: string;
  label: string;
  status: string | null;
  badge?: number;
};

/** Строит список вкладок из конфига статусов (например statusConfig). Первая вкладка "Все" с status: null. */
export function getTabsFromStatusConfig(
  config: Record<string, { label: string }>,
  options?: { allLabel?: string; allValue?: string; excludeKeys?: string[] }
): TabItem[] {
  const { allLabel = "All", allValue = "outline", excludeKeys = ["default"] } = options ?? {};
  const entries = Object.entries(config).filter(([key]) => !excludeKeys.includes(key));
  return [
    { value: allValue, label: allLabel, status: null },
    ...entries.map(([status, { label }]) => ({ value: status, label, status })),
  ];
}

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
  /** id колонки со статусом для фильтра по табам (нужен только при передаче tabs) */
  statusColumnId?: string;
  /** привязка табов к фильтру (игнорируется, если передан tabs) */
  tabStatusFilter?: TabStatusFilter;
  /** Вкладки: value, label, status для фильтра. Если не передан — табы не показываются, только таблица. */
  tabs?: TabItem[];
  /** Доп. контент в тулбаре справа (кнопки и т.д.). Передаётся из страницы (Trips, Clicks и т.д.). */
  toolbarExtra?: React.ReactNode;
  /** Плейсхолдер селекта выбора вкладки (только при наличии tabs) */
  viewSelectorPlaceholder?: string;
  /** Подпись "Rows per page" */
  rowsPerPageLabel?: string;
  /** Подпись колонок: "Columns" на узком экране (короткая) */
  columnsButtonLabelShort?: string;
  /** Подпись колонок: "Customize Columns" на широком (длинная) */
  columnsButtonLabelLong?: string;
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
      className={`relative z-0 min-h-[38px] whitespace-nowrap ${enableDragAndDrop ? "data-[dragging=true]:z-10 data-[dragging=true]:opacity-80" : ""}`}
      style={style}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id} className={FIXED_COLUMN_CLASS[cell.column.id]}>
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
    <TableRow className="min-h-[38px] whitespace-nowrap">
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

        const fixedClass = FIXED_COLUMN_CLASS[columnId];
        return (
          <TableCell key={header.id || index} className={`py-2 ${fixedClass ?? ""}`}>
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
  statusColumnId = "orderStatus",
  tabStatusFilter: tabStatusFilterProp,
  tabs: tabsProp,
  toolbarExtra,
  viewSelectorPlaceholder = "Select a view",
  rowsPerPageLabel = "Rows per page",
  columnsButtonLabelShort = "Columns",
  columnsButtonLabelLong = "Customize Columns",
}: DataTableProps<TData>) {
  const viewTabs = tabsProp ?? [];
  const hasTabs = viewTabs.length > 0;

  const tabStatusFilter = useMemo(
    () =>
      hasTabs
        ? Object.fromEntries(viewTabs.map((t) => [t.value, t.status]))
        : (tabStatusFilterProp ?? {}),
    [hasTabs, viewTabs, tabStatusFilterProp]
  );

  const [data, setData] = useState(() => initialData);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });
  const [activeTab, setActiveTab] = useState(() => viewTabs[0]?.value ?? "");
  const sortableId = useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  // Sync external data changes
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // Фильтр по вкладке (только когда передан tabs)
  const tableData = useMemo(() => {
    if (!hasTabs || !statusColumnId) return data;
    const statusValue = tabStatusFilter[activeTab] ?? null;
    if (statusValue === null) return data;
    return data.filter((row) => (row as Record<string, unknown>)[statusColumnId] === statusValue);
  }, [data, activeTab, tabStatusFilter, statusColumnId, hasTabs]);

  // Сброс пагинации при смене вкладки, чтобы не оставаться на пустой странице
  const prevActiveTabRef = useRef(activeTab);
  useEffect(() => {
    if (prevActiveTabRef.current !== activeTab && tabStatusFilter) {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      prevActiveTabRef.current = activeTab;
    } else {
      prevActiveTabRef.current = activeTab;
    }
  }, [activeTab, tabStatusFilter]);

  const dataIds = useMemo<UniqueIdentifier[]>(
    () => tableData?.map((row) => getRowId(row)) || [],
    [tableData, getRowId]
  );

  const table = useReactTable({
    data: tableData,
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

  const tableBlock = (
    <>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-border">
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
          sensors={enableDragAndDrop ? sensors : []}
          id={sortableId}
        >
          <div
            className={
              !isLoading && !table.getRowModel().rows?.length
                ? "flex min-h-0 flex-1 flex-col overflow-auto"
                : "min-h-0 flex-1 overflow-auto"
            }
          >
            <Table
              className={`table-fixed ${!isLoading && !table.getRowModel().rows?.length ? "shrink-0" : ""}`}
            >
              <TableHeader className="bg-secondary sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        className={`border-r border-border ${FIXED_COLUMN_CLASS[header.column.id] ?? ""}`}
                        key={header.id}
                        colSpan={header.colSpan}
                      >
                        <div className="flex items-center justify-center">
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              {!isLoading && !table.getRowModel().rows?.length ? null : (
                <TableBody className="**:data-[slot=table-cell]:first:w-8">
                  {isLoading ? (
                    Array.from({ length: skeletonRows }).map((_, index) => (
                      <TableSkeletonRow
                        key={`skeleton-${index}`}
                        headerGroups={table.getHeaderGroups()}
                        rowIndex={index}
                      />
                    ))
                  ) : (
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
                  )}
                </TableBody>
              )}
            </Table>
            {!isLoading && !table.getRowModel().rows?.length ? (
              <div className="flex flex-1 flex-col items-center justify-center min-h-0 py-8">
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <EmptyGridAnimation />
                    </EmptyMedia>
                    <EmptyTitle className="text-muted-foreground">{emptyMessage}</EmptyTitle>
                  </EmptyHeader>
                </Empty>
              </div>
            ) : null}
          </div>
        </DndContext>
      </div>
      <div className="flex shrink-0 items-center justify-between">
        <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              {rowsPerPageLabel}
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-20" id="rows-per-page">
                <SelectValue placeholder={String(table.getState().pagination.pageSize)} />
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
    </>
  );

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-4">
      {hasTabs ? (
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex min-h-0 w-full flex-1 flex-col gap-2"
        >
          <div className="flex shrink-0 items-center justify-between">
            <Label htmlFor="view-selector" className="sr-only">
              View
            </Label>
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="flex w-fit h-8 lg:hidden" id="view-selector">
                <SelectValue placeholder={viewSelectorPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {viewTabs.map((tab) => (
                  <SelectItem key={tab.value} value={tab.value}>
                    {tab.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <TabsList className="**:data-[slot=badge]:bg-muted-foreground hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 lg:flex">
              {viewTabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                  {tab.badge != null && <Badge variant="secondary">{tab.badge}</Badge>}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="flex items-center gap-2">
              {enableColumnVisibility && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <LayoutGrid />
                      <span className="hidden lg:inline">{columnsButtonLabelLong}</span>
                      <span className="lg:hidden">{columnsButtonLabelShort}</span>
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {table
                      .getAllColumns()
                      .filter(
                        (column) => typeof column.accessorFn !== "undefined" && column.getCanHide()
                      )
                      .map((column) => (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) => column.toggleVisibility(!!value)}
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {toolbarExtra}
            </div>
          </div>

          {viewTabs.map((tab) => (
            <TabsContent
              key={tab.value}
              value={tab.value}
              className="relative flex min-h-0 flex-1 flex-col gap-4 overflow-hidden data-[state=inactive]:hidden"
            >
              {tableBlock}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <>
          <div className="flex shrink-0 items-center justify-end gap-2">
            {enableColumnVisibility && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <LayoutGrid />
                    <span className="hidden lg:inline">{columnsButtonLabelLong}</span>
                    <span className="lg:hidden">{columnsButtonLabelShort}</span>
                    <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {table
                    .getAllColumns()
                    .filter(
                      (column) => typeof column.accessorFn !== "undefined" && column.getCanHide()
                    )
                    .map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {toolbarExtra}
          </div>
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden">{tableBlock}</div>
        </>
      )}
    </div>
  );
}
