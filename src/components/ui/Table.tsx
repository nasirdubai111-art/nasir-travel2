import React from "react";
import { cn } from "../../lib/utils";

export const Table: React.FC<React.TableHTMLAttributes<HTMLTableElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className="w-full overflow-x-auto rounded-[12px] border border-[#E5E7EB] bg-white shadow-xs">
    <table className={cn("w-full text-left border-collapse text-sm", className)} {...props}>
      {children}
    </table>
  </div>
);

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className,
  children,
  ...props
}) => (
  <thead className={cn("bg-[#F8FAFC] border-b border-[#E5E7EB] text-xs font-semibold text-[#4B5563] uppercase tracking-wider select-none", className)} {...props}>
    {children}
  </thead>
);

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className,
  children,
  ...props
}) => (
  <tbody className={cn("divide-y divide-[#E5E7EB] bg-white text-[#111827]", className)} {...props}>
    {children}
  </tbody>
);

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({
  className,
  children,
  ...props
}) => (
  <tr className={cn("hover:bg-[#F8FAFC] transition-colors duration-100", className)} {...props}>
    {children}
  </tr>
);

export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({
  className,
  children,
  ...props
}) => (
  <th className={cn("px-4 py-3 font-semibold text-xs text-[#4B5563]", className)} {...props}>
    {children}
  </th>
);

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({
  className,
  children,
  ...props
}) => (
  <td className={cn("px-4 py-3 text-sm text-[#111827] align-middle", className)} {...props}>
    {children}
  </td>
);
