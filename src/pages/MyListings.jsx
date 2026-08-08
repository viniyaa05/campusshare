import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { deleteItem, getItemsByOwner } from '../services/api';

const STATUS_STYLES = {
  available: { label: 'Available', className: 'bg-forest/10 text-forest' },
  requested: { label: 'Requested', className: 'bg-mustard/20 text-ink' },
  lent: { label: 'Lent out', className: 'bg-brick/10 text-brick' },
};

export default function MyListings() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!user) return;
    load();
  }, [user]);

  async function load() {
    setLoading(true);
    const data = await getItemsByOwner(user.id);
    setItems(data);
    setLoading(false);
  }

  async function handleDelete(id) {
    setDeletingId(id);
    await deleteItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    setDeletingId(null);
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <div className="flex items-center justify-between">
        <div>
          <span className="stamp text-xs text-ink/40">your notices</span>
          <h1 className="mt-2 font-display text-2xl font-semibold text-ink">
            My Listings
          </h1>
        </div>
        <Link
          to="/share-item"
          className="rounded-full bg-mustard px-4 py-2.5 text-sm font-semibold text-ink hover:brightness-95"
        >
          + Post an item
        </Link>
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-ink/50">Loading your listings…</p>
      ) : items.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-line bg-white p-10 text-center">
          <p className="text-sm text-ink/60">You haven't posted anything yet.</p>
          <Link to="/share-item" className="mt-3 inline-block text-sm font-semibold text-ink underline">
            Post your first item
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {items.map((item) => {
            const status = STATUS_STYLES[item.status] || STATUS_STYLES.available;
            return (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-xl border border-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="h-14 w-14 shrink-0 rounded-lg"
                    style={{ backgroundColor: item.imageColor || '#1C2541' }}
                  />
                  <div>
                    <Link to={`/items/${item.id}`} className="font-display text-sm font-semibold text-ink hover:underline">
                      {item.title}
                    </Link>
                    <p className="text-xs text-ink/50">{item.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}>
                    {status.label}
                  </span>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="text-xs font-medium text-brick hover:underline disabled:opacity-50"
                  >
                    {deletingId === item.id ? 'Removing…' : 'Remove'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
