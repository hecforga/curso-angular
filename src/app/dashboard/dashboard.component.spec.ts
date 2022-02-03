import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { addMatchers, asyncData, click } from '../../testing';
import { ProductService } from '../product.service';
import { PRODUCTS } from '../mock-products';

import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { AppModule } from '../app.module';

beforeEach(addMatchers);

let comp: DashboardComponent;
let fixture: ComponentFixture<DashboardComponent>;

////////  Deep  ////////////////

describe('DashboardComponent (deep)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({imports: [AppModule]});
  });

  compileAndCreate();

  tests(clickForDeep);

  function clickForDeep() {
    // get first <div class="product">
    const productEl: HTMLElement = fixture.nativeElement.querySelector('.product');
    click(productEl);
  }
});

////////  Shallow ////////////////

import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DashboardComponent (shallow)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule(
        {declarations: [DashboardComponent], schemas: [NO_ERRORS_SCHEMA]});
  });

  compileAndCreate();

  tests(clickForShallow);

  function clickForShallow() {
    // get first <product> DebugElement
    const productDe = fixture.debugElement.query(By.css('.product'));
    productDe.triggerEventHandler('click', comp.products[0]);
  }
});

/** Add TestBed providers, compile, and create DashboardComponent */
function compileAndCreate() {
  beforeEach(waitForAsync(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['getProducts']);

    TestBed
        .configureTestingModule({
          providers: [
            {provide: ProductService, useValue: productServiceSpy}, {provide: Router, useValue: routerSpy}
          ]
        })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(DashboardComponent);
          comp = fixture.componentInstance;

          // getProducts spy returns observable of test products
          productServiceSpy.getProducts.and.returnValue(asyncData(PRODUCTS));
        });
  }));
}

/**
 * The (almost) same tests for both.
 * Only change: the way that the first product is clicked
 */
function tests(productClick: () => void) {

  it('should NOT have products before ngOnInit', () => {
    expect(comp.products.length)
      .withContext('should not have products before ngOnInit')
      .toBe(0);
  });

  it('should NOT have products immediately after ngOnInit', () => {
    fixture.detectChanges();  // runs initial lifecycle hooks

    expect(comp.products.length)
      .withContext('should not have products until service promise resolves')
      .toBe(0);
  });

  describe('after get dashboard products', () => {
    let router: Router;

     // Trigger component so it gets products and binds to them
    beforeEach(waitForAsync(() => {
      router = fixture.debugElement.injector.get(Router);
      fixture.detectChanges(); // runs ngOnInit -> getProducts
      fixture.whenStable() // No need for the `lastPromise` hack!
        .then(() => fixture.detectChanges()); // bind to products
    }));

    it('should HAVE products', () => {
      expect(comp.products.length)
        .withContext('should have products after service promise resolves')
        .toBeGreaterThan(0);
    });

    it('should DISPLAY products', () => {
      // Find and examine the displayed products
      // Look for them in the DOM by css class
      const products = fixture.nativeElement.querySelectorAll('.product');
      expect(products.length)
        .withContext('should display 4 products')
        .toBe(4);
    });

    it('should tell ROUTER to navigate when product clicked', () => {
      productClick();  // trigger click on first inner <div class="product">

      // args passed to router.navigateByUrl() spy
      const spy = router.navigateByUrl as jasmine.Spy;
      const navArgs = spy.calls.first().args[0];

      // expecting to navigate to id of the component's first product
      const id = comp.products[0].id;
      expect(navArgs)
        .withContext('should nav to ProductDetail for first product')
        .toBe('/products/detail/' + id);
    });
  });
}
