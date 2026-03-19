import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', password2: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.password2) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register(form.username, form.email, form.password, form.password2);
      navigate('/');
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        const firstErr = Object.values(data).flat()[0];
        setError(typeof firstErr === 'string' ? firstErr : 'Registration failed');
      } else {
        setError('Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">✨</div>
          <h1 className="font-serif text-3xl font-bold text-amber-400">
            Start Your Diary
          </h1>
          <p className="text-cream-200/50 mt-2">
            Create an account to begin journaling
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card space-y-5">
          {error && (
            <div className="bg-red-900/20 border border-red-700/40 text-red-400 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-cream-200/60 mb-2">
              Username
            </label>
            <input
              id="register-username"
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="input-field"
              placeholder="Choose a username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-cream-200/60 mb-2">
              Email
            </label>
            <input
              id="register-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="input-field"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-cream-200/60 mb-2">
              Password
            </label>
            <input
              id="register-password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="input-field"
              placeholder="At least 6 characters"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-cream-200/60 mb-2">
              Confirm Password
            </label>
            <input
              id="register-password2"
              type="password"
              name="password2"
              value={form.password2}
              onChange={handleChange}
              className="input-field"
              placeholder="Confirm your password"
              required
              minLength={6}
            />
          </div>

          <button
            id="register-submit"
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-cream-200/40">
            Already have an account?{' '}
            <Link to="/login" className="text-amber-400 hover:text-amber-300 font-medium">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
