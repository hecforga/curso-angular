import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';

import { Product } from '../product';
import { ProductService } from '../product.service';
import { JhiDataUtils } from '../data-util.service';
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
    description: [undefined, [Validators.required, Validators.pattern('[a-zA-Z \-.]*')]],
    expiryDate: [],
    category: [undefined, [Validators.required]],
    rating: [undefined, [Validators.required]],
    price: [undefined, [Validators.required, Validators.min(10000), Validators.max(20000)]],
    quantity: [undefined, [Validators.required, Validators.min(0), Validators.max(100)]],
    image: [null, [Validators.required]],
    imageContentType: [],
    accept: [false, [Validators.requiredTrue]],
  }, { validators: codeAndNameMatchValidator });

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private location: Location,
    private fb: FormBuilder,
    private elementRef: ElementRef,
    private dataUtils: JhiDataUtils
  ) {}

  ngOnInit(): void {
    this.getProduct();

    this.manageNameChanges();
  }

  setFileData(event: any, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe();
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (this.elementRef && idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.product.id) {
      this.productService.updateProduct(this.createFromForm())
        .subscribe((product) => this.manageSaveResponse(product));
    } else {
      this.productService.addProduct(this.createFromForm())
        .subscribe((product) => this.manageSaveResponse(product));
    }
  }

  private getProduct(): void {
    this.route.data.subscribe(({ product }) => {
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
      image: product.image,
      imageContentType: product.imageContentType,
      accept: product.accept,
    });
  }

  private manageNameChanges() {
    if (!this.editForm.get(['name'])!.value) {
      this.editForm.get(['description'])!.disable();
    }

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
      image: this.editForm.get(['image'])!.value,
      imageContentType: this.editForm.get(['imageContentType'])!.value,
      rating: this.editForm.get(['rating'])!.value,
      price: this.editForm.get(['price'])!.value,
      quantity: this.editForm.get(['quantity'])!.value,
      accept: this.editForm.get(['accept'])!.value,
      expiryDate: this.editForm.get(['expiryDate'])!.value ? moment(this.editForm.get(['expiryDate'])!.value) : undefined,
    };
  }

  private manageSaveResponse(product: Product): void {
    if (product) {
      this.goBack();
    }
  }
}
