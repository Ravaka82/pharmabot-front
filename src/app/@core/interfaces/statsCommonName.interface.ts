interface Model {
    _id: string;
    fournisseur: string;
    date_catalogue: string;
    prix: string;
    }
    
    interface ErrorCatch {
      action: ActionStateType;
      errorMessage: string;
    }
    interface Entry extends Model {}
    
    type ActionStateType = 'DEFAULT' | 'LOAD' | 'CREATE' | 'UPDATE' | 'DELETE';
    
    export {
      Entry,
      ErrorCatch,
      ActionStateType
    }
    