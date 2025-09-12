import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {
  title = 'westview-admin';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    console.log('App iniciado - Status de autenticação:');
    this.authService.debugAuth();
  }
}
