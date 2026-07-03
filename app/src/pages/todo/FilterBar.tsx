import type { TodoCategory, TodoPriority } from '../../types';
import './FilterBar.css';

export interface Filters {
  searchQuery: string;
  priorityFilter: 'All' | TodoPriority;
  categoryFilter: 'All' | string;
  dueFrom: string;
  dueTo: string;
  sortBy: 'dueDate' | 'priority';
  showCompleted: boolean;
}

interface FilterBarProps {
  filters: Filters;
  categories: TodoCategory[];
  onChange: (patch: Partial<Filters>) => void;
  onManageCategories: () => void;
  onAddTask: () => void;
}

export function FilterBar({ filters, categories, onChange, onManageCategories, onAddTask }: FilterBarProps) {
  return (
    <div className="filter-bar">
      <input
        type="text"
        placeholder="Search tasks..."
        className="filter-bar__input"
        value={filters.searchQuery}
        onChange={(e) => onChange({ searchQuery: e.target.value })}
      />

      <select
        className="filter-bar__select"
        value={filters.priorityFilter}
        onChange={(e) => onChange({ priorityFilter: e.target.value as Filters['priorityFilter'] })}
      >
        <option value="All">All Priorities</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>

      <select
        className="filter-bar__select"
        value={filters.categoryFilter}
        onChange={(e) => onChange({ categoryFilter: e.target.value })}
      >
        <option value="All">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <input
        type="date"
        className="filter-bar__input"
        value={filters.dueFrom}
        onChange={(e) => onChange({ dueFrom: e.target.value })}
        title="Due date from"
      />
      <input
        type="date"
        className="filter-bar__input"
        value={filters.dueTo}
        onChange={(e) => onChange({ dueTo: e.target.value })}
        title="Due date to"
      />

      <select
        className="filter-bar__select"
        value={filters.sortBy}
        onChange={(e) => onChange({ sortBy: e.target.value as Filters['sortBy'] })}
      >
        <option value="dueDate">Sort: Due Date</option>
        <option value="priority">Sort: Priority</option>
      </select>

      <label className="filter-bar__checkbox">
        <input
          type="checkbox"
          checked={filters.showCompleted}
          onChange={(e) => onChange({ showCompleted: e.target.checked })}
        />
        Show completed
      </label>

      <button type="button" className="filter-bar__manage-btn" onClick={onManageCategories}>
        Manage Categories
      </button>
      <button type="button" className="filter-bar__add-btn" onClick={onAddTask}>
        + Add Task
      </button>
    </div>
  );
}
