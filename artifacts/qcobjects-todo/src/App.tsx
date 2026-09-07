import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  ClipboardList,
  Clock3,
  Filter,
  ListFilter,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import {
  type Todo,
  type TodoPriority,
  loadTodos,
  saveTodos,
} from '@/lib/todo-storage';
import { loadTodoAppConfig, type TodoAppConfig } from '@/qcobjects/config';
import { TodoController } from '@/qcobjects/todo-controller';
import { getTodoTelemetry } from '@/qcobjects/vibe-leading';

const queryClient = new QueryClient();
const todoController = new TodoController();

type ViewFilter = 'all' | 'active' | 'completed';
type PriorityFilter = 'all' | TodoPriority;

const priorityMeta: Record<TodoPriority, { label: string; color: string; dot: string }> = {
  high: {
    label: 'High',
    color: 'text-[hsl(2_72%_48%)] bg-[hsl(2_72%_55%_/_0.11)]',
    dot: 'bg-[hsl(2_72%_55%)]',
  },
  medium: {
    label: 'Medium',
    color: 'text-[hsl(32_80%_40%)] bg-[hsl(36_100%_70%_/_0.26)]',
    dot: 'bg-[hsl(36_100%_58%)]',
  },
  low: {
    label: 'Low',
    color: 'text-[hsl(177_44%_31%)] bg-[hsl(177_44%_41%_/_0.12)]',
    dot: 'bg-[hsl(177_44%_41%)]',
  },
};

const todayString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const day = `${now.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatHeaderDate = () =>
  new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(
    new Date(),
  );

const formatDueDate = (date?: string) => {
  if (!date) return null;
  const today = todayString();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowString = `${tomorrow.getFullYear()}-${`${tomorrow.getMonth() + 1}`.padStart(
    2,
    '0',
  )}-${`${tomorrow.getDate()}`.padStart(2, '0')}`;
  if (date === today) return 'Today';
  if (date === tomorrowString) return 'Tomorrow';
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(
    new Date(`${date}T12:00:00`),
  );
};

const isOverdue = (date?: string, completed?: boolean) =>
  Boolean(date && !completed && date < todayString());

function BrandMark() {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-[hsl(var(--accent))] text-[hsl(var(--sidebar))] shadow-[4px_4px_0_hsl(13_86%_60%_/_0.28)]">
      <Check size={22} strokeWidth={3} />
    </div>
  );
}

function Sidebar({
  todos,
  view,
  setView,
}: {
  todos: Todo[];
  view: ViewFilter;
  setView: (value: ViewFilter) => void;
}) {
  const activeCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.filter((todo) => todo.completed).length;
  const navItems: { value: ViewFilter; label: string; count: number }[] = [
    { value: 'all', label: 'Everything', count: todos.length },
    { value: 'active', label: 'In progress', count: activeCount },
    { value: 'completed', label: 'Finished', count: completedCount },
  ];

  return (
    <aside
      data-testid="sidebar-navigation"
      className="relative flex w-full flex-col overflow-hidden bg-[hsl(var(--sidebar))] px-5 py-5 text-[hsl(var(--sidebar-foreground))] md:min-h-screen md:w-[256px] md:px-6 md:py-7"
    >
      <div className="pointer-events-none absolute -right-20 -top-16 h-48 w-48 rounded-full border-[30px] border-[hsl(var(--accent)/0.12)]" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 h-52 w-52 rounded-full border-[26px] border-[hsl(var(--primary)/0.12)]" />
      <div className="relative flex items-center gap-3">
        <BrandMark />
        <div>
          <div className="font-[family-name:var(--app-font-serif)] text-[17px] font-bold tracking-[-0.04em]">
            QCObjects
          </div>
          <div className="font-mono text-[9px] uppercase tracking-[0.21em] text-[hsl(var(--sidebar-foreground)/0.52)]">
            Todo cockpit
          </div>
        </div>
      </div>

      <div className="relative mt-9 hidden md:block">
        <p className="font-mono text-[10px] uppercase tracking-[0.17em] text-[hsl(var(--sidebar-foreground)/0.45)]">
          Your workspace
        </p>
        <nav className="mt-3 space-y-1" aria-label="Todo views">
          {navItems.map((item) => {
            const selected = view === item.value;
            return (
              <button
                key={item.value}
                type="button"
                data-testid={`button-filter-${item.value}`}
                onClick={() => setView(item.value)}
                className={`focus-ring group flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-[13px] transition-[background-color,color,transform] duration-200 ${
                  selected
                    ? 'bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-foreground))] shadow-[inset_3px_0_hsl(var(--accent))]'
                    : 'text-[hsl(var(--sidebar-foreground)/0.63)] hover:translate-x-0.5 hover:bg-[hsl(var(--sidebar-accent)/0.66)] hover:text-[hsl(var(--sidebar-foreground))]'
                }`}
              >
                <span className="flex items-center gap-3">
                  {item.value === 'all' ? (
                    <ListFilter size={16} strokeWidth={selected ? 2.5 : 1.8} />
                  ) : item.value === 'active' ? (
                    <Circle size={16} strokeWidth={selected ? 2.5 : 1.8} />
                  ) : (
                    <CheckCircle2 size={16} strokeWidth={selected ? 2.5 : 1.8} />
                  )}
                  {item.label}
                </span>
                <span
                  data-testid={`count-filter-${item.value}`}
                  className={`font-mono text-[11px] ${selected ? 'text-[hsl(var(--accent))]' : 'text-[hsl(var(--sidebar-foreground)/0.38)]'}`}
                >
                  {item.count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="relative mt-auto hidden rounded-2xl border border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-accent)/0.54)] p-4 md:block">
        <div className="flex items-center gap-2 text-[hsl(var(--accent))]">
          <Sparkles size={14} />
          <span className="font-mono text-[10px] uppercase tracking-[0.13em]">Small rhythm</span>
        </div>
        <p className="mt-3 text-[13px] leading-5 text-[hsl(var(--sidebar-foreground)/0.7)]">
          One clear next step is enough to keep the day moving.
        </p>
      </div>
    </aside>
  );
}

function MobileFilters({
  view,
  setView,
}: {
  view: ViewFilter;
  setView: (value: ViewFilter) => void;
}) {
  return (
    <div className="mt-5 flex gap-1 overflow-x-auto rounded-xl bg-[hsl(var(--muted)/0.7)] p-1 md:hidden">
      {(['all', 'active', 'completed'] as ViewFilter[]).map((item) => (
        <button
          key={item}
          type="button"
          data-testid={`button-mobile-filter-${item}`}
          onClick={() => setView(item)}
          className={`focus-ring flex-1 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold capitalize transition-colors ${
            view === item
              ? 'bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-sm'
              : 'text-[hsl(var(--muted-foreground))]'
          }`}
        >
          {item === 'all' ? 'Everything' : item === 'active' ? 'In progress' : 'Finished'}
        </button>
      ))}
    </div>
  );
}

function TaskRow({
  todo,
  editing,
  editTitle,
  editPriority,
  editDueDate,
  onToggle,
  onDelete,
  onEditStart,
  onEditCancel,
  onEditSave,
  onEditTitle,
  onEditPriority,
  onEditDueDate,
}: {
  todo: Todo;
  editing: boolean;
  editTitle: string;
  editPriority: TodoPriority;
  editDueDate: string;
  onToggle: () => void;
  onDelete: () => void;
  onEditStart: () => void;
  onEditCancel: () => void;
  onEditSave: (event: FormEvent) => void;
  onEditTitle: (value: string) => void;
  onEditPriority: (value: TodoPriority) => void;
  onEditDueDate: (value: string) => void;
}) {
  const dueLabel = formatDueDate(todo.dueDate);
  const overdue = isOverdue(todo.dueDate, todo.completed);

  if (editing) {
    return (
      <form
        data-testid={`form-edit-todo-${todo.id}`}
        onSubmit={onEditSave}
        className="animate-rise-in rounded-2xl border border-[hsl(var(--accent)/0.65)] bg-[hsl(var(--card))] p-4 shadow-[0_10px_30px_hsl(236_25%_19%_/_0.08)]"
      >
        <div className="flex items-start gap-3">
          <button
            type="button"
            data-testid={`button-cancel-toggle-${todo.id}`}
            onClick={onEditCancel}
            className="focus-ring mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] transition-colors hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
            aria-label="Cancel editing"
          >
            <X size={13} />
          </button>
          <div className="min-w-0 flex-1">
            <input
              autoFocus
              data-testid={`input-edit-todo-${todo.id}`}
              value={editTitle}
              onChange={(event) => onEditTitle(event.target.value)}
              className="focus-ring w-full border-b border-[hsl(var(--border))] bg-transparent pb-2 text-[15px] font-semibold text-[hsl(var(--foreground))] outline-none focus:border-[hsl(var(--primary))]"
              aria-label="Edit todo title"
            />
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <select
                data-testid={`select-edit-priority-${todo.id}`}
                value={editPriority}
                onChange={(event) => onEditPriority(event.target.value as TodoPriority)}
                className="focus-ring rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2 py-1.5 text-xs font-medium text-[hsl(var(--foreground))] outline-none"
                aria-label="Edit priority"
              >
                <option value="low">Low priority</option>
                <option value="medium">Medium priority</option>
                <option value="high">High priority</option>
              </select>
              <input
                type="date"
                data-testid={`input-edit-due-date-${todo.id}`}
                value={editDueDate}
                onChange={(event) => onEditDueDate(event.target.value)}
                className="focus-ring rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2 py-1.5 text-xs text-[hsl(var(--foreground))] outline-none"
                aria-label="Edit due date"
              />
              <button
                type="submit"
                data-testid={`button-save-edit-${todo.id}`}
                className="focus-ring ml-auto rounded-lg bg-[hsl(var(--primary))] px-3 py-1.5 text-xs font-bold text-[hsl(var(--primary-foreground))] transition-transform hover:-translate-y-0.5"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  }

  return (
    <article
      data-testid={`card-todo-${todo.id}`}
      className={`group relative flex items-start gap-3 rounded-2xl border bg-[hsl(var(--card))] p-4 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[hsl(var(--accent)/0.65)] hover:shadow-[0_9px_26px_hsl(236_25%_19%_/_0.07)] ${
        todo.completed ? 'border-[hsl(var(--border)/0.7)]' : 'border-[hsl(var(--border))]'
      }`}
    >
      <button
        type="button"
        data-testid={`button-toggle-todo-${todo.id}`}
        onClick={onToggle}
        aria-label={todo.completed ? `Reopen ${todo.title}` : `Complete ${todo.title}`}
        className={`focus-ring mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-[background-color,border-color,transform] duration-300 ${
          todo.completed
            ? 'animate-check-pop border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
            : 'border-[hsl(var(--border))] text-transparent hover:scale-110 hover:border-[hsl(var(--primary))]'
        }`}
      >
        <Check size={14} strokeWidth={3} />
      </button>

      <div className="min-w-0 flex-1">
        <p
          data-testid={`text-todo-title-${todo.id}`}
          className={`pr-2 text-[15px] font-semibold leading-6 transition-colors ${
            todo.completed
              ? 'text-[hsl(var(--muted-foreground))] line-through decoration-[hsl(var(--primary)/0.8)] decoration-2'
              : 'text-[hsl(var(--foreground))]'
          }`}
        >
          {todo.title}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span
            data-testid={`status-priority-${todo.id}`}
            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] ${priorityMeta[todo.priority].color}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${priorityMeta[todo.priority].dot}`} />
            {priorityMeta[todo.priority].label}
          </span>
          {dueLabel && (
            <span
              data-testid={`text-due-date-${todo.id}`}
              className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.06em] ${
                overdue ? 'text-[hsl(var(--destructive))]' : 'text-[hsl(var(--muted-foreground))]'
              }`}
            >
              <CalendarDays size={12} />
              {overdue ? 'Overdue · ' : ''}
              {dueLabel}
            </span>
          )}
          {todo.completed && todo.completedAt && (
            <span
              data-testid={`text-completed-at-${todo.id}`}
              className="font-mono text-[10px] uppercase tracking-[0.06em] text-[hsl(var(--muted-foreground)/0.7)]"
            >
              Done {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(todo.completedAt))}
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-0.5 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
        <button
          type="button"
          data-testid={`button-edit-todo-${todo.id}`}
          onClick={onEditStart}
          aria-label={`Edit ${todo.title}`}
          className="focus-ring rounded-lg p-2 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
        >
          <Pencil size={15} />
        </button>
        <button
          type="button"
          data-testid={`button-delete-todo-${todo.id}`}
          onClick={onDelete}
          aria-label={`Delete ${todo.title}`}
          className="focus-ring rounded-lg p-2 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--destructive)/0.1)] hover:text-[hsl(var(--destructive))]"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </article>
  );
}

function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [appConfig, setAppConfig] = useState<TodoAppConfig | null>(null);
  const [view, setView] = useState<ViewFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [query, setQuery] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<TodoPriority>('medium');
  const [newDueDate, setNewDueDate] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPriority, setEditPriority] = useState<TodoPriority>('medium');
  const [editDueDate, setEditDueDate] = useState('');

  useEffect(() => {
    let cancelled = false;
    const initialize = async () => {
      const config = await loadTodoAppConfig();
      if (cancelled) return;
      setAppConfig(config);
      const timer = window.setTimeout(() => {
        setTodos(loadTodos(config.storageKey));
        setIsReady(true);
      }, 90);
      return () => window.clearTimeout(timer);
    };
    void initialize();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (isReady && appConfig) saveTodos(todos, appConfig.storageKey);
  }, [todos, isReady, appConfig]);

  const activeTodos = useMemo(() => todos.filter((todo) => !todo.completed), [todos]);
  const completedTodos = useMemo(() => todos.filter((todo) => todo.completed), [todos]);
  const dueTodayCount = useMemo(
    () => activeTodos.filter((todo) => todo.dueDate === todayString()).length,
    [activeTodos],
  );
  const telemetry = useMemo(() => getTodoTelemetry(todos), [todos]);

  const filteredTodos = useMemo(() => {
    const search = query.trim().toLowerCase();
    return todos
      .filter((todo) => {
        const matchesView =
          view === 'all' || (view === 'active' && !todo.completed) || (view === 'completed' && todo.completed);
        const matchesPriority = priorityFilter === 'all' || todo.priority === priorityFilter;
        const matchesSearch = !search || todo.title.toLowerCase().includes(search);
        return matchesView && matchesPriority && matchesSearch;
      })
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return b.createdAt.localeCompare(a.createdAt);
      });
  }, [todos, view, priorityFilter, query]);

  const addTodo = (event: FormEvent) => {
    event.preventDefault();
    if (!newTitle.trim()) return;
    setTodos((current) => todoController.add(current, newTitle, newPriority, newDueDate));
    setNewTitle('');
    setNewPriority('medium');
    setNewDueDate('');
  };

  const toggleTodo = (id: string) => {
    setTodos((current) => todoController.toggle(current, id));
  };

  const deleteTodo = (todo: Todo) => {
    if (window.confirm(`Delete "${todo.title}"?`)) {
      setTodos((current) => todoController.remove(current, todo.id));
      if (editingId === todo.id) setEditingId(null);
    }
  };

  const beginEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditPriority(todo.priority);
    setEditDueDate(todo.dueDate ?? '');
  };

  const saveEdit = (event: FormEvent) => {
    event.preventDefault();
    if (!editingId || !editTitle.trim()) return;
    setTodos((current) =>
      todoController.update(current, editingId, {
        title: editTitle,
        priority: editPriority,
        dueDate: editDueDate,
      }),
    );
    setEditingId(null);
  };

  const clearCompleted = () => {
    if (!completedTodos.length) return;
    if (window.confirm(`Clear ${completedTodos.length} finished ${completedTodos.length === 1 ? 'task' : 'tasks'}?`)) {
      setTodos((current) => todoController.clearCompleted(current));
    }
  };

  const listLabel = view === 'all' ? 'All tasks' : view === 'active' ? 'In progress' : 'Finished';

  return (
    <div className="grain flex min-h-[100dvh] flex-col bg-transparent text-[hsl(var(--foreground))] md:flex-row">
      <Sidebar todos={todos} view={view} setView={setView} />
      <main className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-[1120px] px-5 pb-14 pt-7 sm:px-8 md:px-12 md:pb-20 md:pt-12">
          <header className="animate-rise-in flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p
                data-testid="text-current-date"
                className="font-mono text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--primary))]"
              >
                {formatHeaderDate()}
              </p>
              <h1
                data-testid="heading-todo-cockpit"
                className="mt-2 font-[family-name:var(--app-font-serif)] text-[clamp(2.2rem,5vw,4.15rem)] font-bold leading-[0.95] tracking-[-0.065em] text-[hsl(var(--foreground))]"
              >
                Make room for
                <br />
                <span className="text-[hsl(var(--primary))]">what matters.</span>
              </h1>
              <p className="mt-4 max-w-[420px] text-[14px] leading-6 text-[hsl(var(--muted-foreground))]">
                A calm place to keep the next right thing in view.
              </p>
            </div>
            <div
              data-testid="panel-progress-summary"
              className="flex w-full max-w-[280px] items-center gap-4 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/0.68)] px-4 py-3 shadow-[0_8px_25px_hsl(236_25%_19%_/_0.04)] sm:w-auto"
            >
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[5px] border-[hsl(var(--accent))]">
                <span data-testid="text-completion-percent" className="font-mono text-[11px] font-medium">
                  {telemetry.traction}%
                </span>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[hsl(var(--muted-foreground))]">
                  Traction
                </p>
                <p data-testid="text-progress-summary" className="mt-1 text-sm font-semibold">
                  {activeTodos.length ? `${activeTodos.length} ${activeTodos.length === 1 ? 'task' : 'tasks'} in motion` : 'A clean slate'}
                </p>
              </div>
            </div>
          </header>

          <MobileFilters view={view} setView={setView} />

          <form
            data-testid="form-add-todo"
            onSubmit={addTodo}
            className="animate-rise-in mt-9 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3 shadow-[0_13px_35px_hsl(236_25%_19%_/_0.06)] [animation-delay:80ms] sm:p-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--primary)/0.11)] text-[hsl(var(--primary))]">
                <Plus size={19} strokeWidth={2.5} />
              </div>
              <input
                data-testid="input-new-todo"
                value={newTitle}
                onChange={(event) => setNewTitle(event.target.value)}
                placeholder="What needs your attention?"
                className="focus-ring min-w-0 flex-1 bg-transparent text-[15px] font-medium text-[hsl(var(--foreground))] outline-none placeholder:text-[hsl(var(--muted-foreground)/0.72)]"
                aria-label="New todo title"
              />
              <button
                type="submit"
                data-testid="button-add-todo"
                disabled={!newTitle.trim()}
                className="focus-ring shrink-0 rounded-xl bg-[hsl(var(--primary))] px-4 py-2.5 text-xs font-bold text-[hsl(var(--primary-foreground))] shadow-[3px_3px_0_hsl(36_100%_70%)] transition-[transform,box-shadow,opacity] hover:-translate-y-0.5 hover:shadow-[4px_5px_0_hsl(36_100%_70%)] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
              >
                Add task
              </button>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[hsl(var(--border)/0.75)] pt-3 pl-12">
              <label className="flex items-center gap-1.5">
                <span className="sr-only">Priority</span>
                <select
                  data-testid="select-new-priority"
                  value={newPriority}
                  onChange={(event) => setNewPriority(event.target.value as TodoPriority)}
                  className="focus-ring rounded-lg border-0 bg-[hsl(var(--muted)/0.7)] px-2 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-[hsl(var(--muted-foreground))] outline-none"
                  aria-label="New task priority"
                >
                  <option value="low">Low priority</option>
                  <option value="medium">Medium priority</option>
                  <option value="high">High priority</option>
                </select>
              </label>
              <label className="flex items-center gap-1.5 rounded-lg bg-[hsl(var(--muted)/0.7)] px-2 py-1.5 text-[hsl(var(--muted-foreground))]">
                <CalendarDays size={13} />
                <span className="sr-only">Due date</span>
                <input
                  type="date"
                  data-testid="input-new-due-date"
                  value={newDueDate}
                  onChange={(event) => setNewDueDate(event.target.value)}
                  className="focus-ring w-[106px] bg-transparent font-mono text-[10px] uppercase tracking-[0.05em] outline-none"
                  aria-label="New task due date"
                />
              </label>
              <span className="ml-auto hidden items-center gap-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[hsl(var(--muted-foreground)/0.62)] sm:flex">
                <Clock3 size={12} />
                {appConfig?.localFirst ? 'Stays on this device' : 'Ready to sync'}
              </span>
            </div>
          </form>

          <section className="animate-rise-in mt-10 [animation-delay:160ms]" aria-labelledby="task-list-title">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <h2 id="task-list-title" className="font-[family-name:var(--app-font-serif)] text-[22px] font-bold tracking-[-0.04em]">
                    {listLabel}
                  </h2>
                  <span
                    data-testid="text-visible-task-count"
                    className="rounded-full bg-[hsl(var(--muted))] px-2 py-0.5 font-mono text-[10px] text-[hsl(var(--muted-foreground))]"
                  >
                    {filteredTodos.length}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                  {dueTodayCount ? `${dueTodayCount} due today · ` : ''}
                  {completedTodos.length ? `${completedTodos.length} finished so far` : 'Your list, at your pace'}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <label className="relative flex min-w-0 flex-1 items-center sm:flex-none">
                  <Search size={15} className="pointer-events-none absolute left-3 text-[hsl(var(--muted-foreground))]" />
                  <input
                    type="search"
                    data-testid="input-search-todos"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search tasks"
                    className="focus-ring w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/0.65)] py-2.5 pl-9 pr-3 text-xs outline-none placeholder:text-[hsl(var(--muted-foreground)/0.8)] sm:w-[160px]"
                    aria-label="Search tasks"
                  />
                </label>
                <label className="relative flex items-center">
                  <Filter size={14} className="pointer-events-none absolute left-3 text-[hsl(var(--muted-foreground))]" />
                  <select
                    data-testid="select-filter-priority"
                    value={priorityFilter}
                    onChange={(event) => setPriorityFilter(event.target.value as PriorityFilter)}
                    className="focus-ring appearance-none rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/0.65)] py-2.5 pl-8 pr-8 text-xs outline-none"
                    aria-label="Filter by priority"
                  >
                    <option value="all">All priorities</option>
                    <option value="high">High priority</option>
                    <option value="medium">Medium priority</option>
                    <option value="low">Low priority</option>
                  </select>
                  <ChevronDown size={13} className="pointer-events-none absolute right-2.5 text-[hsl(var(--muted-foreground))]" />
                </label>
                {completedTodos.length > 0 && (
                  <button
                    type="button"
                    data-testid="button-clear-completed"
                    onClick={clearCompleted}
                    className="focus-ring inline-flex items-center gap-1.5 rounded-xl border border-transparent px-2.5 py-2.5 text-xs font-semibold text-[hsl(var(--muted-foreground))] transition-colors hover:border-[hsl(var(--destructive)/0.2)] hover:bg-[hsl(var(--destructive)/0.07)] hover:text-[hsl(var(--destructive))]"
                  >
                    <Trash2 size={14} />
                    <span className="hidden sm:inline">Clear finished</span>
                  </button>
                )}
              </div>
            </div>

            {!isReady ? (
              <div data-testid="state-loading-todos" className="mt-5 space-y-3" aria-label="Loading tasks">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-[hsl(var(--border)/0.7)] bg-[hsl(var(--card)/0.6)] p-5">
                    <div className="h-6 w-6 animate-pulse rounded-full bg-[hsl(var(--muted))]" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-3/5 animate-pulse rounded bg-[hsl(var(--muted))]" />
                      <div className="h-2 w-1/4 animate-pulse rounded bg-[hsl(var(--muted))]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredTodos.length > 0 ? (
              <div data-testid="list-todos" className="scrollbar-thin mt-5 space-y-3">
                {filteredTodos.map((todo, index) => (
                  <div key={todo.id} className="animate-rise-in" style={{ animationDelay: `${Math.min(index * 45, 260)}ms` }}>
                    <TaskRow
                      todo={todo}
                      editing={editingId === todo.id}
                      editTitle={editTitle}
                      editPriority={editPriority}
                      editDueDate={editDueDate}
                      onToggle={() => toggleTodo(todo.id)}
                      onDelete={() => deleteTodo(todo)}
                      onEditStart={() => beginEdit(todo)}
                      onEditCancel={() => setEditingId(null)}
                      onEditSave={saveEdit}
                      onEditTitle={setEditTitle}
                      onEditPriority={setEditPriority}
                      onEditDueDate={setEditDueDate}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div
                data-testid="state-empty-todos"
                className="mt-5 overflow-hidden rounded-2xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--card)/0.52)] px-6 py-12 text-center"
              >
                <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[hsl(var(--accent)/0.25)] text-[hsl(var(--primary))]">
                  <ClipboardList size={28} strokeWidth={1.7} />
                  <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-[hsl(var(--primary))]" />
                </div>
                <h3 className="mt-5 font-[family-name:var(--app-font-serif)] text-xl font-bold tracking-[-0.04em]">
                  {query || priorityFilter !== 'all'
                    ? 'Nothing matches that filter.'
                    : view === 'completed'
                      ? 'No finished tasks yet.'
                      : view === 'active'
                        ? 'You are all caught up.'
                        : 'Your list is ready when you are.'}
                </h3>
                <p className="mx-auto mt-2 max-w-[330px] text-sm leading-6 text-[hsl(var(--muted-foreground))]">
                  {query || priorityFilter !== 'all'
                    ? 'Try a different search or loosen the priority filter.'
                    : view === 'completed'
                      ? 'Complete a task and it will land here as a small win.'
                      : view === 'active'
                        ? 'Take the quiet moment. The next thing can wait.'
                        : 'Add one small, concrete action above. Momentum likes a clear start.'}
                </p>
                {(query || priorityFilter !== 'all') && (
                  <button
                    type="button"
                    data-testid="button-reset-filters"
                    onClick={() => {
                      setQuery('');
                      setPriorityFilter('all');
                    }}
                    className="focus-ring mt-5 rounded-xl bg-[hsl(var(--primary))] px-4 py-2.5 text-xs font-bold text-[hsl(var(--primary-foreground))] transition-transform hover:-translate-y-0.5"
                  >
                    Reset filters
                  </button>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;