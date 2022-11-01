import {CatalogueExcelOptions} from "./catalogue.interface";

interface Model extends  CatalogueExcelOptions {
  _id: string;
  fournisseur: string;
  isArrivage: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

interface ErrorCatch {
  action: ActionStateType;
  errorMessage: string;
}

interface CreateInput extends CatalogueExcelOptions {
  fournisseur: string;
}

interface UpdateInput extends Partial<CatalogueExcelOptions> {
  fournisseur?: string;
  isArrivage?: boolean;
}

interface DeleteInput {
  _id: string;
}


interface Entry extends Model {}

type ActionStateType = 'DEFAULT' | 'LOAD' | 'CREATE' | 'DELETE' | 'UPDATE';


export {
  ActionStateType,
  Entry,
  ErrorCatch,
  DeleteInput,
  CreateInput,
  UpdateInput
}
