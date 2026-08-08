import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, getItems } from '../services/api';
import ItemCard from '../components/ItemCard';
import CategoryCard from '../components/CategoryCard';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [cats, items] = await Promise.all([getCategories(), getItems()]);
      setCategories(cats);
      setRecentItems(items.slice(0, 3));
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line bg-dot-grid bg-dots">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
          <div className="max-w-2xl">
            <span className="stamp inline-block rounded-full border border-line bg-white px-3 py-1 text-xs text-ink/60">
              posted daily by students near you
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.1] text-ink sm:text-5xl">
              Why buy it,
              <br />
              when someone down the hall
              <br />
              already owns one?
            </h1>
            <p className="mt-5 max-w-lg text-base text-ink/60">
              CampusShare is the bulletin board for borrowing and lending
              textbooks, gear, tools, and everything else sitting unused in
              your hostel room.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/browse"
                className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper transition hover:bg-ink/90"
              >
                Browse items
              </Link>
              <Link
                to="/share-item"
                className="rounded-full border border-line bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:border-ink"
              >
                Post something to lend
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-ink">
            Browse by category
          </h2>
          <Link to="/browse" className="text-sm font-medium text-ink/60 hover:text-ink">
            View all →
          </Link>
        </div>
        <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <Link key={cat} to={`/browse?category=${encodeURIComponent(cat)}`}>
              <CategoryCard category={cat} />
            </Link>
          ))}
        </div>
      </section>

      {/* Recent listings */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-ink">
            Freshly posted
          </h2>
          <Link to="/browse" className="text-sm font-medium text-ink/60 hover:text-ink">
            See more →
          </Link>
        </div>

        {loading ? (
          <p className="mt-6 text-sm text-ink/50">Loading listings…</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="border-t border-line bg-paperDim">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="font-display text-xl font-semibold text-ink">
            How it works
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              {
                title: 'Post or browse',
                body: 'List something you own but rarely use, or search for what you need nearby.',
              },
              {
                title: 'Send a request',
                body: 'Message the owner directly through the app to ask about borrowing.',
              },
              {
                title: 'Meet up on campus',
                body: 'Coordinate pickup, borrow it for as long as you need, then return it.',
              },
            ].map((step, i) => (
              <div key={step.title}>
                <span className="stamp text-xs text-ink/40">
                  0{i + 1}
                </span>
                <h3 className="mt-2 font-display text-base font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm text-ink/60">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
