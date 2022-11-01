interface Model {
    _id: string;
    designation: string;
    date_expiration: string;
    prix: string;
    tva: string;
    fournisseur: string;
    date_catalogue: string;
    __typename:string;
  }
  
interface UpdateArchiveInput {  
    designation: string;
    date_expiration: string;
    prix: string;
    tva: string;
    fournisseur: string;
    date_catalogue: string;
}
interface AddArchiveInput {
    _id:string;
    designation: string;
    date_expiration: string;
    prix: string;
    tva: string ;
    fournisseur: string;
    date_catalogue: string;
}
  
  interface DeleteArchiveInput {
    _id: string;
  }
  
  interface JsonCatalogue{
    _id:string;
    designation: string;
    date_expiration: string;
    prix: string;
    tva: string;
    fournisseur: string;
    date_catalogue: string;
  }
  interface DateInput{
    dateStart: string;
    dateEnd: string;
  }

  interface ResultAddDesignation{
    _id: string;
    fournisseur: string;
    date_catalogue: string;
    prix: string;
}
   
  interface ErrorCatch {
    action: ActionStateType;
    errorMessage: string;
  }
  interface deleteArchive {
    ok: number
    deletedCount: number
}
  interface Entry extends Model {}
  
  type ActionStateType = 'DEFAULT' | 'LOAD' | 'CREATE' | 'UPDATE' | 'DELETE';
  
  export {
    Entry,
    ErrorCatch,
    AddArchiveInput,
    UpdateArchiveInput,
    DeleteArchiveInput,
    JsonCatalogue,
    DateInput,
    ActionStateType,
    ResultAddDesignation
  }
  