interface Model {
  _id: string;
  user?: { pseudo: string }
  description?: string
  metadata?: any
  action: string
  createdAt: Date
}

type HistoryActionType = 'LOGIN' | 'LOGOUT' | 'CREATE' | 'UPDATE' | 'DELETE' | 'SEARCH';

interface CreateInput {
  action: HistoryActionType
  user?: string
  description?: string
  metadata?: any
}

interface ErrorCatch {
  action: ActionStateType;
  errorMessage: string;
}

interface Entry extends Model {}

type ActionStateType = 'DEFAULT' | 'LOAD' | 'CREATE' | 'UPDATE' | 'DELETE';

export {
  Entry,
  ErrorCatch,
  CreateInput,
  ActionStateType
}
