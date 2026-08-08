import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { createItem, getCategories } from '../services/api';

const ACCENT_COLORS = ['#1C2541', '#3B6E52', '#E3A72A', '#B5482A'];

export default function ShareItem() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: '',
    category: '',
    description: '',
    condition: 'Good',
    location: user?.hostel || '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getCategories().then((cats) => {
      setCategories(cats);
      setForm((f) => ({ ...f, category: cats[0] || '' }));
    });
  }, []);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.title.trim() || !form.description.trim()) {
      setError('Please fill in a title and description.');
      return;
    }
    setSubmitting(true);
    try {
      const item = await createItem({
        ...form,
        ownerId: user.id,
        ownerName: user.name,
        imageColor: ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)],
      });
      navigate(`/items/${item.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <span className="stamp text-xs text-ink/40">post a notice</span>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink">
        Share something you're not using
      </h1>
      <p className="mt-1 text-sm text-ink/60">
        Describe it clearly so borrowers know exactly what they're getting.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Title</label>
          <input
            type="text"
            name="title"
            required
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Acoustic guitar, barely used"
            className="w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink focus:border-ink"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink focus:border-ink"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Description</label>
          <textarea
            name="description"
            required
            rows={4}
            value={form.description}
            onChange={handleChange}
            placeholder="What is it, what condition is it in, any usage notes?"
            className="w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink focus:border-ink"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Condition</label>
            <select
              name="condition"
              value={form.condition}
              onChange={handleChange}
              className="w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink focus:border-ink"
            >
              <option>Like New</option>
              <option>Good</option>
              <option>Fair</option>
              <option>Well Loved</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Pickup location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Lake View Hostel"
              className="w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink focus:border-ink"
            />
          </div>
        </div>

        {error && (
          <p className="rounded-lg bg-brick/10 px-3 py-2 text-sm text-brick">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-ink px-4 py-3 text-sm font-semibold text-paper transition hover:bg-ink/90 disabled:opacity-60 sm:w-auto"
        >
          {submitting ? 'Posting…' : 'Post item'}
        </button>
      </form>
    </div>
  );
}
