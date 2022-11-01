import {EntityState} from "@ngrx/entity";
import {ActionStateType, Entry} from "../../interfaces/statsCommonName.interface";

interface State extends EntityState<Entry>{
  // additional entity state properties
  action: ActionStateType
  loading: boolean
  errorMessage: string
}

export default State;
