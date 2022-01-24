import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';

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

  constructor(private productService: ProductService, private router: Router, private confirmationService: ConfirmationService) {
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
    this.router.navigate(['products', 'detail-reactive', product.id]);
  }

  delete(product: Product, event?: Event): void {
    this.confirmationService.confirm({
      target: event?.target ? event.target : undefined,
      message: '¿Esta seguro de que desea eliminar este producto?',
      header: 'Confirmación de borrado',
      icon: 'pi pi-info-circle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.productService.deleteProduct(product.id!).subscribe(() => this.getProducts());
      },
    });
  }

  create(): void {
    this.router.navigate(['new']);
  }

  deleteSelectedProducts(event: Event): void {
    this.confirmationService.confirm({
      target: event.target ? event.target : undefined,
      message: '¿Esta seguro de que desea eliminar los productos seleccionados?',
      header: 'Confirmación de borrado',
      icon: 'pi pi-info-circle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        for (const product of this.selectedProducts) {
          this.delete(product);
        }
        this.selectedProducts = [];
      },
    });
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
