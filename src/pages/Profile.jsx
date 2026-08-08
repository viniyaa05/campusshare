import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function Profile() {
  const { user, updateCurrentUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', hostel: user?.hostel || '' });
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setSaved(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    await updateCurrentUser(form);
    setSubmitting(false);
    setSaved(true);
  }

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '';

  return (
    <div className="mx-auto max-w-lg px-5 py-12">
      <span className="stamp text-xs text-ink/40">your profile</span>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink">
        Account details
      </h1>

      <div className="mt-6 flex items-center gap-4 rounded-xl border border-line bg-white p-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink font-display text-lg text-paper">
          {user?.name?.[0]?.toUpperCase()}
        </span>
        <div>
          <p className="font-display text-sm font-semibold text-ink">{user?.name}</p>
          <p className="text-xs text-ink/50">Member since {memberSince}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Full name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink focus:border-ink"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Email</label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full rounded-lg border border-line bg-paperDim px-4 py-3 text-sm text-ink/50"
          />
          <p className="mt-1 text-xs text-ink/40">Email can't be changed.</p>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Hostel / residence</label>
          <input
            type="text"
            name="hostel"
            value={form.hostel}
            onChange={handleChange}
            placeholder="e.g. Lake View Hostel"
            className="w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink focus:border-ink"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper hover:bg-ink/90 disabled:opacity-60"
        >
          {submitting ? 'Saving…' : 'Save changes'}
        </button>
        {saved && <span className="ml-3 text-sm text-forest">Saved.</span>}
      </form>
    </div>
  );
}
