import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    hostel: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-16">
      <span className="stamp text-xs text-ink/40">new here?</span>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink">
        Create your account
      </h1>
      <p className="mt-1 text-sm text-ink/60">
        Already registered?{' '}
        <Link to="/login" className="font-medium text-ink underline">
          Log in
        </Link>
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Full name</label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Riya Menon"
            className="w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink focus:border-ink"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Email</label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="you@campus.edu"
            className="w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink focus:border-ink"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Password</label>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            value={form.password}
            onChange={handleChange}
            placeholder="At least 6 characters"
            className="w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink focus:border-ink"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            Hostel / residence <span className="text-ink/40">(optional)</span>
          </label>
          <input
            type="text"
            name="hostel"
            value={form.hostel}
            onChange={handleChange}
            placeholder="Lake View Hostel"
            className="w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink focus:border-ink"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-brick/10 px-3 py-2 text-sm text-brick">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-ink px-4 py-3 text-sm font-semibold text-paper transition hover:bg-ink/90 disabled:opacity-60"
        >
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </div>
  );
}
