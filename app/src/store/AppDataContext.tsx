import { createContext, useContext, useMemo, type ReactNode } from 'react';
import {
  calendarEvents,
  dayMeta as initialDayMeta,
  financeCategories,
  financeTransactions,
  getTodayISO,
  initialGoalCategories,
  initialGoals,
  initialHabitCategories,
  initialHabits,
  initialJournalEntries,
  initialJournalFolders,
  initialLessonSubjects,
  initialLessons,
  initialRecipeCategories,
  initialRecipes,
  initialShoppingList,
  todoCategories,
  todoTasks,
} from '../data/mockData';
import { lessonsToCalendarEvents } from '../lib/lessonUtils';
import { generateId, nextStatus } from '../lib/todoUtils';
import { useLocalStorageState } from '../lib/useLocalStorageState';
import type {
  CalendarEvent,
  CalendarEventDraft,
  DayMeta,
  FinanceCategory,
  FinanceTransaction,
  Goal,
  GoalCategory,
  GoalDraft,
  Habit,
  HabitCategory,
  HabitDraft,
  JournalEntry,
  JournalEntryDraft,
  JournalFolder,
  Lesson,
  LessonDraft,
  LessonStatus,
  LessonSubject,
  Recipe,
  RecipeCategory,
  RecipeDraft,
  ShoppingListItem,
  TaskCreateDraft,
  TaskEditPatch,
  TodoCategory,
  TodoPriority,
  TodoTask,
} from '../types';

interface AppDataContextValue {
  tasks: TodoTask[];
  categories: TodoCategory[];
  events: CalendarEvent[];
  calendarEntries: CalendarEvent[];
  dayMeta: Record<string, DayMeta>;
  setDayMood: (dateIso: string, mood: string) => void;
  setDayWeather: (dateIso: string, weather: string) => void;
  cycleTaskStatus: (id: string) => void;
  renameTaskTitle: (id: string, title: string) => void;
  changeTaskPriority: (id: string, priority: TodoPriority) => void;
  changeTaskCategory: (id: string, categoryId: string) => void;
  saveTaskEdits: (id: string, patch: TaskEditPatch) => void;
  createTask: (draft: TaskCreateDraft) => void;
  deleteTask: (id: string) => void;
  addCategory: (name: string) => void;
  renameCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
  createEvent: (draft: CalendarEventDraft) => void;
  updateEvent: (id: string, draft: CalendarEventDraft) => void;
  deleteEvent: (id: string) => void;
  financeCategories: FinanceCategory[];
  financeTransactions: FinanceTransaction[];
  addTransaction: (tx: Omit<FinanceTransaction, 'id'>) => void;
  updateTransaction: (id: string, patch: Omit<FinanceTransaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  addFinanceCategory: (category: Omit<FinanceCategory, 'id'>) => void;
  renameFinanceCategory: (id: string, name: string) => void;
  changeFinanceCategoryEmoji: (id: string, emoji: string) => void;
  deleteFinanceCategory: (id: string) => void;
  setCategoryBudget: (id: string, budget: number) => void;
  goals: Goal[];
  addGoal: (draft: GoalDraft) => Goal;
  updateGoal: (id: string, draft: GoalDraft) => void;
  deleteGoal: (id: string) => void;
  goalCategories: GoalCategory[];
  addGoalCategory: (name: string, emoji: string) => void;
  renameGoalCategory: (id: string, name: string) => void;
  changeGoalCategoryEmoji: (id: string, emoji: string) => void;
  deleteGoalCategory: (id: string) => void;
  unlinkTaskFromGoal: (taskId: string) => void;
  habits: Habit[];
  addHabit: (draft: HabitDraft) => void;
  updateHabit: (id: string, draft: HabitDraft) => void;
  deleteHabit: (id: string) => void;
  setHabitArchived: (id: string, archived: boolean) => void;
  toggleHabitCompletion: (id: string, dateIso: string) => void;
  setHabitCompletionNote: (id: string, dateIso: string, note: string) => void;
  habitCategories: HabitCategory[];
  addHabitCategory: (name: string, emoji: string) => void;
  renameHabitCategory: (id: string, name: string) => void;
  changeHabitCategoryEmoji: (id: string, emoji: string) => void;
  deleteHabitCategory: (id: string) => void;
  journalFolders: JournalFolder[];
  addJournalFolder: (name: string) => void;
  renameJournalFolder: (id: string, name: string) => void;
  deleteJournalFolder: (id: string) => void;
  journalEntries: JournalEntry[];
  addJournalEntry: (draft: JournalEntryDraft) => void;
  updateJournalEntry: (id: string, draft: JournalEntryDraft) => void;
  deleteJournalEntry: (id: string) => void;
  lessons: Lesson[];
  addLesson: (draft: LessonDraft) => void;
  updateLesson: (id: string, draft: LessonDraft) => void;
  deleteLesson: (id: string) => void;
  setLessonStatus: (id: string, status: LessonStatus) => void;
  setLessonOccurrenceStatus: (id: string, dateIso: string, status: LessonStatus) => void;
  lessonSubjects: LessonSubject[];
  addLessonSubject: (name: string, emoji: string) => void;
  renameLessonSubject: (id: string, name: string) => void;
  changeLessonSubjectEmoji: (id: string, emoji: string) => void;
  deleteLessonSubject: (id: string) => void;
  recipes: Recipe[];
  addRecipe: (draft: RecipeDraft) => void;
  updateRecipe: (id: string, draft: RecipeDraft) => void;
  deleteRecipe: (id: string) => void;
  toggleRecipeFavorite: (id: string) => void;
  recipeCategories: RecipeCategory[];
  addRecipeCategory: (name: string, emoji: string) => void;
  renameRecipeCategory: (id: string, name: string) => void;
  changeRecipeCategoryEmoji: (id: string, emoji: string) => void;
  deleteRecipeCategory: (id: string) => void;
  shoppingList: ShoppingListItem[];
  addShoppingListItem: (text: string) => void;
  addRecipeIngredientsToShoppingList: (recipeId: string) => void;
  updateShoppingListItem: (id: string, text: string) => void;
  removeShoppingListItem: (id: string) => void;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

function taskToCalendarEvent(task: TodoTask): CalendarEvent | null {
  if (!task.dueDate) return null;
  return {
    id: `task-${task.id}`,
    title: task.title,
    date: task.dueDate,
    type: 'task',
    category: 'task',
    recurring: task.recurring,
  };
}

function draftToEvent(id: string, draft: CalendarEventDraft): CalendarEvent {
  return {
    id,
    title: draft.title,
    date: draft.date,
    endDate: draft.allDay ? draft.endDate : undefined,
    startTime: draft.allDay ? undefined : draft.startTime,
    endTime: draft.allDay ? undefined : draft.endTime,
    allDay: draft.allDay,
    type: draft.type,
    category: draft.category,
    recurring: draft.recurring,
    colorOverride: draft.colorOverride,
    reminders: draft.reminders,
  };
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useLocalStorageState<TodoTask[]>('hi-app:tasks', todoTasks);
  const [categories, setCategories] = useLocalStorageState<TodoCategory[]>('hi-app:categories', todoCategories);
  const [events, setEvents] = useLocalStorageState<CalendarEvent[]>('hi-app:events', calendarEvents);
  const [financeCats, setFinanceCats] = useLocalStorageState<FinanceCategory[]>(
    'hi-app:finance-categories',
    financeCategories,
  );
  const [financeTxs, setFinanceTxs] = useLocalStorageState<FinanceTransaction[]>(
    'hi-app:finance-transactions',
    financeTransactions,
  );
  const [goals, setGoals] = useLocalStorageState<Goal[]>('hi-app:goals', initialGoals);
  const [goalCategories, setGoalCategories] = useLocalStorageState<GoalCategory[]>(
    'hi-app:goal-categories',
    initialGoalCategories,
  );
  const [habits, setHabits] = useLocalStorageState<Habit[]>('hi-app:habits', initialHabits);
  const [habitCategories, setHabitCategories] = useLocalStorageState<HabitCategory[]>(
    'hi-app:habit-categories',
    initialHabitCategories,
  );
  const [journalFolders, setJournalFolders] = useLocalStorageState<JournalFolder[]>(
    'hi-app:journal-folders',
    initialJournalFolders,
  );
  const [journalEntries, setJournalEntries] = useLocalStorageState<JournalEntry[]>(
    'hi-app:journal-entries',
    initialJournalEntries,
  );
  const [lessons, setLessons] = useLocalStorageState<Lesson[]>('hi-app:lessons', initialLessons);
  const [lessonSubjects, setLessonSubjects] = useLocalStorageState<LessonSubject[]>(
    'hi-app:lesson-subjects',
    initialLessonSubjects,
  );
  const [recipes, setRecipes] = useLocalStorageState<Recipe[]>('hi-app:recipes', initialRecipes);
  const [recipeCategories, setRecipeCategories] = useLocalStorageState<RecipeCategory[]>(
    'hi-app:recipe-categories',
    initialRecipeCategories,
  );
  const [shoppingList, setShoppingList] = useLocalStorageState<ShoppingListItem[]>(
    'hi-app:shopping-list',
    initialShoppingList,
  );
  const [dayMeta, setDayMeta] = useLocalStorageState<Record<string, DayMeta>>('hi-app:day-meta', initialDayMeta);

  const value = useMemo<AppDataContextValue>(() => {
    const lessonEvents = lessonsToCalendarEvents(lessons, lessonSubjects, getTodayISO());
    const calendarEntries = [
      ...events,
      ...tasks.map(taskToCalendarEvent).filter((e): e is CalendarEvent => e !== null),
      ...lessonEvents,
    ];

    return {
      tasks,
      categories,
      events,
      calendarEntries,
      dayMeta,
      setDayMood: (dateIso, mood) =>
        setDayMeta((prev) => ({ ...prev, [dateIso]: { ...prev[dateIso], mood } })),
      setDayWeather: (dateIso, weather) =>
        setDayMeta((prev) => ({ ...prev, [dateIso]: { ...prev[dateIso], weather } })),
      cycleTaskStatus: (id) =>
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: nextStatus(t.status) } : t))),
      renameTaskTitle: (id, title) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, title } : t))),
      changeTaskPriority: (id, priority) =>
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, priority } : t))),
      changeTaskCategory: (id, categoryId) =>
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, categoryId } : t))),
      saveTaskEdits: (id, patch) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t))),
      createTask: (draft) =>
        setTasks((prev) => [
          ...prev,
          {
            id: generateId('task'),
            title: draft.title,
            categoryId: draft.categoryId || categories[0]?.id || '',
            priority: draft.priority,
            dueDate: draft.dueDate,
            status: 'not_started',
            recurring: draft.recurring,
            subtasks: draft.subtasks,
            description: draft.description,
            goalId: draft.goalId || '',
          },
        ]),
      deleteTask: (id) => setTasks((prev) => prev.filter((t) => t.id !== id)),
      unlinkTaskFromGoal: (taskId) =>
        setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, goalId: '' } : t))),
      addCategory: (name) => setCategories((prev) => [...prev, { id: generateId('cat'), name }]),
      renameCategory: (id, name) => setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, name } : c))),
      deleteCategory: (id) => setCategories((prev) => prev.filter((c) => c.id !== id)),
      createEvent: (draft) => setEvents((prev) => [...prev, draftToEvent(generateId('event'), draft)]),
      updateEvent: (id, draft) =>
        setEvents((prev) => prev.map((e) => (e.id === id ? draftToEvent(id, draft) : e))),
      deleteEvent: (id) => setEvents((prev) => prev.filter((e) => e.id !== id)),
      financeCategories: financeCats,
      financeTransactions: financeTxs,
      addTransaction: (tx) => setFinanceTxs((prev) => [...prev, { ...tx, id: generateId('tx') }]),
      updateTransaction: (id, patch) =>
        setFinanceTxs((prev) => prev.map((t) => (t.id === id ? { ...patch, id } : t))),
      deleteTransaction: (id) => setFinanceTxs((prev) => prev.filter((t) => t.id !== id)),
      addFinanceCategory: (category) =>
        setFinanceCats((prev) => [...prev, { ...category, id: generateId('fcat') }]),
      renameFinanceCategory: (id, name) =>
        setFinanceCats((prev) => prev.map((c) => (c.id === id ? { ...c, name } : c))),
      changeFinanceCategoryEmoji: (id, emoji) =>
        setFinanceCats((prev) => prev.map((c) => (c.id === id ? { ...c, emoji } : c))),
      deleteFinanceCategory: (id) => setFinanceCats((prev) => prev.filter((c) => c.id !== id)),
      setCategoryBudget: (id, budget) =>
        setFinanceCats((prev) => prev.map((c) => (c.id === id ? { ...c, budget } : c))),
      goals,
      addGoal: (draft) => {
        const goal: Goal = {
          id: generateId('goal'),
          title: draft.title,
          categoryId: draft.categoryId || goalCategories[0]?.id || '',
          status: draft.status,
          percent: draft.percent,
          dueDate: draft.dueDate,
          description: draft.description,
        };
        setGoals((prev) => [...prev, goal]);
        return goal;
      },
      updateGoal: (id, draft) =>
        setGoals((prev) =>
          prev.map((g) =>
            g.id === id
              ? {
                  ...g,
                  title: draft.title,
                  categoryId: draft.categoryId,
                  status: draft.status,
                  percent: draft.percent,
                  dueDate: draft.dueDate,
                  description: draft.description,
                }
              : g,
          ),
        ),
      deleteGoal: (id) => {
        setGoals((prev) => prev.filter((g) => g.id !== id));
        setTasks((prev) => prev.map((t) => (t.goalId === id ? { ...t, goalId: '' } : t)));
        setJournalEntries((prev) => prev.map((e) => (e.goalId === id ? { ...e, goalId: '' } : e)));
      },
      goalCategories,
      addGoalCategory: (name, emoji) =>
        setGoalCategories((prev) => [...prev, { id: generateId('goalcat'), name, emoji }]),
      renameGoalCategory: (id, name) =>
        setGoalCategories((prev) => prev.map((c) => (c.id === id ? { ...c, name } : c))),
      changeGoalCategoryEmoji: (id, emoji) =>
        setGoalCategories((prev) => prev.map((c) => (c.id === id ? { ...c, emoji } : c))),
      deleteGoalCategory: (id) => {
        const remaining = goalCategories.filter((c) => c.id !== id);
        const fallback = remaining[0]?.id ?? '';
        setGoalCategories(remaining);
        setGoals((prev) => prev.map((g) => (g.categoryId === id ? { ...g, categoryId: fallback } : g)));
      },
      habits,
      addHabit: (draft) =>
        setHabits((prev) => [
          ...prev,
          {
            id: generateId('habit'),
            title: draft.title,
            categoryId: draft.categoryId || habitCategories[0]?.id || '',
            frequencyType: draft.frequencyType,
            activeDays: draft.activeDays,
            description: draft.description,
            archived: false,
            completions: {},
          },
        ]),
      updateHabit: (id, draft) =>
        setHabits((prev) =>
          prev.map((h) =>
            h.id === id
              ? {
                  ...h,
                  title: draft.title,
                  categoryId: draft.categoryId,
                  frequencyType: draft.frequencyType,
                  activeDays: draft.activeDays,
                  description: draft.description,
                }
              : h,
          ),
        ),
      deleteHabit: (id) => setHabits((prev) => prev.filter((h) => h.id !== id)),
      setHabitArchived: (id, archived) =>
        setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, archived } : h))),
      toggleHabitCompletion: (id, dateIso) =>
        setHabits((prev) =>
          prev.map((h) => {
            if (h.id !== id) return h;
            const completions = { ...h.completions };
            if (dateIso in completions) delete completions[dateIso];
            else completions[dateIso] = '';
            return { ...h, completions };
          }),
        ),
      setHabitCompletionNote: (id, dateIso, note) =>
        setHabits((prev) =>
          prev.map((h) => (h.id === id && dateIso in h.completions ? { ...h, completions: { ...h.completions, [dateIso]: note } } : h)),
        ),
      habitCategories,
      addHabitCategory: (name, emoji) =>
        setHabitCategories((prev) => [...prev, { id: generateId('habitcat'), name, emoji }]),
      renameHabitCategory: (id, name) =>
        setHabitCategories((prev) => prev.map((c) => (c.id === id ? { ...c, name } : c))),
      changeHabitCategoryEmoji: (id, emoji) =>
        setHabitCategories((prev) => prev.map((c) => (c.id === id ? { ...c, emoji } : c))),
      deleteHabitCategory: (id) => {
        const remaining = habitCategories.filter((c) => c.id !== id);
        const fallback = remaining[0]?.id ?? '';
        setHabitCategories(remaining);
        setHabits((prev) => prev.map((h) => (h.categoryId === id ? { ...h, categoryId: fallback } : h)));
      },
      journalFolders,
      addJournalFolder: (name) => setJournalFolders((prev) => [...prev, { id: generateId('folder'), name }]),
      renameJournalFolder: (id, name) =>
        setJournalFolders((prev) => prev.map((f) => (f.id === id ? { ...f, name } : f))),
      deleteJournalFolder: (id) => {
        setJournalFolders((prev) => prev.filter((f) => f.id !== id));
        setJournalEntries((prev) => prev.map((e) => (e.folderId === id ? { ...e, folderId: 'general' } : e)));
      },
      journalEntries,
      addJournalEntry: (draft) => setJournalEntries((prev) => [{ ...draft, id: generateId('jentry') }, ...prev]),
      updateJournalEntry: (id, draft) =>
        setJournalEntries((prev) => prev.map((e) => (e.id === id ? { ...draft, id } : e))),
      deleteJournalEntry: (id) => setJournalEntries((prev) => prev.filter((e) => e.id !== id)),
      lessons,
      addLesson: (draft) =>
        setLessons((prev) => [
          ...prev,
          {
            id: generateId('lesson'),
            objective: draft.objective,
            subjectId: draft.subjectId || lessonSubjects[0]?.id || '',
            recurring: draft.recurring,
            day: draft.day,
            date: draft.recurring ? undefined : draft.date,
            startTime: draft.startTime,
            durationMinutes: draft.durationMinutes,
            materials: draft.materials
              .split(',')
              .map((m) => m.trim())
              .filter(Boolean),
            status: draft.status,
            statusByDate: {},
            notes: draft.notes,
          },
        ]),
      updateLesson: (id, draft) =>
        setLessons((prev) =>
          prev.map((l) =>
            l.id === id
              ? {
                  ...l,
                  objective: draft.objective,
                  subjectId: draft.subjectId,
                  recurring: draft.recurring,
                  day: draft.day,
                  date: draft.recurring ? undefined : draft.date,
                  startTime: draft.startTime,
                  durationMinutes: draft.durationMinutes,
                  materials: draft.materials
                    .split(',')
                    .map((m) => m.trim())
                    .filter(Boolean),
                  status: draft.status,
                  statusByDate: draft.recurring ? l.statusByDate : {},
                  notes: draft.notes,
                }
              : l,
          ),
        ),
      deleteLesson: (id) => setLessons((prev) => prev.filter((l) => l.id !== id)),
      setLessonStatus: (id, status) =>
        setLessons((prev) => prev.map((l) => (l.id === id ? { ...l, status, statusByDate: {} } : l))),
      setLessonOccurrenceStatus: (id, dateIso, status) =>
        setLessons((prev) =>
          prev.map((l) => (l.id === id ? { ...l, statusByDate: { ...l.statusByDate, [dateIso]: status } } : l)),
        ),
      lessonSubjects,
      addLessonSubject: (name, emoji) =>
        setLessonSubjects((prev) => [...prev, { id: generateId('subject'), name, emoji }]),
      renameLessonSubject: (id, name) =>
        setLessonSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, name } : s))),
      changeLessonSubjectEmoji: (id, emoji) =>
        setLessonSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, emoji } : s))),
      deleteLessonSubject: (id) => {
        const remaining = lessonSubjects.filter((s) => s.id !== id);
        const fallback = remaining[0]?.id ?? '';
        setLessonSubjects(remaining);
        setLessons((prev) => prev.map((l) => (l.subjectId === id ? { ...l, subjectId: fallback } : l)));
      },
      recipes,
      addRecipe: (draft) =>
        setRecipes((prev) => [
          ...prev,
          {
            id: generateId('recipe'),
            title: draft.title,
            categoryId: draft.categoryId || recipeCategories[0]?.id || '',
            ingredients: draft.ingredients,
            instructions: draft.instructions,
            favorite: false,
          },
        ]),
      updateRecipe: (id, draft) =>
        setRecipes((prev) =>
          prev.map((r) =>
            r.id === id
              ? {
                  ...r,
                  title: draft.title,
                  categoryId: draft.categoryId,
                  ingredients: draft.ingredients,
                  instructions: draft.instructions,
                }
              : r,
          ),
        ),
      deleteRecipe: (id) => setRecipes((prev) => prev.filter((r) => r.id !== id)),
      toggleRecipeFavorite: (id) =>
        setRecipes((prev) => prev.map((r) => (r.id === id ? { ...r, favorite: !r.favorite } : r))),
      recipeCategories,
      addRecipeCategory: (name, emoji) =>
        setRecipeCategories((prev) => [...prev, { id: generateId('rcat'), name, emoji }]),
      renameRecipeCategory: (id, name) =>
        setRecipeCategories((prev) => prev.map((c) => (c.id === id ? { ...c, name } : c))),
      changeRecipeCategoryEmoji: (id, emoji) =>
        setRecipeCategories((prev) => prev.map((c) => (c.id === id ? { ...c, emoji } : c))),
      deleteRecipeCategory: (id) => {
        const remaining = recipeCategories.filter((c) => c.id !== id);
        const fallback = remaining[0]?.id ?? '';
        setRecipeCategories(remaining);
        setRecipes((prev) => prev.map((r) => (r.categoryId === id ? { ...r, categoryId: fallback } : r)));
      },
      shoppingList,
      addShoppingListItem: (text) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        setShoppingList((prev) => (prev.some((i) => i.text === trimmed) ? prev : [...prev, { id: generateId('shop'), text: trimmed }]));
      },
      addRecipeIngredientsToShoppingList: (recipeId) => {
        const recipe = recipes.find((r) => r.id === recipeId);
        if (!recipe) return;
        setShoppingList((prev) => {
          const existing = new Set(prev.map((i) => i.text));
          const additions = recipe.ingredients
            .filter((ing) => !existing.has(ing))
            .map((ing) => ({ id: generateId('shop'), text: ing }));
          return [...prev, ...additions];
        });
      },
      updateShoppingListItem: (id, text) =>
        setShoppingList((prev) => prev.map((i) => (i.id === id ? { ...i, text } : i))),
      removeShoppingListItem: (id) => setShoppingList((prev) => prev.filter((i) => i.id !== id)),
    };
  }, [
    tasks,
    categories,
    events,
    financeCats,
    financeTxs,
    goals,
    goalCategories,
    habits,
    habitCategories,
    journalFolders,
    journalEntries,
    lessons,
    lessonSubjects,
    recipes,
    recipeCategories,
    shoppingList,
    dayMeta,
    setTasks,
    setCategories,
    setEvents,
    setFinanceCats,
    setFinanceTxs,
    setGoals,
    setGoalCategories,
    setHabits,
    setHabitCategories,
    setJournalFolders,
    setJournalEntries,
    setLessons,
    setLessonSubjects,
    setRecipes,
    setRecipeCategories,
    setShoppingList,
    setDayMeta,
  ]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within an AppDataProvider');
  return ctx;
}
