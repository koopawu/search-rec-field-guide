// S7 · 收尾 CTA 带（home.md §S7）
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { chapters } from '@/content';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const QUOTE = '指标定义错了，全公司会朝错误方向优化。';

export default function ClosingCta() {
  return (
    <section className="border-t border-line bg-surface-2" aria-label="开始学习">
      <div className="mx-auto max-w-[1280px] px-6 py-24 text-center max-md:px-4">
        <h2 className="mx-auto max-w-3xl font-serif text-h2 text-ink">
          {Array.from(QUOTE).map((ch, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, delay: i * 0.03, ease: EASE }}
            >
              {ch}
            </motion.span>
          ))}
        </h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.5, ease: EASE }}
          className="mt-4 text-body text-ink-2"
        >
          从第一章开始，建立属于你的分发判断力。
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.4, ease: EASE }}
          className="mt-8"
        >
          <Link
            to={`/chapters/${chapters[0].slug}`}
            className="inline-flex rounded-lg bg-accent px-7 py-3 text-body font-medium text-[#FFFDF9] transition-all hover:translate-y-[1px] hover:bg-accent-deep"
          >
            进入篇章一 · 搜索篇
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
