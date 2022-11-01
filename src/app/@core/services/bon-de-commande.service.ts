import {Injectable} from "@angular/core";
import {Apollo} from "apollo-angular";
import {gql} from "@apollo/client/core";
import {map} from "rxjs/operators";
import {BonDeCommande as Model} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class BonDeCommandeService {
  constructor(private apollo: Apollo) { }

  get() {
    return this.apollo
    .query({
      query: gql`
      query BonDeCommandes {
        bonDeCommandes {
          _id
          fournisseur {
            _id
            name
          }
          archive {
            _id
            designation
          }
          quantite
          createdAt
          updatedAt
        }
      }
      `,
    }).pipe(
      map(response => {
        return (response.data as any).bonDeCommandes as Model.Entry[];
      })
    )
  }

  add(input: Model.AddBonDeCommandeInput) {
    return this.apollo
    .mutate({
      variables: { input },
      mutation: gql`
      mutation AddBonDeCommandeById($input: AddBonDeCommandeInput!) {
        addBonDeCommandeById(input: $input) {
          _id
          fournisseur {
            _id
            name
          }
          archive {
           _id
           designation
          }
          quantite
          createdAt
          updatedAt
        }
      }
      `,
    }).pipe(
      map(response => (response.data as any).addBonDeCommandeById as Model.Entry)
    )
  }

  update(_id: string, changes: Model.UpdateBonDeCommandeInput) {
    return this.apollo
    .mutate({
      variables: { id: _id, changes },
      mutation: gql`
      mutation UpdateBonDeCommandeById($id: ID!, $changes: UpdateBonDeCommandeInput!) {
        updateBonDeCommandeById(_id: $id, changes: $changes) {
          _id
          fournisseur {
            _id
          }
          archive {
            _id
          }
          quantite
          createdAt
          updatedAt
        }
      }
      `,
    }).pipe(
      map(response => (response.data as any).updateBonDeCommandeById as Model.Entry)
    )
  }
                                                                                                                                                                                     
  delete(_id: string) {
    return this.apollo
    .mutate({
      variables: { id: _id },
      mutation: gql`
      mutation DeleteBonDeCommandeById($id: ID!) {
        deleteBonDeCommandeById(_id: $id) {
         _id
          fournisseur {
            _id
            name
          }
          archive {
           _id
           designation
          }
          quantite
          createdAt
          updatedAt
        }
      }
      `,
    }).pipe(
      map(response => (response.data as any).deleteBonDeCommandeById as Model.Entry)
    )
  }
  sender({to,subject,text,file,filename} :any) {
    console.log('SERVICE::::::::::::::::',to,subject,text,file,filename)
    return this.apollo
    .mutate({
      variables: {to, subject, text, file,filename},
      context: {
        useMultipart: true
      },
      mutation: gql`
      mutation Sender($to: String, $subject: String, $text: String, $file: Upload!,$filename: String) {
        sender(to: $to, subject: $subject, text: $text, file: $file,filename: $filename) {
          statu
        }
      }
      `,
    }).pipe(
      map(response => (response.data as any).sender as Model.Entry)
    )
  } 
}
