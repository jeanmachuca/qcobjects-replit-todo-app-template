export type TodoAppConfig = {
  appName: string;
  sourceType: 'module';
  relativeImportPath: string;
  componentsBasePath: string;
  storageKey: string;
  localFirst: boolean;
  missionScript: {
    missionName: string;
    frequency: 'Stealth/Precision' | 'High-Velocity/Market-Capture';
    outcome: string;
    constraints: string[];
    acceptance: string[];
  };
  hud: {
    signals: string[];
    tractionGreenAt: number;
    hallucinationDebtGreenAt: number;
  };
};

export const defaultTodoAppConfig: TodoAppConfig = {
  appName: 'QCObjects Todo',
  sourceType: 'module',
  relativeImportPath: 'js/packages/',
  componentsBasePath: 'templates/components/',
  storageKey: 'qcobjects-todo:v1',
  localFirst: true,
  missionScript: {
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
  },
  hud: {
    signals: ['traction', 'circuitDelta', 'hallucinationDebt'],
    tractionGreenAt: 95,
    hallucinationDebtGreenAt: 0,
  },
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const mergeConfig = (value: unknown): TodoAppConfig => {
  if (!isRecord(value)) return defaultTodoAppConfig;

  return {
    ...defaultTodoAppConfig,
    ...value,
    missionScript: {
      ...defaultTodoAppConfig.missionScript,
      ...(isRecord(value.missionScript) ? value.missionScript : {}),
    },
    hud: {
      ...defaultTodoAppConfig.hud,
      ...(isRecord(value.hud) ? value.hud : {}),
    },
  } as TodoAppConfig;
};

export const loadTodoAppConfig = async (): Promise<TodoAppConfig> => {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}config.json`, {
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) throw new Error(`Config request failed: ${response.status}`);
    return mergeConfig(await response.json());
  } catch {
    return defaultTodoAppConfig;
  }
};