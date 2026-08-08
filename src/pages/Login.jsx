import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
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
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-16">
      <span className="stamp text-xs text-ink/40">welcome back</span>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink">
        Log in to CampusShare
      </h1>
      <p className="mt-1 text-sm text-ink/60">
        New here?{' '}
        <Link to="/register" className="font-medium text-ink underline">
          Create an account
        </Link>
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
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
          {submitting ? 'Logging in…' : 'Log in'}
        </button>

        <p className="text-center text-xs text-ink/40">
          Demo account — riya@campus.edu / password123
        </p>
      </form>
    </div>
  );
}
