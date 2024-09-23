import { Injectable } from '@angular/core';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private orderData: Order | null = null;

  setOrderData(order: Order): void {
    this.orderData = order;
  }

  getOrderData(): Order | null {
    return this.orderData;
  }
}
