import {Injectable} from '@angular/core';
import {Apollo} from "apollo-angular";
import {gql} from "@apollo/client/core";
import {map} from "rxjs/operators";
import {History as Model} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor(private apollo: Apollo) { }

  get() {
    return this.apollo
    .query({
      query: gql`
        query GetHistory {
          histories {
            _id
            action
            createdAt
            description
            metadata
            user {
              pseudo
            }
          }
        }
      `,
    }).pipe(
      map(response => (response.data as any).histories as Model.Entry[])
    )
  }

  add(input: Model.CreateInput[]) {
    return this.apollo
    .mutate({
      variables: { input },
      mutation: gql`
        mutation AddHistory($input: [AddHistoryInput]!) {
          addHistory(input: $input) {
            _id
            action
            createdAt
            description
            metadata
            user {
              pseudo
            }
          }
        }
      `,
    }).pipe(
      map(response => (response.data as any).addHistory as Model.Entry[])
    )
  }

  delete(_id: string[]) {
    return this.apollo
    .mutate({
      variables: { _id },
      mutation: gql`
        mutation DeleteHistory($_id: [ID]!) {
          deleteHistories(input: $_id) {
            deletedCount
            ok
          }
        }
      `,
    }).pipe(
      map(response => (response.data as any).deleteHistories as Model.Entry)
    )
  }
}
