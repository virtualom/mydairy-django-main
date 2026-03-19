import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import API from '../api/axios';
import MoodSelector from '../components/MoodSelector';
import TagInput from '../components/TagInput';

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'link'],
    ['clean'],
  ],
};

export default function EntryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    mood: 'calm',
    tag_names: [],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      API.get(`entries/${id}/`)
        .then(({ data }) => {
          setForm({
            title: data.title,
            content: data.content,
            date: data.date,
            mood: data.mood,
            tag_names: data.tags?.map((t) => t.name) || [],
          });
        })
        .catch(() => setError('Entry not found'))
        .finally(() => setFetching(false));
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isEdit) {
        await API.put(`entries/${id}/`, form);
      } else {
        await API.post('entries/', form);
      }
      navigate('/');
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        const firstErr = Object.values(data).flat()[0];
        setError(typeof firstErr === 'string' ? firstErr : 'Failed to save');
      } else {
        setError('Failed to save entry');
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-4xl animate-pulse">✍️</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-slide-up">
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-cream-50">
          {isEdit ? 'Edit Entry' : 'New Entry'}
        </h1>
        <p className="text-sm text-cream-200/40 mt-1">
          {isEdit ? 'Update your diary entry' : 'What\'s on your mind today?'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-900/20 border border-red-700/40 text-red-400 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-cream-200/60 mb-2">
            Title
          </label>
          <input
            id="entry-title"
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="input-field text-lg"
            placeholder="Give your entry a title…"
            required
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-cream-200/60 mb-2">
            Date
          </label>
          <input
            id="entry-date"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="input-field"
            required
          />
        </div>

        {/* Mood */}
        <div>
          <label className="block text-sm font-medium text-cream-200/60 mb-3">
            How are you feeling?
          </label>
          <MoodSelector
            value={form.mood}
            onChange={(mood) => setForm({ ...form, mood })}
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-cream-200/60 mb-2">
            Your thoughts
          </label>
          <ReactQuill
            theme="snow"
            value={form.content}
            onChange={(content) => setForm({ ...form, content })}
            modules={quillModules}
            placeholder="Pour out your heart…"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-cream-200/60 mb-2">
            Tags
          </label>
          <TagInput
            tags={form.tag_names}
            onChange={(tag_names) => setForm({ ...form, tag_names })}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4">
          <button
            id="entry-submit"
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading
              ? 'Saving…'
              : isEdit
              ? 'Update Entry'
              : 'Save Entry'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
