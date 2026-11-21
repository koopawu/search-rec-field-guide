// 首页 `/` — 知识地图导览（design/home.md 全部 7 个分区）
import Hero from '@/components/home/Hero';
import AudienceStrip from '@/components/home/AudienceStrip';
import KnowledgeMap from '@/components/home/KnowledgeMap';
import LearningPath from '@/components/home/LearningPath';
import ChapterGrid from '@/components/home/ChapterGrid';
import FeaturedSections from '@/components/home/FeaturedSections';
import ClosingCta from '@/components/home/ClosingCta';

export default function Home() {
  return (
    <>
      <Hero />
      <AudienceStrip />
      <KnowledgeMap />
      <LearningPath />
      <ChapterGrid />
      <FeaturedSections />
      <ClosingCta />
    </>
  );
}
