import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.getProducts();
  }

  goToDetail(product: Product) {
    const url = `/products/detail/${product.id}`;
    this.router.navigateByUrl(url);
  }

  private getProducts(): void {
    this.productService.getProducts()
      .subscribe(products => this.products = products.slice(1, 5));
  }
}
