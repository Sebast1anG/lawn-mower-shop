import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { OrderService, ConfigurationService } from '../../services';
import { Order, ConfigurationData } from '../../models';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
})
export class SummaryComponent implements OnInit {
  orderData: Order | null = null;
  configurationData: ConfigurationData | null = null;

  constructor(
    private router: Router,
    private orderService: OrderService,
    private configurationService: ConfigurationService
  ) {}

  ngOnInit(): void {
    this.orderData = this.orderService.getOrderData();
    this.configurationData = this.configurationService.getConfigurationData();

    if (!this.orderData || !this.configurationData) {
      this.router.navigate(['/configuration']);
    }
  }

  goToHome(): void {
    this.router.navigate(['/configuration']);
  }
}
