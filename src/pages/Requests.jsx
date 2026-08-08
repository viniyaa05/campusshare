import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getRequestsForUser, respondToRequest } from '../services/api';

const STATUS_STYLES = {
  pending: { label: 'Pending', className: 'bg-mustard/20 text-ink' },
  accepted: { label: 'Accepted', className: 'bg-forest/10 text-forest' },
  declined: { label: 'Declined', className: 'bg-brick/10 text-brick' },
};

function timeAgo(timestamp) {
  const diff = Date.now() - timestamp;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function Requests() {
  const { user } = useAuth();
  const [tab, setTab] = useState('incoming');
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null);

  useEffect(() => {
    if (!user) return;
    load();
  }, [user]);

  async function load() {
    setLoading(true);
    const data = await getRequestsForUser(user.id);
    setIncoming(data.incoming);
    setOutgoing(data.outgoing);
    setLoading(false);
  }

  async function handleRespond(requestId, status) {
    setActingId(requestId);
    await respondToRequest(requestId, status);
    await load();
    setActingId(null);
  }

  const list = tab === 'incoming' ? incoming : outgoing;

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <span className="stamp text-xs text-ink/40">borrowing activity</span>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink">Requests</h1>

      <div className="mt-6 inline-flex rounded-full border border-line bg-white p-1">
        <button
          onClick={() => setTab('incoming')}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            tab === 'incoming' ? 'bg-ink text-paper' : 'text-ink/60'
          }`}
        >
          Incoming ({incoming.length})
        </button>
        <button
          onClick={() => setTab('outgoing')}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            tab === 'outgoing' ? 'bg-ink text-paper' : 'text-ink/60'
          }`}
        >
          Sent by me ({outgoing.length})
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {loading ? (
          <p className="text-sm text-ink/50">Loading requests…</p>
        ) : list.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line bg-white p-10 text-center">
            <p className="text-sm text-ink/60">
              {tab === 'incoming'
                ? 'No one has requested your items yet.'
                : "You haven't requested to borrow anything yet."}
            </p>
            {tab === 'outgoing' && (
              <Link to="/browse" className="mt-3 inline-block text-sm font-semibold text-ink underline">
                Browse items
              </Link>
            )}
          </div>
        ) : (
          list.map((req) => {
            const status = STATUS_STYLES[req.status];
            return (
              <div key={req.id} className="rounded-xl border border-line bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      to={`/items/${req.itemId}`}
                      className="font-display text-sm font-semibold text-ink hover:underline"
                    >
                      {req.itemTitle}
                    </Link>
                    <p className="mt-0.5 text-xs text-ink/50">
                      {tab === 'incoming'
                        ? `Requested by ${req.requesterName}`
                        : 'Requested by you'}{' '}
                      · {timeAgo(req.createdAt)}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}>
                    {status.label}
                  </span>
                </div>

                {req.message && (
                  <p className="mt-3 rounded-lg bg-paperDim px-3 py-2 text-sm text-ink/70">
                    "{req.message}"
                  </p>
                )}

                {tab === 'incoming' && req.status === 'pending' && (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleRespond(req.id, 'accepted')}
                      disabled={actingId === req.id}
                      className="rounded-full bg-forest px-4 py-2 text-xs font-semibold text-paper hover:brightness-105 disabled:opacity-50"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRespond(req.id, 'declined')}
                      disabled={actingId === req.id}
                      className="rounded-full border border-line px-4 py-2 text-xs font-semibold text-ink hover:border-ink disabled:opacity-50"
                    >
                      Decline
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
