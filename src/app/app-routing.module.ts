import { Injectable, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterModule, Routes } from '@angular/router';
import { EMPTY, mergeMap, Observable, of } from 'rxjs';

import { Product } from './product';
import { ProductService } from './product.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductsComponent } from './products/products.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductDetailReactiveComponent } from './product-detail-reactive/product-detail-reactive.component';

@Injectable({ providedIn: 'root' })
export class ProductResolve implements Resolve<Product> {
  constructor(private service: ProductService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Product> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.getProduct(id).pipe(
        mergeMap((product) => {
          if (product) {
            return of(product);
          } else {
            this.router.navigate(['/']);
            return EMPTY;
          }
        })
      );
    }
    return of({
      extras: [],
    });
  }
}

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'detail/:id', component: ProductDetailComponent },
  {
    path: 'detail-reactive/:id',
    component: ProductDetailReactiveComponent,
    resolve: {
      product: ProductResolve,
    },
  },
  {
    path: 'new',
    component: ProductDetailReactiveComponent,
    resolve: {
      product: ProductResolve,
    },
  },
  { path: 'products', component: ProductsComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
