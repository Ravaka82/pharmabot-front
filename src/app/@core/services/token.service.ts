import {Injectable} from '@angular/core';
import {Apollo} from "apollo-angular";
import {gql} from "@apollo/client/core";
import {Account} from 'src/app/@core/interfaces';
import {GET_ITEM_STORAGE, REMOVE_ITEM_STORAGE, SET_ITEM_STORAGE} from "../../utils";

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private apollo: Apollo) { }

  setToken(token: string = ''): void {
    SET_ITEM_STORAGE('token', token)
  }

  removeToken(): void {
    REMOVE_ITEM_STORAGE('token');
  }

  getToken(): string | null {
    return GET_ITEM_STORAGE('token');
  }

  validateToken(token: string): Promise<{ valid: boolean, user: Account.Entry}> {
    return this.apollo.mutate({
      variables: {
        input: token
      },
      mutation: gql`
        mutation TokenValidation($input: String!) {
          validateToken(input: $input){
            valid
            user {
              _id
              token
              connected
              createdAt
              pseudo
              catalogueGroupe
              role {
                _id
                name
                pages
              }
            }
          }
        }
      `
    })
    .toPromise()
    .then(({data}) => {
      return (data as any)?.validateToken;
    })
  }
}
