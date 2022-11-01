import {Injectable} from '@angular/core';
import {Apollo} from "apollo-angular";
import {gql} from "@apollo/client/core";
import {map} from "rxjs/operators";
import {Search as Model} from "../interfaces";
import {isEqual as _isEqual} from "lodash";
import * as moment from "moment";
import {GET_ITEM_STORAGE, SET_ITEM_STORAGE} from "../../utils";

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private apollo: Apollo) { }

  async saveSearch(currentValue: string, previousValue: string): Promise<void> {
    const previousFirstChar = previousValue.charAt(0);
    const currentFirstChar = currentValue.charAt(0);

    if (previousValue.length > 0 && (currentValue === '' || !_isEqual(previousFirstChar, currentFirstChar))) {
      const today = moment().format('DD/MM/YYYY');
      const yesterday = GET_ITEM_STORAGE('today') || moment().format('DD/MM/YYYY');
      let searches = GET_ITEM_STORAGE('searches') || [];
      const currentUserId = GET_ITEM_STORAGE('currentUserId') || '';
      const searchUserId = GET_ITEM_STORAGE('searchUserId') || currentUserId;

      if (today === yesterday && currentUserId === searchUserId) {
        searches.push({keyword: previousValue, at: new Date()});
      } else {
        const payload = {
          searches,
          user: searchUserId,
          history: yesterday
        }
        try {
          const _searches = await this.add(payload).toPromise();
          console.log(`Searches history ${_searches.history} saved for user ${payload.user}.`);
          searches = [{keyword: previousValue, at: new Date()}];
        } catch (error) {
          console.log('Error saving searches.', error);
          searches.push({keyword: previousValue, at: new Date()});
        }
      }
      SET_ITEM_STORAGE('today', today);
      SET_ITEM_STORAGE('searches', searches);
      SET_ITEM_STORAGE('searchUserId', GET_ITEM_STORAGE('currentUserId'));
    }
  }

  get() {
    return this.apollo
    .query({
      query: gql`
        query GetSearches {
          searches {
            _id
            history
            searches {
              at
              keyword
            }
            createdAt
            user {
              pseudo
            }
          }
        }
      `,
    }).pipe(
      map(response => (response.data as any).searches as Model.Entry[])
    )
  }

  add(input: Model.CreateInput) {
    return this.apollo
    .mutate({
      variables: { input },
      mutation: gql`
        mutation AddSearch($input: AddSearchInput!) {
          addSearch(input: $input) {
            _id
            history
            searches {
              at
              keyword
            }
            createdAt
            user {
              pseudo
            }
          }
        }
      `,
    }).pipe(
      map(response => (response.data as any).addSearch as Model.Entry)
    )
  }
  countOccurence() {
    return this.apollo
    .query({
      query: gql`
      query CountOccurence {
        countOccurence {
          _id
          count
        }
      }
      `,
    }).pipe(
      map(response => (response.data as any).countOccurence as Model.Entry[])
    )
  }
}
