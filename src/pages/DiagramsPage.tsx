// 图示库 `/diagrams`（design/diagrams.md）：页头 + sticky 筛选条 + 画廊 + Lightbox + 页尾引导
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import Breadcrumb from '@/components/atoms/Breadcrumb';
import { buildGalleryItems, CORE_DIAGRAM_IDS, GALLERY_CATEGORIES, type GalleryItem } from '@/components/diagrams/gallery/data';
import GalleryFilterBar, { type CategoryFilter } from '@/components/diagrams/gallery/GalleryFilterBar';
import DiagramCard from '@/components/diagrams/gallery/DiagramCard';
import DiagramLightbox from '@/components/diagrams/gallery/DiagramLightbox';

/** 画廊数据在模块加载时聚合一次（内容数据为静态构建期数据） */
const GALLERY_ITEMS = buildGalleryItems();

export default function DiagramsPage() {
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [coreOnly, setCoreOnly] = useState(false);
  const [queryInput, setQueryInput] = useState('');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  // 图名搜索防抖 200ms
  useEffect(() => {
    const t = setTimeout(() => setQuery(queryInput.trim()), 200);
    return () => clearTimeout(t);
  }, [queryInput]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return GALLERY_ITEMS.filter((item) => {
      if (category !== 'all' && item.category !== category) return false;
      if (coreOnly && !item.isCore) return false;
      if (
        q &&
        !item.title.toLowerCase().includes(q) &&
        !item.diagramId.toLowerCase().includes(q) &&
        !item.altText.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [category, coreOnly, query]);

  const openItem = filtered.find((i) => i.diagramId === openId) ?? null;

  return (
    <div className="pb-0">
      {/* S1 · 页头 */}
      <motion.header
        className="mx-auto max-w-[1280px] px-6 pb-8 pt-16 max-md:px-4"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.1 } },
        }}
      >
        <motion.div variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}>
          <Breadcrumb items={[{ label: '首页', href: '/' }, { label: '图示库' }]} />
        </motion.div>
        <motion.p
          variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
          className="mt-6 text-label text-ink-3"
        >
          DIAGRAM GALLERY
        </motion.p>
        <motion.h1
          variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
          className="mt-2 font-serif text-h1 text-ink"
        >
          图示库
        </motion.h1>
        <motion.p
          variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
          className="mt-4 max-w-2xl text-body-l text-ink-2"
        >
          {GALLERY_ITEMS.length} 幅工程草图风格的架构图示，覆盖搜索与推荐全链路。每幅图都可放大，并跳回它出现的小节。
        </motion.p>
        <motion.p
          variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
          className="mt-3 font-mono text-small text-ink-3"
        >
          {GALLERY_ITEMS.length} 幅图示 · {GALLERY_CATEGORIES.length} 个分类 · {CORE_DIAGRAM_IDS.size} 幅全站核心图
        </motion.p>
      </motion.header>

      {/* S2 · 筛选工具条（sticky） */}
      <GalleryFilterBar
        category={category}
        onCategory={setCategory}
        coreOnly={coreOnly}
        onCoreOnly={setCoreOnly}
        query={queryInput}
        onQuery={setQueryInput}
      />

      {/* S3 · 图示画廊 */}
      <main className="mx-auto max-w-[1280px] px-6 py-10 max-md:px-4">
        {filtered.length === 0 ? (
          <p className="py-24 text-center text-body text-ink-3">
            没有匹配的图示，试试换个关键词或分类。
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item, i) => (
              <DiagramCard
                key={item.diagramId}
                item={item}
                index={i}
                onOpen={(it: GalleryItem) => setOpenId(it.diagramId)}
              />
            ))}
          </div>
        )}
      </main>

      {/* S4 · Lightbox */}
      <DiagramLightbox
        item={openItem}
        items={filtered}
        onClose={() => setOpenId(null)}
        onSwitch={(it) => setOpenId(it.diagramId)}
      />

      {/* S5 · 页尾引导 */}
      <footer className="mx-auto max-w-[1280px] px-6 py-12 text-center max-md:px-4">
        <p className="text-body text-ink-2">
          想把图放回上下文里读？
          <Link to="/chapters/search" className="link-underline ml-1 font-medium text-accent hover:text-accent-deep">
            → 进入篇章一 · 搜索篇
          </Link>
        </p>
      </footer>
    </div>
  );
}
