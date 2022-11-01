import {createReducer, on} from "@ngrx/store";
import {AccountState as State} from '../states';
import {AccountActions as ModelActions} from '../actions';

const initialState: State = {
  action: 'DEFAULT',
  loading: false,
  errorMessage: '',
  catalogueGroupe: '',
  _id: undefined,
  role: undefined,
  token: undefined
}

export const reducer = createReducer(
  initialState,
  on(
    ModelActions.LOGIN_REQUESTED,
    ModelActions.LOGOUT_REQUESTED,
    (state) => {
      return {...state, errorMessage: '', loading: true}
    }),
  on(ModelActions.LOGIN_SUCCEED, (state, {entry}) => {
    return {...state, ...entry, loading: false}
  }),
  on(ModelActions.LOGOUT_SUCCEED, _ => {
    console.log('initialize account state.');
    return initialState
  }),
  on(ModelActions.UPDATE_SUCCEED, (state, {entry}) => {
    return {
      ...state,
      ...entry
    }
  }),
  on(
    ModelActions.LOGIN_FAILED,
    ModelActions.LOGOUT_FAILED,
    (state, {error: {errorMessage}}) => {
      console.log('Account::failed', errorMessage)
      return {...state, loading: false, errorMessage}
    })
);
