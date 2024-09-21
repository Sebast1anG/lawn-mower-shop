import { PaymentType } from './payment-type.enum';
import { DeliveryType } from './delivery-type.enum';
import { Address } from './address.model';

export interface Order {
  paymentType: PaymentType;
  deliveryType: DeliveryType;
  deliveryDateTime: Date;
  deliveryAddress: Address;
  authorizedUsers: Address[];
  price: number;
}
