interface Model {
  _id: string
  name: string
  address: string
  city: string
  zip: string
  country: string
  nif: string
  stat: string
  rcs: string
  phoneNumber: string
  officeNumber: string
  logo: string
  createdAt: Date
  updatedAt: Date
}

interface CreateInput {
  name: string
  address: string
  city: string
  zip: string
  country: string
  nif: string
  stat: string
  rcs?: string
  phoneNumber?: string
  officeNumber: string
  logo?: string
}

interface UpdateInput {
  name?: string
  address?: string
  city?: string
  zip?: string
  country?: string
  nif?: string
  stat?: string
  rcs?: string
  phoneNumber?: string
  officeNumber?: string
  logo?: string
}

interface DeleteInput {
  _id: string;
}

interface ErrorCatch {
  action: ActionStateType;
  errorMessage: string;
}

interface Entry extends Model {}


type ActionStateType = 'DEFAULT' | 'LOAD' | 'CREATE' | 'UPDATE' | 'DELETE';

export {
  Entry,
  ErrorCatch,
  UpdateInput,
  CreateInput,
  DeleteInput,
  ActionStateType
}
