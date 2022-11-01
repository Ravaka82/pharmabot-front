import {EntityState} from "@ngrx/entity";
import {ActionStateType, Entry} from "../../interfaces/map.interface";

interface State extends EntityState<Entry>{
  action: ActionStateType
  loading: boolean
  errorMessage: string
}

export default State;
