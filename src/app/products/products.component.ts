import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { combineLatest, Subscription, timer } from 'rxjs';

import { Product, ProductFilter } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];

  selectedProducts: Product[] = [];

  totalRecords = 0;
  lazyLoadEvent!: LazyLoadEvent;

  defaultProductFilter: ProductFilter = {
    name: '',
    category: ''
  };
  productFilter!: ProductFilter;

  categoryOptions = ['Monovolumen', 'SUV', 'Turismo', 'Deportivo', 'Berlina', 'Pick-up'];

  refreshIntervalOptions = [{
    value: 5000,
    label: 'Refrescar cada 5 segundos'
  }, {
    value: 10000,
    label: 'Refrescar cada 10 segundos'
  }, {
    value: 30000,
    label: 'Refrescar cada 30 segundos'
  }];
  refreshInterval = 5000;
  refreshIntervalSubscription!: Subscription;

  constructor(private productService: ProductService, private router: Router, private confirmationService: ConfirmationService) {
    this.resetFilter();
  }

  ngOnInit(): void {
    this.refreshIntervalSubscription = timer(this.refreshInterval, this.refreshInterval).subscribe(() => {
      this.getProducts();
    });
  }

  ngOnDestroy(): void {
    this.refreshIntervalSubscription.unsubscribe();
  }

  onRefreshIntervalChange(refreshInterval: number): void {
    this.refreshInterval = refreshInterval;
    this.refreshIntervalSubscription.unsubscribe();
    this.refreshIntervalSubscription = timer(0, this.refreshInterval).subscribe(() => {
      this.getProducts();
    });
  }

  loadProducts(event: LazyLoadEvent) {
    this.lazyLoadEvent = event;
    this.getProducts();
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

  private getProducts(): void {
    combineLatest([
      this.productService.getProducts(this.lazyLoadEvent, this.productFilter),
      this.productService.getProductsCount(this.productFilter),
    ]).subscribe(([products, productsCount]) => {
      this.totalRecords = productsCount;
      this.products = products;
    });
  }

  private resetFilter(): void {
    this.productFilter =  { ...this.defaultProductFilter };
  }
}
