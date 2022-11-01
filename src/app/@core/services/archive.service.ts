import {Injectable} from "@angular/core";
import {Apollo} from "apollo-angular";
import {gql} from "@apollo/client/core";
import {map} from "rxjs/operators";
import {Archive as Model} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class ArchiveService {
  constructor(private apollo: Apollo) { }

  get() {
    return this.apollo
    .query({
      query: gql`
      query GetArchive {
        archives {
          _id
          designation
          date_expiration
          prix
          tva
          fournisseur
          date_catalogue
        }
      }
      `,
    }).pipe(
      map(response => {
        return (response.data as any).archives as Model.Entry[];
      })
    )
  }

  add(input: Model.AddArchiveInput) {
    return this.apollo
    .mutate({
      variables: {input},
      mutation: gql`
        mutation AddArchive($input: AddArchiveInput!) {
            addArchive(input: $input) {
              designation
              date_expiration
              prix
              tva
              fournisseur
              date_catalogue
            }
          }
      `,
    }).pipe(
      map(response => (response.data as any).addArchive as Model.Entry)
    )
  }

  update(_id: string, changes: Model.UpdateArchiveInput) {
    return this.apollo
    .mutate({
      variables: {_id, changes},
      mutation: gql`
      mutation UpdateArchiveById($id: ID!, $changes: UpdateArchiveInput!) {
        updateArchiveById(_id: $id, changes: $changes) {
          _id
          designation
          date_expiration
          prix
          tva
          fournisseur
          date_catalogue
        }
      }
      `,
    }).pipe(
      map(response => (response.data as any).updateArchiveById as Model.Entry)
    )
  }

  deleteArchive(input: string[]) {
    return this.apollo
    .mutate({
      variables: { input},
      mutation: gql`
      mutation DeleteArchiveById($input: [ID]!) {
        deleteArchiveById(input: $input) {
          ok
          deletedCount
        }
      }
      `,
    }).pipe(
      map(response => (response.data as any).deleteArchiveById as Model.Entry)
    )
  }
  addJsonCatalogue(dateStart: string, dateEnd: string) {
    return this.apollo
    .mutate({
      variables: {dateStart, dateEnd},
      mutation: gql`
      mutation Mutation($dateStart: String!, $dateEnd: String!) {
        addJsonCatalogue(dateStart: $dateStart, dateEnd: $dateEnd) {
          _id
          designation
          date_expiration
          prix
          tva
          fournisseur
          date_catalogue
        }
      }
      `,
    }).pipe(
      map(response => (response.data as any).addJsonCatalogue as Model.Entry[])
    )
  } 
}
