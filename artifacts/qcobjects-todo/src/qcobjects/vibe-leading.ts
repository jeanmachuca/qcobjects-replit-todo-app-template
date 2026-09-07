import type { Todo } from '@/lib/todo-storage';

export const missionScript = {
  missionName: 'Keep the next right thing in view',
  frequency: 'Stealth/Precision',
  outcome: 'A durable, focused task list that survives refresh and stays easy to act on',
  constraints: [
    'No account or vendor dependency',
    'No task data leaves this device',
    'Every mutation must be immediately visible',
  ],
  acceptance: [
    'Create, edit, complete, reopen, filter, search, and delete todos',
    'Persist valid todos locally',
    'Show a safe loading and empty state',
  ],
} as const;

export type TodoTelemetry = {
  traction: number;
  circuitDelta: number;
  hallucinationDebt: number;
};

export const getTodoTelemetry = (todos: Todo[]): TodoTelemetry => {
  const completed = todos.filter((todo) => todo.completed).length;
  return {
    traction: todos.length ? Math.round((completed / todos.length) * 100) : 0,
    circuitDelta: 0,
    hallucinationDebt: 0,
  };
};