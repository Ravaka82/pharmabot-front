import {Injectable} from "@angular/core";
import {Apollo} from "apollo-angular";
import {gql} from "@apollo/client/core";
import {map, tap} from "rxjs/operators";
import {User as Model} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apollo: Apollo) { }

  get() {
    return this.apollo
    .query({
      query: gql`
        query GetUsers {
          users {
            _id
            catalogueGroupe
            connected
            updatedAt
            pseudo
            role {
              _id
              name
              pages
            }
          }
        }
      `,
    }).pipe(
      map(response => {
        return (response.data as any).users as Model.Entry[];
      })
    )
  }

  add(input: Model.CreateInput) {
    return this.apollo
    .mutate({
      variables: { input },
      mutation: gql`
        mutation AddUser($input: AddUserInput!) {
          addUser(input: $input) {
            _id
            catalogueGroupe
            connected
            updatedAt
            pseudo
            role {
              _id
              name
              pages
            }
          }
        }
      `,
    }).pipe(
      map(response => (response.data as any).addUser as Model.Entry)
    )
  }

  update(_id: string, changes: Model.UpdateInput) {
    return this.apollo
    .mutate({
      variables: { _id, changes },
      mutation: gql`
        mutation UpdateUser($_id: ID!, $changes: UpdateUserInput!) {
          updateUserById(_id: $_id, changes: $changes) {
            _id
            connected
            pseudo
            updatedAt
            role {
              _id
              name
              pages
            }
            catalogueGroupe
          }
        }
      `
    }).pipe(
      map(response => (response.data as any).updateUserById as Model.Entry)
    )
  }

  delete(_id: string) {
    return this.apollo
    .mutate({
      variables: { _id },
      mutation: gql`
        mutation DeleteUser($_id: ID!) {
          deleteUserById(_id: $_id) {
            _id
            pseudo
          }
        }
      `,
    }).pipe(
      map(response => (response.data as any).deleteUserById as Model.Entry)
    )
  }
}
