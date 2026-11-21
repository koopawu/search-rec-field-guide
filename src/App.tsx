// App 路由骨架：BrowserRouter（main.tsx）+ 嵌套 Route（Layout 渲染 <Outlet/>，pattern B）
import { Routes, Route } from 'react-router';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import ChapterPage from '@/pages/ChapterPage';
import SectionPage from '@/pages/SectionPage';
import DiagramsPage from '@/pages/DiagramsPage';
import SearchPage from '@/pages/SearchPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="chapters/:slug" element={<ChapterPage />} />
        <Route path="chapters/:slug/:sectionId" element={<SectionPage />} />
        <Route path="diagrams" element={<DiagramsPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route
          path="*"
          element={
            <div className="mx-auto max-w-[1280px] px-6 py-24">
              <h1 className="font-serif text-h1 text-ink">页面不存在</h1>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}
