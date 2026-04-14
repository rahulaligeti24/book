const ChartPanel = ({ title, children, description }) => (
  <section className="rounded-[30px] border border-white/70 bg-white p-6 shadow-soft">
    <h3 className="font-display text-2xl font-bold text-ink">{title}</h3>
    {description ? <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p> : null}
    <div className="mt-6 h-[320px] w-full">{children}</div>
  </section>
);

export default ChartPanel;

