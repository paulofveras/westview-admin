import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FornecedorService } from '../services/fornecedor.service';
import { EnderecoService } from '../services/endereco.service'; // Novo
import { Fornecedor } from '../models/pessoa.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fornecedor-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './fornecedor-form.html',
  styleUrl: './fornecedor-form.css'
})
export class FornecedorFormComponent implements OnInit { // Adicione 'implements OnInit'

  formGroup!: FormGroup; // Use ! para inicialização tardia
  isEditMode: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private fornecedorService: FornecedorService,
              private enderecoService: EnderecoService, // Injete
              private router: Router,
              private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    const fornecedor: Fornecedor = this.activatedRoute.snapshot.data['fornecedor'];
    this.isEditMode = !!(fornecedor && fornecedor.id);

    this.formGroup = this.formBuilder.group({
      id: [fornecedor?.id || null],
      nome: [fornecedor?.nome || '', [Validators.required, Validators.minLength(3)]],
      nomeFantasia: [fornecedor?.nomeFantasia || ''],
      cnpj: [fornecedor?.cnpj || '', [Validators.required, Validators.minLength(14)]], // Validação simples
      email: [fornecedor?.email || '', [Validators.email]],
      
      endereco: this.formBuilder.group({
        cep: [fornecedor?.endereco?.cep || '', [Validators.required, Validators.pattern(/^\d{8}$/)]],
        rua: [fornecedor?.endereco?.rua || '', Validators.required],
        numero: [fornecedor?.endereco?.numero || '', Validators.required]
      }),
      
      telefone: this.formBuilder.group({
        codigoArea: [fornecedor?.telefone?.codigoArea || '', [Validators.required, Validators.pattern(/^\d{2}$/)]],
        numero: [fornecedor?.telefone?.numero || '', Validators.required]
      })
    });
  }

  // --- Lógica de CEP ---
  buscarCep() {
    const cepControl = this.formGroup.get('endereco.cep');
    const cep = cepControl?.value;

    if (cep && String(cep).length === 8) {
      this.formGroup.get('endereco.rua')?.disable();

      this.enderecoService.consultarCep(cep).subscribe({
        next: (dados) => {
          if (!dados.erro) {
            this.formGroup.get('endereco')?.patchValue({
              rua: dados.logradouro
            });
            document.getElementById('numeroInputForn')?.focus();
          } else {
            alert('CEP não encontrado.');
          }
          this.formGroup.get('endereco.rua')?.enable();
        },
        error: () => {
          alert('Erro ao buscar CEP.');
          this.formGroup.get('endereco.rua')?.enable();
        }
      });
    }
  }

  salvar() {
    if (this.formGroup.valid) {
      this.formGroup.enable(); // Garante envio de campos desabilitados
      const fornecedor = this.formGroup.value;
      
      const operacao = this.isEditMode
        ? this.fornecedorService.update(fornecedor)
        : this.fornecedorService.save(fornecedor);

      operacao.subscribe({
        next: () => {
          this.router.navigateByUrl('/fornecedores/list');
        },
        error: (err) => {
          console.log('Erro ao salvar: ' + JSON.stringify(err));
          alert('Erro ao salvar fornecedor.');
        }
      });
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  excluir() {
    if (this.isEditMode) {
      const fornecedor = this.formGroup.value;
      if (confirm(`Tem certeza que deseja excluir "${fornecedor.nome}"?`)) {
        this.fornecedorService.delete(fornecedor.id).subscribe({
          next: () => this.router.navigateByUrl('/fornecedores/list'),
          error: (err) => console.log('Erro ao Excluir' + JSON.stringify(err))
        });
      }
    }
  }
}