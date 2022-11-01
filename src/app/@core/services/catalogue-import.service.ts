import {Injectable} from "@angular/core";
import {Apollo} from "apollo-angular";
import {gql} from "@apollo/client/core";
import {map} from "rxjs/operators";
import {CatalogueImport as Model} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class CatalogueImportService {
  constructor(private apollo: Apollo) { }

  get() {
    return this.apollo
    .query({
      query: gql`
        query GetCatalogueImports {
          catalogueImports {
            _id
            date_expiration
            designation
            feuille
            fournisseur
            isArrivage
            prix
            tva
            createdAt
            updatedAt
          }
        }
      `,
    }).pipe(
      map(response => (response.data as any).catalogueImports as Model.Entry[])
    )
  }

  add(input: Model.CreateInput) {
    return this.apollo
    .mutate({
      variables: { input },
      mutation: gql`
        mutation AddCatalogueImport($input: AddCatalogueImportInput!) {
          addCatalogueImport(input: $input) {
            _id
            date_expiration
            designation
            feuille
            fournisseur
            isArrivage
            prix
            tva
            createdAt
            updatedAt
          }
        }
      `,
    }).pipe(
      map(response => (response.data as any).addCatalogueImport as Model.Entry)
    )
  }

  update(_id: string, changes: Model.UpdateInput) {
    return this.apollo
    .mutate({
      variables: { _id, changes },
      mutation: gql`
        mutation UpdateCatalogueImport($_id: ID!, $changes: UpdateCatalogueImportInput!) {
          updateCatalogueImportById(_id: $_id, changes: $changes) {
            _id
            date_expiration
            designation
            feuille
            fournisseur
            isArrivage
            prix
            tva
            updatedAt
          }
        }
      `,
    }).pipe(
      map(response => (response.data as any).updateCatalogueImportById as Model.Entry)
    )
  }

  delete(_id: string) {
    return this.apollo
    .mutate({
      variables: { _id },
      mutation: gql`
        mutation DeleteCatalogueImport($_id: ID!) {
          deleteCatalogueImportById(_id: $_id) {
            _id
            fournisseur
          }
        }
      `,
    }).pipe(
      map(response => (response.data as any).deleteCatalogueImportById as Model.Entry)
    )
  }
}
