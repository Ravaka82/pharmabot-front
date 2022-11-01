import {createEntityAdapter, EntityAdapter} from "@ngrx/entity";
import {Entry} from "src/app/@core/interfaces/product-refs.interface";
import {createReducer, on} from "@ngrx/store";
import {ProductRefsState as State} from '../states';
import {AccountActions, ProductRefsActions as ModelActions} from '../actions';

export const adapter: EntityAdapter<Entry> = createEntityAdapter<Entry>({
  selectId: ({_id}) => _id
});

const initialState: State = adapter.getInitialState({
  action: 'DEFAULT',
  loading: false,
  errorMessage: ''
});

export const reducer = createReducer(
  initialState,
  on(
    ModelActions.LOAD_REQUESTED,
    ModelActions.CREATE_REQUESTED,
    ModelActions.UPDATE_REQUESTED,
    ModelActions.DELETE_REQUESTED,(state) => {
      return {...state, loading: true}
    }),
  on(
    ModelActions.LOAD_FAILED,
    ModelActions.CREATE_FAILED,
    ModelActions.UPDATE_FAILED,
    ModelActions.DELETE_FAILED,(state, {error: {errorMessage}}) => {
      return {...state, loading: false, errorMessage}
    }),
  on(ModelActions.LOAD_SUCCEED, (state, {entries}) => {
    return adapter.setAll(entries || [], { ...state, loading: false });
  }),

  on(ModelActions.CREATE_SUCCEED, (state, {entry}) => {
    return adapter.addOne(entry , { ...state, loading: false });
  }),
  on(ModelActions.UPDATE_SUCCEED, (state, {entry}) => {
    return adapter.updateOne({id: entry._id, changes: entry}, { ...state, loading: false })
  }),
  on(ModelActions.DELETE_SUCCEED, (state, {entry}) => {
    return adapter.removeOne(entry._id, { ...state, loading: false });
  }),
  on(AccountActions.LOGOUT_SUCCEED, _ => {
    console.log('initialize archive state.');
    return adapter.removeAll(initialState)
  })
);

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();
