import {createAction, props, union} from '@ngrx/store';
import {Account as MODEL} from '../../interfaces';

const source = 'Account';

export const LOGIN_REQUESTED = createAction(
  `[${source}] login requested`,
  props<{input: MODEL.LoginInput}>()
);
export const LOGIN_SUCCEED = createAction(
  `[${source}] login succeed`,
  props<{entry: MODEL.Entry}>()
);
export const UPDATE_SUCCEED = createAction(
  `[${source}] update succeed`,
  props<{entry: MODEL.Entry}>()
);
export const LOGIN_FAILED = createAction(
  `[${source}] login failed`,
  props<{error: MODEL.ErrorCatch}>()
);

export const LOGOUT_REQUESTED = createAction(
  `[${source}] logout requested`,
  props<{input: MODEL.LogoutInput}>()
);
export const LOGOUT_SUCCEED = createAction(
  `[${source}] logout succeed`,
  props<{entry: any}>()
);
export const LOGOUT_FAILED = createAction(
  `[${source}] logout failed`,
  props<{error: MODEL.ErrorCatch}>()
);

const all = union({
  LOGIN_REQUESTED,
  LOGIN_SUCCEED,
  UPDATE_SUCCEED,
  LOGIN_FAILED,
  LOGOUT_REQUESTED,
  LOGOUT_SUCCEED,
  LOGOUT_FAILED,
});
export type Action = typeof all;
