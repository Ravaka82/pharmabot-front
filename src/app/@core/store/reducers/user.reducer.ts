import {createReducer, on} from "@ngrx/store";
import {UserState as State} from '../states';
import {UserActions as ModelActions, AccountActions} from '../actions';
import {createEntityAdapter, EntityAdapter} from "@ngrx/entity";
import * as Model from '../../interfaces/user.interface'


const adapter: EntityAdapter<Model.Entry> = createEntityAdapter<Model.Entry>({
  selectId: (entry => entry._id)
});

const initialState: State = adapter.getInitialState({
  action: 'DEFAULT',
  loading: false,
  errorMessage: '',
  selected: undefined
})

export const reducer = createReducer(
  initialState,
  on(
    ModelActions.LOAD_REQUESTED,
    ModelActions.CREATE_REQUESTED,
    ModelActions.UPDATE_REQUESTED,
    ModelActions.DELETE_REQUESTED,
    (state) => {
      return {...state, errorMessage: '', loading: true}
    }),
  on(ModelActions.LOAD_SUCCEED, (state, {entries}) => {
    return adapter.setAll(entries || [], { ...state, loading: false });
  }),
  on(ModelActions.CREATE_SUCCEED, (state, {entry}) => {
    return adapter.addOne(entry, { ...state, loading: false });
  }),
  on(ModelActions.UPDATE_SUCCEED, (state, {entry}) => {
    return adapter.updateOne({id: entry._id, changes: entry}, { ...state, loading: false });
  }),
  on(ModelActions.DELETE_SUCCEED, (state, {entry}) => {
    return adapter.removeOne(entry._id, { ...state, loading: false });
  }),
  on(
    ModelActions.LOAD_FAILED,
    ModelActions.CREATE_FAILED,
    ModelActions.UPDATE_FAILED,
    ModelActions.DELETE_FAILED,
    (state, {error: { errorMessage, action}}) => {
      console.log('User::failed', errorMessage)
      return {...state, loading: false, errorMessage, action}
    }),
  on (ModelActions.SELECTED, (state, {userId}) => {
    return { ...state, selected: userId}
  }),
  on(AccountActions.LOGOUT_SUCCEED, _ => {
    console.log('initialize user state.');
    return adapter.removeAll(initialState)
  })
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
