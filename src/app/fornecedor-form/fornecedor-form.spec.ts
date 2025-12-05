import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Para simular requisições
import { RouterTestingModule } from '@angular/router/testing'; // Para simular rotas
import { NoopAnimationsModule } from '@angular/platform-browser/animations'; // Para o MatStepper não quebrar

// O nome correto da classe é FornecedorFormComponent
import { FornecedorFormComponent } from './fornecedor-form'; 

describe('FornecedorFormComponent', () => {
  let component: FornecedorFormComponent;
  let fixture: ComponentFixture<FornecedorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FornecedorFormComponent, // O componente Standalone
        HttpClientTestingModule, // Módulo de teste para HTTP
        RouterTestingModule,     // Módulo de teste para Rotas
        NoopAnimationsModule     // Desabilita animações para testes
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FornecedorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});