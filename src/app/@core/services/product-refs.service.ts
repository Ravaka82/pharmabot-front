import {Injectable} from '@angular/core';
import {Apollo} from "apollo-angular";
import {gql} from "@apollo/client/core";
import {map} from "rxjs/operators";
import {ProductRefs as Model} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class ProductRefsService {

  constructor(private apollo: Apollo) { }

  get(){
    return this.apollo
    .query({
      query: gql`
      query ProductRefs {
        productRefs {
          _id
          nameProduct
          refsMap {
            _id
            name
          }
        }
      }
      `,
    }).pipe(
      map(response => (response.data as any).productRefs as Model.Entry[])
    )
  }

  create(input: [Model.AddProductRefsInput]) {
    return this.apollo
    .mutate({
      variables: { input },
      mutation: gql`
        mutation AddProductRefs($input: [AddProductRefsInput]!) {
          addProductRefs(input: $input) {
            _id
            nameProduct
            refsMap {
              _id
              name
            }
          }
        }
      `,
    }).pipe(
      map(response => (response.data as any).addProductRefs as Model.Entry)
    )
  }
                                                                                                                                                                                      
  delete(_id: string) {
    return this.apollo
    .mutate({
      variables: { id: _id },
      mutation: gql`
      mutation DeleteProduct($id: ID!) {
        deleteProduct(_id: $id) {
          _id
          nameProduct
          refsMap {
            _id
          }
        }
      }
      `,
    }).pipe(
      map(response => (response.data as any).deleteProduct as Model.Entry)
    )
  }
}
