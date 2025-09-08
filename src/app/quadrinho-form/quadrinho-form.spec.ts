import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuadrinhoFormComponent } from './quadrinho-form';

describe('QuadrinhoForm', () => {
  let component: QuadrinhoFormComponent;
  let fixture: ComponentFixture<QuadrinhoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuadrinhoFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuadrinhoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
