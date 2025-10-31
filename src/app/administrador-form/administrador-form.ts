import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Administrador } from '../models/pessoa.model';
import { AdministradorService } from '../services/administrador.service';

@Component({
  selector: 'app-administrador-form',
  standalone: true,
  templateUrl: './administrador-form.html',
  styleUrl: './administrador-form.css',
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class AdministradorFormComponent implements OnInit {
  formGroup!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private administradorService: AdministradorService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const administrador: Administrador | undefined = this.route.snapshot.data['administrador'];
    const username = administrador?.username ?? administrador?.usuario?.username ?? '';

    this.formGroup = this.fb.group({
      id: [administrador?.id ?? null],
      nome: [administrador?.nome ?? '', [Validators.required, Validators.minLength(2)]],
      cpf: [administrador?.cpf ?? '', [Validators.required, Validators.minLength(11)]],
      email: [administrador?.email ?? '', [Validators.email]],
      cargo: [administrador?.cargo ?? 'Administrador', Validators.required],
      nivelAcesso: [administrador?.nivelAcesso ?? '', Validators.required],
      username: [username, [Validators.required, Validators.minLength(3)]],
      senha: ['', Validators.required],
      endereco: this.fb.group({
        cep: [administrador?.endereco?.cep ?? '', Validators.required],
        rua: [administrador?.endereco?.rua ?? '', Validators.required],
        numero: [administrador?.endereco?.numero ?? '', Validators.required]
      }),
      telefone: this.fb.group({
        codigoArea: [administrador?.telefone?.codigoArea ?? '', Validators.required],
        numero: [administrador?.telefone?.numero ?? '', Validators.required]
      })
    });
  }

  salvar(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const value = this.formGroup.value as Administrador;
    if (!value.id) {
      this.administradorService.create(value).subscribe({
        next: () => this.router.navigateByUrl('/administradores/list'),
        error: (error) => console.error('Erro ao criar administrador', error)
      });
    } else {
      this.administradorService.update(value.id, value).subscribe({
        next: () => this.router.navigateByUrl('/administradores/list'),
        error: (error) => console.error('Erro ao atualizar administrador', error)
      });
    }
  }

  excluir(): void {
    const id = this.formGroup.get('id')?.value;
    if (!id) {
      return;
    }

    if (confirm('Deseja realmente excluir este administrador?')) {
      this.administradorService.delete(id).subscribe({
        next: () => this.router.navigateByUrl('/administradores/list'),
        error: (error) => console.error('Erro ao excluir administrador', error)
      });
    }
  }
}
