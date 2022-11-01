interface Model {
  _id: string;
  name: string;
}

interface AddRefsMapInput {
    name: string;
}

interface ErrorCatch {
  action: ActionStateType;
  errorMessage: string;
}

interface Entry extends Model {}

type ActionStateType = 'DEFAULT' | 'LOAD' | 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT';

export {
  Entry,
  ErrorCatch,
  ActionStateType,
  AddRefsMapInput
}
