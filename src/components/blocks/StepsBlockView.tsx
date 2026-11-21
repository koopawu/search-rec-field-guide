import { Fragment } from 'react';
import { MoveRight } from 'lucide-react';
import type { StepsBlock } from '@/content';
import RichTextView from './RichTextView';
import { SourceRefGroup } from '@/components/atoms';

/** steps 流程步骤（section.md §4.4） */
export default function StepsBlockView({ block, hue }: { block: StepsBlock; hue: string }) {
  const { orientation = 'vertical', steps, cyclic = false, sourceRefs } = block.payload;

  if (orientation === 'horizontal' && steps.length <= 4) {
    return (
      <div className="rounded-card border border-line bg-surface p-6 shadow-card">
        <div className="flex items-stretch gap-2 max-md:flex-col">
          {steps.map((step, i) => (
            <Fragment key={i}>
              {i > 0 && (
                <MoveRight
                  size={18}
                  strokeWidth={1.5}
                  className="self-center text-ink-3 max-md:rotate-90"
                  aria-hidden="true"
                />
              )}
              <div className="flex-1 rounded-lg bg-surface-2 p-4">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex h-6 w-6 items-center justify-center rounded-full font-serif text-small font-bold text-[#FFFDF9]"
                    style={{ backgroundColor: hue }}
                  >
                    {i + 1}
                  </span>
                  <h4 className="text-body font-bold text-ink">{step.title}</h4>
                  {step.badge && (
                    <span
                      className="rounded-full px-2 py-0.5 text-[11px] font-medium text-[#FFFDF9]"
                      style={{ backgroundColor: hue }}
                    >
                      {step.badge}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-small text-ink-2">
                  <RichTextView content={step.description} />
                </p>
              </div>
            </Fragment>
          ))}
        </div>
        {cyclic && <CyclicNote hue={hue} />}
        {sourceRefs && <SourceRefGroup sourceRefs={sourceRefs} />}
      </div>
    );
  }

  return (
    <div className="rounded-card border border-line bg-surface p-6 shadow-card">
      <ol className="relative space-y-6">
        {steps.map((step, i) => (
          <li key={i} className="relative pl-10">
            {/* 连接线 */}
            {i < steps.length - 1 && (
              <span
                className="absolute left-[13px] top-7 h-[calc(100%-8px)] w-0.5 bg-line-strong"
                aria-hidden="true"
              />
            )}
            <span
              className="absolute left-0 top-0 inline-flex h-7 w-7 items-center justify-center rounded-full border-[1.5px] bg-surface font-serif text-small font-bold"
              style={{ borderColor: hue, color: hue }}
            >
              {i + 1}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-body font-bold text-ink">{step.title}</h4>
              {step.badge && (
                <span
                  className="rounded-full px-2 py-0.5 text-[11px] font-medium text-[#FFFDF9]"
                  style={{ backgroundColor: hue }}
                >
                  {step.badge}
                </span>
              )}
            </div>
            <p className="mt-1 text-body text-ink-2">
              <RichTextView content={step.description} />
            </p>
          </li>
        ))}
      </ol>
      {cyclic && <CyclicNote hue={hue} />}
      {sourceRefs && <SourceRefGroup sourceRefs={sourceRefs} />}
    </div>
  );
}

function CyclicNote({ hue }: { hue: string }) {
  return (
    <div className="mt-4 flex items-center gap-2 text-small text-ink-3">
      <svg width="40" height="16" viewBox="0 0 40 16" aria-hidden="true">
        <path
          d="M38 8 C38 2, 4 2, 4 8"
          fill="none"
          stroke={hue}
          strokeWidth="1.5"
          strokeDasharray="5 5"
          markerEnd="url(#cyclic-arrow)"
        />
        <defs>
          <marker id="cyclic-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0 0 L6 3 L0 6" fill="none" stroke={hue} strokeWidth="1.5" />
          </marker>
        </defs>
      </svg>
      <span>循环：末端回到首步，形成闭环</span>
    </div>
  );
}
