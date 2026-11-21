/** SectionNo：小节编号方块（Serif 700 数字，篇章色描边）——全站识别符号 */
export default function SectionNo({
  no,
  color,
  size = 24,
  className = '',
}: {
  /** 展示编号，如 '1.4' */
  no: string;
  /** 篇章色 hue */
  color: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-md border-[1.5px] font-serif font-bold ${className}`}
      style={{
        width: size,
        height: size,
        borderColor: color,
        color,
        fontSize: size >= 32 ? size * 0.34 : 11,
        lineHeight: 1,
      }}
      aria-label={`小节 ${no}`}
    >
      {no}
    </span>
  );
}
