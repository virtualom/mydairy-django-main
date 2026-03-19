import { Link } from 'react-router-dom';

const MOOD_CONFIG = {
  happy:   { emoji: '😊', bg: 'bg-yellow-900/30', border: 'border-yellow-600/40', text: 'text-yellow-300' },
  sad:     { emoji: '😢', bg: 'bg-blue-900/30',   border: 'border-blue-600/40',   text: 'text-blue-300' },
  angry:   { emoji: '😠', bg: 'bg-red-900/30',    border: 'border-red-600/40',     text: 'text-red-300' },
  anxious: { emoji: '😰', bg: 'bg-purple-900/30', border: 'border-purple-600/40',  text: 'text-purple-300' },
  calm:    { emoji: '😌', bg: 'bg-green-900/30',  border: 'border-green-600/40',   text: 'text-green-300' },
  excited: { emoji: '🤩', bg: 'bg-orange-900/30', border: 'border-orange-600/40',  text: 'text-orange-300' },
};

function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

export default function EntryCard({ entry, onDelete }) {
  const mood = MOOD_CONFIG[entry.mood] || MOOD_CONFIG.calm;
  const snippet = stripHtml(entry.content).slice(0, 120);
  const dateStr = new Date(entry.date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="card animate-fade-in group">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <Link
            to={`/edit/${entry.id}`}
            className="text-lg font-semibold text-cream-50 hover:text-amber-300 transition-colors line-clamp-1"
          >
            {entry.title}
          </Link>
          <p className="text-sm text-cream-200/40 mt-0.5">{dateStr}</p>
        </div>
        <div className={`mood-badge ${mood.bg} ${mood.border} border ${mood.text} ml-3 shrink-0`}>
          <span className="text-base">{mood.emoji}</span>
          <span className="capitalize text-xs">{entry.mood}</span>
        </div>
      </div>

      {/* Content snippet */}
      <p className="text-cream-200/60 text-sm leading-relaxed mb-4 line-clamp-3">
        {snippet}{snippet.length >= 120 ? '…' : ''}
      </p>

      {/* Tags */}
      {entry.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {entry.tags.map((tag) => (
            <span key={tag.id} className="tag-pill">
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Link
          to={`/edit/${entry.id}`}
          className="text-xs text-amber-400/70 hover:text-amber-300 px-3 py-1.5 rounded-lg hover:bg-amber-900/20 transition-all"
        >
          Edit
        </Link>
        <button
          onClick={() => onDelete(entry.id)}
          className="text-xs text-red-400/70 hover:text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-900/20 transition-all"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export { MOOD_CONFIG };
