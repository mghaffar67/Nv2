
import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Filter as FilterIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface Column {
  header: string;
  accessor: string;
  headerClassName?: string;
  className?: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  title: string;
  columns: Column[];
  data: any[];
  onSearch?: (term: string) => void;
  filters?: { label: string; value: string }[];
  onFilterChange?: (value: string) => void;
  isLoading?: boolean;
}

const DataTable: React.FC<DataTableProps> = ({ 
  title, 
  columns, 
  data, 
  onSearch, 
  filters, 
  onFilterChange,
  isLoading = false 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = window.innerWidth < 768 ? 6 : 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white rounded-[24px] md:rounded-[36px] shadow-sm border border-slate-100 overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 md:p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base md:text-xl font-black text-slate-800 leading-none">{title}</h2>
          <p className="text-[8px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Registry Flow: {data.length} entries</p>
        </div>

        <div className="flex items-center gap-2">
          {onSearch && (
            <div className="relative group flex-grow md:flex-none">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search..." 
                onChange={(e) => onSearch(e.target.value)}
                className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[9px] md:text-sm font-medium w-full md:w-64 focus:outline-none focus:ring-4 focus:ring-indigo-50/50 transition-all"
              />
            </div>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse min-w-[500px] md:min-w-0">
          <thead>
            <tr className="bg-slate-50/30">
              {columns.map((col, idx) => (
                <th key={idx} className={clsx("px-4 md:px-8 py-3 md:py-4 text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50", col.headerClassName)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((col, j) => (
                    <td key={j} className={clsx("px-4 md:px-8 py-4", col.className)}>
                      <div className="h-2 bg-slate-50 rounded-full w-12 md:w-24"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length > 0 ? (
              paginatedData.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-slate-50/30 transition-colors group">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className={clsx("px-4 md:px-8 py-3 md:py-5", col.className)}>
                      {col.render ? col.render(row[col.accessor], row) : (
                        <span className="text-[10px] md:text-sm font-bold text-slate-600">{row[col.accessor]}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-lg mb-4 shadow-inner">📭</div>
                    <p className="text-slate-400 font-black uppercase tracking-widest text-[9px]">Registry Empty</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 md:p-6 bg-slate-50/20 flex items-center justify-between border-t border-slate-50">
        <p className="text-[8px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest">
          Showing <span className="text-slate-900">{Math.min(currentPage*itemsPerPage, data.length)}</span> of {data.length}
        </p>
        <div className="flex items-center gap-1">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="p-1.5 border border-slate-100 rounded-lg bg-white text-slate-400 disabled:opacity-30 transition-all shadow-sm"
          >
            <ChevronLeft size={14} />
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 3) }).map((_, i) => (
              <button 
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={clsx(
                  "w-7 h-7 rounded-lg text-[9px] font-black transition-all",
                  currentPage === i + 1 ? "bg-slate-900 text-white shadow-md" : "text-slate-400 hover:bg-white"
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button 
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="p-1.5 border border-slate-100 rounded-lg bg-white text-slate-400 disabled:opacity-30 transition-all shadow-sm"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
