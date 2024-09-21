import { createAction, props } from '@ngrx/store';
import { Order } from '../../models/order.model';

export const addOrder = createAction(
  '[Order] Add Order',
  props<{ order: Order }>()
);
export const resetOrder = createAction('[Order] Reset Order');
