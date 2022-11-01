import {ActionStateType, Entry} from 'src/app/@core/interfaces/catalogue-import.interface';
import {EntityState} from "@ngrx/entity";

interface State extends EntityState<Entry>{
  // additional entity state properties
  action: ActionStateType
  loading: boolean
  errorMessage: string
}

export default State;
