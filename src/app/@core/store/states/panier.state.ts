import {EntityState} from "@ngrx/entity";
import {ActionStateType, Entry} from "../../interfaces/panier.interface";

interface State extends EntityState<Entry>{
  // additional entity state properties
  action: ActionStateType
}

export default State;
