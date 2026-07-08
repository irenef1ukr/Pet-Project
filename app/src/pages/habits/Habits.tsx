import { useMemo, useState } from 'react';
import { TopNav } from '../../components/TopNav';
import { getTodayISO } from '../../data/mockData';
import { addDaysIso } from '../../lib/dateUtils';
import {
  buildWeekDays,
  completionRate,
  computeStreak,
  frequencyLabel,
  habitCategoryColors,
  isScheduled,
  mondayOfIso,
} from '../../lib/habitUtils';
import { useAppData } from '../../store/AppDataContext';
import type { Habit, HabitDraft } from '../../types';
import { HabitCategoriesScreen } from './HabitCategoriesScreen';
import { HabitDetailScreen } from './HabitDetailScreen';
import { HabitFormScreen } from './HabitFormScreen';
import { HabitRow } from './HabitRow';
import type { HabitListItem } from './habitListItem';
import './Habits.css';

type Screen = 'main' | 'detail' | 'form' | 'categories';
type DueFilter = 'all' | 'due' | 'done' | 'archived';

const EMPTY_FORM: HabitDraft = {
  title: '',
  categoryId: '',
  frequencyType: 'daily',
  activeDays: [],
  description: '',
};

const DUE_FILTERS: { id: DueFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'due', label: 'Due Today' },
  { id: 'done', label: 'Done Today' },
  { id: 'archived', label: 'Archived' },
];

export function Habits() {
  const {
    habits,
    habitCategories,
    addHabit,
    updateHabit,
    deleteHabit,
    setHabitArchived,
    toggleHabitCompletion,
    setHabitCompletionNote,
    addHabitCategory,
    renameHabitCategory,
    changeHabitCategoryEmoji,
    deleteHabitCategory,
  } = useAppData();

  const todayIso = getTodayISO();

  const [screen, setScreen] = useState<Screen>('main');
  const [dueFilter, setDueFilter] = useState<DueFilter>('all');
  const [detailId, setDetailId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<HabitDraft>(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [newCategory, setNewCategory] = useState({ emoji: '🌱', name: '' });

  const matchesFilter = (h: Habit) => {
    if (dueFilter === 'archived') return h.archived;
    if (h.archived) return false;
    if (dueFilter === 'all') return true;
    const scheduledToday = isScheduled(h, todayIso);
    const doneToday = todayIso in h.completions;
    if (dueFilter === 'due') return scheduledToday && !doneToday;
    if (dueFilter === 'done') return scheduledToday && doneToday;
    return true;
  };

  const buildListItem = (h: Habit): HabitListItem => ({
    id: h.id,
    title: h.title,
    frequencyLabel: frequencyLabel(h),
    streak: computeStreak(h, todayIso),
    rateLabel: `${completionRate(h, todayIso, 30)}%`,
    week: buildWeekDays(h, todayIso),
    archived: h.archived,
  });

  const categoryGroups = useMemo(() => {
    const filtered = habits.filter(matchesFilter);
    return habitCategories
      .map((c, idx) => ({
        id: c.id,
        name: c.name,
        emoji: c.emoji,
        colors: habitCategoryColors(idx),
        habits: filtered.filter((h) => h.categoryId === c.id).map(buildListItem),
      }))
      .filter((c) => c.habits.length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habits, habitCategories, dueFilter, todayIso]);

  interface BestStreak {
    streak: number;
    title: string;
  }

  const summaryCards = useMemo(() => {
    const active = habits.filter((h) => !h.archived);
    const monday = mondayOfIso(todayIso);
    let weekDone = 0;
    let weekTotal = 0;
    let monthDone = 0;
    let monthTotal = 0;
    let best: BestStreak | null = null;
    for (const h of active) {
      for (let i = 0; i < 7; i++) {
        const d = addDaysIso(monday, i);
        if (isScheduled(h, d)) {
          weekTotal++;
          if (d in h.completions) weekDone++;
        }
      }
      for (let i = 0; i < 30; i++) {
        const d = addDaysIso(todayIso, -i);
        if (isScheduled(h, d)) {
          monthTotal++;
          if (d in h.completions) monthDone++;
        }
      }
      const streak = computeStreak(h, todayIso);
      if (best === null || streak > best.streak) {
        best = { streak, title: h.title };
      }
    }
    return { weekDone, weekTotal, monthDone, monthTotal, best };
  }, [habits, todayIso]);

  const openDetail = (id: string) => {
    setDetailId(id);
    setScreen('detail');
  };

  const backFromDetail = () => {
    setDetailId(null);
    setScreen('main');
  };

  const openNewHabit = () => {
    setEditingId(null);
    setFormError('');
    setForm({ ...EMPTY_FORM, categoryId: habitCategories[0]?.id ?? '' });
    setScreen('form');
  };

  const openEditHabit = (h: Habit) => {
    setEditingId(h.id);
    setFormError('');
    setForm({
      title: h.title,
      categoryId: h.categoryId,
      frequencyType: h.frequencyType,
      activeDays: h.activeDays.slice(),
      description: h.description,
    });
    setScreen('form');
  };

  const saveHabit = () => {
    const title = form.title.trim();
    if (!title) {
      setFormError('Please give this habit a title.');
      return;
    }
    if (form.frequencyType === 'custom' && form.activeDays.length === 0) {
      setFormError('Pick at least one day, or switch to Every day.');
      return;
    }
    const draft = { ...form, title };
    if (editingId) updateHabit(editingId, draft);
    else addHabit(draft);
    setScreen(detailId ? 'detail' : 'main');
  };

  const cancelForm = () => setScreen(detailId ? 'detail' : 'main');

  const confirmDeleteHabit = () => {
    if (!detailId) return;
    deleteHabit(detailId);
    setDetailId(null);
    setScreen('main');
  };

  const addNewCategory = () => {
    const name = newCategory.name.trim();
    if (!name) return;
    addHabitCategory(name, newCategory.emoji || '🌱');
    setNewCategory({ emoji: '🌱', name: '' });
  };

  const detailHabit = detailId ? habits.find((h) => h.id === detailId) : undefined;
  const detailCategoryIndex = detailHabit
    ? habitCategories.findIndex((c) => c.id === detailHabit.categoryId)
    : -1;

  return (
    <div className="page">
      <TopNav />
      <div className="habits-main">
        {screen === 'main' && (
          <>
            <div className="habits-header">
              <span className="habits-title">Habits</span>
              <div className="habits-header__actions">
                <button type="button" className="habits-btn habits-btn--manage" onClick={() => setScreen('categories')}>
                  Manage Categories
                </button>
                <button type="button" className="habits-btn habits-btn--new" onClick={openNewHabit}>
                  + New Habit
                </button>
              </div>
            </div>

            <div className="habits-summary-grid">
              <div className="habits-summary-card">
                <span className="habits-summary-card__label" style={{ color: habitCategoryColors(0).tagText }}>
                  This Week
                </span>
                <span className="habits-summary-card__value">{summaryCards.weekDone}/{summaryCards.weekTotal}</span>
                <span className="habits-summary-card__sub">check-ins completed</span>
              </div>
              <div className="habits-summary-card">
                <span className="habits-summary-card__label" style={{ color: habitCategoryColors(2).tagText }}>
                  This Month
                </span>
                <span className="habits-summary-card__value">
                  {summaryCards.monthTotal ? Math.round((summaryCards.monthDone / summaryCards.monthTotal) * 100) : 0}%
                </span>
                <span className="habits-summary-card__sub">completion rate, last 30 days</span>
              </div>
              <div className="habits-summary-card">
                <span className="habits-summary-card__label" style={{ color: habitCategoryColors(1).tagText }}>
                  Best Streak
                </span>
                <span className="habits-summary-card__value">
                  {summaryCards.best ? `🔥 ${summaryCards.best.streak}` : '—'}
                </span>
                <span className="habits-summary-card__sub">{summaryCards.best ? summaryCards.best.title : 'no habits yet'}</span>
              </div>
            </div>

            <div className="habits-due-chips">
              {DUE_FILTERS.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  className={`habits-due-chip${dueFilter === chip.id ? ' habits-due-chip--active' : ''}`}
                  onClick={() => setDueFilter(chip.id)}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {habits.length === 0 && (
              <div className="habits-empty">No habits yet — click "+ New Habit" above to create one.</div>
            )}
            {habits.length > 0 && categoryGroups.length === 0 && (
              <div className="habits-empty">No habits match this filter — try "+ New Habit" above</div>
            )}

            {categoryGroups.map((cat) => (
              <div key={cat.id} className="habits-category-group">
                <span
                  className="habits-category-label"
                  style={{ background: cat.colors.tagBg, color: cat.colors.tagText }}
                >
                  {cat.emoji} {cat.name}
                </span>
                <div className="habits-category-card">
                  {cat.habits.map((item) => (
                    <HabitRow
                      key={item.id}
                      item={item}
                      colors={cat.colors}
                      onOpen={() => openDetail(item.id)}
                      onToggleDay={(dateIso) => toggleHabitCompletion(item.id, dateIso)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        {screen === 'detail' && detailHabit && (
          <HabitDetailScreen
            habit={detailHabit}
            category={habitCategories.find((c) => c.id === detailHabit.categoryId)}
            colors={habitCategoryColors(Math.max(detailCategoryIndex, 0))}
            todayIso={todayIso}
            onBack={backFromDetail}
            onEdit={() => openEditHabit(detailHabit)}
            onDelete={confirmDeleteHabit}
            onToggleArchive={() => setHabitArchived(detailHabit.id, !detailHabit.archived)}
            onToggleDay={(dateIso) => toggleHabitCompletion(detailHabit.id, dateIso)}
            onSaveNote={(dateIso, note) => setHabitCompletionNote(detailHabit.id, dateIso, note)}
          />
        )}

        {screen === 'form' && (
          <HabitFormScreen
            isEditing={!!editingId}
            categories={habitCategories}
            draft={form}
            error={formError}
            onChange={(patch) => setForm((f) => ({ ...f, ...patch }))}
            onSave={saveHabit}
            onCancel={cancelForm}
          />
        )}

        {screen === 'categories' && (
          <HabitCategoriesScreen
            categories={habitCategories}
            newCategory={newCategory}
            onBack={() => setScreen('main')}
            onEmojiChange={changeHabitCategoryEmoji}
            onNameChange={renameHabitCategory}
            onDelete={deleteHabitCategory}
            onNewCategoryChange={(patch) => setNewCategory((c) => ({ ...c, ...patch }))}
            onAddCategory={addNewCategory}
          />
        )}
      </div>
    </div>
  );
}
