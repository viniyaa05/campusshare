import { Link } from 'react-router-dom';

const STATUS_STYLES = {
  available: { label: 'Available', className: 'bg-forest/10 text-forest' },
  requested: { label: 'Requested', className: 'bg-mustard/20 text-ink' },
  lent: { label: 'Lent out', className: 'bg-brick/10 text-brick' },
};

function timeAgo(timestamp) {
  const diff = Date.now() - timestamp;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days <= 0) return 'today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return `${months} mo ago`;
}

export default function ItemCard({ item }) {
  const status = STATUS_STYLES[item.status] || STATUS_STYLES.available;

  return (
    <Link to={`/items/${item.id}`} className="block">
      <article className="notice-card relative rounded-lg p-4">
        <span className="notice-pin" aria-hidden="true" />
        <div
          className="mb-3 flex h-32 w-full items-center justify-center rounded-md text-paper"
          style={{ backgroundColor: item.imageColor || '#1C2541' }}
        >
          <span className="font-display text-sm opacity-80">
            {item.category}
          </span>
        </div>

        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-semibold leading-snug text-ink">
            {item.title}
          </h3>
        </div>

        <p className="mt-1 line-clamp-2 text-sm text-ink/60">
          {item.description}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
          >
            {status.label}
          </span>
          <span className="stamp text-xs text-ink/40">
            {timeAgo(item.createdAt)}
          </span>
        </div>
      </article>
    </Link>
  );
}
