export function FundingProgress({ current, total }: { current: number; total: number }) {
  const percent = Math.min(100, Math.round((current / total) * 100));
  return (
    <div>
      <div className="mb-2 flex justify-between text-xs font-semibold text-slate">
        <span>Funding Decision Progress</span>
        <span>{percent}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-royal to-electric" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
