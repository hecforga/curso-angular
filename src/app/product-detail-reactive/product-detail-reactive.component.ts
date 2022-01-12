import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder } from '@angular/forms';

import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-detail-reactive',
  templateUrl: './product-detail-reactive.component.html',
  styleUrls: [ './product-detail-reactive.component.css' ]
})
export class ProductDetailReactiveComponent implements OnInit {
  product!: Product;

  editForm = this.fb.group({
    name: [],
    description: [{ value: undefined, disabled: true }],
    category: [],
    rating: [],
    price: [],
    quantity: [],
  });

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private location: Location,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getProduct();

    this.manageNameChanges();
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.product) {
      this.productService.updateProduct(this.createFromForm())
        .subscribe(() => this.goBack());
    }
  }

  private getProduct(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.productService.getProduct(id)
      .subscribe(product => {
        this.product = product;
        this.updateForm(product);
      });
  }

  private updateForm(product: Product): void {
    this.editForm.patchValue({
      name: product.name,
      description: product.description,
      category: product.category,
      rating: product.rating,
      price: product.price,
      quantity: product.quantity,
    });
  }

  private manageNameChanges() {
    this.editForm.get(['name'])!.valueChanges.subscribe((value) => {
      if (value) {
        this.editForm.get(['description'])!.enable();
      } else {
        this.editForm.get(['description'])!.disable();
        this.editForm.patchValue({
          description: undefined,
        });
      }
    });
  }

  private createFromForm(): Product {
    return {
      ...this.product,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      category: this.editForm.get(['category'])!.value,
      rating: this.editForm.get(['rating'])!.value,
      price: this.editForm.get(['price'])!.value,
      quantity: this.editForm.get(['quantity'])!.value,
    };
  }
}
