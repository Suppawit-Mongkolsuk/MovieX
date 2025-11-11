import * as ScrollArea from '@radix-ui/react-scroll-area';

interface BaseTableProps<T> {
  columns: string[];
  data: T[];
  renderRow: (item: T, index: number) => React.ReactNode;
}

export function BaseTable<T>({ columns, data, renderRow }: BaseTableProps<T>) {
  return (
    <div className="w-full rounded-xl">
      {/* ตาราง Header */}
      <table className="w-full border-collapse table-fixed ">
        <colgroup>
          {columns.map((_, i) => (
            <col key={i} />
          ))}
        </colgroup>
        {/* thead */}
        <thead>
          <tr
            className="rounded-xl bg-gradient-to-r from-[#4A0000]/70 to-[#8B0000]/60 
            text-white uppercase text-sm backdrop-blur-md 
            shadow-[0_2px_10px_rgba(0,0,0,0.25)]"
          >
            {columns.map((col, i) => (
              <th key={i} className="p-4 font-semibold ">
                {col}
              </th>
            ))}
          </tr>
        </thead>
      </table>

      {/* tbody */}
      <ScrollArea.Root className="w-full rounded-b-xl overflow-hidden">
        <ScrollArea.Viewport className="w-full max-h-[65vh] overflow-y-auto block">
          <table className="w-full text-left table-fixed min-w-full">
            <colgroup>
              {columns.map((_, i) => (
                <col key={i} className="w-auto" />
              ))}
            </colgroup>
            <tbody
              className="bg-gradient-to-b from-white/10 to-white/5 
              text-white backdrop-blur-md 
              border-t border-white/10 shadow-inner"
            >
              {data && data.length > 0 ? (
                data.map((item, i) => renderRow(item, i))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-4 text-gray-400 "
                  >
                    ไม่มีข้อมูล
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </ScrollArea.Viewport>

        {/* ✅ scrollbar ด้านข้าง */}
        <ScrollArea.Scrollbar
          orientation="vertical"
          className="flex select-none touch-none p-0.5 transition-colors bg-transparent"
        >
          <ScrollArea.Thumb className="flex-1 rounded-full bg-white/40 hover:bg-white/60" />
        </ScrollArea.Scrollbar>

        {/* ✅ scrollbar ด้านล่าง */}
        <ScrollArea.Scrollbar
          orientation="horizontal"
          className="flex select-none touch-none h-2 transition-colors bg-transparent"
        >
          <ScrollArea.Thumb className="flex-1 rounded-full bg-white/40 hover:bg-white/60" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  );
}
