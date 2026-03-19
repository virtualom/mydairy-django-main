import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import EntryCard from '../components/EntryCard';
import StreakTracker from '../components/StreakTracker';

const MOOD_OPTIONS = [
  { value: '', label: 'All Moods' },
  { value: 'happy', label: '😊 Happy' },
  { value: 'sad', label: '😢 Sad' },
  { value: 'angry', label: '😠 Angry' },
  { value: 'anxious', label: '😰 Anxious' },
  { value: 'calm', label: '😌 Calm' },
  { value: 'excited', label: '🤩 Excited' },
];

export default function Dashboard() {
  const [entries, setEntries] = useState([]);
  const [streak, setStreak] = useState({ current_streak: 0, longest_streak: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [mood, setMood] = useState('');
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState([]);

  const fetchEntries = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (mood) params.mood = mood;
      if (tag) params.tag = tag;
      const { data } = await API.get('entries/', { params });
      setEntries(data.results || data);
    } catch (err) {
      console.error('Failed to fetch entries:', err);
    }
  };

  const fetchStreak = async () => {
    try {
      const { data } = await API.get('entries/streak/');
      setStreak(data);
    } catch (err) {
      console.error('Failed to fetch streak:', err);
    }
  };

  const fetchTags = async () => {
    try {
      const { data } = await API.get('tags/');
      setTags(data.results || data);
    } catch (err) {
      console.error('Failed to fetch tags:', err);
    }
  };

  useEffect(() => {
    Promise.all([fetchEntries(), fetchStreak(), fetchTags()]).finally(() =>
      setLoading(false)
    );
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEntries();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, mood, tag]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this entry?')) return;
    try {
      await API.delete(`entries/${id}/`);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-pulse">📔</div>
          <p className="text-cream-200/40">Loading your diary…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Streak */}
      <div className="mb-8">
        <StreakTracker
          currentStreak={streak.current_streak}
          longestStreak={streak.longest_streak}
        />
      </div>

      {/* Header + New Entry */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-cream-50">
            Your Journal
          </h1>
          <p className="text-sm text-cream-200/40 mt-1">
            {entries.length} entr{entries.length !== 1 ? 'ies' : 'y'}
          </p>
        </div>
        <Link to="/new" className="btn-primary flex items-center gap-2">
          <span>✍️</span>
          <span>New Entry</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cream-200/30">
              🔍
            </span>
            <input
              id="search-input"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search entries…"
              className="input-field pl-10"
            />
          </div>

          {/* Mood Filter */}
          <select
            id="mood-filter"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="input-field"
          >
            {MOOD_OPTIONS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>

          {/* Tag Filter */}
          <select
            id="tag-filter"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="input-field"
          >
            <option value="">All Tags</option>
            {tags.map((t) => (
              <option key={t.id} value={t.name}>
                #{t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Entry Grid */}
      {entries.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="font-serif text-xl text-cream-200/60 mb-2">
            {search || mood || tag ? 'No entries match your filters' : 'No entries yet'}
          </h2>
          <p className="text-cream-200/30 mb-6">
            {search || mood || tag
              ? 'Try adjusting your filters'
              : 'Start capturing your thoughts and feelings'}
          </p>
          {!search && !mood && !tag && (
            <Link to="/new" className="btn-primary inline-flex items-center gap-2">
              <span>✍️</span> Write Your First Entry
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
