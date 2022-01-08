import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';

import { Product, ProductFilter } from '../product';
import { ProductService } from '../product.service';
import { PRODUCTS } from '../mock-products';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  products: Product[] = [];

  selectedProducts: Product[] = [];

  totalRecords = PRODUCTS.length;
  lazyLoadEvent!: LazyLoadEvent;

  defaultPotionFilter: ProductFilter = {
    name: '',
    category: ''
  };
  productFilter!: ProductFilter;

  categoryOptions = ['Monovolumen', 'SUV', 'Turismo', 'Deportivo', 'Berlina', 'Pick-up'];

  constructor(private productService: ProductService, private router: Router) {
    this.resetFilter();
  }

  loadProducts(event: LazyLoadEvent) {
    this.lazyLoadEvent = event;
    this.getProducts();
  }

  getProducts(): void {
    this.productService.getProducts(this.lazyLoadEvent, this.productFilter)
      .subscribe(products => this.products = products);
  }

  edit(product: Product): void {
    this.router.navigate(['detail', product.id]);
  }

  delete(product: Product): void {
    this.products = this.products.filter(h => h !== product);
    this.productService.deleteProduct(product.id).subscribe();
  }

  deleteSelectedProducts(): void {
    for (const product of this.selectedProducts) {
      this.delete(product);
    }
    this.selectedProducts = [];
  }

  filter(): void {
    this.getProducts();
  }

  clear(): void {
    this.resetFilter();
    this.getProducts();
  }

  getInventoryStatus(product: Product): string {
    return this.productService.getInventoryStatus(product);
  }

  private resetFilter(): void {
    this.productFilter =  { ...this.defaultPotionFilter };
  }

}
