import { useMemo, useState } from 'react';
import { TopNav } from '../../components/TopNav';
import { TODO_TODAY, todoCategories, todoTasks } from '../../data/mockData';
import type { TodoCategory, TodoPriority, TodoTask } from '../../types';
import { CategoryManagerModal } from './CategoryManagerModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { FilterBar, type Filters } from './FilterBar';
import { TaskCreateModal, type TaskCreateDraft } from './TaskCreateModal';
import { TaskDetailModal, type TaskEditPatch } from './TaskDetailModal';
import { TaskList } from './TaskList';
import { generateId, isMyDay, nextStatus, sortTasks } from './todoUtils';
import './Todo.css';

const DEFAULT_FILTERS: Filters = {
  searchQuery: '',
  priorityFilter: 'All',
  categoryFilter: 'All',
  dueFrom: '',
  dueTo: '',
  sortBy: 'dueDate',
  showCompleted: false,
};

type ModalState =
  | { type: 'none' }
  | { type: 'create' }
  | { type: 'detail'; taskId: string }
  | { type: 'categories' };

export function Todo() {
  const [tasks, setTasks] = useState<TodoTask[]>(todoTasks);
  const [categories, setCategories] = useState<TodoCategory[]>(todoCategories);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [modal, setModal] = useState<ModalState>({ type: 'none' });
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const today = TODO_TODAY;

  const { myDayTasks, allTasks } = useMemo(() => {
    const q = filters.searchQuery.trim().toLowerCase();
    const matchesFilters = (task: TodoTask) => {
      if (q && !task.title.toLowerCase().includes(q)) return false;
      if (filters.priorityFilter !== 'All' && task.priority !== filters.priorityFilter) return false;
      if (filters.categoryFilter !== 'All' && task.categoryId !== filters.categoryFilter) return false;
      if (filters.dueFrom && (!task.dueDate || task.dueDate < filters.dueFrom)) return false;
      if (filters.dueTo && (!task.dueDate || task.dueDate > filters.dueTo)) return false;
      return true;
    };

    const filtered = tasks.filter(matchesFilters);
    const visible = filters.showCompleted ? filtered : filtered.filter((t) => t.status !== 'complete');
    return {
      myDayTasks: sortTasks(visible.filter((t) => isMyDay(t, today)), filters.sortBy),
      allTasks: sortTasks(visible, filters.sortBy),
    };
  }, [tasks, filters, today]);

  const cycleStatus = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: nextStatus(t.status) } : t)));
  };

  const renameTitle = (id: string, title: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, title } : t)));
  };

  const changePriority = (id: string, priority: TodoPriority) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, priority } : t)));
  };

  const changeCategory = (id: string, categoryId: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, categoryId } : t)));
  };

  const saveTaskEdits = (id: string, patch: TaskEditPatch) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    setModal({ type: 'none' });
  };

  const createTask = (draft: TaskCreateDraft) => {
    const newTask: TodoTask = {
      id: generateId('task'),
      title: draft.title,
      categoryId: draft.categoryId || categories[0]?.id || '',
      priority: draft.priority,
      dueDate: draft.dueDate,
      status: 'not_started',
      recurring: draft.recurring,
      subtasks: draft.subtasks,
      description: draft.description,
    };
    setTasks((prev) => [...prev, newTask]);
    setModal({ type: 'none' });
  };

  const requestDelete = (id: string) => setPendingDeleteId(id);
  const confirmDelete = () => {
    setTasks((prev) => prev.filter((t) => t.id !== pendingDeleteId));
    setPendingDeleteId(null);
  };

  const addCategory = (name: string) => {
    setCategories((prev) => [...prev, { id: generateId('cat'), name }]);
  };
  const renameCategory = (id: string, name: string) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, name } : c)));
  };
  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const selectedTask = modal.type === 'detail' ? tasks.find((t) => t.id === modal.taskId) : undefined;
  const pendingDeleteTask = pendingDeleteId ? tasks.find((t) => t.id === pendingDeleteId) : undefined;

  const rowHandlers = {
    categories,
    today,
    onCycleStatus: cycleStatus,
    onRenameTitle: renameTitle,
    onChangePriority: changePriority,
    onChangeCategory: changeCategory,
    onEdit: (id: string) => setModal({ type: 'detail', taskId: id }),
    onDelete: requestDelete,
  };

  return (
    <div className="page">
      <TopNav />
      <div className="todo-main">
        <FilterBar
          filters={filters}
          categories={categories}
          onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
          onManageCategories={() => setModal({ type: 'categories' })}
          onAddTask={() => setModal({ type: 'create' })}
        />

        <TaskList title="My Day" tasks={myDayTasks} emptyMessage="Nothing on your plate today 🎉" {...rowHandlers} />

        <TaskList title="All Tasks" tasks={allTasks} emptyMessage="No tasks found" {...rowHandlers} />
      </div>

      {selectedTask && (
        <TaskDetailModal
          key={selectedTask.id}
          task={selectedTask}
          categories={categories}
          onSave={saveTaskEdits}
          onClose={() => setModal({ type: 'none' })}
        />
      )}

      {modal.type === 'create' && (
        <TaskCreateModal categories={categories} onCreate={createTask} onClose={() => setModal({ type: 'none' })} />
      )}

      {modal.type === 'categories' && (
        <CategoryManagerModal
          categories={categories}
          onRename={renameCategory}
          onDelete={deleteCategory}
          onAdd={addCategory}
          onClose={() => setModal({ type: 'none' })}
        />
      )}

      {pendingDeleteTask && (
        <DeleteConfirmModal
          task={pendingDeleteTask}
          onCancel={() => setPendingDeleteId(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
