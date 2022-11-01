import {Role} from './index';

interface Model {
  token?: string;
  _id?: string;
  pseudo?: string;
  connected?: boolean;
  catalogueGroupe?: string;
  createdAt?: Date;
  role?: Role.Entry
}


interface UpdateInput {
  token: string;
  _id: string;
  role: string;
}

interface LoginInput {
  password: string;
  pseudo: string;
}

interface LogoutInput {
  token: string;
  _id: string;
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
  UpdateInput,
  ActionStateType,
  LoginInput,
  LogoutInput
}
