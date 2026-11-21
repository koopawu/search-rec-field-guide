// ============================================================
// Layout：站点外壳。Navbar（sticky）+ <Outlet/> + Footer + Lenis 平滑滚动
// 路由模式：嵌套 Route（pattern B，见 react-dev.md "Layout + routing contract"）
// ============================================================

import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import Lenis from 'lenis';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Layout() {
  const { pathname } = useLocation();

  // Lenis 全站平滑滚动（lerp 0.1，design.md §5）
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1 });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  // 路由切换回顶部（锚点跳转除外，由调用方处理）
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
