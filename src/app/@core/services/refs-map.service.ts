import {Injectable} from '@angular/core';
import {Apollo} from "apollo-angular";
import {gql} from "@apollo/client/core";
import {map} from "rxjs/operators";
import {RefsMap as Model} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class RefsMapService {

  constructor(private apollo: Apollo) { }

  get() {
    return this.apollo
    .query({
      query: gql`
      query RefsMap {
        refsMap {
          _id
          name
        }
      }
      `,
    }).pipe(
      map(response => (response.data as any).refsMap as Model.Entry[])
    )
  }

  // getLast() {
  //   return this.apollo
  //   .query({
  //     query: gql`
  //       query Query {
  //         findLastRefsMap {
  //           _id
  //           name
  //         }
  //       }
  //     `,
  //   }).pipe(
  //     map(response => (response.data as any).last as Model.Entry[])
  //   )
  // }

  create(input: Model.AddRefsMapInput) {
    return this.apollo
    .mutate({
      variables: { input },
      mutation: gql`
        mutation AddRefsMapInput($input: AddRefsMapInput!) {
          addRefsMap(input: $input) {
            _id
            name
          }
        }
      `,
    }).pipe(
      map(response => (response.data as any).addRefsMap as Model.Entry)
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
