interface Model {
    _id: string;
    fournisseur?: { _id: string, name: string }
    archive?:{ _id: string, designation: string }
    quantite?: string
    createdAt: Date
    updatedAt: Date
  }
  
  interface UpdateBonDeCommandeInput {
    fournisseur: string
    archive: string
    quantite: string
}

interface AddBonDeCommandeInput  {
    fournisseur: string
    archive: string
    quantite: string
}
interface DeleteBonDeCommandeInput {
    _id: string;
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
    UpdateBonDeCommandeInput,
    AddBonDeCommandeInput,
    DeleteBonDeCommandeInput,
    ActionStateType
  }
  