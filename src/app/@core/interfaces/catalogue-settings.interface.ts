import {Fournisseur} from './index';

interface Model {
  _id: string;
  catalogueGroupeId: string;
  fournisseurId: string;
  couleur: string;
  remise: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CreateInput {
  catalogueGroupeId: string;
}

interface GetInput {
  catalogueGroupeId: string;
}

interface UpdateInput {
  fournisseurId?: string;
  couleur?: string;
  remise?: number
}

interface DeleteInput {
  _id: string;
}

interface ErrorCatch {
  action: ActionStateType;
  errorMessage: string;
}

interface CatalogueSettingsPage extends Model {
  fournisseur: Fournisseur.Entry;
  fournisseurName?: string;
  couleurText?: string;
  dateCatalogue?: string;
}

interface Entry extends Model {}

type ActionStateType = 'DEFAULT' | 'LOAD' | 'CREATE' | 'UPDATE' | 'DELETE';

export {
  Entry,
  ErrorCatch,
  CreateInput,
  UpdateInput,
  DeleteInput,
  GetInput,
  ActionStateType,
  CatalogueSettingsPage
}
