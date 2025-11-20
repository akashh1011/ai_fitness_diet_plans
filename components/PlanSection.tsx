
interface Props {
  title: string;
  content: unknown;
  onItemClick: (label: string) => void;
}

export default function PlanSection({ title, content, onItemClick }: Props) {
  // 1) Raw string banaao
  const raw =
    typeof content === "string"
      ? content
      : content
      ? JSON.stringify(content, null, 2)
      : "";

  // 2) JSON looking text ko thoda clean karo
  let text = raw;
  const trimmed = raw.trim();
  const looksJson =
    trimmed.startsWith("{") || trimmed.startsWith("[");

  if (looksJson) {
    text = raw
      .replace(/[{}"]/g, "")
      .replace(/,\n/g, "\n")
      .replace(/,/g, "")
      .replace(/\\n/g, "\n");
  }

  const lines = text.split("\n");

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-sm">
      <h2 className="font-semibold mb-2">{title}</h2>
      <div className="space-y-1">
        {lines.map((line, i) => {
          const trimmedLine = line.trim();
          if (!trimmedLine) {
            return <p key={i} className="h-1" />;
          }

          const isBullet =
            trimmedLine.startsWith("- ") ||
            trimmedLine.startsWith("•") ||
            trimmedLine.startsWith("*");

          if (!isBullet) {
            return (
              <p key={i} className="whitespace-pre-wrap">
                {trimmedLine}
              </p>
            );
          }

          const label = trimmedLine.replace(/^[-*•]\s*/, "");

          return (
            <button
              key={i}
              type="button"
              className="block w-full text-left hover:bg-slate-800/70 rounded px-1"
              onClick={() => onItemClick(label)}
            >
              {trimmedLine}
            </button>
          );
        })}
      </div>
    </section>
  );
}
