interface Model {
  id?: string;
  key?: string;
  clientId: string;
  fournisseurId: string;
  designation: string;
  date_expiration?: string;
  cart_count: number;
  prix: number;
  createdAt?: Date;
}

interface ErrorCatch {
  action: ActionStateType;
  errorMessage: string;
}

interface Entry extends Model {
  fournisseurName?: string;
  cart_total?: number;
}
interface PanierPage extends Entry {
  hideFooterCut?: boolean;
  receivedByInput?: boolean;
  receivedByUpdate?: string;
  isUpdating?: boolean;
}
type ActionStateType = 'DEFAULT' | 'LOAD' | 'CREATE' | 'UPDATE' | 'DELETE';

export {
  Entry,
  ErrorCatch,
  ActionStateType
}
