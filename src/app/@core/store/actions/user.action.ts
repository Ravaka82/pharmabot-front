import {createAction, props, union} from '@ngrx/store';
import {User as MODEL} from '../../interfaces';

const source = 'user';

export const LOAD_REQUESTED = createAction(
  `[${source}] load request`,

);
export const LOAD_SUCCEED = createAction(
  `[${source}] load succeed`,
  props< {entries: MODEL.Entry[]}>()
);
export const LOAD_FAILED = createAction(
  `[${source}] load failed`,
  props<{error: MODEL.ErrorCatch}>()
);

export const CREATE_REQUESTED = createAction(
  `[${source}] create request`,
  props<{input: MODEL.CreateInput}>()
);
export const CREATE_SUCCEED = createAction(
  `[${source}] create succeed`,
  props<{entry: MODEL.Entry}>()
);
export const CREATE_FAILED = createAction(
  `[${source}] create failed`,
  props<{error: MODEL.ErrorCatch}>()
);

export const UPDATE_REQUESTED = createAction(
  `[${source}] update request`,
  props<{id: string, changes: MODEL.UpdateInput}>()
);
export const UPDATE_SUCCEED = createAction(
  `[${source}] update succeed`,
  props<{entry: MODEL.Entry}>()
);
export const UPDATE_FAILED = createAction(
  `[${source}] update failed`,
  props<{error: MODEL.ErrorCatch}>()
);

export const DELETE_REQUESTED = createAction(
  `[${source}] delete request`,
  props< {input: MODEL.DeleteInput}>()
);
export const DELETE_SUCCEED = createAction(
  `[${source}] delete succeed`,
  props<{entry: MODEL.Entry}>()
);
export const DELETE_FAILED = createAction(
  `[${source}] delete failed`,
  props<{error: MODEL.ErrorCatch}>()
);

export const SELECTED = createAction(
  `[${source}] selected`,
  props<{userId: string}>()
)

const all = union({
  LOAD_REQUESTED,
  CREATE_REQUESTED,
  UPDATE_REQUESTED,
  DELETE_REQUESTED,

  LOAD_SUCCEED,
  CREATE_SUCCEED,
  UPDATE_SUCCEED,
  DELETE_SUCCEED,

  LOAD_FAILED,
  CREATE_FAILED,
  UPDATE_FAILED,
  DELETE_FAILED,

  SELECTED
});
export type Action = typeof all;
