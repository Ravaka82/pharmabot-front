import {Injectable} from "@angular/core";
import {Apollo} from "apollo-angular";
import {gql} from "@apollo/client/core";
import {map} from "rxjs/operators";
import {SearchGraph as Model} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class SearchGraphService {
  constructor(private apollo: Apollo) { }


  addOccurenceByMonth(month: string,nombre:string) {
    return this.apollo
    .mutate({
      variables: {month,nombre},
      mutation: gql`
      mutation AddOccurenceByMonth($month: String!, $nombre: String!) {
        addOccurenceByMonth(month: $month, nombre: $nombre) {
          _id
          keyword
          count
          at
        }
      }
      `,
    }).pipe(
      map(response => (response.data as any).addOccurenceByMonth as Model.Entry[])
    )
  } 

}
