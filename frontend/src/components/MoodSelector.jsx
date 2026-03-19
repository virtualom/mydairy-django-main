const MOODS = [
  { value: 'happy',   emoji: '😊', label: 'Happy',   color: 'border-yellow-500 bg-yellow-900/20' },
  { value: 'sad',     emoji: '😢', label: 'Sad',     color: 'border-blue-500 bg-blue-900/20' },
  { value: 'angry',   emoji: '😠', label: 'Angry',   color: 'border-red-500 bg-red-900/20' },
  { value: 'anxious', emoji: '😰', label: 'Anxious', color: 'border-purple-500 bg-purple-900/20' },
  { value: 'calm',    emoji: '😌', label: 'Calm',    color: 'border-green-500 bg-green-900/20' },
  { value: 'excited', emoji: '🤩', label: 'Excited', color: 'border-orange-500 bg-orange-900/20' },
];

export default function MoodSelector({ value, onChange }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
      {MOODS.map((mood) => (
        <button
          key={mood.value}
          type="button"
          onClick={() => onChange(mood.value)}
          className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all duration-200 ${
            value === mood.value
              ? `${mood.color} scale-105 shadow-glow`
              : 'border-dark-400 bg-dark-400/30 hover:border-amber-900/40'
          }`}
        >
          <span className="text-2xl">{mood.emoji}</span>
          <span className={`text-xs font-medium ${
            value === mood.value ? 'text-cream-100' : 'text-cream-200/50'
          }`}>
            {mood.label}
          </span>
        </button>
      ))}
    </div>
  );
}
