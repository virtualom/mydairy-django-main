import { useState } from 'react';

export default function TagInput({ tags = [], onChange }) {
  const [input, setInput] = useState('');

  const addTag = () => {
    const tag = input.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      onChange([...tags, tag]);
    }
    setInput('');
  };

  const removeTag = (tagToRemove) => {
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
    if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 p-3 input-field min-h-[48px]">
        {tags.map((tag) => (
          <span key={tag} className="tag-pill group/tag">
            #{tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1.5 text-amber-400/50 hover:text-red-400 transition-colors"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={tags.length === 0 ? 'Add tags (press Enter)' : ''}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-cream-100 placeholder-cream-200/30 text-sm"
        />
      </div>
    </div>
  );
}
