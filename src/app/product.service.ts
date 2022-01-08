import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LazyLoadEvent } from 'primeng/api';

import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Product, ProductFilter } from './product';


@Injectable({ providedIn: 'root' })
export class ProductService {

  private productsUrl = 'api/products';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  /** GET products from the server */
  getProducts(lazyLoadEvent?: LazyLoadEvent, filter?: ProductFilter): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl)
      .pipe(
        map(products => (
          products.filter(product => {
            if (!filter) {
              return true;
            }

            if (filter.name && !product.name.toLowerCase().includes(filter.name.toLowerCase())) {
              return false;
            }
            if (filter.category && product.category !== filter.category) {
              return false;
            }
            return true;
          })
        )),
        map(products => {
          if (!lazyLoadEvent) {
            return products;
          }
          const auxProducts = [...products];
          auxProducts.sort((a, b) => {
            if ((a as Record<string, any>)[lazyLoadEvent.sortField!] > (b as Record<string, any>)[lazyLoadEvent.sortField!]) {
              return lazyLoadEvent.sortOrder!;
            }
            if ((a as Record<string, any>)[lazyLoadEvent.sortField!] < (b as Record<string, any>)[lazyLoadEvent.sortField!]) {
              return -1 * lazyLoadEvent.sortOrder!;
            }
            return 0;
          });
          return auxProducts.slice(lazyLoadEvent.first, lazyLoadEvent.first! + lazyLoadEvent.rows!);
        }),
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
    return this.http.get<Product>(url).pipe(
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
    return this.http.post<Product>(this.productsUrl, product, this.httpOptions).pipe(
      catchError(this.handleError<Product>('addProduct'))
    );
  }

  /** DELETE: delete the product from the server */
  deleteProduct(id: number): Observable<Product> {
    const url = `${this.productsUrl}/${id}`;

    return this.http.delete<Product>(url, this.httpOptions).pipe(
      catchError(this.handleError<Product>('deleteProduct'))
    );
  }

  /** PUT: update the product on the server */
  updateProduct(product: Product): Observable<any> {
    return this.http.put(this.productsUrl, product, this.httpOptions).pipe(
      catchError(this.handleError<any>('updateProduct'))
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
}
