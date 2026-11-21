// 上一/下一 双卡导航（chapter.md S5 篇章间导航、section.md S3-4 上下节导航共用样式）
// 卡片表面为目标篇章 tint 色 + 篇章色文字；hover 箭头外移、卡片上浮
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export interface NavCardData {
  href: string;
  /** 眉题，如「上一篇章」「下一节 1.5」 */
  eyebrow: string;
  title: string;
  /** 副标题（tagline / 篇章简介），1 行截断 */
  sub?: string;
  hue: string;
  tint: string;
  /** 跳转后滚动到的首页锚点 id（用于「回到知识地图 / 学习路径」卡） */
  anchorId?: string;
}

function NavCard({ data, dir }: { data: NavCardData; dir: 'prev' | 'next' }) {
  const navigate = useNavigate();
  const Arrow = dir === 'prev' ? ArrowLeft : ArrowRight;

  const inner = (
    <>
      <Arrow
        size={18}
        strokeWidth={1.5}
        color={data.hue}
        className={`shrink-0 transition-transform duration-200 ${
          dir === 'prev' ? 'group-hover:-translate-x-1.5' : 'group-hover:translate-x-1.5'
        }`}
        aria-hidden="true"
      />
      <span className="min-w-0 flex-1">
        <span className="block text-label" style={{ color: data.hue }}>
          {data.eyebrow}
        </span>
        <span className="mt-1 block truncate font-serif text-h3" style={{ color: data.hue }}>
          {data.title}
        </span>
        {data.sub && <span className="mt-1 block truncate text-small text-ink-2">{data.sub}</span>}
      </span>
    </>
  );

  const className = `group flex items-center gap-4 rounded-card p-5 text-left shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover ${
    dir === 'next' ? 'flex-row-reverse text-right' : ''
  }`;

  if (data.anchorId) {
    return (
      <button
        type="button"
        style={{ backgroundColor: data.tint }}
        className={className}
        onClick={() => {
          navigate(data.href);
          setTimeout(
            () => document.getElementById(data.anchorId!)?.scrollIntoView({ behavior: 'smooth' }),
            120,
          );
        }}
      >
        {inner}
      </button>
    );
  }

  return (
    <Link to={data.href} style={{ backgroundColor: data.tint }} className={className}>
      {inner}
    </Link>
  );
}

/** 上一 / 下一 双卡；缺一侧时渲染占位保持双列对齐 */
export default function PrevNextCards({ prev, next }: { prev?: NavCardData; next?: NavCardData }) {
  return (
    <nav className="grid gap-4 sm:grid-cols-2" aria-label="上下导航">
      {prev ? <NavCard data={prev} dir="prev" /> : <span className="hidden sm:block" />}
      {next ? <NavCard data={next} dir="next" /> : <span className="hidden sm:block" />}
    </nav>
  );
}
