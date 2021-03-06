import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Product, ProductFilter } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];

  selectedProducts: Product[] = [];

  defaultPotionFilter: ProductFilter = {
    name: '',
    category: ''
  };
  productFilter!: ProductFilter;

  categoryOptions = ['Monovolumen', 'SUV', 'Turismo', 'Deportivo', 'Berlina', 'Pick-up'];

  constructor(private productService: ProductService, private router: Router) {
    this.resetFilter();
  }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.productService.getProducts(this.productFilter)
      .subscribe(products => this.products = products);
  }

  edit(product: Product): void {
    this.router.navigate(['detail-reactive', product.id]);
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
