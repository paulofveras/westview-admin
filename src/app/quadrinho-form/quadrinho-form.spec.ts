import { ComponentFixture, TestBed } from '@angular/core/testing';

// CORREÇÃO: Importe diretamente do arquivo .ts (sem a extensão)
import { QuadrinhoFormComponent } from './quadrinho-form'; 

// Se o seu arquivo se chama quadrinho-form.ts, o import acima está correto.
// Mas precisamos garantir que o TestBed configure os imports corretamente.

// Importe os módulos necessários para o teste funcionar (HttpClient, Router, etc)
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations'; // Para o MatStepper não quebrar no teste

describe('QuadrinhoFormComponent', () => { // Nome da classe
  let component: QuadrinhoFormComponent;
  let fixture: ComponentFixture<QuadrinhoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        QuadrinhoFormComponent, // Componente Standalone vai aqui
        HttpClientTestingModule, // Mock do HttpClient
        RouterTestingModule, // Mock do Router
        NoopAnimationsModule // Mock das animações do Material
      ]
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
