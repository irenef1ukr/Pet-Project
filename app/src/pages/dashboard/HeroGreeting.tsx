import './HeroGreeting.css';

interface HeroGreetingProps {
  userName: string;
  date: string;
  quote: string;
  moodEmoji: string;
  weatherEmoji: string;
  loggedToday: boolean;
  onCycleMood: () => void;
  onCycleWeather: () => void;
}

export function HeroGreeting({
  userName,
  date,
  quote,
  moodEmoji,
  weatherEmoji,
  loggedToday,
  onCycleMood,
  onCycleWeather,
}: HeroGreetingProps) {
  return (
    <div className="hero">
      <div className="hero__spacer" />
      <div className="hero__greeting">
        <span className="hero__title">Good morning, {userName}</span>
        <span className="hero__subtitle">
          {date} · &quot;{quote}&quot;
        </span>
      </div>
      <div className="hero__mood-weather">
        <div className="hero__emoji-row">
          <button
            type="button"
            className={`hero__emoji${loggedToday ? ' hero__emoji--logged' : ''}`}
            onClick={onCycleMood}
            aria-label="Change mood"
          >
            {moodEmoji}
          </button>
          <button
            type="button"
            className={`hero__emoji${loggedToday ? ' hero__emoji--logged' : ''}`}
            onClick={onCycleWeather}
            aria-label="Change weather"
          >
            {weatherEmoji}
          </button>
        </div>
        <span className="hero__helper">
          {loggedToday ? '✓ logged today' : 'tap to change'}
        </span>
      </div>
    </div>
  );
}
