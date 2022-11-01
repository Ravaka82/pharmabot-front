import {createAction, props, union} from '@ngrx/store';
import {Panier as MODEL} from '../../interfaces';

const source = 'Panier';

export const LOAD = createAction(
  `[${source}] load`,
  props<{entries?: MODEL.Entry[]}>()
);

export const PUSH_OR_UPDATE = createAction(
  `[${source}] create or update`,
  props<{entry: MODEL.Entry}>()
);

export const REMOVE_ITEM = createAction(
  `[${source}] item removed`,
  props<{ids: string[] }>()
);

const all = union({
  LOAD,
  PUSH_OR_UPDATE,
  REMOVE_ITEM
});
export type Action = typeof all;
