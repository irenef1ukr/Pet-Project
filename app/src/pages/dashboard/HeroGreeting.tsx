import { useState } from 'react';
import './HeroGreeting.css';

interface HeroGreetingProps {
  userName: string;
  greeting: string;
  date: string;
  quote: string;
  moodEmoji: string | null;
  weatherEmoji: string | null;
  moodOptions: string[];
  weatherOptions: string[];
  onSelectMood: (emoji: string) => void;
  onSelectWeather: (emoji: string) => void;
}

type OpenPicker = 'mood' | 'weather' | null;

export function HeroGreeting({
  userName,
  greeting,
  date,
  quote,
  moodEmoji,
  weatherEmoji,
  moodOptions,
  weatherOptions,
  onSelectMood,
  onSelectWeather,
}: HeroGreetingProps) {
  const [openPicker, setOpenPicker] = useState<OpenPicker>(null);

  const togglePicker = (picker: OpenPicker) => setOpenPicker((prev) => (prev === picker ? null : picker));

  return (
    <div className="hero">
      <div className="hero__spacer" />
      <div className="hero__greeting">
        <span className="hero__title">
          {greeting}, {userName}
        </span>
        <span className="hero__subtitle">
          {date} · &quot;{quote}&quot;
        </span>
      </div>
      <div className="hero__mood-weather">
        <div className="hero__emoji-row">
          <div className="hero__emoji-wrap">
            <button
              type="button"
              className={`hero__emoji${moodEmoji ? '' : ' hero__emoji--empty'}`}
              onClick={() => togglePicker('mood')}
              aria-label="Log mood"
            >
              {moodEmoji ?? ''}
            </button>
            {openPicker === 'mood' && (
              <>
                <div className="hero__picker-backdrop" onClick={() => setOpenPicker(null)} />
                <div className="hero__picker">
                  {moodOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`hero__picker-option${option === moodEmoji ? ' hero__picker-option--selected' : ''}`}
                      onClick={() => {
                        onSelectMood(option);
                        setOpenPicker(null);
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="hero__emoji-wrap">
            <button
              type="button"
              className={`hero__emoji${weatherEmoji ? '' : ' hero__emoji--empty'}`}
              onClick={() => togglePicker('weather')}
              aria-label="Log weather"
            >
              {weatherEmoji ?? ''}
            </button>
            {openPicker === 'weather' && (
              <>
                <div className="hero__picker-backdrop" onClick={() => setOpenPicker(null)} />
                <div className="hero__picker">
                  {weatherOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`hero__picker-option${option === weatherEmoji ? ' hero__picker-option--selected' : ''}`}
                      onClick={() => {
                        onSelectWeather(option);
                        setOpenPicker(null);
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
