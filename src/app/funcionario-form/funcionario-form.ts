import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FuncionarioService } from '../services/funcionario.service';
import { Funcionario } from '../models/pessoa.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-funcionario-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './funcionario-form.html',
  styleUrl: './funcionario-form.css'
})
export class FuncionarioFormComponent {

  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private funcionarioService: FuncionarioService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {

    const funcionario: Funcionario = this.activatedRoute.snapshot.data['funcionario'];

    this.formGroup = formBuilder.group({
      id: [(funcionario && funcionario.id) ? funcionario.id : null],
      nome: [(funcionario && funcionario.nome) ? funcionario.nome : '', Validators.required],
      cpf: [(funcionario && funcionario.cpf) ? funcionario.cpf : '', Validators.required],
      cargo: [(funcionario && funcionario.cargo) ? funcionario.cargo : '', Validators.required],
      email: [(funcionario && funcionario.email) ? funcionario.email : ''],
      username: [(funcionario && funcionario.username) ? funcionario.username : '', Validators.required],
      senha: ['', Validators.required],
      endereco: formBuilder.group({
        cep: [(funcionario && funcionario.endereco.cep) ? funcionario.endereco.cep : '', Validators.required],
        rua: [(funcionario && funcionario.endereco.rua) ? funcionario.endereco.rua : '', Validators.required],
        numero: [(funcionario && funcionario.endereco.numero) ? funcionario.endereco.numero : '', Validators.required]
      }),
      telefone: formBuilder.group({
        codigoArea: [(funcionario && funcionario.telefone.codigoArea) ? funcionario.telefone.codigoArea : '', Validators.required],
        numero: [(funcionario && funcionario.telefone.numero) ? funcionario.telefone.numero : '', Validators.required]
      })
    });
  }

  salvar() {
    if (this.formGroup.valid) {
      const funcionario = this.formGroup.value;
      if (funcionario.id == null) {
        this.funcionarioService.save(funcionario).subscribe({
          next: (funcionarioCadastrado) => {
            this.router.navigateByUrl('/funcionarios/list');
          },
          error: (err) => {
            console.log('Erro ao Incluir' + JSON.stringify(err));
          }
        });
      } else {
        this.funcionarioService.update(funcionario).subscribe({
          next: (funcionarioAlterado) => {
            this.router.navigateByUrl('/funcionarios/list');
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
      const funcionario = this.formGroup.value;
      if (funcionario.id != null) {
        this.funcionarioService.delete(funcionario).subscribe({
          next: () => {
            this.router.navigateByUrl('/funcionarios/list');
          },
          error: (err) => {
            console.log('Erro ao Excluir' + JSON.stringify(err));
          }
        });
      }
    }
  }
}
