// 小节收尾 · 已读打卡条（section.md S3-3）
// 读写 localStorage `srkb:read:{sectionId}`，与首页学习路径打卡共用存储
import { Check, Circle } from 'lucide-react';
import { useReadState } from './readState';

export default function ReadCheckButton({
  sectionId,
  hue,
}: {
  sectionId: string;
  hue: string;
}) {
  const [done, setDone] = useReadState(sectionId);

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-card border border-line bg-surface p-5 shadow-card">
      <button
        type="button"
        onClick={() => setDone(!done)}
        aria-pressed={done}
        className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-body font-medium transition-all hover:translate-y-[1px]"
        style={
          done
            ? { backgroundColor: hue, color: '#FFFDF9' }
            : { border: `1.5px solid ${hue}`, color: hue, backgroundColor: 'transparent' }
        }
      >
        {done ? (
          <Check size={16} strokeWidth={2} aria-hidden="true" />
        ) : (
          <Circle size={15} strokeWidth={1.5} aria-hidden="true" />
        )}
        {done ? '本节已读' : '标记本节已读'}
      </button>
      {done && <span className="text-small text-ink-3">已加入学习路径进度</span>}
    </div>
  );
}
