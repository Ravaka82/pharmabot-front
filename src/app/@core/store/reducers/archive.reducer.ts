import {createEntityAdapter, EntityAdapter} from "@ngrx/entity";
import {createReducer, on} from "@ngrx/store";
import {ArchiveState as State} from '../states';
import {AccountActions, ArchiveActions as ModelActions} from '../actions';
import * as Model from '../../interfaces/archives.interface'

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
  on(ModelActions.LOAD_SUCCEED, (state, {entries}) => {
    return adapter.setAll(entries || [], { ...state, loading: false });
  }),
  on(ModelActions.CREATE_SUCCEED, (state, {entry}) => {
    return adapter.addOne(entry , { ...state, loading: false });
  }),
  on(ModelActions.DELETE_SUCCEED, (state, {input}) => {
    return adapter.removeMany(input, { ...state, loading: false });
  }),
  on(
    ModelActions.LOAD_FAILED,
    ModelActions.CREATE_FAILED,
    ModelActions.DELETE_FAILED,
    (state, {error: { errorMessage, action}}) => {
      console.log('Archive::failed', errorMessage)
      return {...state, loading: false, errorMessage, action}
    }),
  on(AccountActions.LOGOUT_SUCCEED, _ => {
    console.log('initialize archive state.');
    return adapter.removeAll(initialState)
  })
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
