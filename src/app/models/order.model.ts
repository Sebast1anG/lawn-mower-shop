import { PaymentType, DeliveryType, Address } from '../models';

export interface Order {
  paymentType: PaymentType;
  deliveryType: DeliveryType;
  deliveryDateTime: Date;
  deliveryAddress: Address;
  authorizedUsers: Address[];
  price: number;
}
