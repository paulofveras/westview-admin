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

@Component({
  selector: 'app-quadrinho-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './quadrinho-form.html',
  styleUrls: ['./quadrinho-form.css']
})
export class QuadrinhoFormComponent implements OnInit, OnDestroy {

  formGroup: FormGroup;
  isEditMode: boolean = false;
  fornecedores: Fornecedor[] = [];
  materiais: Material[] = [];
  
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  private previewObjectUrl?: string;

  constructor(private formBuilder: FormBuilder,
              private quadrinhoService: QuadrinhoService,
              private fornecedorService: FornecedorService,
              private materialService: MaterialService, // Injete o serviço
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService) {

    const quadrinho: Quadrinho = this.activatedRoute.snapshot.data['quadrinho'];
    this.isEditMode = (quadrinho && quadrinho.id) ? true : false;

    if (this.isEditMode && quadrinho.nomeImagem) {
      this.loadExistingImage(quadrinho.nomeImagem);
    }

    this.formGroup = formBuilder.group({
      id: [quadrinho?.id],
      nome: [quadrinho?.nome, Validators.required],
      descricao: [quadrinho?.descricao, Validators.required],
      preco: [quadrinho?.preco, Validators.required],
      estoque: [quadrinho?.estoque, Validators.required],
      idFornecedor: [quadrinho?.fornecedor?.id, Validators.required],
      idMaterial: [quadrinho?.material?.id, Validators.required]
    });
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/login');
      return;
    }

    // Busca os fornecedores E os materiais quando o componente inicia
    this.fornecedorService.findAll().subscribe(data => {
      this.fornecedores = data;
    });

    this.materialService.findAll().subscribe(data => {
      this.materiais = data;
    });
  }
  
  ngOnDestroy(): void {
    this.revokePreviewUrl();
  }

  // O método salvar permanece o mesmo, pois o formGroup já inclui o idMaterial
  salvar() {
    if (this.formGroup.valid) {
      const quadrinho = this.formGroup.value;

      if (this.isEditMode) {
        this.quadrinhoService.update(quadrinho).subscribe({
          next: () => this.handlePostSave(quadrinho.id),
          error: (err) => console.log('Erro ao atualizar dados do quadrinho' + JSON.stringify(err))
        });
      } else {
        this.quadrinhoService.save(quadrinho).subscribe({
          next: (quadrinhoSalvo) => this.handlePostSave(quadrinhoSalvo?.id),
          error: (err) => console.log('Erro ao salvar dados do quadrinho' + JSON.stringify(err))
        });
      }
    }
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

  excluir() {
    if (this.isEditMode) {
      if (confirm('Tem certeza que deseja excluir este quadrinho?')) {
        const quadrinho = this.formGroup.value;
        this.quadrinhoService.delete(quadrinho).subscribe({
          next: () => this.router.navigateByUrl('/quadrinhos/list'),
          error: (err) => console.log('Erro ao Excluir' + JSON.stringify(err))
        });
      }
    }
  }

  private handlePostSave(idQuadrinho?: number): void {
    if (this.selectedFile && idQuadrinho) {
      this.quadrinhoService.uploadImagem(idQuadrinho, this.selectedFile.name, this.selectedFile)
        .subscribe({
          next: () => this.router.navigateByUrl('/quadrinhos/list'),
          error: (err) => console.log('Erro ao fazer upload da imagem', err)
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
      error: (err) => console.log('Erro ao carregar imagem do quadrinho', err)
    });
  }

  private revokePreviewUrl(): void {
    if (this.previewObjectUrl) {
      URL.revokeObjectURL(this.previewObjectUrl);
      this.previewObjectUrl = undefined;
    }
  }
}
