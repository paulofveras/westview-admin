import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // 1. Precisa importar o RouterModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule], // 2. Precisa declarar o RouterModule aqui
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'westview-admin';
}
