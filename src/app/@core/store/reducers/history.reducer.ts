import {createReducer, on} from "@ngrx/store";
import {HistoryState as State} from '../states';
import {HistoryActions as ModelActions, AccountActions} from '../actions';
import {createEntityAdapter, EntityAdapter} from "@ngrx/entity";
import * as Model from '../../interfaces/histories.interface'


const adapter: EntityAdapter<Model.Entry> = createEntityAdapter<Model.Entry>({
  selectId: (entry => entry._id)
});

const initialState: State = adapter.getInitialState({
  action: 'DEFAULT',
  loading: false,
  errorMessage: ''
})

export const reducer = createReducer(
  initialState,
  on(
    ModelActions.LOAD_REQUESTED,
    ModelActions.CREATE_REQUESTED,
    ModelActions.DELETE_REQUESTED,
    (state) => {
      return {...state, errorMessage: '', loading: true}
    }),
  on(ModelActions.LOAD_SUCCEED, (state,{entries}) => {
    return adapter.setAll(entries || [], { ...state, loading: false });
  }),
  on(ModelActions.CREATE_SUCCEED, (state, {entry}) => {
    return adapter.addMany(entry, { ...state, loading: false });
  }),
  on(ModelActions.DELETE_SUCCEED, (state, {ids}) => {
    return adapter.removeMany(ids, { ...state, loading: false });
  }),
  on(
    ModelActions.LOAD_FAILED,
    ModelActions.CREATE_FAILED,
    ModelActions.DELETE_FAILED,
    (state, {error: { errorMessage, action}}) => {
      console.log('History::failed', errorMessage)
      return {...state, loading: false, errorMessage, action}
    }),
  on(AccountActions.LOGOUT_SUCCEED, _ => {
    console.log('initialize history state.');
    return adapter.removeAll(initialState)
  })
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
