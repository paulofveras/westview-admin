import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Quadrinho } from '../models/quadrinho.model';
import { Fornecedor } from '../models/pessoa.model';
import { Material } from '../models/material.model';
import { MaterialService } from '../services/material.service';
import { QuadrinhoService } from '../services/quadrinho.service';
import { FornecedorService } from '../services/fornecedor.service';
import { AuthService } from '../services/auth.service';

// Material Imports
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-quadrinho-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    MatStepperModule, MatInputModule, MatButtonModule, MatSelectModule, MatFormFieldModule
  ],
  templateUrl: './quadrinho-form.html',
  styleUrls: ['./quadrinho-form.css']
})
export class QuadrinhoFormComponent implements OnInit, OnDestroy {
  // Grupos para o Stepper
  basicoForm: FormGroup;
  detalhesForm: FormGroup; // Preço, Estoque, Páginas
  relacionamentoForm: FormGroup; // Fornecedor, Material
  
  isEditMode: boolean = false;
  quadrinhoId: number | null = null;
  
  fornecedores: Fornecedor[] = [];
  materiais: Material[] = [];
  
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  private previewObjectUrl?: string;

  constructor(
    private fb: FormBuilder,
    private quadrinhoService: QuadrinhoService,
    private fornecedorService: FornecedorService,
    private materialService: MaterialService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {
    // Grupo 1
    this.basicoForm = this.fb.group({
      nome: ['', Validators.required],
      descricao: ['', Validators.required]
    });

    // Grupo 2
    this.detalhesForm = this.fb.group({
      preco: [0, Validators.required],
      estoque: [0, Validators.required],
      quantPaginas: [0]
    });

    // Grupo 3
    this.relacionamentoForm = this.fb.group({
      idFornecedor: [null, Validators.required],
      idMaterial: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/login');
      return;
    }

    this.fornecedorService.findAll().subscribe(data => this.fornecedores = data);
    this.materialService.findAll().subscribe(data => this.materiais = data);

    const quadrinho: Quadrinho = this.activatedRoute.snapshot.data['quadrinho'];
    if (quadrinho && quadrinho.id) {
      this.isEditMode = true;
      this.quadrinhoId = quadrinho.id;

      this.basicoForm.patchValue({
        nome: quadrinho.nome,
        descricao: quadrinho.descricao
      });
      this.detalhesForm.patchValue({
        preco: quadrinho.preco,
        estoque: quadrinho.estoque,
        quantPaginas: quadrinho.quantPaginas
      });
      this.relacionamentoForm.patchValue({
        idFornecedor: quadrinho.fornecedor?.id,
        idMaterial: quadrinho.material?.id
      });

      if (quadrinho.nomeImagem) {
        this.loadExistingImage(quadrinho.nomeImagem);
      }
    }
  }
  
  ngOnDestroy(): void {
    this.revokePreviewUrl();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.revokePreviewUrl();
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  // --- CORREÇÃO AQUI ---
  salvar() {
    // Marca todos como tocados para mostrar erros se estiver inválido
    if (this.basicoForm.invalid || this.detalhesForm.invalid || this.relacionamentoForm.invalid) {
      this.basicoForm.markAllAsTouched();
      this.detalhesForm.markAllAsTouched();
      this.relacionamentoForm.markAllAsTouched();
      return;
    }

    const quadrinho = {
      id: this.quadrinhoId,
      ...this.basicoForm.value,
      ...this.detalhesForm.value,
      ...this.relacionamentoForm.value
    };

    if (this.isEditMode) {
      // Update retorna void, não tem 'res'
      this.quadrinhoService.update(quadrinho).subscribe({
        next: () => {
          // Se editou, já temos o ID
          this.handlePostSave(this.quadrinhoId!);
        },
        error: (err: any) => console.log('Erro ao atualizar', err)
      });
    } else {
      // Save retorna o Quadrinho com ID
      this.quadrinhoService.save(quadrinho).subscribe({
        next: (res: Quadrinho) => {
          this.handlePostSave(res.id);
        },
        error: (err: any) => console.log('Erro ao salvar', err)
      });
    }
  }
  // ---------------------

  private handlePostSave(idQuadrinho: number): void {
    if (this.selectedFile) {
      this.quadrinhoService.uploadImagem(idQuadrinho, this.selectedFile.name, this.selectedFile)
        .subscribe({
          next: () => this.router.navigateByUrl('/quadrinhos/list'),
          error: (err) => console.log('Erro imagem', err)
        });
    } else {
      this.router.navigateByUrl('/quadrinhos/list');
    }
  }

  private loadExistingImage(nomeImagem: string): void {
    this.quadrinhoService.downloadImagem(nomeImagem).subscribe({
      next: (blob) => {
        this.revokePreviewUrl();
        this.previewObjectUrl = URL.createObjectURL(blob);
        this.imagePreview = this.previewObjectUrl;
      },
      error: (err) => console.log('Erro img', err)
    });
  }

  private revokePreviewUrl(): void {
    if (this.previewObjectUrl) {
      URL.revokeObjectURL(this.previewObjectUrl);
      this.previewObjectUrl = undefined;
    }
  }

  excluir() {
      if (this.quadrinhoId && confirm('Excluir?')) {
          this.quadrinhoService.delete({ id: this.quadrinhoId } as Quadrinho).subscribe(() => {
              this.router.navigateByUrl('/quadrinhos/list');
          });
      }
  }
}
