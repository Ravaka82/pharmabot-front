import {CatalogueGroupe} from './index';

interface Model {
  _id: string
  reference: string
  sender: FactureClient
  receiver: FactureClient
  catalogueGroupe: CatalogueGroupe.Entry
  status: StatusType
  receivedBy: string
  receivedAt: Date
  paidAt: Date
  payAvailableAt: Date
  qrcode: string
  metadata: any
  facturation: [Facturation]
  createdAt: Date
  updatedAt: Date
}

interface Facturation {
  designation: string
  quantity: number
  price: number
}

interface FactureClient {
  address?: string
  city?: string
  country?: string
  logo?: string
  name?: string
  nif?: string
  officeNumber?: string
  phoneNumber?: string
  rcs?: string
  stat?: string
  zip?: string
}

interface CreateInput {
  reference: string
  sender: FactureClient
  receiver: FactureClient
  catalogueGroupe: string
  status: StatusType
  metadata?: any
  facturation: [Facturation]
}

interface UpdateInput {
  status?: StatusType
  receivedBy?: string
  receivedAt?: Date
  paidAt?: Date
  payAvailableAt?: Date
  metadata?: any
}

interface GetInput {
  catalogueGroupe?: string;
  _id?: string;
}

interface DeleteInput {
  _id: string;
}

interface ErrorCatch {
  action: ActionStateType;
  errorMessage: string;
}

interface Entry extends Model {}

interface FacturePage extends Entry {
  hideFooterCut?: boolean;
  receivedByInput?: boolean;
  receivedByUpdate?: string;
  isUpdating?: boolean;
}

type StatusType = 'WAITING' | 'PAID' | 'CREATED' | 'PAY_AVAILABLE';
type ActionStateType = 'DEFAULT' | 'LOAD' | 'CREATE' | 'UPDATE' | 'DELETE';

export {
  Entry,
  ErrorCatch,
  UpdateInput,
  CreateInput,
  DeleteInput,
  ActionStateType,
  Facturation,
  FactureClient,
  FacturePage,
  GetInput
}
