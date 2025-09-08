import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuadrinhoListComponent } from './quadrinho-list';

describe('QuadrinhoList', () => {
  let component: QuadrinhoListComponent; 
  let fixture: ComponentFixture<QuadrinhoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuadrinhoListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuadrinhoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
