import { RefsMap } from ".";

interface Model {
  _id: string;
  nameProduct: string;
  refsMap: { _id:string, name: string }
}

interface AddProductRefsInput {
    nameProduct: string;
    refsMap: string;
}
interface DeleteProductRefsInput {
  _id: string;
}

interface ErrorCatch {
  action: ActionStateType;
  errorMessage: string;
}
interface Entry extends Model{}

type ActionStateType = 'DEFAULT' | 'LOAD' | 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT';

export {
  Entry,
  ErrorCatch,
  ActionStateType,
  AddProductRefsInput,
  DeleteProductRefsInput
}
