interface Model {
    _id: string;
    keyword: string
    count: string
    at: string
  }

  interface ErrorCatch {
    errorMessage: string;
  }
  
  interface Entry extends Model {}
  
  type ActionStateType = 'DEFAULT' | 'LOAD' | 'CREATE' | 'UPDATE' | 'DELETE';7
  
  export {
    Entry,
    ErrorCatch,
    ActionStateType
  }
  
  
  