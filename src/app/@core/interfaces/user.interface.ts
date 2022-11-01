import {Role, CatalogueGroupe} from './index';

interface Model {
  _id: string;
  pseudo: string;
  password: string;
  catalogueGroupe: string;
  role: Role.Entry;
  createdAt?: Date;
  updatedAt?: Date;
}
interface CreateInput {
  pseudo: string;
  password: string;
  catalogueGroupe: string;
  role: string;
}

interface UpdateInput {
  connected?: boolean;
  pseudo?: string;
  password?: string;
  catalogueGroupe?: string;
  role?: string;
}

interface DeleteInput {
  _id: string;
}

interface ErrorCatch {
  action: ActionStateType;
  errorMessage: string;
}

interface UserPage extends Model {
  catalogueGroupeName: string;
}

interface Entry extends Model {}


type ActionStateType = 'DEFAULT' | 'LOAD' | 'CREATE' | 'UPDATE' | 'DELETE';

export {
  Entry,
  ErrorCatch,
  UpdateInput,
  CreateInput,
  DeleteInput,
  ActionStateType,
  UserPage
}
