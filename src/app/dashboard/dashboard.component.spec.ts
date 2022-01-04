import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { HeroSearchComponent } from '../hero-search/hero-search.component';
import { ProductService } from '../product.service';
import { PRODUCTS } from '../mock-products';

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let productService;
  let getProductsSpy: jasmine.Spy;

  beforeEach(waitForAsync(() => {
    productService = jasmine.createSpyObj('ProductService', ['getProducts']);
    getProductsSpy = productService.getProducts.and.returnValue(of(PRODUCTS));
    TestBed
        .configureTestingModule({
          declarations: [DashboardComponent, HeroSearchComponent],
          imports: [RouterTestingModule.withRoutes([])],
          providers: [{provide: ProductService, useValue: productService}]
        })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should display "Top Coches" as headline', () => {
    expect(fixture.nativeElement.querySelector('h2').textContent).toEqual('Top Coches');
  });

  it('should call productService', waitForAsync(() => {
       expect(getProductsSpy.calls.any()).toBe(true);
     }));

  it('should display 4 links', waitForAsync(() => {
       expect(fixture.nativeElement.querySelectorAll('a').length).toEqual(4);
     }));
});
