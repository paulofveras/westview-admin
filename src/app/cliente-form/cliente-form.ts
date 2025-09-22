import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClienteService } from '../services/cliente.service';
import { Cliente } from '../models/pessoa.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './cliente-form.html',
  styleUrl: './cliente-form.css'
})
export class ClienteFormComponent {

  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private clienteService: ClienteService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {

    const cliente: Cliente = this.activatedRoute.snapshot.data['cliente'];

    this.formGroup = formBuilder.group({
      id: [(cliente && cliente.id) ? cliente.id : null],
      nome: [(cliente && cliente.nome) ? cliente.nome : '', Validators.required],
      cpf: [(cliente && cliente.cpf) ? cliente.cpf : '', Validators.required],
      email: [(cliente && cliente.email) ? cliente.email : ''],
      username: [(cliente && cliente.username) ? cliente.username : '', Validators.required],
      senha: ['', Validators.required],
      endereco: formBuilder.group({
        cep: [(cliente && cliente.endereco.cep) ? cliente.endereco.cep : '', Validators.required],
        rua: [(cliente && cliente.endereco.rua) ? cliente.endereco.rua : '', Validators.required],
        numero: [(cliente && cliente.endereco.numero) ? cliente.endereco.numero : '', Validators.required]
      }),
      telefone: formBuilder.group({
        codigoArea: [(cliente && cliente.telefone.codigoArea) ? cliente.telefone.codigoArea : '', Validators.required],
        numero: [(cliente && cliente.telefone.numero) ? cliente.telefone.numero : '', Validators.required]
      })
    });
  }

  salvar() {
    if (this.formGroup.valid) {
      const cliente = this.formGroup.value;
      if (cliente.id == null) {
        this.clienteService.save(cliente).subscribe({
          next: (clienteCadastrado) => {
            this.router.navigateByUrl('/clientes/list');
          },
          error: (err) => {
            console.log('Erro ao Incluir' + JSON.stringify(err));
          }
        });
      } else {
        this.clienteService.update(cliente).subscribe({
          next: (clienteAlterado) => {
            this.router.navigateByUrl('/clientes/list');
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
      const cliente = this.formGroup.value;
      if (cliente.id != null) {
        this.clienteService.delete(cliente).subscribe({
          next: () => {
            this.router.navigateByUrl('/clientes/list');
          },
          error: (err) => {
            console.log('Erro ao Excluir' + JSON.stringify(err));
          }
        });
      }
    }
  }
}