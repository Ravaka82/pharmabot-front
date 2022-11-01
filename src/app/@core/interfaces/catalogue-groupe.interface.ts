interface Model {
  _id: string;
  name: string;
  active: boolean;
  fournisseurs: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface CreateInput {
  name: string;
}

interface UpdateInput {
  name?: string;
  active?: boolean;
  fournisseurs?: string[];
}

interface DeleteInput {
  _id: string;
}

interface ErrorCatch {
  action: ActionStateType;
  errorMessage: string;
}

interface Entry extends Model {}

interface CatalogueGroupePage {
  id: string;
  name: string;
  active: boolean;
  catalogueCount: number;
}

type ActionStateType = 'DEFAULT' | 'LOAD' | 'CREATE' | 'UPDATE' | 'DELETE';

export {
  Entry,
  ErrorCatch,
  CreateInput,
  UpdateInput,
  DeleteInput,
  CatalogueGroupePage,
  ActionStateType
}
