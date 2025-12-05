import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';

// Imports do Material para o visual refinado
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

interface UsuarioFormValue {
  id: number | null;
  username: string;
  senha?: string;
}

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  templateUrl: './usuario-form.html',
  styleUrl: './usuario-form.css',
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule
  ]
})
export class UsuarioFormComponent implements OnInit {
  formGroup!: FormGroup;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const usuario = this.route.snapshot.data['usuario'];
    this.isEdit = !!usuario && !!usuario.id;

    this.formGroup = this.fb.group({
      id: [usuario?.id ?? null],
      username: [usuario?.username ?? '', [Validators.required, Validators.minLength(3)]],
      senha: ['']
    });

    if (!this.isEdit) {
      this.formGroup.get('senha')?.addValidators(Validators.required);
    }
  }

  salvar(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const value = this.formGroup.value as UsuarioFormValue;
    if (!value.id) {
      if (!value.senha) {
        console.error('Senha obrigatória para criação de usuário.');
        return;
      }
      this.usuarioService.create({ username: value.username, senha: value.senha }).subscribe({
        next: () => this.router.navigateByUrl('/usuarios/list'),
        error: (error) => console.error('Erro ao criar usuário', error)
      });
    } else {
      this.usuarioService
        .update(value.id, { username: value.username, senha: value.senha || undefined })
        .subscribe({
          next: () => this.router.navigateByUrl('/usuarios/list'),
          error: (error) => console.error('Erro ao atualizar usuário', error)
        });
    }
  }

  excluir(): void {
    const id = this.formGroup.get('id')?.value;
    if (!id) {
      return;
    }

    if (confirm('Deseja realmente excluir este usuário?')) {
      this.usuarioService.delete(id).subscribe({
        next: () => this.router.navigateByUrl('/usuarios/list'),
        error: (error) => console.error('Erro ao excluir usuário', error)
      });
    }
  }
}
