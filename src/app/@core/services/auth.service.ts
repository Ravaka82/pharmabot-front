import {Injectable} from '@angular/core';
import {Apollo} from "apollo-angular";
import {gql} from "@apollo/client/core";
import {map} from "rxjs/operators";
import { Account } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private apollo: Apollo) { }

  login(input: Account.LoginInput) {
    return this.apollo
      .mutate({
        variables: {
          input
        },
        mutation: gql`
          mutation Login($input: LoginInput!) {
            login(input: $input){
              _id
              token
              connected
              createdAt
              pseudo
              catalogueGroupe
              role {
                name
                pages
              }
            }
          }
        `,
      }).pipe(
        map(response => (response.data as any).login as Account.Entry)
    )
  }

  logout(input: Account.LogoutInput) {
    return this.apollo
    .mutate({
      variables: {
        input
      },
      mutation: gql`
        mutation Logout($input: LogoutInput!) {
          logout(input: $input){
            _id
            pseudo
          }
        }
      `,
    }).pipe(
      map(response => (response.data as any).logout)
    )
  }
}
