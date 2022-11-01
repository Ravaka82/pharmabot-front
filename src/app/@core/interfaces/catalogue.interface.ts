interface Model {
  _id: string;
  isArrivage: boolean;
  fournisseur: string;
  catalogue: string;
  extension: string;
  user: string;
  createdAt: Date;
  updatedAt?: Date;
}


interface CatalogueExcelOptions {
  _id?: string
  feuille: string
  designation: string
  prix: string
  date_expiration: string
  tva?: string
  isArrivage: boolean
}

interface CatalogueFileOptions {
  user: string
  file: any
  fournisseur: string
  date_catalogue: string
  excel: CatalogueExcelOptions
}

interface ErrorCatch {
  action: ActionStateType;
  errorMessage: string;
}

interface CreateInput extends  CatalogueFileOptions {
}

interface DeleteInput {
  _id: string;
}


interface Entry extends Model {}

type ActionStateType = 'DEFAULT' | 'LOAD' | 'CREATE' | 'DELETE';


export {
  CatalogueExcelOptions,
  CatalogueFileOptions,
  ActionStateType,
  Entry,
  ErrorCatch,
  DeleteInput,
  CreateInput
}
