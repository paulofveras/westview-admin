import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Material Imports
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

// Services & Models
import { FornecedorService } from '../services/fornecedor.service';
import { EnderecoService } from '../services/endereco.service';
import { Fornecedor } from '../models/pessoa.model';

@Component({
  selector: 'app-fornecedor-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule,
    MatStepperModule, 
    MatInputModule, 
    MatButtonModule, 
    MatFormFieldModule
  ],
  templateUrl: './fornecedor-form.html',
  styleUrls: ['./fornecedor-form.css']
})
export class FornecedorFormComponent implements OnInit {
  // Grupos separados para o Stepper
  empresaForm!: FormGroup;
  contatoForm!: FormGroup;
  
  isEditMode: boolean = false;
  fornecedorId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private fornecedorService: FornecedorService,
    private enderecoService: EnderecoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    // Grupo 1: Dados da Empresa
    this.empresaForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      nomeFantasia: [''],
      cnpj: ['', [Validators.required, Validators.minLength(14)]],
      email: ['', [Validators.email]]
    });

    // Grupo 2: Endereço e Telefone
    this.contatoForm = this.fb.group({
      endereco: this.fb.group({
        cep: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
        rua: ['', Validators.required],
        numero: ['', Validators.required]
      }),
      telefone: this.fb.group({
        codigoArea: ['', [Validators.required, Validators.pattern(/^\d{2}$/)]],
        numero: ['', Validators.required]
      })
    });

    // Carregar dados se for edição
    const fornecedor: Fornecedor = this.activatedRoute.snapshot.data['fornecedor'];
    if (fornecedor && fornecedor.id) {
      this.isEditMode = true;
      this.fornecedorId = fornecedor.id;

      this.empresaForm.patchValue({
        nome: fornecedor.nome,
        nomeFantasia: fornecedor.nomeFantasia,
        cnpj: fornecedor.cnpj,
        email: fornecedor.email
      });

      this.contatoForm.patchValue({
        endereco: fornecedor.endereco,
        telefone: fornecedor.telefone
      });
    }
  }

  buscarCep() {
    const enderecoGroup = this.contatoForm.get('endereco') as FormGroup;
    const cep = enderecoGroup.get('cep')?.value;

    if (cep && String(cep).length === 8) {
      // Feedback visual (opcional: desabilitar campo rua)
      
      this.enderecoService.consultarCep(cep).subscribe({
        next: (dados) => {
          if (!dados.erro) {
            enderecoGroup.patchValue({ rua: dados.logradouro });
            document.getElementById('numeroInputForn')?.focus();
          } else {
            alert('CEP não encontrado.');
          }
        },
        error: () => alert('Erro ao buscar CEP.')
      });
    }
  }

  salvar() {
    // Valida tudo antes de enviar
    if (this.empresaForm.invalid || this.contatoForm.invalid) {
      this.empresaForm.markAllAsTouched();
      this.contatoForm.markAllAsTouched();
      return;
    }

    // Junta os dados dos dois formulários em um objeto Fornecedor
    const fornecedor = {
      id: this.fornecedorId,
      ...this.empresaForm.value,
      ...this.contatoForm.value
    };

    const operacao = this.isEditMode
      ? this.fornecedorService.update(fornecedor)
      : this.fornecedorService.save(fornecedor);

    operacao.subscribe({
      next: () => this.router.navigateByUrl('/fornecedores/list'),
      error: (err) => {
        console.log('Erro ao salvar:', err);
        alert('Erro ao salvar fornecedor.');
      }
    });
  }

  excluir() {
    if (this.isEditMode && this.fornecedorId) {
      if (confirm(`Tem certeza que deseja excluir?`)) {
        this.fornecedorService.delete(this.fornecedorId).subscribe({
          next: () => this.router.navigateByUrl('/fornecedores/list'),
          error: (err) => console.log('Erro ao excluir:', err)
        });
      }
    }
  }
}