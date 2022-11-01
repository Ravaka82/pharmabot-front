import {Injectable} from '@angular/core';
import {Apollo} from "apollo-angular";
import {gql} from "@apollo/client/core";
import {map} from "rxjs/operators";
import {CatalogueGroupe as Model} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class CatalogueGroupeService {

  constructor(private apollo: Apollo) { }

  get() {
    return this.apollo
    .query({
      query: gql`
        query GetCatalogueGroupe {
          catalogueGroupes {
            _id
            name
            active
            updatedAt
            fournisseurs
          }
        }
      `,
    }).pipe(
      map(response => (response.data as any).catalogueGroupes as Model.Entry[])
    )
  }

  add(input: Model.CreateInput) {
    return this.apollo
    .mutate({
      variables: { input },
      mutation: gql`
        mutation AddCatalogueGroupe($input: AddCatalogueGroupeInput!) {
          addCatalogueGroupe(input: $input) {
            _id
            name
            fournisseurs
            active
            updatedAt
          }
        }
      `,
    }).pipe(
      map(response => (response.data as any).addCatalogueGroupe as Model.Entry)
    )
  }

  update(_id: string, changes: Model.UpdateInput) {
    return this.apollo
    .mutate({
      variables: { _id, changes },
      mutation: gql`
        mutation UpdateCatalogueGroupe($_id: ID!, $changes: UpdateCatalogueGroupeInput!) {
          updateCatalogueGroupeById(_id: $_id, changes: $changes) {
            _id
            name
            active
            updatedAt
            fournisseurs
          }
        }
      `,
    }).pipe(
      map(response => (response.data as any).updateCatalogueGroupeById as Model.Entry)
    )
  }

  delete(_id: string) {
    return this.apollo
    .mutate({
      variables: { _id },
      mutation: gql`
        mutation DeleteCatalogueGroupe($_id: ID!) {
          deleteCatalogueGroupeById(_id: $_id) {
            _id
            name
          }
        }
      `,
    }).pipe(
      map(response => (response.data as any).deleteCatalogueGroupeById as Model.Entry)
    )
  }
}
