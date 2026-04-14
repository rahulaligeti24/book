const SectionHeader = ({ eyebrow, title, description, action }) => (
  <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
    <div className="max-w-2xl">
      {eyebrow ? <p className="text-sm font-semibold uppercase tracking-[0.25em] text-teal">{eyebrow}</p> : null}
      <h2 className="mt-2 font-display text-3xl font-bold text-ink">{title}</h2>
      {description ? <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p> : null}
    </div>
    {action}
  </div>
);

export default SectionHeader;

