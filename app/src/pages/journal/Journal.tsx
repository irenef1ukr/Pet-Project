import { useMemo, useState } from 'react';
import { TopNav } from '../../components/TopNav';
import { getTodayDate, getTodayISO } from '../../data/mockData';
import { computeStreak, entryPreview, monthEntryCount, onThisDayEntries, topMood } from '../../lib/journalUtils';
import { useAppData } from '../../store/AppDataContext';
import { FolderManagerScreen } from './FolderManagerScreen';
import { JournalComposer } from './JournalComposer';
import { JournalEntryCard } from './JournalEntryCard';
import { JournalEntryRow } from './JournalEntryRow';
import './Journal.css';

type Screen = 'journal' | 'folders';
type View = 'list' | 'grid';

export function Journal() {
  const {
    journalFolders,
    journalEntries,
    goals,
    addJournalFolder,
    renameJournalFolder,
    deleteJournalFolder,
    addJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    addGoal,
  } = useAppData();

  const today = getTodayDate();
  const todayIso = getTodayISO();

  const [screen, setScreen] = useState<Screen>('journal');
  const [view, setView] = useState<View>('list');
  const [folderFilter, setFolderFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [composerInstance, setComposerInstance] = useState(0);
  const [newFolderName, setNewFolderName] = useState('');

  const editingEntry = editingId ? journalEntries.find((e) => e.id === editingId) : undefined;

  const folderName = (id: string) => journalFolders.find((f) => f.id === id)?.name ?? 'General';
  const goalName = (id: string) => (id ? goals.find((g) => g.id === id)?.label ?? '' : '');

  const filteredEntries = useMemo(
    () =>
      journalEntries.filter((e) => {
        if (folderFilter !== 'all' && e.folderId !== folderFilter) return false;
        if (dateFrom && e.date < dateFrom) return false;
        if (dateTo && e.date > dateTo) return false;
        return true;
      }),
    [journalEntries, folderFilter, dateFrom, dateTo],
  );

  const sortedEntries = useMemo(
    () => [...filteredEntries].sort((a, b) => (a.date < b.date ? 1 : -1)),
    [filteredEntries],
  );

  const streak = computeStreak(journalEntries, todayIso);
  const monthCount = monthEntryCount(journalEntries, todayIso);
  const mood = topMood(journalEntries);
  const onThisDay = useMemo(() => onThisDayEntries(journalEntries, today), [journalEntries, today]);

  const addFolder = () => {
    const name = newFolderName.trim();
    if (!name) return;
    addJournalFolder(name);
    setNewFolderName('');
  };

  const finishComposer = () => {
    setEditingId(null);
    setComposerInstance((n) => n + 1);
  };

  return (
    <div className="page">
      <TopNav />
      <div className="journal-main">
        {screen === 'folders' ? (
          <FolderManagerScreen
            folders={journalFolders}
            newFolderName={newFolderName}
            onBack={() => setScreen('journal')}
            onRename={renameJournalFolder}
            onDelete={deleteJournalFolder}
            onNewFolderNameChange={setNewFolderName}
            onAddFolder={addFolder}
          />
        ) : (
          <>
            <div className="journal-stats-row">
              <div className="journal-stat-card">
                <span className="journal-stat-card__label">Streak</span>
                <span className="journal-stat-card__value">
                  {streak} day{streak === 1 ? '' : 's'}
                </span>
              </div>
              <div className="journal-stat-card">
                <span className="journal-stat-card__label">This Month</span>
                <span className="journal-stat-card__value journal-stat-card__value--small">
                  {monthCount} entr{monthCount === 1 ? 'y' : 'ies'} this month
                  {mood ? ` · mostly ${mood}` : ''}
                </span>
              </div>
            </div>

            {journalEntries.length === 0 && (
              <div className="journal-welcome-banner">
                <span className="journal-welcome-banner__title">✨ Start your journey</span>
                <span className="journal-welcome-banner__body">
                  Write your first journal entry below to capture today&apos;s thoughts.
                </span>
              </div>
            )}

            {onThisDay.length > 0 && (
              <div className="journal-on-this-day">
                <span className="journal-on-this-day__label">📅 On This Day</span>
                {onThisDay.map((o) => (
                  <div key={o.id} className="journal-on-this-day__row">
                    <span className="journal-on-this-day__year">{o.date.slice(0, 4)}</span>
                    <span className="journal-on-this-day__title">{o.title}</span>
                    <span className="journal-on-this-day__preview">— {entryPreview(o, 60)}</span>
                  </div>
                ))}
              </div>
            )}

            <JournalComposer
              key={editingId ?? `new-${composerInstance}`}
              today={todayIso}
              editingEntry={editingEntry}
              folders={journalFolders}
              goals={goals}
              onOpenFolders={() => setScreen('folders')}
              onCreateGoal={addGoal}
              onCancelEdit={finishComposer}
              onSave={(draft) => {
                if (editingId) {
                  updateJournalEntry(editingId, draft);
                } else {
                  addJournalEntry(draft);
                }
                finishComposer();
              }}
            />

            <div className="journal-entries-header">
              <div className="journal-entries-header__left">
                <span className="journal-entries-header__label">Entries</span>
                <div className="journal-filter-chips">
                  {[{ id: 'all', name: 'All' }, ...journalFolders].map((f) => (
                    <span
                      key={f.id}
                      className={`journal-filter-chip${folderFilter === f.id ? ' journal-filter-chip--active' : ''}`}
                      onClick={() => setFolderFilter(f.id)}
                      role="button"
                      tabIndex={0}
                    >
                      {f.name}
                    </span>
                  ))}
                </div>
                <div className="journal-date-range">
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="journal-date-range__input"
                    aria-label="From date"
                  />
                  <span className="journal-date-range__sep">–</span>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="journal-date-range__input"
                    aria-label="To date"
                  />
                  {(dateFrom || dateTo) && (
                    <span
                      className="journal-date-range__clear"
                      onClick={() => {
                        setDateFrom('');
                        setDateTo('');
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      Clear
                    </span>
                  )}
                </div>
              </div>
              <div className="journal-view-toggle">
                <span
                  className={`journal-view-toggle__btn${view === 'list' ? ' journal-view-toggle__btn--active' : ''}`}
                  onClick={() => setView('list')}
                  role="button"
                  tabIndex={0}
                >
                  List
                </span>
                <span
                  className={`journal-view-toggle__btn${view === 'grid' ? ' journal-view-toggle__btn--active' : ''}`}
                  onClick={() => setView('grid')}
                  role="button"
                  tabIndex={0}
                >
                  Grid
                </span>
              </div>
            </div>

            {sortedEntries.length === 0 ? (
              <div className="journal-empty">No entries yet — write your first one above ✍️</div>
            ) : view === 'list' ? (
              <div className="journal-list">
                {sortedEntries.map((e) => (
                  <JournalEntryRow
                    key={e.id}
                    entry={e}
                    folderName={folderName(e.folderId)}
                    goalName={goalName(e.goalId)}
                    onEdit={() => setEditingId(e.id)}
                    onDelete={() => deleteJournalEntry(e.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="journal-grid">
                {sortedEntries.map((e) => (
                  <JournalEntryCard
                    key={e.id}
                    entry={e}
                    folderName={folderName(e.folderId)}
                    goalName={goalName(e.goalId)}
                    onEdit={() => setEditingId(e.id)}
                    onDelete={() => deleteJournalEntry(e.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
