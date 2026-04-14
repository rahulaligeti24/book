const StatCard = ({ label, value, tone = 'teal' }) => (
  <div className="rounded-[28px] border border-white/70 bg-white p-6 shadow-soft">
    <p className={`text-xs font-semibold uppercase tracking-[0.25em] ${tone === 'coral' ? 'text-coral' : 'text-teal'}`}>
      {label}
    </p>
    <p className="mt-4 font-display text-4xl font-bold text-ink">{value}</p>
  </div>
);

export default StatCard;

