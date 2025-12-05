import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdministradorService } from '../services/administrador.service';
import { EnderecoService } from '../services/endereco.service';
import { Administrador } from '../models/pessoa.model';

import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-administrador-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatStepperModule, MatInputModule, MatButtonModule, MatFormFieldModule],
  templateUrl: './administrador-form.html',
  styleUrl: './administrador-form.css'
})
export class AdministradorFormComponent implements OnInit {
  pessoalForm!: FormGroup;
  acessoForm!: FormGroup;
  contatoForm!: FormGroup;

  isEditMode: boolean = false;
  adminId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private administradorService: AdministradorService,
    private enderecoService: EnderecoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // 1. Pessoal
    this.pessoalForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      cpf: ['', [Validators.required, Validators.minLength(11)]],
      email: ['', [Validators.email]],
      cargo: ['Administrador', Validators.required],
      nivelAcesso: ['', Validators.required]
    });

    // 2. Acesso
    this.acessoForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      senha: ['']
    });

    // 3. Contato
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

    const administrador: Administrador = this.route.snapshot.data['administrador'];
    if (administrador && administrador.id) {
      this.isEditMode = true;
      this.adminId = administrador.id;
      const username = administrador.username ?? administrador.usuario?.username ?? '';

      this.pessoalForm.patchValue({
        nome: administrador.nome,
        cpf: administrador.cpf,
        email: administrador.email,
        cargo: administrador.cargo,
        nivelAcesso: administrador.nivelAcesso
      });
      this.acessoForm.patchValue({ username: username });
      this.contatoForm.patchValue({
        endereco: administrador.endereco,
        telefone: administrador.telefone
      });
    } else {
       this.acessoForm.get('senha')?.addValidators(Validators.required);
    }
  }

  buscarCep() {
    const enderecoGroup = this.contatoForm.get('endereco') as FormGroup;
    const cep = enderecoGroup.get('cep')?.value;
    if (cep && String(cep).length === 8) {
      this.enderecoService.consultarCep(cep).subscribe(dados => {
        if (!dados.erro) {
            enderecoGroup.patchValue({ rua: dados.logradouro });
        }
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

    const administrador = {
        id: this.adminId,
        ...this.pessoalForm.value,
        ...this.acessoForm.value,
        ...this.contatoForm.value
    };

    if (this.isEditMode) {
      this.administradorService.update(administrador.id, administrador).subscribe({
          next: () => this.router.navigateByUrl('/administradores/list'),
          error: (err: any) => alert('Erro ao salvar admin.')
      });
    } else {
      this.administradorService.create(administrador).subscribe({
          next: () => this.router.navigateByUrl('/administradores/list'),
          error: (err: any) => alert('Erro ao salvar admin.')
      });
    }
  }

  excluir() {
    if (this.isEditMode && this.adminId) {
      if (confirm('Excluir administrador?')) {
        this.administradorService.delete(this.adminId).subscribe({
            next: () => this.router.navigateByUrl('/administradores/list')
        });
      }
    }
  }
}
