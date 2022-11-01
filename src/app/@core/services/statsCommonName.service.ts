import {Injectable} from "@angular/core";
import {Apollo} from "apollo-angular";
import {gql} from "@apollo/client/core";
import {map} from "rxjs/operators";
import {StatsCommonName as Model} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class StatsCommonNameService {
  constructor(private apollo: Apollo) { }

  ResultAddCommonName(commonName: string,dateStart: string,dateEnd: string){
    return this.apollo
    .mutate({
        variables: {commonName,dateStart,dateEnd},
        mutation: gql`
        mutation AddCommonName($commonName: String!, $dateStart: String!, $dateEnd: String!) {
          addCommonName(commonName: $commonName, dateStart: $dateStart, dateEnd: $dateEnd) {
            _id
            fournisseur
            date_catalogue
            prix
          }
        }
        `,
    }).pipe(
      map(response => (response.data as any).addCommonName as Model.Entry[])
    )
  }

}
