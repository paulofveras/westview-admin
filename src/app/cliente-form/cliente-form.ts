import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Cliente } from '../models/pessoa.model';
import { ClienteService } from '../services/cliente.service';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './cliente-form.html',
  styleUrl: './cliente-form.css'
})
export class ClienteFormComponent implements OnInit {
  formGroup!: FormGroup;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const cliente: Cliente | undefined = this.route.snapshot.data['cliente'];
    this.isEdit = !!cliente && !!cliente.id;

    const username = cliente?.username ?? cliente?.usuario?.username ?? '';

    this.formGroup = this.fb.group({
      id: [cliente?.id ?? null],
      nome: [cliente?.nome ?? '', [Validators.required, Validators.minLength(2)]],
      cpf: [cliente?.cpf ?? '', [Validators.required, Validators.minLength(11)]],
      email: [cliente?.email ?? '', [Validators.email]],
      username: [username, [Validators.required, Validators.minLength(3)]],
      senha: ['', Validators.required],
      endereco: this.fb.group({
        cep: [cliente?.endereco?.cep ?? '', Validators.required],
        rua: [cliente?.endereco?.rua ?? '', Validators.required],
        numero: [cliente?.endereco?.numero ?? '', Validators.required]
      }),
      telefone: this.fb.group({
        codigoArea: [cliente?.telefone?.codigoArea ?? '', Validators.required],
        numero: [cliente?.telefone?.numero ?? '', Validators.required]
      })
    });
  }

  salvar(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const value = this.formGroup.value as Cliente;
    if (!value.id) {
      this.clienteService.create(value).subscribe({
        next: () => this.router.navigateByUrl('/clientes/list'),
        error: (error) => console.error('Erro ao criar cliente', error)
      });
    } else {
      this.clienteService.update(value.id, value).subscribe({
        next: () => this.router.navigateByUrl('/clientes/list'),
        error: (error) => console.error('Erro ao atualizar cliente', error)
      });
    }
  }

  excluir(): void {
    const id = this.formGroup.get('id')?.value;
    if (!id) {
      return;
    }

    if (confirm('Deseja realmente excluir este cliente?')) {
      this.clienteService.delete(id).subscribe({
        next: () => this.router.navigateByUrl('/clientes/list'),
        error: (error) => console.error('Erro ao excluir cliente', error)
      });
    }
  }
}
