import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCategories, getItems } from '../services/api';
import SearchBar from '../components/SearchBar';
import CategoryCard from '../components/CategoryCard';
import ItemCard from '../components/ItemCard';

export default function BrowseItems() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || '';

  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    getItems({ query, category: activeCategory }).then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, [query, activeCategory]);

  function selectCategory(cat) {
    if (cat === activeCategory) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <span className="stamp text-xs text-ink/40">the board</span>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink">
        Browse items
      </h1>

      <div className="mt-6 max-w-xl">
        <SearchBar value={query} onChange={setQuery} />
      </div>

      <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <CategoryCard
            key={cat}
            category={cat}
            active={cat === activeCategory}
            onClick={() => selectCategory(cat)}
          />
        ))}
      </div>

      <div className="mt-8">
        {loading ? (
          <p className="text-sm text-ink/50">Loading listings…</p>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line bg-white p-10 text-center">
            <p className="text-sm text-ink/60">
              Nothing matches yet. Try a different search or category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
