// scrollspy 工具：阅读页右栏目录 / mobile 折叠目录共用
import { useEffect, useState } from 'react';

/** scrollspy：取当前滚动位置上方最后一个锚点（rAF 节流，不重渲染高频动画） */
export function useScrollSpy(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? '');
  const key = ids.join('|');

  useEffect(() => {
    const list = key ? key.split('|') : [];
    if (!list.length) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY + 120;
      let current = list[0];
      for (const id of list) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) current = id;
      }
      setActive(current);
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
  }, [key]);

  return active;
}

export function scrollToAnchor(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
