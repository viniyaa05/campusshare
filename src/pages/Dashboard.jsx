import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getDashboardStats, getItemsByOwner } from '../services/api';
import ItemCard from '../components/ItemCard';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [myItems, setMyItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function load() {
      const [statsData, items] = await Promise.all([
        getDashboardStats(user.id),
        getItemsByOwner(user.id),
      ]);
      setStats(statsData);
      setMyItems(items.slice(0, 3));
      setLoading(false);
    }
    load();
  }, [user]);

  const statCards = stats
    ? [
        { label: 'Items listed', value: stats.totalListed },
        { label: 'Currently lent out', value: stats.currentlyLent },
        { label: 'Pending requests', value: stats.pendingRequests },
        { label: 'Items you\'ve borrowed', value: stats.itemsBorrowed },
      ]
    : [];

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <span className="stamp text-xs text-ink/40">your dashboard</span>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink">
        Welcome back, {user?.name?.split(' ')[0]}
      </h1>
      <p className="mt-1 text-sm text-ink/60">
        Here's what's happening with your listings and borrow requests.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl border border-line bg-white" />
            ))
          : statCards.map((card) => (
              <div key={card.label} className="rounded-xl border border-line bg-white p-4">
                <p className="font-display text-2xl font-semibold text-ink">
                  {card.value}
                </p>
                <p className="mt-1 text-xs text-ink/60">{card.label}</p>
              </div>
            ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          to="/share-item"
          className="rounded-full bg-mustard px-5 py-2.5 text-sm font-semibold text-ink hover:brightness-95"
        >
          + Post a new item
        </Link>
        <Link
          to="/browse"
          className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:border-ink"
        >
          Browse items
        </Link>
        <Link
          to="/requests"
          className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:border-ink"
        >
          View requests
        </Link>
      </div>

      <div className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">
            Your recent listings
          </h2>
          <Link to="/my-listings" className="text-sm font-medium text-ink/60 hover:text-ink">
            View all →
          </Link>
        </div>

        {!loading && myItems.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-line bg-white p-8 text-center">
            <p className="text-sm text-ink/60">
              You haven't posted anything yet. Got something gathering dust?
            </p>
            <Link
              to="/share-item"
              className="mt-3 inline-block text-sm font-semibold text-ink underline"
            >
              Post your first item
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {myItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
