import {Injectable} from '@angular/core';
import {Apollo} from "apollo-angular";
import {gql} from "@apollo/client/core";
import {map} from "rxjs/operators";
import {CatalogueSettings as Model} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class CatalogueSettingsService {

  constructor(private apollo: Apollo) { }

  get(input: Model.GetInput) {
    return this.apollo
    .query({
      variables: { input },
      query: gql`
        query GetCatalogueSettings($input: catalogueSettingsByGroupeIdInput!) {
          catalogueSettingsByGroupeId(input: $input) {
            _id
            catalogueGroupeId
            couleur
            fournisseurId
            remise
            updatedAt
          }
        }
      `,
    }).pipe(
      map(response => (response.data as any).catalogueSettingsByGroupeId as Model.Entry[])
    )
  }

  add(input: Model.CreateInput) {
    return this.apollo
    .mutate({
      variables: { input },
      mutation: gql`
        mutation AddCatalogueSettings($input: AddCatalogueSettingsInput!) {
          addCatalogueSettings(input: $input) {
            _id
            catalogueGroupeId
            couleur
            fournisseurId
            remise
            updatedAt
          }
        }
      `,
    }).pipe(
      map(response => (response.data as any).addCatalogueSettings as Model.Entry)
    )
  }

  update(_id: string, changes: Model.UpdateInput) {
    return this.apollo
    .mutate({
      variables: { _id, changes },
      mutation: gql`
        mutation UpdateCatalogueSettings($_id: ID!, $changes: UpdateCatalogueSettingsInput!) {
          updateCatalogueSettingsById(_id: $_id, changes: $changes) {
            _id
            catalogueGroupeId
            couleur
            fournisseurId
            remise
            updatedAt
          }
        }
      `,
    }).pipe(
      map(response => (response.data as any).updateCatalogueSettingsById as Model.Entry)
    )
  }

  delete(_id: string) {
    return this.apollo
    .mutate({
      variables: { _id },
      mutation: gql`
        mutation DeleteCatalogueSettings($_id: ID!) {
          deleteCatalogueSettingsById(_id: $_id) {
            _id
            catalogueGroupeId
          }
        }
      `,
    }).pipe(
      map(response => (response.data as any).deleteCatalogueSettingsById as Model.Entry)
    )
  }
}
