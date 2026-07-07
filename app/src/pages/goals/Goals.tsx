import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNav } from '../../components/TopNav';
import { useAppData } from '../../store/AppDataContext';
import { useLocalStorageState } from '../../lib/useLocalStorageState';
import { GOAL_STATUS_LABEL, GOAL_STATUS_ORDER, goalDueLabel, goalTaskCountLabel } from '../../lib/goalUtils';
import type { Goal, GoalDraft, GoalStatus, GoalTaskDraft } from '../../types';
import { GoalCategoriesScreen } from './GoalCategoriesScreen';
import { GoalDetailScreen } from './GoalDetailScreen';
import { GoalFormScreen } from './GoalFormScreen';
import { GoalGridCard } from './GoalGridCard';
import { GoalListRow } from './GoalListRow';
import type { GoalListItem } from './goalListItem';
import './Goals.css';

type Screen = 'main' | 'detail' | 'form' | 'categories';
type StatusFilter = 'all' | GoalStatus;

const EMPTY_FORM: GoalDraft = {
  title: '',
  categoryId: '',
  status: 'not_started',
  percent: 0,
  dueDate: '',
  description: '',
};

export function Goals() {
  const navigate = useNavigate();
  const {
    goals,
    goalCategories,
    tasks,
    journalEntries,
    categories: todoCategories,
    addGoal,
    updateGoal,
    deleteGoal,
    addGoalCategory,
    renameGoalCategory,
    changeGoalCategoryEmoji,
    deleteGoalCategory,
    createTask,
    cycleTaskStatus,
    unlinkTaskFromGoal,
  } = useAppData();

  const [screen, setScreen] = useState<Screen>('main');
  const [view, setView] = useLocalStorageState<'list' | 'grid'>('hi-app:goals-view', 'grid');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [detailId, setDetailId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<GoalDraft>(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [newCategory, setNewCategory] = useState({ emoji: '🎯', name: '' });

  const buildListItem = (g: Goal): GoalListItem => {
    const linkedTasks = tasks.filter((t) => t.goalId === g.id);
    const linkedJournal = journalEntries.filter((e) => e.goalId === g.id);
    return {
      id: g.id,
      title: g.title,
      status: g.status,
      percent: g.percent,
      dueLabel: goalDueLabel(g),
      hasTasks: linkedTasks.length > 0,
      taskCountLabel: goalTaskCountLabel(tasks, g.id),
      hasJournalLinks: linkedJournal.length > 0,
      journalCountLabel: `${linkedJournal.length} linked journal ${linkedJournal.length === 1 ? 'entry' : 'entries'}`,
    };
  };

  const categoryGroups = useMemo(() => {
    const filtered = goals.filter((g) => statusFilter === 'all' || g.status === statusFilter);
    return goalCategories
      .map((cat) => ({
        id: cat.id,
        name: cat.name,
        emoji: cat.emoji,
        goals: filtered.filter((g) => g.categoryId === cat.id).map(buildListItem),
      }))
      .filter((cat) => cat.goals.length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goals, goalCategories, statusFilter, tasks, journalEntries]);

  const statusChips: { id: StatusFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    ...GOAL_STATUS_ORDER.map((status) => ({ id: status, label: GOAL_STATUS_LABEL[status] })),
  ];

  const openDetail = (id: string) => {
    setDetailId(id);
    setScreen('detail');
  };

  const backFromDetail = () => {
    setDetailId(null);
    setScreen('main');
  };

  const openNewGoal = () => {
    setEditingId(null);
    setFormError('');
    setForm({ ...EMPTY_FORM, categoryId: goalCategories[0]?.id ?? '' });
    setScreen('form');
  };

  const openEditGoal = (g: Goal) => {
    setEditingId(g.id);
    setFormError('');
    setForm({
      title: g.title,
      categoryId: g.categoryId,
      status: g.status,
      percent: g.percent,
      dueDate: g.dueDate,
      description: g.description,
    });
    setScreen('form');
  };

  const saveGoal = () => {
    const title = form.title.trim();
    if (!title) {
      setFormError('Title is required');
      return;
    }
    const draft = { ...form, title };
    if (editingId) updateGoal(editingId, draft);
    else addGoal(draft);
    setScreen(detailId ? 'detail' : 'main');
  };

  const cancelForm = () => setScreen(detailId ? 'detail' : 'main');

  const confirmDeleteGoal = () => {
    if (!detailId) return;
    deleteGoal(detailId);
    setDetailId(null);
    setScreen('main');
  };

  const addTaskToGoal = (draft: GoalTaskDraft) => {
    if (!detailId) return;
    createTask({
      title: draft.title,
      priority: draft.priority,
      dueDate: draft.dueDate,
      categoryId: todoCategories[0]?.id ?? '',
      recurring: 'none',
      subtasks: [],
      description: '',
      goalId: detailId,
    });
  };

  const addNewCategory = () => {
    const name = newCategory.name.trim();
    if (!name) return;
    addGoalCategory(name, newCategory.emoji || '🎯');
    setNewCategory({ emoji: '🎯', name: '' });
  };

  const detailGoal = detailId ? goals.find((g) => g.id === detailId) : undefined;

  return (
    <div className="page">
      <TopNav />
      <div className="goals-main">
        {screen === 'main' && (
          <>
            <div className="goals-header">
              <span className="goals-title">Goals</span>
              <div className="goals-header__actions">
                <div className="goals-view-toggle">
                  <button
                    type="button"
                    className={`goals-view-toggle__btn${view === 'list' ? ' goals-view-toggle__btn--active' : ''}`}
                    onClick={() => setView('list')}
                  >
                    List
                  </button>
                  <button
                    type="button"
                    className={`goals-view-toggle__btn${view === 'grid' ? ' goals-view-toggle__btn--active' : ''}`}
                    onClick={() => setView('grid')}
                  >
                    Grid
                  </button>
                </div>
                <button type="button" className="goals-btn goals-btn--manage" onClick={() => setScreen('categories')}>
                  Manage Categories
                </button>
                <button type="button" className="goals-btn goals-btn--new" onClick={openNewGoal}>
                  + New Goal
                </button>
              </div>
            </div>

            <div className="goals-status-chips">
              {statusChips.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  className={`goals-status-chip${statusFilter === chip.id ? ' goals-status-chip--active' : ''}`}
                  onClick={() => setStatusFilter(chip.id)}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {goals.length === 0 && (
              <div className="goals-empty">No goals yet — click "+ New Goal" above to create one.</div>
            )}
            {goals.length > 0 && categoryGroups.length === 0 && (
              <div className="goals-empty">No goals match this filter — try "+ New Goal" above</div>
            )}

            {categoryGroups.map((cat) => (
              <div key={cat.id} className="goals-category-group">
                <span className="goals-category-label">
                  {cat.emoji} {cat.name}
                </span>
                {view === 'grid' ? (
                  <div className="goals-grid">
                    {cat.goals.map((item) => (
                      <GoalGridCard key={item.id} item={item} onOpen={() => openDetail(item.id)} />
                    ))}
                  </div>
                ) : (
                  <div className="goals-list">
                    {cat.goals.map((item) => (
                      <GoalListRow key={item.id} item={item} onOpen={() => openDetail(item.id)} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {screen === 'detail' && detailGoal && (
          <GoalDetailScreen
            goal={detailGoal}
            category={goalCategories.find((c) => c.id === detailGoal.categoryId)}
            linkedTasks={tasks.filter((t) => t.goalId === detailGoal.id)}
            linkedJournalEntries={journalEntries
              .filter((e) => e.goalId === detailGoal.id)
              .sort((a, b) => (a.date < b.date ? 1 : -1))}
            onBack={backFromDetail}
            onEdit={() => openEditGoal(detailGoal)}
            onDelete={confirmDeleteGoal}
            onCycleTaskStatus={cycleTaskStatus}
            onUnlinkTask={unlinkTaskFromGoal}
            onAddTask={addTaskToGoal}
            onOpenJournal={() => navigate('/journal')}
          />
        )}

        {screen === 'form' && (
          <GoalFormScreen
            isEditing={!!editingId}
            categories={goalCategories}
            draft={form}
            error={formError}
            onChange={(patch) => setForm((f) => ({ ...f, ...patch }))}
            onSave={saveGoal}
            onCancel={cancelForm}
          />
        )}

        {screen === 'categories' && (
          <GoalCategoriesScreen
            categories={goalCategories}
            newCategory={newCategory}
            onBack={() => setScreen('main')}
            onEmojiChange={changeGoalCategoryEmoji}
            onNameChange={renameGoalCategory}
            onDelete={deleteGoalCategory}
            onNewCategoryChange={(patch) => setNewCategory((c) => ({ ...c, ...patch }))}
            onAddCategory={addNewCategory}
          />
        )}
      </div>
    </div>
  );
}
