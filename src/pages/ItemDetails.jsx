import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { createRequest, getItemById } from '../services/api';

const STATUS_STYLES = {
  available: { label: 'Available', className: 'bg-forest/10 text-forest' },
  requested: { label: 'Requested', className: 'bg-mustard/20 text-ink' },
  lent: { label: 'Lent out', className: 'bg-brick/10 text-brick' },
};

export default function ItemDetails() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [message, setMessage] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    getItemById(id)
      .then((data) => {
        if (active) setItem(data);
      })
      .catch(() => {
        if (active) setNotFound(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  async function handleRequest(e) {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/items/${id}` } } });
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await createRequest({
        itemId: item.id,
        requesterId: user.id,
        requesterName: user.name,
        message,
      });
      setRequestSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p className="mx-auto max-w-4xl px-5 py-16 text-sm text-ink/50">Loading item…</p>;
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-16 text-center">
        <p className="text-sm text-ink/60">This item couldn't be found — it may have been removed.</p>
        <Link to="/browse" className="mt-3 inline-block text-sm font-semibold text-ink underline">
          Back to browsing
        </Link>
      </div>
    );
  }

  const status = STATUS_STYLES[item.status] || STATUS_STYLES.available;
  const isOwner = user?.id === item.ownerId;

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <Link to="/browse" className="text-sm font-medium text-ink/50 hover:text-ink">
        ← Back to browsing
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-2">
        <div
          className="flex h-72 items-center justify-center rounded-xl text-paper"
          style={{ backgroundColor: item.imageColor || '#1C2541' }}
        >
          <span className="font-display text-lg opacity-80">{item.category}</span>
        </div>

        <div>
          <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}>
            {status.label}
          </span>
          <h1 className="mt-3 font-display text-2xl font-semibold text-ink">
            {item.title}
          </h1>
          <p className="mt-1 text-sm text-ink/50">
            Posted by {item.ownerName} · {item.location}
          </p>

          <p className="mt-5 text-sm leading-relaxed text-ink/70">
            {item.description}
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-ink/40">Condition</dt>
              <dd className="mt-0.5 font-medium text-ink">{item.condition}</dd>
            </div>
            <div>
              <dt className="text-ink/40">Category</dt>
              <dd className="mt-0.5 font-medium text-ink">{item.category}</dd>
            </div>
          </dl>

          {isOwner ? (
            <p className="mt-8 rounded-lg bg-paperDim px-4 py-3 text-sm text-ink/60">
              This is your listing. Manage it from{' '}
              <Link to="/my-listings" className="font-medium text-ink underline">
                My Listings
              </Link>
              .
            </p>
          ) : item.status !== 'available' ? (
            <p className="mt-8 rounded-lg bg-paperDim px-4 py-3 text-sm text-ink/60">
              This item isn't available to request right now.
            </p>
          ) : requestSent ? (
            <p className="mt-8 rounded-lg bg-forest/10 px-4 py-3 text-sm text-forest">
              Your request has been sent to {item.ownerName}. Check the Requests page for updates.
            </p>
          ) : (
            <form onSubmit={handleRequest} className="mt-8 space-y-3">
              <label className="block text-sm font-medium text-ink">
                Message to {item.ownerName}
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi! I'd love to borrow this for the weekend…"
                className="w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink focus:border-ink"
              />
              {error && <p className="text-sm text-brick">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper hover:bg-ink/90 disabled:opacity-60"
              >
                {submitting ? 'Sending…' : 'Request to borrow'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
