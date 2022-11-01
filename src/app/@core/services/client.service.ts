import {Injectable} from "@angular/core";
import {Apollo} from "apollo-angular";
import {gql} from "@apollo/client/core";
import {map} from "rxjs/operators";
import {Client as Model} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  constructor(private apollo: Apollo) { }

  get() {
    return this.apollo
    .query({
      query: gql`
        query GetClients {
          clients {
            _id
            address
            city
            country
            createdAt
            logo
            name
            nif
            officeNumber
            phoneNumber
            rcs
            stat
            updatedAt
            zip
          }
        }
      `,
    }).pipe(
      map(response => {
        return (response.data as any).clients as Model.Entry[];
      })
    )
  }

  add(input: Model.CreateInput) {
    return this.apollo
    .mutate({
      variables: { input },
      mutation: gql`
        mutation AddClient($input: AddClientInput!) {
          addClient(input: $input) {
            _id
            address
            city
            country
            createdAt
            logo
            name
            nif
            officeNumber
            phoneNumber
            rcs
            stat
            updatedAt
            zip
          }
        }
      `,
    }).pipe(
      map(response => (response.data as any).addClient as Model.Entry)
    )
  }

  update(_id: string, changes: Model.UpdateInput) {
    return this.apollo
    .mutate({
      variables: { _id, changes },
      mutation: gql`
        mutation UpdateClient($_id: ID!, $changes: UpdateClientInput!) {
          updateClientById(_id: $_id, changes: $changes) {
            _id
            address
            city
            country
            createdAt
            logo
            name
            nif
            officeNumber
            phoneNumber
            rcs
            stat
            updatedAt
            zip
          }
        }
      `,
    }).pipe(
      map(response => (response.data as any).updateClientById as Model.Entry)
    )
  }

  delete(_id: string) {
    return this.apollo
    .mutate({
      variables: { _id },
      mutation: gql`
        mutation DeleteClient($_id: ID!) {
          deleteClientById(_id: $_id) {
            _id
            name
          }
        }
      `,
    }).pipe(
      map(response => (response.data as any).deleteClientById as Model.Entry)
    )
  }
}
