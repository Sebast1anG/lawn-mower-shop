import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
})
export class SummaryComponent implements OnInit {
  configurationData: any;
  orderData: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const configJson = sessionStorage.getItem('configurationData');
    const orderJson = sessionStorage.getItem('orderData');

    this.configurationData = configJson ? JSON.parse(configJson) : null;
    this.orderData = orderJson ? JSON.parse(orderJson) : null;
  }

  goToHome(): void {
    this.router.navigate(['/configuration']);
  }
}
