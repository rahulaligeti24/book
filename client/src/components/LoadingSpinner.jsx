const LoadingSpinner = ({ label = 'Loading...' }) => (
  <div className="flex min-h-[220px] flex-col items-center justify-center gap-4 rounded-3xl border border-slate-200 bg-white/70">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal/20 border-t-teal" />
    <p className="text-sm font-medium text-slate-500">{label}</p>
  </div>
);

export default LoadingSpinner;

