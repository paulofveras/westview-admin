import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-fornecedor-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './fornecedor-form.html',
  styleUrls: ['./fornecedor-form.css']
})
export class FornecedorFormComponent {
  form: FormGroup;
  mensagem: string = '';
  tipoMensagem: 'sucesso' | 'erro' = 'sucesso';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(60)]],
      email: ['', [Validators.required, Validators.email]],
      endereco: this.fb.group({
        cep: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
        rua: ['', Validators.required],
        numero: ['', [Validators.required, Validators.min(1)]]
      }),
      telefone: this.fb.group({
        codigoArea: ['', [Validators.required, Validators.pattern(/^\d{2}$/)]],
        numero: ['', [Validators.required, Validators.pattern(/^\d{8,9}$/)]]
      })
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.http.post('http://localhost:8080/fornecedores', this.form.value)
        .pipe(
          catchError(error => {
            this.mostrarMensagem('Erro ao cadastrar fornecedor', 'erro');
            return of(null);
          })
        )
        .subscribe(response => {
          if (response) {
            this.mostrarMensagem('Fornecedor cadastrado com sucesso!');
            this.form.reset();
          }
        });
    }
  }

  private mostrarMensagem(mensagem: string, tipo: 'sucesso' | 'erro' = 'sucesso'): void {
    this.mensagem = mensagem;
    this.tipoMensagem = tipo;
    setTimeout(() => this.mensagem = '', 3000);
  }
}
