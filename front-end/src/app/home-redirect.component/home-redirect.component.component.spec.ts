import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeRedirectComponentComponent } from './home-redirect.component.component';

describe('HomeRedirectComponentComponent', () => {
  let component: HomeRedirectComponentComponent;
  let fixture: ComponentFixture<HomeRedirectComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeRedirectComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeRedirectComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
