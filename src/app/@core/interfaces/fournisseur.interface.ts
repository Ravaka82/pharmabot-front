import { FloatLabelType } from "@angular/material/form-field";

interface Model {
  _id: string;
  name: string;
  positionx: number;
  positiony: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CreateInput {
  name: string;
}

interface UpdateInput {
  name?: string;
}

interface DeleteInput {
  _id: string;
}

interface ErrorCatch {
  action: ActionStateType;
  errorMessage: string;
}

interface Entry extends Model {
  isEditable?: boolean;
  checked?: boolean;
  disabled?: boolean;
}

type ActionStateType = 'DEFAULT' | 'LOAD' | 'CREATE' | 'UPDATE' | 'DELETE';

export {
  Entry,
  ErrorCatch,
  CreateInput,
  UpdateInput,
  DeleteInput,
  ActionStateType
}
