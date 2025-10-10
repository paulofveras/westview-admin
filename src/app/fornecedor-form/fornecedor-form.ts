import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FornecedorService } from '../services/fornecedor.service';
import { Fornecedor } from '../models/pessoa.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fornecedor-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './fornecedor-form.html',
  styleUrl: './fornecedor-form.css'
})
export class FornecedorFormComponent {

  formGroup: FormGroup;
  isEditMode: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private fornecedorService: FornecedorService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {

    const fornecedor: Fornecedor = this.activatedRoute.snapshot.data['fornecedor'];
    this.isEditMode = !!(fornecedor && fornecedor.id); // Forma mais segura de verificar

    // Estrutura do formulário agora espelha o DTO do backend de forma segura
    this.formGroup = formBuilder.group({
      id: [fornecedor?.id || null],
      nome: [fornecedor?.nome || '', Validators.required],
      nomeFantasia: [fornecedor?.nomeFantasia || ''],
      cnpj: [fornecedor?.cnpj || '', Validators.required],
      email: [fornecedor?.email || ''],
      // Grupo para endereço com verificação de existência
      endereco: formBuilder.group({
        cep: [fornecedor?.endereco?.cep || '', Validators.required],
        rua: [fornecedor?.endereco?.rua || '', Validators.required],
        numero: [fornecedor?.endereco?.numero || '', Validators.required]
      }),
      // Grupo para telefone com verificação de existência
      telefone: formBuilder.group({
        codigoArea: [fornecedor?.telefone?.codigoArea || '', Validators.required],
        numero: [fornecedor?.telefone?.numero || '', Validators.required]
      })
    });
  }

  salvar() {
    if (this.formGroup.valid) {
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
        }
      });
    }
  }

  excluir() {
    if (this.isEditMode) {
      const fornecedor = this.formGroup.value;
      if (confirm(`Tem certeza que deseja excluir o fornecedor "${fornecedor.nome}"?`)) {
        this.fornecedorService.delete(fornecedor.id).subscribe({
          next: () => {
            this.router.navigateByUrl('/fornecedores/list');
          },
          error: (err) => {
            console.log('Erro ao Excluir' + JSON.stringify(err));
          }
        });
      }
    }
  }
}