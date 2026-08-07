import { useMemo, useState } from 'react';
import { TopNav } from '../../components/TopNav';
import { allTags, sortNotes } from '../../lib/noteUtils';
import { useAppData } from '../../store/AppDataContext';
import type { Note } from '../../types';
import { NoteCard } from './NoteCard';
import { NoteComposer } from './NoteComposer';
import { NoteRow } from './NoteRow';
import './Notes.css';

type View = 'list' | 'grid';

export function Notes() {
  const { notes, addNote, updateNote, deleteNote, toggleNotePinned } = useAppData();

  const [view, setView] = useState<View>('grid');
  const [tagFilter, setTagFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [composerInstance, setComposerInstance] = useState(0);

  const editingNote = editingId ? notes.find((n) => n.id === editingId) : undefined;
  const tags = useMemo(() => allTags(notes), [notes]);

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase();
    return notes.filter((n) => {
      if (tagFilter !== 'all' && !n.tags.includes(tagFilter)) return false;
      if (query && !`${n.title} ${n.bodyHtml}`.toLowerCase().includes(query)) return false;
      return true;
    });
  }, [notes, tagFilter, search]);

  const sortedNotes = useMemo(() => sortNotes(filteredNotes), [filteredNotes]);
  const pinnedNotes = sortedNotes.filter((n) => n.pinned);
  const otherNotes = sortedNotes.filter((n) => !n.pinned);

  const finishComposer = () => {
    setEditingId(null);
    setComposerInstance((n) => n + 1);
  };

  const renderNote = (n: Note) =>
    view === 'list' ? (
      <NoteRow
        key={n.id}
        note={n}
        onEdit={() => setEditingId(n.id)}
        onDelete={() => deleteNote(n.id)}
        onTogglePin={() => toggleNotePinned(n.id)}
      />
    ) : (
      <NoteCard
        key={n.id}
        note={n}
        onEdit={() => setEditingId(n.id)}
        onDelete={() => deleteNote(n.id)}
        onTogglePin={() => toggleNotePinned(n.id)}
      />
    );

  return (
    <div className="page">
      <TopNav />
      <div className="notes-main">
        <div className="notes-stats-row">
          <div className="notes-stat-card">
            <span className="notes-stat-card__label">Notes</span>
            <span className="notes-stat-card__value">{notes.length}</span>
          </div>
          <div className="notes-stat-card">
            <span className="notes-stat-card__label">Tags</span>
            <span className="notes-stat-card__value">{tags.length}</span>
          </div>
        </div>

        {notes.length === 0 && (
          <div className="notes-welcome-banner">
            <span className="notes-welcome-banner__title">🗒️ Jot something down</span>
            <span className="notes-welcome-banner__body">
              Write your first note below — pin it or tag it to find it later.
            </span>
          </div>
        )}

        <NoteComposer
          key={editingId ?? `new-${composerInstance}`}
          editingNote={editingNote}
          existingTags={tags}
          onCancelEdit={finishComposer}
          onSave={(draft) => {
            if (editingId) {
              updateNote(editingId, draft);
            } else {
              addNote(draft);
            }
            finishComposer();
          }}
        />

        <div className="notes-entries-header">
          <div className="notes-entries-header__left">
            <span className="notes-entries-header__label">All Notes</span>
            <div className="notes-filter-chips">
              {['all', ...tags].map((t) => (
                <span
                  key={t}
                  className={`notes-filter-chip${tagFilter === t ? ' notes-filter-chip--active' : ''}`}
                  onClick={() => setTagFilter(t)}
                  role="button"
                  tabIndex={0}
                >
                  {t === 'all' ? 'All' : `#${t}`}
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Search notes…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="notes-search-input"
            />
          </div>
          <div className="notes-view-toggle">
            <span
              className={`notes-view-toggle__btn${view === 'list' ? ' notes-view-toggle__btn--active' : ''}`}
              onClick={() => setView('list')}
              role="button"
              tabIndex={0}
            >
              List
            </span>
            <span
              className={`notes-view-toggle__btn${view === 'grid' ? ' notes-view-toggle__btn--active' : ''}`}
              onClick={() => setView('grid')}
              role="button"
              tabIndex={0}
            >
              Grid
            </span>
          </div>
        </div>

        {sortedNotes.length === 0 ? (
          <div className="notes-empty">No notes match — try a different tag or search 🔍</div>
        ) : (
          <>
            {pinnedNotes.length > 0 && (
              <>
                <span className="notes-section-label">📌 Pinned</span>
                <div className={view === 'list' ? 'notes-list' : 'notes-grid'}>{pinnedNotes.map(renderNote)}</div>
              </>
            )}
            {otherNotes.length > 0 && (
              <>
                {pinnedNotes.length > 0 && <span className="notes-section-label">Others</span>}
                <div className={view === 'list' ? 'notes-list' : 'notes-grid'}>{otherNotes.map(renderNote)}</div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
