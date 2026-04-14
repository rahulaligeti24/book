import { Search } from 'lucide-react';

const SearchBar = ({ value, onChange, onSubmit, placeholder = 'Search books, authors, genres...' }) => (
  <form
    onSubmit={(event) => {
      event.preventDefault();
      onSubmit?.();
    }}
    className="glass-panel flex flex-col gap-3 p-3 sm:flex-row"
  >
    <div className="flex flex-1 items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
      <Search size={18} className="text-slate-400" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
      />
    </div>
    <button type="submit" className="rounded-2xl bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal">
      Search
    </button>
  </form>
);

export default SearchBar;

