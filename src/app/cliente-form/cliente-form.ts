import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Cliente } from '../models/pessoa.model';
import { ClienteService } from '../services/cliente.service';
import { EnderecoService } from '../services/endereco.service'; // Importe o novo serviço

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
    private enderecoService: EnderecoService, // Injete aqui
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
      senha: [''], // Senha não é obrigatória na edição (tratado no salvar)
      
      endereco: this.fb.group({
        cep: [cliente?.endereco?.cep ?? '', [Validators.required, Validators.pattern(/^\d{8}$/)]],
        rua: [cliente?.endereco?.rua ?? '', Validators.required],
        numero: [cliente?.endereco?.numero ?? '', Validators.required]
      }),
      
      telefone: this.fb.group({
        codigoArea: [cliente?.telefone?.codigoArea ?? '', [Validators.required, Validators.pattern(/^\d{2}$/)]],
        numero: [cliente?.telefone?.numero ?? '', [Validators.required, Validators.minLength(8)]]
      })
    });

    // Se for criação, senha é obrigatória
    if (!this.isEdit) {
      this.formGroup.get('senha')?.addValidators(Validators.required);
    }
  }

  // --- Lógica de CEP ---
  buscarCep() {
    const cepControl = this.formGroup.get('endereco.cep');
    const cep = cepControl?.value;

    if (cep && String(cep).length === 8) {
      this.formGroup.get('endereco.rua')?.disable(); // Feedback visual

      this.enderecoService.consultarCep(cep).subscribe({
        next: (dados) => {
          if (!dados.erro) {
            this.formGroup.get('endereco')?.patchValue({
              rua: dados.logradouro
            });
            // Foca no número para agilizar
            document.getElementById('numeroInput')?.focus();
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

  salvar(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    // Reabilita campos para garantir que o valor seja enviado
    this.formGroup.enable(); 

    const value = this.formGroup.value as Cliente;
    if (!value.id) {
      this.clienteService.create(value).subscribe({
        next: () => this.router.navigateByUrl('/clientes/list'),
        error: (error) => {
            console.error('Erro ao criar cliente', error);
            alert('Erro ao salvar. Verifique se o CPF ou Username já existem.');
        }
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
    if (id && confirm('Deseja realmente excluir este cliente?')) {
      this.clienteService.delete(id).subscribe({
        next: () => this.router.navigateByUrl('/clientes/list'),
        error: (error) => console.error('Erro ao excluir cliente', error)
      });
    }
  }
}
