import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Quadrinho } from '../models/quadrinho.model';
import { Fornecedor } from '../models/pessoa.model';
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
export class QuadrinhoFormComponent implements OnInit {

  formGroup: FormGroup;
  isEditMode: boolean = false;
  fornecedores: Fornecedor[] = [];
  
  selectedFile: File | null = null;
  imageUrl: string | ArrayBuffer | null = null;

  constructor(private formBuilder: FormBuilder,
              private quadrinhoService: QuadrinhoService,
              private fornecedorService: FornecedorService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService) {

    // Pegamos o objeto 'quadrinho' que o nosso resolver preparou.
    const quadrinho: Quadrinho = this.activatedRoute.snapshot.data['quadrinho'];

    // Se o quadrinho tem um ID, então estamos no modo de edição.
    this.isEditMode = (quadrinho && quadrinho.id) ? true : false;

    this.formGroup = formBuilder.group({
      // Populamos o formulário com os dados do 'quadrinho' resolvido.
      id: [quadrinho?.id],
      nome: [quadrinho?.nome, Validators.required],
      descricao: [quadrinho?.descricao, Validators.required],
      preco: [quadrinho?.preco, Validators.required],
      estoque: [quadrinho?.estoque, Validators.required],
      // No modo de edição, o ID do fornecedor já vem pré-selecionado.
      idFornecedor: [quadrinho?.fornecedor?.id, Validators.required]
    });
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/login');
      return;
    }

    this.fornecedorService.findAll().subscribe(data => {
      this.fornecedores = data;
    });
  }

  salvar() {
    if (this.formGroup.valid) {
      const quadrinho = this.formGroup.value;
      const operacao = this.isEditMode
        ? this.quadrinhoService.update(quadrinho)
        : this.quadrinhoService.save(quadrinho);

      operacao.subscribe({
        next: () => {
          this.router.navigateByUrl('/quadrinhos/list');
        },
        error: (err) => {
          console.log('Erro ao salvar' + JSON.stringify(err));
        }
      });
    }
  }

  excluir() {
    if (this.isEditMode) {
      const quadrinho = this.formGroup.value;
      this.quadrinhoService.delete(quadrinho).subscribe({
        next: () => {
          this.router.navigateByUrl('/quadrinhos/list');
        },
        error: (err) => {
          console.log('Erro ao Excluir' + JSON.stringify(err));
        }
      });
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = e => this.imageUrl = reader.result;
      reader.readAsDataURL(this.selectedFile);
    }
  }
}