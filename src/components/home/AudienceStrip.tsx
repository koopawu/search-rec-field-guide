// S2 · 读者定位条（home.md §S2）：三列卡片
import { motion } from 'framer-motion';
import ChapterIcon from '@/components/ChapterIcon';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const CARDS = [
  {
    icon: 'search',
    title: '资深策略 PM',
    body: '懂 AB 实验和漏斗，想系统补齐召回/排序/混排的算法地图，设计策略时知道杠杆在哪。',
  },
  {
    icon: 'dashboard-scale',
    title: '准分发负责人',
    body: '要管流量分配、生态调控与商业化混排，需要指标金字塔、流量调控四件套与大厂机制对照。',
  },
  {
    icon: 'spark',
    title: '追赶 LLM 浪潮的人',
    body: 'RAG、生成式推荐、搜推问一体化正在重构分发，需要建立新范式的判断力而非追热点。',
  },
];

export default function AudienceStrip() {
  return (
    <section className="mx-auto max-w-[1280px] px-6 py-24 max-md:px-4" aria-label="写给谁">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: EASE }}
        className="text-center"
      >
        <h2 className="font-serif text-h2 text-ink">写给谁</h2>
        <p className="mt-3 text-body text-ink-2">
          如果你正从『策略产品』走向『分发负责人』，这座知识库按你的决策场景组织。
        </p>
      </motion.div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {CARDS.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
            className="group relative overflow-hidden rounded-card border border-line bg-surface p-7 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
          >
            <span
              className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100"
              aria-hidden="true"
            />
            <ChapterIcon icon={card.icon} size={28} color="var(--accent)" />
            <h3 className="mt-4 text-h3 font-serif text-ink">{card.title}</h3>
            <p className="mt-2.5 text-body text-ink-2">{card.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
