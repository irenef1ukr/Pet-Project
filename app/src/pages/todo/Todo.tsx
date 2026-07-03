import { useMemo, useState } from 'react';
import { TopNav } from '../../components/TopNav';
import { getTodayISO } from '../../data/mockData';
import { useAppData } from '../../store/AppDataContext';
import type { TodoTask } from '../../types';
import { CategoryManagerModal } from './CategoryManagerModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { FilterBar, type Filters } from './FilterBar';
import { TaskCreateModal } from './TaskCreateModal';
import { TaskDetailModal } from './TaskDetailModal';
import { TaskList } from './TaskList';
import { isMyDay, sortTasks } from '../../lib/todoUtils';
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
  const {
    tasks,
    categories,
    cycleTaskStatus,
    renameTaskTitle,
    changeTaskPriority,
    changeTaskCategory,
    saveTaskEdits,
    createTask,
    deleteTask,
    addCategory,
    renameCategory,
    deleteCategory,
  } = useAppData();
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [modal, setModal] = useState<ModalState>({ type: 'none' });
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const today = getTodayISO();

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

  const requestDelete = (id: string) => setPendingDeleteId(id);
  const confirmDelete = () => {
    if (pendingDeleteId) deleteTask(pendingDeleteId);
    setPendingDeleteId(null);
  };

  const handleSaveTaskEdits: typeof saveTaskEdits = (id, patch) => {
    saveTaskEdits(id, patch);
    setModal({ type: 'none' });
  };

  const handleCreateTask: typeof createTask = (draft) => {
    createTask(draft);
    setModal({ type: 'none' });
  };

  const selectedTask = modal.type === 'detail' ? tasks.find((t) => t.id === modal.taskId) : undefined;
  const pendingDeleteTask = pendingDeleteId ? tasks.find((t) => t.id === pendingDeleteId) : undefined;

  const rowHandlers = {
    categories,
    today,
    onCycleStatus: cycleTaskStatus,
    onRenameTitle: renameTaskTitle,
    onChangePriority: changeTaskPriority,
    onChangeCategory: changeTaskCategory,
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
          onSave={handleSaveTaskEdits}
          onClose={() => setModal({ type: 'none' })}
        />
      )}

      {modal.type === 'create' && (
        <TaskCreateModal
          categories={categories}
          onCreate={handleCreateTask}
          onClose={() => setModal({ type: 'none' })}
        />
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
