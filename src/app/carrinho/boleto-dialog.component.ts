import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-boleto-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <div class="boleto-container">
      <div class="header">
        <div class="bank-logo">WESTBANK</div>
        <div class="bank-code">999-9</div>
        <div class="barcode-line">23793.38128 60083.013525 56006.333300 1 89000000015000</div>
      </div>
      
      <div class="info-grid">
        <div class="field">
          <label>Local de Pagamento</label>
          <span>PAGÁVEL EM QUALQUER BANCO ATÉ O VENCIMENTO</span>
        </div>
        <div class="field">
          <label>Vencimento</label>
          <span>25/12/2025</span>
        </div>
        <div class="field">
          <label>Beneficiário</label>
          <span>WESTVIEW COMICS LTDA - CNPJ 12.345.678/0001-90</span>
        </div>
        <div class="field">
          <label>Agência / Código Beneficiário</label>
          <span>1234 / 56789-0</span>
        </div>
        <div class="field">
          <label>Data do Documento</label>
          <span>{{ dataHoje | date:'dd/MM/yyyy' }}</span>
        </div>
        <div class="field">
          <label>Valor do Documento</label>
          <span class="valor">A PAGAR</span>
        </div>
      </div>

      <div class="instructions">
        <label>Instruções</label>
        <p>- Não receber após o vencimento.</p>
        <p>- O pagamento será confirmado em até 3 dias úteis.</p>
      </div>

      <div class="barcode-img">
        <div class="bars"></div>
      </div>

      <div class="actions">
        <button mat-stroked-button (click)="imprimir()">🖨️ Imprimir</button>
        <button mat-flat-button color="primary" (click)="simularPagamento()">Simular Pagamento Realizado</button>
      </div>
    </div>
  `,
  styles: [`
    .boleto-container { padding: 20px; font-family: Arial, sans-serif; max-width: 600px; border: 1px dashed #ccc; }
    .header { display: flex; gap: 20px; align-items: center; border-bottom: 2px solid #000; padding-bottom: 5px; margin-bottom: 10px; }
    .bank-logo { font-weight: bold; font-size: 20px; }
    .bank-code { font-weight: bold; font-size: 18px; border-left: 2px solid #000; border-right: 2px solid #000; padding: 0 15px; }
    .barcode-line { font-size: 14px; font-weight: bold; margin-left: auto; }
    
    .info-grid { display: grid; grid-template-columns: 3fr 1fr; border: 1px solid #000; }
    .field { border-bottom: 1px solid #ccc; border-right: 1px solid #ccc; padding: 5px; display: flex; flex-direction: column; }
    .field label { font-size: 10px; color: #666; }
    .field span { font-size: 12px; font-weight: bold; }
    .field .valor { font-size: 14px; }
    
    .instructions { margin-top: 10px; font-size: 12px; border: 1px solid #000; padding: 10px; }
    
    .barcode-img { margin-top: 20px; height: 50px; background: repeating-linear-gradient(90deg, #000 0px, #000 2px, #fff 2px, #fff 4px); width: 100%; }
    
    .actions { margin-top: 20px; display: flex; justify-content: flex-end; gap: 10px; }
  `]
})
export class BoletoDialogComponent {
  dataHoje = new Date();

  constructor(public dialogRef: MatDialogRef<BoletoDialogComponent>) {}

  imprimir() {
    window.print();
  }

  simularPagamento() {
    // Fecha retornando 'true' para indicar que "pagou"
    this.dialogRef.close(true);
  }
}