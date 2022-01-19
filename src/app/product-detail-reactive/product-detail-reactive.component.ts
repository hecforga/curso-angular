import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';

import { Product } from '../product';
import { ProductService } from '../product.service';
import { forbiddenNameValidator, codeAndNameMatchValidator, validateIsNameTaken } from '../common/helpers/validators';

@Component({
  selector: 'app-product-detail-reactive',
  templateUrl: './product-detail-reactive.component.html',
  styleUrls: [ './product-detail-reactive.component.css' ]
})
export class ProductDetailReactiveComponent implements OnInit {
  product!: Product;

  editForm = this.fb.group({
    code: [undefined, [Validators.required]],
    name: [undefined, [Validators.required, forbiddenNameValidator(/bob/i)]],
    description: [{ value: undefined, disabled: true }, [Validators.pattern('[a-zA-Z \-.]*')]],
    expiryDate: [],
    category: [],
    rating: [],
    price: [undefined, [Validators.min(10000), Validators.max(20000)]],
    quantity: [undefined, [Validators.min(0), Validators.max(100)]],
    accept: [false, [Validators.requiredTrue]],
  }, { validators: codeAndNameMatchValidator });

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

        this.editForm.get(['name'])!.addAsyncValidators(validateIsNameTaken(this.product, this.productService));
      });
  }

  private updateForm(product: Product): void {
    this.editForm.patchValue({
      code: product.code,
      name: product.name,
      description: product.description,
      expiryDate: product.expiryDate?.toDate(),
      category: product.category,
      rating: product.rating,
      price: product.price,
      quantity: product.quantity,
      accept: product.accept,
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
      code: this.editForm.get(['code'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      category: this.editForm.get(['category'])!.value,
      rating: this.editForm.get(['rating'])!.value,
      price: this.editForm.get(['price'])!.value,
      quantity: this.editForm.get(['quantity'])!.value,
      accept: this.editForm.get(['accept'])!.value,
      expiryDate: this.editForm.get(['expiryDate'])!.value ? moment(this.editForm.get(['expiryDate'])!.value) : undefined,
    };
  }
}
