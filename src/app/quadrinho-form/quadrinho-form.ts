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

  // Adicionando as propriedades que estavam faltando no seu .ts
  formGroup: FormGroup; // O nome correto que estamos usando é 'formGroup'
  isEditMode: boolean = false;
  fornecedores: Fornecedor[] = [];
  
  // Propriedades para upload de imagem
  selectedFile: File | null = null;
  imageUrl: string | ArrayBuffer | null = null;

  constructor(private formBuilder: FormBuilder,
              private quadrinhoService: QuadrinhoService,
              private fornecedorService: FornecedorService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService) {

    const quadrinho: Quadrinho = this.activatedRoute.snapshot.data['quadrinho'];
    
    // Define se estamos no modo de edição
    this.isEditMode = (quadrinho && quadrinho.id) ? true : false;

    this.formGroup = formBuilder.group({
      id: [(quadrinho && quadrinho.id) ? quadrinho.id : null],
      nome: [(quadrinho && quadrinho.nome) ? quadrinho.nome : '', Validators.required],
      descricao: [(quadrinho && quadrinho.descricao) ? quadrinho.descricao : '', Validators.required],
      preco: [(quadrinho && quadrinho.preco) ? quadrinho.preco : '', Validators.required],
      estoque: [(quadrinho && quadrinho.estoque) ? quadrinho.estoque : '', Validators.required],
      idFornecedor: [(quadrinho && quadrinho.fornecedor) ? quadrinho.fornecedor.id : null, Validators.required]
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
      const operacao = quadrinho.id == null 
        ? this.quadrinhoService.save(quadrinho)
        : this.quadrinhoService.update(quadrinho);

      operacao.subscribe({
        next: () => {
          this.router.navigateByUrl('/quadrin hos/list');
        },
        error: (err) => {
          console.log('Erro ao salvar' + JSON.stringify(err));
        }
      });
    }
  }

  excluir() {
    const quadrinho = this.formGroup.value;
    if (quadrinho.id != null) {
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

  // Método para lidar com a seleção de arquivo
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = e => this.imageUrl = reader.result;
      reader.readAsDataURL(this.selectedFile);
    }
  }
}