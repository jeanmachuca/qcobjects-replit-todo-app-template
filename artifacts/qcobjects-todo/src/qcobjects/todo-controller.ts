import type { Todo, TodoPriority } from '@/lib/todo-storage';
import { makeTodo } from '@/lib/todo-storage';

/**
 * QCObjects-style controller boundary for the local-first todo component.
 * The React view owns rendering; this class owns mutations and keeps the
 * component model independent from the rendering process.
 */
export class TodoController {
  add(todos: Todo[], title: string, priority: TodoPriority, dueDate?: string): Todo[] {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return todos;
    return [makeTodo(trimmedTitle, priority, dueDate), ...todos];
  }

  toggle(todos: Todo[], id: string): Todo[] {
    return todos.map((todo) =>
      todo.id === id
        ? {
            ...todo,
            completed: !todo.completed,
            completedAt: !todo.completed ? new Date().toISOString() : undefined,
          }
        : todo,
    );
  }

  update(
    todos: Todo[],
    id: string,
    changes: Pick<Todo, 'title' | 'priority'> & { dueDate?: string },
  ): Todo[] {
    return todos.map((todo) =>
      todo.id === id
        ? {
            ...todo,
            title: changes.title.trim(),
            priority: changes.priority,
            dueDate: changes.dueDate || undefined,
          }
        : todo,
    );
  }

  remove(todos: Todo[], id: string): Todo[] {
    return todos.filter((todo) => todo.id !== id);
  }

  clearCompleted(todos: Todo[]): Todo[] {
    return todos.filter((todo) => !todo.completed);
  }
}