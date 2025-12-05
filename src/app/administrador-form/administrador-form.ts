import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdministradorService } from '../services/administrador.service';
import { EnderecoService } from '../services/endereco.service'; // Serviço de CEP
import { Administrador } from '../models/pessoa.model';

@Component({
  selector: 'app-administrador-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './administrador-form.html',
  styleUrl: './administrador-form.css'
})
export class AdministradorFormComponent implements OnInit {
  formGroup!: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private administradorService: AdministradorService,
    private enderecoService: EnderecoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const administrador: Administrador = this.route.snapshot.data['administrador'];
    this.isEditMode = !!(administrador && administrador.id);
    const username = administrador?.username ?? administrador?.usuario?.username ?? '';

    this.formGroup = this.fb.group({
      id: [administrador?.id || null],
      nome: [administrador?.nome || '', [Validators.required, Validators.minLength(3)]],
      cpf: [administrador?.cpf || '', [Validators.required, Validators.minLength(11)]],
      email: [administrador?.email || '', [Validators.email]],
      cargo: [administrador?.cargo || 'Administrador', Validators.required],
      nivelAcesso: [administrador?.nivelAcesso || '', Validators.required],
      username: [username, [Validators.required, Validators.minLength(3)]],
      senha: [''], // Senha opcional na edição

      endereco: this.fb.group({
        cep: [administrador?.endereco?.cep || '', [Validators.required, Validators.pattern(/^\d{8}$/)]],
        rua: [administrador?.endereco?.rua || '', Validators.required],
        numero: [administrador?.endereco?.numero || '', Validators.required]
      }),

      telefone: this.fb.group({
        codigoArea: [administrador?.telefone?.codigoArea || '', [Validators.required, Validators.pattern(/^\d{2}$/)]],
        numero: [administrador?.telefone?.numero || '', Validators.required]
      })
    });

    if (!this.isEditMode) {
        this.formGroup.get('senha')?.addValidators(Validators.required);
    }
  }

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
            document.getElementById('numeroInputAdmin')?.focus();
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
      this.formGroup.enable();
      const administrador = this.formGroup.value;

      if (this.isEditMode) {
        this.administradorService.update(administrador.id, administrador).subscribe({
          next: () => this.router.navigateByUrl('/administradores/list'),
          error: (err: any) => {
            console.error('Erro ao editar:', err);
            alert('Erro ao editar administrador.');
          }
        });
      } else {
        this.administradorService.create(administrador).subscribe({
          next: () => this.router.navigateByUrl('/administradores/list'),
          error: (err: any) => {
            console.error('Erro ao criar:', err);
            alert('Erro ao criar administrador.');
          }
        });
      }
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  excluir() {
    if (this.isEditMode) {
      const administrador = this.formGroup.value;
      if (confirm(`Tem certeza que deseja excluir "${administrador.nome}"?`)) {
        this.administradorService.delete(administrador.id).subscribe({
          next: () => this.router.navigateByUrl('/administradores/list'),
          error: (err) => console.error('Erro ao excluir:', err)
        });
      }
    }
  }
}
