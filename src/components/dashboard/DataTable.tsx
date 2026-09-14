import React, { useState, useMemo } from "react";
import { Search, ArrowUpDown, Eye, Edit2, Trash2, Download, Inbox } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../ui/Table";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Pagination } from "../ui/Pagination";
import { cn } from "../../lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchKey?: keyof T;
  pageSize?: number;
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onExport?: () => void;
  actionsLabel?: string;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchPlaceholder = "Search records...",
  searchKey,
  pageSize = 10,
  onView,
  onEdit,
  onDelete,
  onExport,
  actionsLabel = "Actions",
  className,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lower = searchTerm.toLowerCase();
    return data.filter((item) => {
      if (searchKey && item[searchKey] !== undefined) {
        return String(item[searchKey]).toLowerCase().includes(lower);
      }
      return Object.values(item).some((val) =>
        String(val).toLowerCase().includes(lower)
      );
    });
  }, [data, searchTerm, searchKey]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA === valB) return 0;
      if (valA > valB) return sortAsc ? 1 : -1;
      return sortAsc ? -1 : 1;
    });
  }, [filteredData, sortKey, sortAsc]);

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const hasActions = !!(onView || onEdit || onDelete);

  return (
    <div className={cn("space-y-4 text-left", className)}>
      {/* Controls: Search and Export */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:max-w-xs">
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        {onExport && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onExport}
            leftIcon={<Download className="w-4 h-4" />}
            className="self-end sm:self-auto"
          >
            Export CSV
          </Button>
        )}
      </div>

      {/* Table Surface */}
      {paginatedData.length === 0 ? (
        <div className="p-12 text-center bg-white border border-[#E5E7EB] rounded-[12px]">
          <Inbox className="w-10 h-10 text-[#9CA3AF] mx-auto mb-2" />
          <h4 className="text-sm font-bold text-[#111827]">No records found</h4>
          <p className="text-xs text-[#6B7280] mt-1">
            Try adjusting your search filters or add new entries.
          </p>
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead
                    key={col.key}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={cn(col.sortable ? "cursor-pointer select-none hover:text-[#0B5ED7]" : "")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {col.sortable && <ArrowUpDown className="w-3.5 h-3.5 text-[#9CA3AF]" />}
                    </div>
                  </TableHead>
                ))}
                {hasActions && <TableHead className="text-right">{actionsLabel}</TableHead>}
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedData.map((row, idx) => (
                <TableRow key={row.id || idx}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.render ? col.render(row) : row[col.key]}
                    </TableCell>
                  ))}

                  {hasActions && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {onView && (
                          <button
                            onClick={() => onView(row)}
                            className="p-1.5 rounded-[6px] hover:bg-slate-100 text-[#0B5ED7] transition-colors cursor-pointer"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="p-1.5 rounded-[6px] hover:bg-slate-100 text-[#F59E0B] transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            className="p-1.5 rounded-[6px] hover:bg-slate-100 text-[#DC2626] transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
