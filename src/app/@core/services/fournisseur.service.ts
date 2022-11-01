  import {Injectable} from "@angular/core";
  import {Apollo} from "apollo-angular";
  import {gql} from "@apollo/client/core";
  import {map} from "rxjs/operators";
  import {Fournisseur as Model} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class FournisseurService {
  constructor(private apollo: Apollo) { }

  get() {
    return this.apollo
    .query({
      query: gql`
        query GetFournisseurs {
          fournisseurs {
            _id
            name
            positionx
            positiony
          }
        }
      `,
    }).pipe(
      map(response => (response.data as any).fournisseurs as Model.Entry[])
    )
  }

  add(input: Model.CreateInput) {
    return this.apollo
    .mutate({
      variables: { input },
      mutation: gql`
        mutation AddFournisseur($input: AddFournisseurInput!) {
          addFournisseur(input: $input) {
            _id
            name
            createdAt
            updatedAt
          }
        }
      `,
    }).pipe(
      map(response => (response.data as any).addFournisseur as Model.Entry)
    )
  }

  update(_id: string, changes: Model.UpdateInput) {
    return this.apollo
    .mutate({
      variables: { _id, changes },
      mutation: gql`
        mutation UpdateFournisseur($_id: ID!, $changes: UpdateFournisseurInput!) {
          updateFournisseurById(_id: $_id, changes: $changes) {
            _id
            name
            updatedAt
          }
        }
      `,
    }).pipe(
      map(response => (response.data as any).updateFournisseurById as Model.Entry)
    )
  }

  delete(_id: string) {
    return this.apollo
    .mutate({
      variables: { _id },
      mutation: gql`
        mutation DeleteFournisseur($_id: ID!) {
          deleteFournisseurById(_id: $_id) {
            _id
            name
          }
        }
      `,
    }).pipe(
      map(response => (response.data as any).deleteFournisseurById as Model.Entry)
    )
  }
}
