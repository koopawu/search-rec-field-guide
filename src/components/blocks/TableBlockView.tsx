import type { TableBlock } from '@/content';
import { SourceRefGroup } from '@/components/atoms';

/** table 对比表格（section.md §4.3） */
export default function TableBlockView({
  block,
  hue,
  tint,
}: {
  block: TableBlock;
  hue: string;
  tint: string;
}) {
  const { caption, columns, rows, highlightRowKeys = [], sourceRefs } = block.payload;
  return (
    <figure className="overflow-hidden rounded-card border border-line bg-surface shadow-card">
      {caption && (
        <figcaption className="px-6 pt-4 text-center text-small text-ink-3">{caption}</figcaption>
      )}
      <div className="overflow-x-auto p-4">
        <table className="w-full border-collapse text-body">
          <thead>
            <tr className="bg-surface-2">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="border-b-2 border-line-strong px-4 py-3 text-left font-bold text-ink"
                  style={{ textAlign: col.align ?? 'left' }}
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => {
              const highlighted = highlightRowKeys.some((k) => row[columns[0]?.key ?? ''] === k || row.key === k);
              return (
                <tr
                  key={ri}
                  className="border-b border-line transition-colors last:border-b-0 hover:bg-surface-2"
                  style={highlighted ? { backgroundColor: tint, boxShadow: `inset 3px 0 0 ${hue}` } : undefined}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-4 py-3 text-ink-2"
                      style={{ textAlign: col.align ?? 'left' }}
                    >
                      {row[col.key]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {sourceRefs && <div className="px-6 pb-4"><SourceRefGroup sourceRefs={sourceRefs} /></div>}
    </figure>
  );
}
