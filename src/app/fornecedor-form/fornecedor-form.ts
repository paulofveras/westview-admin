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

  constructor(private formBuilder: FormBuilder,
              private fornecedorService: FornecedorService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {

    const fornecedor: Fornecedor = this.activatedRoute.snapshot.data['fornecedor'];

    // Estrutura do formulário agora espelha o DTO do backend
    this.formGroup = formBuilder.group({
      id: [(fornecedor && fornecedor.id) ? fornecedor.id : null],
      nome: [(fornecedor && fornecedor.nome) ? fornecedor.nome : '', Validators.required],
      nomeFantasia: [(fornecedor && fornecedor.nomeFantasia) ? fornecedor.nomeFantasia : ''],
      cnpj: [(fornecedor && fornecedor.cnpj) ? fornecedor.cnpj : '', Validators.required],
      email: [(fornecedor && fornecedor.email) ? fornecedor.email : ''],
      // Grupo para endereço
      endereco: formBuilder.group({
        cep: [(fornecedor && fornecedor.endereco.cep) ? fornecedor.endereco.cep : '', Validators.required],
        rua: [(fornecedor && fornecedor.endereco.rua) ? fornecedor.endereco.rua : '', Validators.required],
        numero: [(fornecedor && fornecedor.endereco.numero) ? fornecedor.endereco.numero : '', Validators.required]
      }),
      // Grupo para telefone
      telefone: formBuilder.group({
        codigoArea: [(fornecedor && fornecedor.telefone.codigoArea) ? fornecedor.telefone.codigoArea : '', Validators.required],
        numero: [(fornecedor && fornecedor.telefone.numero) ? fornecedor.telefone.numero : '', Validators.required]
      })
    });
  }

  salvar() {
    if (this.formGroup.valid) {
      const fornecedor = this.formGroup.value;
      if (fornecedor.id == null) {
        this.fornecedorService.save(fornecedor).subscribe({
          next: (fornecedorCadastrado) => {
            this.router.navigateByUrl('/fornecedores/list');
          },
          error: (err) => {
            console.log('Erro ao Incluir' + JSON.stringify(err));
          }
        });
      } else {
        this.fornecedorService.update(fornecedor).subscribe({
          next: (fornecedorAlterado) => {
            this.router.navigateByUrl('/fornecedores/list');
          },
          error: (err) => {
            console.log('Erro ao Editar' + JSON.stringify(err));
          }
        });
      }
    }
  }

  excluir() {
    if (this.formGroup.valid) {
      const fornecedor = this.formGroup.value;
      if (fornecedor.id != null) {
        this.fornecedorService.delete(fornecedor).subscribe({
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
