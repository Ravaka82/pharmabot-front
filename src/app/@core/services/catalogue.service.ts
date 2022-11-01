import {Injectable} from '@angular/core';
import {Apollo} from "apollo-angular";
import {gql} from "@apollo/client/core";
import {map} from "rxjs/operators";
import {Catalogue as Model} from "../interfaces";
import {CatalogueFileOptions} from "../interfaces/catalogue.interface";
import {HttpClient} from "@angular/common/http";
import {get as _get, set as _set} from 'lodash';
import {environment} from "../../../environments/environment";
import {GET_ITEM_STORAGE, SET_ITEM_STORAGE} from "../../utils";

const SERVER_URL = environment.SERVER_URL

@Injectable({
  providedIn: 'root'
})
export class CatalogueService {

  constructor(private http: HttpClient, private apollo: Apollo) { }

  get() {
    return this.apollo
    .query({
      query: gql`
        query GetCatalogue {
          catalogues {
            _id
            isArrivage
            catalogue
            createdAt
            extension
            fournisseur
            user
            updatedAt
          }
        }
      `,
    }).pipe(
      map(response => (response.data as any).catalogues as Model.Entry[])
    )
  }

  uploadCatalogue({file, ...options}: CatalogueFileOptions){
    return this.apollo.mutate<any>({
      variables: {
        file,
        options
      },
      context: {
        useMultipart: true
      },
      mutation: gql`
        mutation UploadCatalogue($file: Upload!, $options: CatalogueOptionInput!) {
          uploadCatalogue(file: $file, options: $options) {
            _id
            isArrivage
            catalogue
            createdAt
            extension
            fournisseur
            updatedAt
            user
          }
        }
      `
    }).pipe(
      map(response => (response.data as any).uploadCatalogue as Model.Entry)
    )
  }

  delete(_id: string) {
    return this.apollo
    .mutate({
      variables: { _id },
      mutation: gql`
        mutation DeleteCatalogue($_id: ID!) {
          deleteCatalogueById(_id: $_id) {
            _id
            catalogue
            fournisseur
          }
        }
      `,
    }).pipe(
      map(response => (response.data as any).deleteCatalogueById as Model.Entry)
    )
  }

  async loadCatalogue(queries: string[], fournisseurOptions: any): Promise<any[]> {
    const data = [];
    const localdb = GET_ITEM_STORAGE('catalogues') || {};
    for (const query of queries) {
      try {
        const entries: any = await this.getCatalogue(query, localdb);
        const fournisseurId = _get(fournisseurOptions, [entries.fournisseur, 0, 'fournisseurId'], '')
        data.push(...entries.rows.map((entry: any) => ({
          ...entry,
          fournisseur: entries.fournisseur,
          cart_id: `${fournisseurId}#${entry.designation}`,
          fournisseurId,
          couleurText: _get(fournisseurOptions, [entries.fournisseur, 0, 'couleurText'], ''),
          couleur: _get(fournisseurOptions, [entries.fournisseur, 0, 'couleur'], ''),
          remise: _get(fournisseurOptions, [entries.fournisseur, 0, 'remise'], '')
        })));
      } catch(error) {
        console.log('Catalogue Not Found.', {query, error})
      }
    }
    SET_ITEM_STORAGE('catalogues', localdb);
    return Promise.resolve(data);
  }

  async getCatalogue(query: string, localdb: any) {
    const fournisseur = query.split('/')[2];
    const dateCatalogue = query.split('/')[3]?.replace('.json', '');
    const catalogueLocaldb = _get(localdb, [fournisseur, dateCatalogue], null);
    const rows = catalogueLocaldb || await this.http.get(`${SERVER_URL}/${query}`).toPromise();
    if (!catalogueLocaldb) {
      _set(localdb, [fournisseur], {});
      _set(localdb, [fournisseur, dateCatalogue], rows);
    }
    return {
      rows,
      fournisseur
    }
  }
}

