export default function SearchBar({ value, onChange, placeholder = 'Search for textbooks, gear, tools…' }) {
  return (
    <div className="relative w-full">
      <svg
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-line bg-white py-3 pl-11 pr-4 text-sm text-ink placeholder:text-ink/40 focus:border-ink"
      />
    </div>
  );
}
