import {ActionStateType, Entry} from 'src/app/@core/interfaces/account.interface';

interface State extends Entry{
  // additional entity state properties
  action: ActionStateType
  loading: boolean
  errorMessage: string
}

export default State;
