export default function StreakTracker({ currentStreak, longestStreak }) {
  return (
    <div className="card animate-fade-in">
      <div className="flex items-center gap-4">
        {/* Fire icon with glow */}
        <div className="relative">
          <div className="text-4xl animate-pulse-glow rounded-full p-2">
            🔥
          </div>
          {currentStreak > 0 && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-xs font-bold text-dark-200">
              {currentStreak}
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-400">
              {currentStreak}
            </span>
            <span className="text-sm text-cream-200/50">
              day{currentStreak !== 1 ? 's' : ''} streak
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-cream-200/30">Best:</span>
            <span className="text-xs text-amber-500/70 font-medium">
              {longestStreak} day{longestStreak !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Motivational text */}
        <div className="text-right hidden sm:block">
          <p className="text-xs text-cream-200/40 italic">
            {currentStreak === 0
              ? 'Start writing today!'
              : currentStreak < 3
              ? 'Keep going! 💪'
              : currentStreak < 7
              ? 'You\'re on fire! 🔥'
              : currentStreak < 30
              ? 'Incredible streak! ⭐'
              : 'Legendary writer! 👑'}
          </p>
        </div>
      </div>
    </div>
  );
}
