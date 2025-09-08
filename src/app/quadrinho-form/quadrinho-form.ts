import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { QuadrinhoService } from '../services/quadrinho';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quadrinho-form',
  standalone: true,
  imports: [
    ReactiveFormsModule, // 5. Adicione aqui para usar formGroup, etc.
    CommonModule,        // Adicione aqui para usar *ngIf
    RouterModule
  ],
  templateUrl: './quadrinho-form.html',
  styleUrls: ['./quadrinho-form.css']
})
export class QuadrinhoFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  quadrinhoId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private service: QuadrinhoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      preco: [0, [Validators.required, Validators.min(0)]],
      estoque: [0, [Validators.required, Validators.min(0)]]
      // Adicione outros campos do formulário aqui
    });
  }

  ngOnInit(): void {
    // Verificamos a URL para ver se tem um 'id'. Se tiver, estamos no modo de edição.
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.quadrinhoId = +id; // O '+' converte a string para número
      this.service.findById(this.quadrinhoId).subscribe(data => {
        this.form.patchValue(data); // Preenche o formulário com os dados do quadrinho
      });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.isEditMode && this.quadrinhoId) {
        // Lógica de ATUALIZAÇÃO
        this.service.update(this.quadrinhoId, this.form.value).subscribe(() => {
          this.router.navigate(['/quadrinhos']); // Volta para a lista
        });
      } else {
        // Lógica de CRIAÇÃO
        this.service.create(this.form.value).subscribe(() => {
          this.router.navigate(['/quadrinhos']); // Volta para a lista
        });
      }
    }
  }
}
