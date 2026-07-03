import type { TodoCategory, TodoPriority, TodoTask } from '../../types';
import { TaskRow } from './TaskRow';
import './TaskList.css';

interface TaskListProps {
  title: string;
  tasks: TodoTask[];
  categories: TodoCategory[];
  today: string;
  emptyMessage: string;
  onCycleStatus: (id: string) => void;
  onRenameTitle: (id: string, title: string) => void;
  onChangePriority: (id: string, priority: TodoPriority) => void;
  onChangeCategory: (id: string, categoryId: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskList({ title, tasks, emptyMessage, ...rowProps }: TaskListProps) {
  return (
    <section className="todo-section">
      <h2 className="todo-section__title">{title}</h2>
      <div className="todo-section__card">
        {tasks.length === 0 ? (
          <div className="todo-section__empty">{emptyMessage}</div>
        ) : (
          tasks.map((task) => <TaskRow key={task.id} task={task} {...rowProps} />)
        )}
      </div>
    </section>
  );
}
