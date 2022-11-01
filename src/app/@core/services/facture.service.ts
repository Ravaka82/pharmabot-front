import {Injectable} from "@angular/core";
import {Apollo} from "apollo-angular";
import {gql} from "@apollo/client/core";
import {map} from "rxjs/operators";
import {Facture, Facture as Model} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class FactureService {
  constructor(private apollo: Apollo) { }

  viewFacture(_id: string) {
    return this.apollo
    .query({
      variables: { _id },
      query: gql`
        query GetViewFacture($_id: String) {
          viewFacture(_id: $_id) {
            _id
            catalogueGroupe {
              _id
              name
            }
            paidAt
            payAvailableAt
            facturation {
              designation
              price
              quantity
            }
            metadata
            receivedAt
            receivedBy
            receiver {
              address
              city
              country
              logo
              name
              nif
              officeNumber
              phoneNumber
              rcs
              stat
              zip
            }
            reference
            sender {
              address
              city
              country
              logo
              name
              nif
              officeNumber
              phoneNumber
              rcs
              stat
              zip
            }
            qrcode
            status
            createdAt
            updatedAt
          }
        }
      `,
    }).pipe(
      map(response => {
        return (response.data as any).viewFacture as Model.Entry[];
      })
    )
  }

  get(query: Facture.GetInput) {
    return this.apollo
    .query({
      variables: { input: query },
      query: gql`
        query GetFacturations($input: FactureGetQuery) {
          factures(query: $input) {
            _id
            catalogueGroupe {
              _id
              name
            }
            paidAt
            payAvailableAt
            facturation {
              designation
              price
              quantity
            }
            metadata
            receivedAt
            receivedBy
            receiver {
              address
              city
              country
              logo
              name
              nif
              officeNumber
              phoneNumber
              rcs
              stat
              zip
            }
            reference
            sender {
              address
              city
              country
              logo
              name
              nif
              officeNumber
              phoneNumber
              rcs
              stat
              zip
            }
            qrcode
            status
            createdAt
            updatedAt
          }
        }
      `,
    }).pipe(
      map(response => {
        return (response.data as any).factures as Model.Entry[];
      })
    )
  }

  add(input: Model.CreateInput) {
    return this.apollo
    .mutate({
      variables: { input },
      mutation: gql`
        mutation AddFacture($input: AddFactureInput!) {
          addFacture(input: $input) {
            _id
            catalogueGroupe {
              _id
              name
            }
            qrcode
            paidAt
            payAvailableAt
            facturation {
              designation
              price
              quantity
            }
            metadata
            receivedAt
            receivedBy
            receiver {
              address
              city
              country
              logo
              name
              nif
              officeNumber
              phoneNumber
              rcs
              stat
              zip
            }
            reference
            sender {
              address
              city
              country
              logo
              name
              nif
              officeNumber
              phoneNumber
              rcs
              stat
              zip
            }
            status
            createdAt
            updatedAt
          }
        }
      `,
    }).pipe(
      map(response => (response.data as any).addFacture as Model.Entry)
    )
  }

  update(_id: string, changes: Model.UpdateInput) {
    return this.apollo
    .mutate({
      variables: { _id, changes },
      mutation: gql`
        mutation UpdateFacture($_id: ID!, $changes: UpdateFactureInput!) {
          updateFactureById(_id: $_id, changes: $changes) {
            _id
            catalogueGroupe {
              _id
              name
            }
            qrcode
            paidAt
            payAvailableAt
            facturation {
              designation
              price
              quantity
            }
            metadata
            receivedAt
            receivedBy
            receiver {
              address
              city
              country
              logo
              name
              nif
              officeNumber
              phoneNumber
              rcs
              stat
              zip
            }
            reference
            sender {
              address
              city
              country
              logo
              name
              nif
              officeNumber
              phoneNumber
              rcs
              stat
              zip
            }
            status
            createdAt
            updatedAt
          }
        }
      `
    }).pipe(
      map(response => (response.data as any).updateFactureById as Model.Entry)
    )
  }

  delete(_id: string) {
    return this.apollo
    .mutate({
      variables: { _id },
      mutation: gql`
        mutation DeleteFacture($_id: ID!) {
          deleteFactureById(_id: $_id) {
            _id
            reference
          }
        }
      `,
    }).pipe(
      map(response => (response.data as any).deleteFactureById as Model.Entry)
    )
  }
}
