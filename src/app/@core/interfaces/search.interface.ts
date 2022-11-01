interface Model {
  _id: string;
  user?: { pseudo: string }
  history?: string;
  searches?: SearchKeyword[]
  createdAt: Date
}

interface SearchKeyword {
  at: Date,
  keyword: string
}

interface CreateInput {
  user: string
  searches: SearchKeyword[]
  history: string
}

interface SearchCountType{
  _id: String
  count: String
}

interface ErrorCatch {
  errorMessage: string;
}

interface Entry extends Model {}

type ActionStateType = 'DEFAULT' | 'LOAD' | 'CREATE' | 'UPDATE' | 'DELETE';7

export {
  Entry,
  ErrorCatch,
  CreateInput,
  ActionStateType
}


