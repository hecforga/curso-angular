import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product!: Product;

  categoryOptions = ['Monovolumen', 'SUV', 'Turismo', 'Deportivo', 'Berlina', 'Pick-up'];
  filteredCategoryOptions: string[] = [];

  extrasOptions = [
    { id: 1, name: 'Bluetooth' },
    { id: 2, name: 'Sensores de aparcamiento' },
    { id: 3, name: 'Cámara trasera' },
    { id: 4, name: 'Carga inalámbrica' }
  ];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getProduct();
  }

  filterCategory(query: string) {
    this.filteredCategoryOptions = this.categoryOptions.filter((categoryOption) => {
      return categoryOption.toLowerCase().includes(query.toLowerCase());
    });
  }

  addColor() {
    this.product.color = '#ffffff';
  }

  removeColor() {
    this.product.color = undefined;
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.product) {
      if (this.product.id) {
        this.productService.updateProduct(this.product)
          .subscribe(() => this.goBack());
      } else {
        this.productService.addProduct(this.product)
          .subscribe(() => this.goBack());
      }
    }
  }

  private getProduct(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.productService.getProduct(id)
      .subscribe(product => this.product = product);
  }
}
