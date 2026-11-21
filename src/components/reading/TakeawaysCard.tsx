// 小节收尾 ·「本节要点回顾」卡（section.md S3-1）
// 篇章 tint 底、圆角 16px、padding 32；进入视口 stagger（正文区唯一动画区块）
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function TakeawaysCard({
  items,
  hue,
  tint,
}: {
  items: string[];
  hue: string;
  tint: string;
}) {
  if (!items.length) return null;
  return (
    <section
      id="takeaways"
      aria-label="本节要点"
      className="scroll-mt-24 rounded-figure p-8 max-md:p-6"
      style={{ backgroundColor: tint }}
    >
      <h2 className="font-serif text-h3 text-ink">✦ 本节要点</h2>
      <ul className="mt-5 space-y-3.5">
        {items.map((text, i) => (
          <motion.li
            key={i}
            className="flex items-start gap-3"
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
          >
            <span
              className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: hue }}
              aria-hidden="true"
            >
              <Check size={12} strokeWidth={2.5} color="#FFFDF9" />
            </span>
            <span className="text-body text-ink">{text}</span>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
