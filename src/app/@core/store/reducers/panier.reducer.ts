import {createReducer, on} from "@ngrx/store";
import {PanierState as State} from '../states';
import {AccountActions, PanierActions as ModelActions} from '../actions';
import {createEntityAdapter, EntityAdapter} from "@ngrx/entity";
import * as Model from '../../interfaces/panier.interface';


const adapter: EntityAdapter<Model.Entry> = createEntityAdapter<Model.Entry>({
  selectId: (entry => entry.id || '')
});

const initialState: State = adapter.getInitialState({
  action: 'DEFAULT'
})

export const reducer = createReducer(
  initialState,
  on(ModelActions.LOAD, (state, {entries}) => {
    return adapter.setAll(entries || [], state);
  }),
  on(ModelActions.PUSH_OR_UPDATE, (state, {entry}) => {
    return adapter.upsertOne(entry, state);
  }),
  on(ModelActions.REMOVE_ITEM, (state, {ids}) => {
    return adapter.removeMany((ids || ['']), state);
  }),
  on(AccountActions.LOGOUT_SUCCEED, _ => {
    console.log('initialize Panier state.');
    return adapter.removeAll(initialState)
  })
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();
