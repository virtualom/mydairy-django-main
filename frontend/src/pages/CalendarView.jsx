import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import API from '../api/axios';

export default function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [entryDates, setEntryDates] = useState([]);
  const [selectedDayEntries, setSelectedDayEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCalendar = async () => {
      setLoading(true);
      try {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth() + 1;
        const { data } = await API.get('entries/calendar/', {
          params: { year, month },
        });
        setEntryDates(data);
      } catch (err) {
        console.error('Failed to fetch calendar:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCalendar();
  }, [currentMonth]);

  const handleDayClick = async (day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    setSelectedDate(day);
    try {
      const { data } = await API.get('entries/', {
        params: { date_from: dateStr, date_to: dateStr },
      });
      setSelectedDayEntries(data.results || data);
    } catch (err) {
      console.error('Failed to fetch day entries:', err);
    }
  };

  const hasEntries = (day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return entryDates.find((d) => d.date === dateStr);
  };

  const renderDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const start = startOfWeek(monthStart);
    const end = endOfWeek(monthEnd);

    const days = [];
    let day = start;

    while (day <= end) {
      const currentDay = day;
      const entryData = hasEntries(currentDay);
      const inMonth = isSameMonth(currentDay, monthStart);
      const today = isToday(currentDay);
      const selected = selectedDate && isSameDay(currentDay, selectedDate);

      days.push(
        <button
          key={currentDay.toString()}
          onClick={() => inMonth && handleDayClick(currentDay)}
          disabled={!inMonth}
          className={`
            relative aspect-square flex flex-col items-center justify-center rounded-xl
            text-sm font-medium transition-all duration-200
            ${!inMonth ? 'text-cream-200/10 cursor-default' : 'cursor-pointer'}
            ${inMonth && !selected ? 'hover:bg-dark-400/50' : ''}
            ${selected ? 'bg-amber-900/40 border border-amber-600/50 shadow-glow' : ''}
            ${today && !selected ? 'ring-1 ring-amber-700/40' : ''}
            ${inMonth ? 'text-cream-200/70' : ''}
          `}
        >
          <span className={today ? 'text-amber-400 font-bold' : ''}>
            {format(currentDay, 'd')}
          </span>
          {entryData && inMonth && (
            <div className="absolute bottom-1.5 flex gap-0.5">
              {Array.from({ length: Math.min(entryData.count, 3) }).map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-amber-500"
                />
              ))}
            </div>
          )}
        </button>
      );
      day = addDays(day, 1);
    }

    return days;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-serif text-2xl font-bold text-cream-50 mb-6">
        📅 Calendar
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 card">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 rounded-xl hover:bg-dark-400/50 text-cream-200/60 hover:text-cream-100 transition-all"
            >
              ← Prev
            </button>
            <h2 className="font-serif text-lg font-semibold text-amber-400">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 rounded-xl hover:bg-dark-400/50 text-cream-200/60 hover:text-cream-100 transition-all"
            >
              Next →
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="text-center text-xs font-medium text-cream-200/30 py-2">
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {loading ? (
              <div className="col-span-7 text-center py-20 text-cream-200/30">
                Loading…
              </div>
            ) : (
              renderDays()
            )}
          </div>
        </div>

        {/* Selected day entries */}
        <div className="card">
          <h3 className="font-serif text-lg font-semibold text-cream-100 mb-4">
            {selectedDate
              ? format(selectedDate, 'MMM d, yyyy')
              : 'Select a day'}
          </h3>

          {selectedDate ? (
            selectedDayEntries.length > 0 ? (
              <div className="space-y-3">
                {selectedDayEntries.map((entry) => (
                  <Link
                    key={entry.id}
                    to={`/edit/${entry.id}`}
                    className="block p-3 rounded-xl bg-dark-400/30 hover:bg-dark-400/50 border border-amber-900/10 hover:border-amber-900/30 transition-all"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm">{
                        { happy: '😊', sad: '😢', angry: '😠', anxious: '😰', calm: '😌', excited: '🤩' }[entry.mood]
                      }</span>
                      <span className="text-sm font-medium text-cream-100 line-clamp-1">
                        {entry.title}
                      </span>
                    </div>
                    {entry.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {entry.tags.map((t) => (
                          <span key={t.id} className="text-xs text-amber-400/60">
                            #{t.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-cream-200/30 text-sm mb-3">No entries this day</p>
                <Link to="/new" className="text-amber-400 text-sm hover:text-amber-300">
                  + Write one
                </Link>
              </div>
            )
          ) : (
            <p className="text-cream-200/30 text-sm text-center py-8">
              Click on a date to see entries
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
