import {Injectable} from "@angular/core";
import {Apollo} from "apollo-angular";
import {gql} from "@apollo/client/core";
import {map} from "rxjs/operators";
import {Map as Model} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class  MapService{
  constructor(private apollo: Apollo) { }
  addOneFournisseur(addOneFournisseurId: string) {
    return this.apollo
    .mutate({
      variables: { addOneFournisseurId},
      mutation: gql`
      mutation AddOneFournisseur($addOneFournisseurId: ID!) {
        addOneFournisseur(id: $addOneFournisseurId) {
          _id
          name
          positionx
          positiony
          createdAt
          updatedAt
        }
      }
      `,
    }).pipe(
      map(response => (response.data as any).addOneFournisseur as Model.Entry)
    )
  } 

}
