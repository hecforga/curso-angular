import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as moment from 'moment';

import { Product, ProductFromServer, ProductFilter } from './product';


@Injectable({ providedIn: 'root' })
export class ProductService {

  private productsUrl = 'http://localhost:8080/api/products';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  /** GET products from the server */
  getProducts(filter?: ProductFilter): Observable<Product[]> {
    let params = new HttpParams();
    if (filter && filter.name) {
      params = params.set('name.contains', filter.name);
    }
    if (filter && filter.category) {
      params = params.set('category.equals', filter.category);
    }

    return this.http.get<ProductFromServer[]>(this.productsUrl, { params })
      .pipe(
        map(products => products.map(product => this.convertFromServer(product))),
        catchError(this.handleError<Product[]>('getProducts', []))
      );
  }

  /** GET product by id. Return `undefined` when id not found */
  getProductNo404(id: number): Observable<Product> {
    const url = `${this.productsUrl}/?id=${id}`;
    return this.http.get<Product[]>(url)
      .pipe(
        map(products => products[0]), // returns a {0|1} element array
        catchError(this.handleError<Product>(`getProduct id=${id}`))
      );
  }

  /** GET product by id. Will 404 if id not found */
  getProduct(id: number): Observable<Product> {
    const url = `${this.productsUrl}/${id}`;
    return this.http.get<ProductFromServer>(url).pipe(
      map((product) => this.convertFromServer(product)),
      catchError(this.handleError<Product>(`getProduct id=${id}`))
    );
  }

  getInventoryStatus(product: Product): string {
    if (product.quantity < 1) {
      return 'OUTOFSTOCK';
    }
    if (product.quantity < 10) {
      return 'LOWSTOCK'
    }
    return 'INSTOCK';
  }

  /* GET products whose name contains search term */
  searchProducts(term: string): Observable<Product[]> {
    if (!term.trim()) {
      // if not search term, return empty product array.
      return of([]);
    }
    return this.http.get<Product[]>(`${this.productsUrl}/?name=${term}`).pipe(
      catchError(this.handleError<Product[]>('searchProducts', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new product to the server */
  addProduct(product: Product): Observable<Product> {
    const productFromServer = this.convertFromClient(product);
    return this.http.post<ProductFromServer>(this.productsUrl, productFromServer, this.httpOptions).pipe(
      map((p) => this.convertFromServer(p)),
      catchError(this.handleError<Product>('addProduct'))
    );
  }

  /** DELETE: delete the product from the server */
  deleteProduct(id: number): Observable<{}> {
    const url = `${this.productsUrl}/${id}`;

    return this.http.delete(url, this.httpOptions).pipe(
      catchError(this.handleError<{}>('deleteProduct'))
    );
  }

  /** PUT: update the product on the server */
  updateProduct(product: Product): Observable<Product> {
    const productFromServer = this.convertFromClient(product);
    return this.http.put<ProductFromServer>(`${this.productsUrl}/${product.id}`, productFromServer, this.httpOptions).pipe(
      map((p) => this.convertFromServer(p)),
      catchError(this.handleError<Product>('updateProduct'))
    );
  }

  isNameTaken(name: string, product: Product): Observable<boolean> {
    return this.getProducts().pipe(
      map((products) => {
        if (!product) {
          return products;
        }
        return products.filter((p) => p.id !== product.id);
      }),
      map((products) => products.filter((p) => p.name === name)),
      map((products) => products.length > 0)
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private convertFromServer(product: ProductFromServer): Product {
    return {
      ...product,
      extras: product.extras ? product.extras.split(',') : [],
      expiryDate: product.expiryDate ? moment(product.expiryDate) : undefined,
    };
  }

  private convertFromClient(product: Product): ProductFromServer {
    return {
      ...product,
      extras: product.extras.join(','),
      expiryDate: product.expiryDate ? product.expiryDate.toJSON() : undefined,
    };
  }
}
