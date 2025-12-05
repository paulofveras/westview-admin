import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

// Imports do Angular Material
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // Novo import

// --- IMPORTS CORRIGIDOS AQUI ---
import { CartItem, CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { PedidoService, PedidoDTO } from '../services/pedido.service';
import { Quadrinho } from '../models/quadrinho.model'; 
import { BoletoDialogComponent } from './boleto-dialog.component';
// -------------------------------
@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule // Novo
  ],
  templateUrl: './carrinho.html', 
  styleUrls: ['./carrinho.css']
})
export class CarrinhoComponent implements OnInit, OnDestroy {
  items: CartItem[] = [];
  total = 0;
  totalItens = 0;
  
  idPagamentoSelecionado: number = 1; 
  isProcessing = false; 
  compraRealizada = false; 

  // Pix
  tempoPixRestante = 10; // 10 segundos para demonstração rápida!
  displayTempoPix = '00:10';
  pixInterval: any;
  statusPix = 'Aguardando pagamento...';

  cardForm: FormGroup;
  readonly placeholderImage = 'assets/images/placeholder-comic.svg';
  private subscription = new Subscription();

  constructor(
    private cartService: CartService,
    private pedidoService: PedidoService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog // Injeção do Dialog
  ) {
    this.cardForm = this.fb.group({
      numero: ['', [Validators.required, Validators.minLength(16)]],
      nome: ['', Validators.required],
      validade: ['', Validators.required],
      cvv: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    this.subscription.add(
      this.cartService.items$.subscribe(items => {
        this.items = items;
        this.atualizarTotais();
      })
    );
    
    // Inicia o timer se já começar no Pix
    if (this.idPagamentoSelecionado === 1) this.iniciarTimerPix();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.pararTimerPix();
  }

  // ... (Métodos getUrlImagem, handleImageError, adicionarAoCarrinho, remover... iguais ao anterior) ...
  getUrlImagem(nomeImagem?: string): string {
    if (!nomeImagem) return this.placeholderImage;
    return `http://localhost:8080/quadrinhos/image/download/${nomeImagem}`;
  }
  handleImageError(event: any): void { event.target.src = this.placeholderImage; }
  adicionarAoCarrinho(quadrinho: Quadrinho): void { this.cartService.addItem(quadrinho); }
  remover(id: number) { this.cartService.removeItem(id); }
  removerTudo(id: number) { this.cartService.deleteItem(id); }
  limpar() { this.cartService.clear(); }
  // ...

  onPagamentoChange() {
    this.pararTimerPix();
    if (this.idPagamentoSelecionado === 1) {
      this.iniciarTimerPix();
    }
  }

  iniciarTimerPix() {
    this.tempoPixRestante = 10; // 10s para o professor ver
    this.statusPix = 'Aguardando confirmação do banco...';
    
    this.pixInterval = setInterval(() => {
      this.tempoPixRestante--;
      const min = Math.floor(this.tempoPixRestante / 60);
      const sec = this.tempoPixRestante % 60;
      this.displayTempoPix = `${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`;
      
      if (this.tempoPixRestante <= 0) {
        this.pararTimerPix();
        this.statusPix = 'Pagamento Confirmado! Redirecionando...';
        // Simula redirecionamento automático
        setTimeout(() => this.finalizarCompra(true), 1000); 
      }
    }, 1000);
  }

  pararTimerPix() {
    if (this.pixInterval) clearInterval(this.pixInterval);
  }

  abrirBoleto() {
    const dialogRef = this.dialog.open(BoletoDialogComponent, {
      width: '700px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // Se o usuário clicou em "Simular Pagamento" no modal
        this.isProcessing = true;
        setTimeout(() => this.finalizarCompra(true), 1500);
      }
    });
  }

  // Flag 'automatico' para pular validações de botão manual
  finalizarCompra(automatico = false): void {
    if (!this.authService.isLoggedIn()) {
      alert('Faça login para continuar.');
      this.router.navigate(['/login']);
      return;
    }
    
    // Se for cartão e não for automático, valida form
    if (this.idPagamentoSelecionado === 3 && !automatico && this.cardForm.invalid) {
      this.cardForm.markAllAsTouched();
      return;
    }

    const usuario = this.authService.getUsuarioLogado();
    if (!usuario || !usuario.id) return;

    this.isProcessing = true;

    const pedidoDTO: PedidoDTO = {
      idCliente: usuario.id,
      idPagamento: this.idPagamentoSelecionado === 4 ? 1 : this.idPagamentoSelecionado, // Exemplo usa ID 1 (Pix) pro backend nao quebrar
      itens: this.items.map(item => ({
        quantidade: item.quantity,
        desconto: 0.0,
        idQuadrinho: item.quadrinho.id
      }))
    };

    // Simula delay de processamento
    setTimeout(() => {
      this.pedidoService.save(pedidoDTO).subscribe({
        next: () => {
          this.isProcessing = false;
          this.compraRealizada = true;
          this.cartService.clear();
        },
        error: (err) => {
          console.error(err);
          this.isProcessing = false;
          alert('Erro na transação.');
        }
      });
    }, 1500);
  }

  voltarLoja() {
    this.router.navigate(['/loja']);
  }
  
  private atualizarTotais(): void {
    this.totalItens = this.items.reduce((total, item) => total + item.quantity, 0);
    this.total = this.items.reduce((total, item) => total + item.quadrinho.preco * item.quantity, 0);
  }
}