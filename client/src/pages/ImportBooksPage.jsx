import { useState } from 'react';
import { FileSpreadsheet, RefreshCw, UploadCloud } from 'lucide-react';
import api from '../api/client';
import SectionHeader from '../components/SectionHeader';

const sampleHeaders = [
  'title',
  'author',
  'genres',
  'keywords',
  'average_rating',
  'coverImage',
  'description'
];

const ImportBooksPage = () => {
  const [file, setFile] = useState(null);
  const [replaceExisting, setReplaceExisting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setResult(null);

    if (!file) {
      setError('Select a CSV or Excel file first.');
      return;
    }

    const formData = new FormData();
    formData.append('dataset', file);
    formData.append('replaceExisting', String(replaceExisting));

    setLoading(true);

    try {
      const { data } = await api.post('/books/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setResult(data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Import failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-shell py-16">
      <SectionHeader
        eyebrow="Dynamic Catalog Import"
        title="Upload CSV or Excel data into MongoDB"
        description="This page imports books directly into the database so your recommendation engine can use dynamic catalog data instead of only seeded content."
      />

      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="glass-panel p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-[28px] border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-ink text-white">
                <UploadCloud size={28} />
              </div>
              <h2 className="mt-4 font-display text-3xl font-bold text-ink">Choose dataset file</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Supported formats: <span className="font-semibold">.csv</span>, <span className="font-semibold">.xlsx</span>, and <span className="font-semibold">.xls</span>
              </p>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(event) => setFile(event.target.files?.[0] || null)}
                className="mt-6 block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600"
              />
              {file ? <p className="mt-4 text-sm font-medium text-teal">Selected file: {file.name}</p> : null}
            </div>

            <label className="flex items-start gap-3 rounded-3xl border border-slate-200 bg-white p-5">
              <input
                type="checkbox"
                checked={replaceExisting}
                onChange={(event) => setReplaceExisting(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-teal focus:ring-teal"
              />
              <span>
                <span className="block text-sm font-semibold text-ink">Replace existing catalog</span>
                <span className="mt-1 block text-sm leading-7 text-slate-500">
                  If enabled, current books and ratings are removed before the new dataset is inserted.
                </span>
              </span>
            </label>

            {error ? <p className="text-sm font-medium text-coral">{error}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-3 rounded-2xl bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal disabled:opacity-70"
            >
              {loading ? <RefreshCw size={18} className="animate-spin" /> : <FileSpreadsheet size={18} />}
              {loading ? 'Importing dataset...' : 'Upload and import'}
            </button>
          </form>

          {result ? (
            <div className="mt-8 rounded-[28px] bg-emerald-50 p-6">
              <h3 className="font-display text-2xl font-bold text-ink">Import complete</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Imported rows</p>
                  <p className="mt-2 text-3xl font-bold text-ink">{result.importedRows}</p>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Total books</p>
                  <p className="mt-2 text-3xl font-bold text-ink">{result.totalBooks}</p>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Inserted</p>
                  <p className="mt-2 text-3xl font-bold text-ink">{result.insertedCount}</p>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Updated</p>
                  <p className="mt-2 text-3xl font-bold text-ink">{result.updatedCount}</p>
                </div>
              </div>
            </div>
          ) : null}
        </section>

        <section className="glass-panel p-8">
          <h2 className="font-display text-3xl font-bold text-ink">Expected columns</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Only <span className="font-semibold">title</span> and <span className="font-semibold">author</span> are required. Genres and keywords can be comma-separated lists.
          </p>

          <div className="mt-6 rounded-[28px] bg-slate-950 p-6 text-sm text-white">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-white/60">CSV header example</p>
            <pre className="overflow-x-auto whitespace-pre-wrap break-words text-white/90">
              {sampleHeaders.join(',')}
            </pre>
          </div>

          <div className="mt-6 rounded-[28px] bg-slate-50 p-6">
            <p className="text-sm font-semibold text-ink">Example row</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              The Midnight Archive,Elena Maris,"Fantasy, Mystery","library, magic, secrets",4.6,https://example.com/cover.jpg,An enchanted library opens after midnight.
            </p>
          </div>

          <div className="mt-6 rounded-[28px] border border-slate-200 p-6">
            <p className="text-sm font-semibold text-ink">How duplicates are handled</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Rows are matched by the combination of title and author. Existing matches are updated; new rows are inserted.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ImportBooksPage;
