interface Model {
  _id: string;
  name: string;
  pages: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
interface CreateInput {
  name: string;
}

interface UpdateInput {
  name?: string;
  pages?: string[];
}

interface DeleteInput {
  _id: string;
}

interface ErrorCatch {
  action: ActionStateType;
  errorMessage: string;
}

interface Entry extends Model {}

interface RolePage {
  id: string;
  label: string;
  pageCount: number;
}

type ActionStateType = 'DEFAULT' | 'LOAD' | 'CREATE' | 'UPDATE' | 'DELETE';

export {
  Entry,
  ErrorCatch,
  UpdateInput,
  CreateInput,
  DeleteInput,
  ActionStateType,
  RolePage
}
