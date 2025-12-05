import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClienteService } from '../services/cliente.service';
import { EnderecoService } from '../services/endereco.service';
import { Cliente } from '../models/pessoa.model';

// Material Imports
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-cliente-form',
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
  templateUrl: './cliente-form.html',
  styleUrls: ['./cliente-form.css']
})
export class ClienteFormComponent implements OnInit {
  // Grupos do Stepper
  pessoalForm!: FormGroup;
  acessoForm!: FormGroup;
  contatoForm!: FormGroup;
  
  isEdit: boolean = false;
  clienteId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private enderecoService: EnderecoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Grupo 1: Dados Pessoais
    this.pessoalForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      cpf: ['', [Validators.required, Validators.minLength(11)]],
      email: ['', [Validators.email]]
    });

    // Grupo 2: Acesso
    this.acessoForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      senha: ['']
    });

    // Grupo 3: Contato
    this.contatoForm = this.fb.group({
      endereco: this.fb.group({
        cep: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
        rua: ['', Validators.required],
        numero: ['', Validators.required]
      }),
      telefone: this.fb.group({
        codigoArea: ['', [Validators.required, Validators.pattern(/^\d{2}$/)]],
        numero: ['', [Validators.required, Validators.minLength(8)]]
      })
    });

    const cliente: Cliente = this.route.snapshot.data['cliente'];
    if (cliente && cliente.id) {
      this.isEdit = true;
      this.clienteId = cliente.id;
      const username = cliente.username ?? cliente.usuario?.username ?? '';

      this.pessoalForm.patchValue({ nome: cliente.nome, cpf: cliente.cpf, email: cliente.email });
      this.acessoForm.patchValue({ username: username });
      this.contatoForm.patchValue({ endereco: cliente.endereco, telefone: cliente.telefone });
    } else {
      this.acessoForm.get('senha')?.addValidators(Validators.required);
    }
  }

  buscarCep() {
    const group = this.contatoForm.get('endereco') as FormGroup;
    const cep = group.get('cep')?.value;
    if (cep && String(cep).length === 8) {
      this.enderecoService.consultarCep(cep).subscribe(d => {
        if(!d.erro) group.patchValue({ rua: d.logradouro });
      });
    }
  }

  salvar() {
    if (this.pessoalForm.invalid || this.acessoForm.invalid || this.contatoForm.invalid) {
        this.pessoalForm.markAllAsTouched();
        this.acessoForm.markAllAsTouched();
        this.contatoForm.markAllAsTouched();
        return;
    }

    const cliente = {
      id: this.clienteId,
      ...this.pessoalForm.value,
      ...this.acessoForm.value,
      ...this.contatoForm.value
    };

    if (this.isEdit) {
      this.clienteService.update(cliente.id, cliente).subscribe({
        next: () => this.router.navigateByUrl('/clientes/list'),
        error: (e: any) => alert('Erro ao salvar cliente.')
      });
    } else {
      this.clienteService.create(cliente).subscribe({
        next: () => this.router.navigateByUrl('/clientes/list'),
        error: (e: any) => alert('Erro ao salvar cliente.')
      });
    }
  }

  excluir() {
    if (this.isEdit && this.clienteId && confirm('Excluir cliente?')) {
      this.clienteService.delete(this.clienteId).subscribe(() => {
        this.router.navigateByUrl('/clientes/list');
      });
    }
  }
}
