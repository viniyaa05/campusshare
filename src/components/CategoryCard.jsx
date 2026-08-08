const CATEGORY_ICONS = {
  Textbooks: '📚',
  Electronics: '🔌',
  'Sports Gear': '🏸',
  'Kitchen & Appliances': '🍳',
  Tools: '🔧',
  'Musical Instruments': '🎸',
  Furniture: '🪑',
  'Costumes & Event Gear': '🎭',
};

export default function CategoryCard({ category, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex shrink-0 flex-col items-center gap-2 rounded-xl border px-4 py-3 text-center transition ${
        active
          ? 'border-ink bg-ink text-paper'
          : 'border-line bg-white text-ink hover:border-ink/40'
      }`}
    >
      <span className="text-xl" aria-hidden="true">
        {CATEGORY_ICONS[category] || '🏷️'}
      </span>
      <span className="text-xs font-medium leading-tight">{category}</span>
    </button>
  );
}
