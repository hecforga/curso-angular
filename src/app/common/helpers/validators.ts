import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { catchError, map, of } from 'rxjs';

import { Product } from 'src/app/product';
import { ProductService } from 'src/app/product.service';

export const forbiddenNameValidator = (nameRe: RegExp): ValidatorFn => (control) => {
  const forbidden = nameRe.test(control.value);
  return forbidden ? { forbiddenName: {value: control.value } } : null;
}

export const codeAndNameMatchValidator: ValidatorFn = (control) => {
  const code = control.get('code');
  const name = control.get('name');

  return code && name && code.value && name.value && (code.value as string).toLowerCase() === (name.value as string).toLowerCase() ? { codeAndNameMatch: true } : null;
};

export const validateIsNameTaken = (product: Product, productService: ProductService): AsyncValidatorFn => (control) => {
  return productService.isNameTaken(control.value, product).pipe(
    map(isTaken => (isTaken ? { uniqueName: true } : null)),
    catchError(() => of(null))
  );
}
