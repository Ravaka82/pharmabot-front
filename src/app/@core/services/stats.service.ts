import {Injectable} from "@angular/core";
import {Apollo} from "apollo-angular";
import {gql} from "@apollo/client/core";
import {map} from "rxjs/operators";
import {Stats as Model} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  constructor(private apollo: Apollo) { }

  ResultAddDesignation(designation: string,dateStart: string,dateEnd: string){
    return this.apollo
    .mutate({
        variables: {designation,dateStart,dateEnd},
        mutation: gql`
        mutation AddOneDesignation($designation: String!, $dateStart: String!, $dateEnd: String!) {
          addOneDesignation(designation: $designation, dateStart: $dateStart, dateEnd: $dateEnd) {
            _id
            fournisseur
            date_catalogue
            prix
          }
        }
        `,
    }).pipe(
      map(response => (response.data as any).addOneDesignation as Model.Entry[])
    )
  }

}
