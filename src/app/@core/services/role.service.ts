import {Injectable} from '@angular/core';
import {Apollo} from "apollo-angular";
import {gql} from "@apollo/client/core";
import {map} from "rxjs/operators";
import {Role as Model} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private apollo: Apollo) { }

  get() {
    return this.apollo
    .query({
      query: gql`
        query GetRole {
          roles {
            _id
            name
            pages
          }
        }
      `,
    }).pipe(
      map(response => (response.data as any).roles as Model.Entry[])
    )
  }

  add(input: Model.CreateInput) {
    return this.apollo
    .mutate({
      variables: { input },
      mutation: gql`
        mutation AddRole($input: AddRoleInput!) {
          addRole(input: $input) {
            _id
            name
            pages
          }
        }
      `,
    }).pipe(
      map(response => (response.data as any).addRole as Model.Entry)
    )
  }

  update(_id: string, changes: Model.UpdateInput) {
    return this.apollo
    .mutate({
      variables: { _id, changes },
      mutation: gql`
        mutation UpdateRole($_id: ID!, $changes: UpdateRoleInput!) {
          updateRoleById(_id: $_id, changes: $changes) {
            _id
            name
            pages
          }
        }
      `,
    }).pipe(
      map(response => (response.data as any).updateRoleById as Model.Entry)
    )
  }

  delete(_id: string) {
    return this.apollo
    .mutate({
      variables: { _id },
      mutation: gql`
        mutation DeleteRole($_id: ID!) {
          deleteRoleById(_id: $_id) {
            _id
            name
          }
        }
      `,
    }).pipe(
      map(response => (response.data as any).deleteRoleById as Model.Entry)
    )
  }
}
