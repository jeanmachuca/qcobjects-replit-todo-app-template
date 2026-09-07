export type TodoPriority = 'low' | 'medium' | 'high';

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  priority: TodoPriority;
  dueDate?: string;
  createdAt: string;
  completedAt?: string;
};

const DEFAULT_STORAGE_KEY = 'qcobjects-todo:v1';

const isPriority = (value: unknown): value is TodoPriority =>
  value === 'low' || value === 'medium' || value === 'high';

const isTodo = (value: unknown): value is Todo => {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<Todo>;
  return (
    typeof item.id === 'string' &&
    typeof item.title === 'string' &&
    typeof item.completed === 'boolean' &&
    isPriority(item.priority) &&
    typeof item.createdAt === 'string'
  );
};

export const loadTodos = (storageKey = DEFAULT_STORAGE_KEY): Todo[] => {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isTodo) : [];
  } catch {
    return [];
  }
};

export const saveTodos = (todos: Todo[], storageKey = DEFAULT_STORAGE_KEY) => {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(todos));
  } catch {
    // Local storage can be unavailable in private browsing; the UI remains usable.
  }
};

export const makeTodo = (title: string, priority: TodoPriority, dueDate?: string): Todo => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  title: title.trim(),
  completed: false,
  priority,
  ...(dueDate ? { dueDate } : {}),
  createdAt: new Date().toISOString(),
});
