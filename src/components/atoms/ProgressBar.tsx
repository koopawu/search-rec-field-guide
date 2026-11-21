import { useEffect, useRef } from 'react';

/** ProgressBar：顶部 2px 阅读进度条（篇章色，scroll 驱动，不重渲染） */
export default function ProgressBar({ color = 'var(--accent)' }: { color?: string }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = barRef.current;
      if (!el) return;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      el.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed left-0 top-0 z-[60] h-0.5 w-full" aria-hidden="true">
      <div
        ref={barRef}
        className="h-full w-full origin-left"
        style={{ backgroundColor: color, transform: 'scaleX(0)' }}
      />
    </div>
  );
}
