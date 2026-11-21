import { Link } from 'react-router';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/** Breadcrumb：`首页 / 篇章名 / 小节名`，Label 字号 */
export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="面包屑" className="flex flex-wrap items-center gap-1.5 text-label text-ink-3">
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`} className="inline-flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={12} strokeWidth={1.5} aria-hidden="true" />}
          {item.href ? (
            <Link to={item.href} className="link-underline hover:text-ink-2">
              {item.label}
            </Link>
          ) : (
            <span className="text-ink-2">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
