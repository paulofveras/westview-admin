import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { QuadrinhoService, Material, FornecedorResponseDTO, Quadrinho } from '../services/quadrinho';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, of, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-quadrinho-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './quadrinho-form.html',
  styleUrls: ['./quadrinho-form.css']
})
export class QuadrinhoFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  quadrinhoId: number | null = null;
  materiais: Material[] = [];
  fornecedores: FornecedorResponseDTO[] = [];
  mensagem: string = '';
  tipoMensagem: 'sucesso' | 'erro' = 'sucesso';
  imagemSelecionada: File | null = null;
  imageUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private service: QuadrinhoService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(60)]],
      descricao: ['', Validators.required],
      preco: [0, [Validators.required, Validators.min(0)]],
      quantPaginas: [0, [Validators.required, Validators.min(1)]],
      id_material: [null, Validators.required],
      id_fornecedor: [null, Validators.required],
      estoque: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    // Verificar se o usuário está autenticado
    if (!this.authService.hasToken()) {
      this.router.navigate(['/login']);
      return;
    }

    this.carregarMateriais();
    this.carregarFornecedores();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.quadrinhoId = +id;
      this.service.findById(this.quadrinhoId).subscribe({
        next: (data: Quadrinho) => {
          this.form.patchValue({
            ...data,
            id_material: data.material.id,
            id_fornecedor: data.fornecedor.id
            
          });
           if (data.nomeImagem) {
            this.imageUrl = this.service.getImageUrl(data.nomeImagem);
          }
        },
        error: (error: any) => {
          this.mostrarMensagem('Erro ao carregar quadrinho', 'erro');
        }
        
      });
    }
  }

  carregarMateriais(): void {
    this.http.get<Material[]>('http://localhost:8080/materiais')
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.mostrarMensagem('Sessão expirada. Faça login novamente.', 'erro');
            this.authService.logout();
            this.router.navigate(['/login']);
          } else {
            this.mostrarMensagem('Erro ao carregar materiais', 'erro');
          }
          return of([]);
        })
      )
      .subscribe({
        next: (data: Material[]) => this.materiais = data,
        error: (error: any) => {
          this.mostrarMensagem('Erro inesperado ao carregar materiais', 'erro');
        }
      });
  }

  carregarFornecedores(): void {
    this.http.get<FornecedorResponseDTO[]>('http://localhost:8080/fornecedores')
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.mostrarMensagem('Sessão expirada. Faça login novamente.', 'erro');
            this.authService.logout();
            this.router.navigate(['/login']);
          } else {
            this.mostrarMensagem('Erro ao carregar fornecedores', 'erro');
          }
          return of([]);
        })
      )
      .subscribe({
        next: (data: FornecedorResponseDTO[]) => this.fornecedores = data,
        error: (error: any) => {
          this.mostrarMensagem('Erro inesperado ao carregar fornecedores', 'erro');
        }
      });
  }

  // Novo método para capturar o arquivo selecionado
  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.imagemSelecionada = file;
      const reader = new FileReader();
      reader.onload = e => this.imageUrl = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const handleSuccess = (quadrinhoId: number, isEdit: boolean) => {
      const message = `Quadrinho ${isEdit ? 'atualizado' : 'criado'} com sucesso!`;
      
      if (this.imagemSelecionada) {
        this.service.uploadImagem(quadrinhoId, this.imagemSelecionada).subscribe({
          next: () => {
            this.mostrarMensagem(message);
            setTimeout(() => this.router.navigate(['/quadrinhos']), 1500);
          },
          error: () => {
            this.mostrarMensagem(`Dados salvos, mas falha ao enviar imagem.`, 'erro');
          }
        });
      } else {
        this.mostrarMensagem(message);
        setTimeout(() => this.router.navigate(['/quadrinhos']), 1500);
      }
    };

    const handleError = (error: HttpErrorResponse) => {
      if (error.status === 401) {
        this.mostrarMensagem('Sessão expirada. Faça login novamente.', 'erro');
        this.authService.logout();
        this.router.navigate(['/login']);
      } else {
        this.mostrarMensagem('Erro ao salvar dados do quadrinho', 'erro');
      }
    };

    if (this.isEditMode && this.quadrinhoId) {
      this.service.update(this.quadrinhoId, this.form.value).subscribe({
        next: () => handleSuccess(this.quadrinhoId!, true),
        error: handleError
      });
    } else {
      this.service.create(this.form.value).subscribe({
        next: (quadrinhoCriado) => handleSuccess(quadrinhoCriado.id, false),
        error: handleError
      });
    }
  }

  private mostrarMensagem(mensagem: string, tipo: 'sucesso' | 'erro' = 'sucesso'): void {
    this.mensagem = mensagem;
    this.tipoMensagem = tipo;
    setTimeout(() => this.mensagem = '', 3000);
  }
}