import {EntityState} from "@ngrx/entity";
import {ActionStateType, Entry} from "../../interfaces/role.interface";

interface State extends EntityState<Entry>{
  // additional entity state properties
  action: ActionStateType
  loading: boolean
  errorMessage: string
  selected?: string
}

export default State;
